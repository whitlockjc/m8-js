/* Copyright 2022 Jeremy Whitlock
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { Scale } = require('./lib/types/Scale')
const Song = require('./lib/types/Song')
const Table = require('./lib/types/Table')
const { Theme } = require('./lib/types/Theme')
const { FMSynth, Macrosynth, MIDIOut, None, Sampler, Wavsynth } = require('./lib/types/Instrument')
const { VERSION_1_4_0, VERSION_2_5_0, M8FileTypes } = require('./lib/constants')
const { toM8HexStr } = require('./lib/helpers')
const M8FileWriter = require('./lib/types/M8FileWriter')

// TODO: Add debug support
// TODO: Add error handling

/**
 * Writes to the M8 File Writer unknown/unused data from the original M8 File Reader when present, or a default value.
 *
 * @param {module:m8-js/lib/types.M8FileWriter} fileWriter - The M8 file writer
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 * @param {Number} length - The number of bytes to write
 * @param {Number} defaultValue - The default value when the offest value wasn't skipped or there is no M8 file reader
 */
const useSkippedBytes = (fileWriter, fileReader, length, defaultValue) => {
  for (let i = 0; i < length; i++) {
    const offset = fileWriter.bytes.length
    let skippedValue = defaultValue

    if (fileReader?.skipped.indexOf(offset) > -1) {
      skippedValue = fileReader.buffer[offset]
    }

    fileWriter.write(skippedValue)
  }
}

/**
 * Module for loading/interacting with {@link https://dirtywave.com/|Dirtywave} M8 instrument/song files.
 *
 * @see {@link https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9} for original Nim sources.
 *
 * @module m8-js
 */

/**
 * A Buffer.
 *
 * @external Buffer
 *
 * @see {@link https://nodejs.org/api/buffer.html|Node.js}
 * @see {@link https://github.com/feross/buffer|Non-Node.js}
 */

/**
 * Dumps an M8 Table to bytes.
 *
 * @param {module:m8-js/lib/types.Table} table - The M8 Table to generate bytes for
 * @param {module:m8-js/lib/types.M8FileWriter} fileWriter - The M8 file writer to write to
 *
 * @returns {Array<Number>}
 */
const writeTableToWriter = (table, fileWriter) => {
  for (let i = 0; i < table.steps.length; i++) {
    const step = table.steps[i]

    fileWriter.write(step.transpose)
    fileWriter.write(step.volume)

    for (let j = 0; j < 3; j++) {
      const fx = step['fx' + (j + 1)]

      fileWriter.write(fx.command)
      fileWriter.write(fx.value)
    }
  }
}

/**
 * Writes an M8 Instrument's bytes to the M8 File Writer.
 *
 * @param {module:m8-js/lib/types.Instrument} instrument - The M8 Instrument
 * @param {module:m8-js/lib/types.M8FileWriter} fileWriter - The M8 file writer to write to
 * @param {module:m8-js/lib/types.M8FileReader} [fileReader] - The optional M8 file reader for using skipped bytes
 * @param {Number} [emptyByte] - The char to use for empty name bytes
 */
const writeInstrumentToWriter = (instrument, fileWriter, fileReader, emptyByte) => {
  const startLen = fileWriter.bytes.length

  fileWriter.write(instrument.kind)
  fileWriter.writeStr(instrument.name, 12, emptyByte)
  fileWriter.writeBool(instrument.transpose)
  fileWriter.write(instrument.tableTick)

  // Do not write these values for 'MIDI OUT', they aren't here when reading
  if (instrument.kind !== 0x03) {
    fileWriter.write(instrument.volume)
    fileWriter.write(instrument.pitch)
    fileWriter.write(instrument.fineTune)
  }

  // Write instrument-specific parameters
  switch (instrument.kind) {
    // WAVSYNTH
    case 0x00:
      fileWriter.write(instrument.instrParams.shape)
      fileWriter.write(instrument.instrParams.size)
      fileWriter.write(instrument.instrParams.mult)
      fileWriter.write(instrument.instrParams.warp)
      fileWriter.write(instrument.instrParams.mirror)

      break

    // MACROSYNTH
    case 0x01:
      fileWriter.write(instrument.instrParams.shape)
      fileWriter.write(instrument.instrParams.timbre)
      fileWriter.write(instrument.instrParams.color)
      fileWriter.write(instrument.instrParams.degrade)
      fileWriter.write(instrument.instrParams.redux)

      break

    // SAMPLER
    case 0x02:
      fileWriter.write(instrument.instrParams.playMode)
      fileWriter.write(instrument.instrParams.slice)
      fileWriter.write(instrument.instrParams.start)
      fileWriter.write(instrument.instrParams.loopStart)
      fileWriter.write(instrument.instrParams.length)
      fileWriter.write(instrument.instrParams.degrade)

      break

    // MIDI OUT
    case 0x03:
      fileWriter.write(instrument.instrParams.port)
      fileWriter.write(instrument.instrParams.channel)
      fileWriter.write(instrument.instrParams.bankSelect)
      fileWriter.write(instrument.instrParams.programChange)

      // Write 3 empty bytes (unused data)
      fileWriter.write([0x00, 0x00, 0x00])

      for (let i = 0; i < instrument.instrParams.customCC.length; i++) {
        const customCC = instrument.instrParams.customCC[i]

        fileWriter.write(customCC.number)
        fileWriter.write(customCC.defaultValue)
      }

      break

    // FMSYNTH
    case 0x04:
      fileWriter.write(instrument.instrParams.algo)

      // If supported, read the synth shapes
      if (fileWriter.m8Version.compare(VERSION_1_4_0) >= 0) {
        for (let i = 0; i < instrument.instrParams.operators.length; i++) {
          fileWriter.write(instrument.instrParams.operators[i].shape)
        }
      }

      // Read the ratios
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        fileWriter.write(operator.ratio)
        fileWriter.write(operator.ratioFine)
      }

      // Read the feedback/volume of each operator
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        fileWriter.write(operator.level)
        fileWriter.write(operator.feedback)
      }

      // Read first modulator slot controls
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        fileWriter.write(operator.modA)
      }

      // Read second modulator slot controls
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        fileWriter.write(operator.modB)
      }

      // Read modulation sources
      fileWriter.write(instrument.instrParams.mod1)
      fileWriter.write(instrument.instrParams.mod2)
      fileWriter.write(instrument.instrParams.mod3)
      fileWriter.write(instrument.instrParams.mod4)

      break

    // NONE
    case 0xFF:
      // Do nothing
      break

    default:
      /* istanbul ignore next */
      throw new TypeError(`Unsupported Instrument type: ${toM8HexStr(instrument.kind)}`)
  }

  // Write filter parameters
  fileWriter.write(instrument.filterParams.type)
  fileWriter.write(instrument.filterParams.cutoff)
  fileWriter.write(instrument.filterParams.res)

  // Write amplifier parameters
  fileWriter.write(instrument.ampParams.amp)
  fileWriter.write(instrument.ampParams.limit)

  // Write mixer parameters
  fileWriter.write(instrument.mixerParams.pan)
  fileWriter.write(instrument.mixerParams.dry)
  fileWriter.write(instrument.mixerParams.cho)
  fileWriter.write(instrument.mixerParams.del)
  fileWriter.write(instrument.mixerParams.rev)

  // Read envelope parameters
  for (let i = 0; i < instrument.env.length; i++) {
    const env = instrument.env[i]

    fileWriter.write(env.dest)
    fileWriter.write(env.amount)
    fileWriter.write(env.attack)
    fileWriter.write(env.hold)
    fileWriter.write(env.decay)
    fileWriter.write(env.retrigger)
  }

  // Read LFO parameters
  for (let i = 0; i < instrument.lfo.length; i++) {
    const lfo = instrument.lfo[i]

    fileWriter.write(lfo.shape)
    fileWriter.write(lfo.dest)
    fileWriter.write(lfo.triggerMode)
    fileWriter.write(lfo.freq)
    fileWriter.write(lfo.amount)
    fileWriter.write(lfo.retrigger)
  }

  // Fill in the empty values between instrument parameters and the sample path (when present)
  useSkippedBytes(fileWriter, fileReader, (startLen + 0x57) - fileWriter.bytes.length, 0xFF)

  fileWriter.writeStr(instrument.kind === 0x02 ? instrument.instrParams.samplePath : '', 128)

  // Write table data whenever writing an Instrument file versus being writing a Song file
  if (fileWriter.fileTypeToStr() === 'Instrument') {
    writeTableToWriter(instrument.tableData, fileWriter)
  }
}

/**
 * Writes an M8 Scale's bytes to the M8 File Writer.
 *
 * @param {module:m8-js/lib/types.Scale} scale - The M8 Scale
 * @param {module:m8-js/lib/types.M8FileWriter} fileWriter - The M8 file writer to write to
 * @param {Number} [emptyByte] - The char to use for empty name bytes
 */
const writeScaleToWriter = (scale, fileWriter, emptyByte) => {
  let noteBits = ''

  for (let i = 0; i < scale.intervals.length; i++) {
    noteBits += scale.intervals[i].enabled === true ? '1' : '0'
  }

  const rawNoteMap = parseInt(noteBits.split('').reverse().join(''), 2)

  fileWriter.write(rawNoteMap & 0xFF)
  fileWriter.write((rawNoteMap >> 8) & 0xFF)

  for (let i = 0; i < scale.intervals.length; i++) {
    const interval = scale.intervals[i]

    fileWriter.write(interval.offsetA)
    fileWriter.write(interval.offsetB)
  }

  fileWriter.writeStr(scale.name, 16, emptyByte)
}

/**
 * Dumps an M8 Instrument file to bytes.
 *
 * @param {module:m8-js/lib/types.Instrument} instrument - The M8 Instrument
 * @param {module:m8-js/lib/types.M8FileReader} [fileReader] - The optional M8 file reader for using skipped bytes
 *
 * @returns {module:m8-js.Buffer}
 */
const dumpInstrument = (instrument, fileReader) => {
  const fileWriter = new M8FileWriter(M8FileTypes.Instrument, instrument.m8Version)

  writeInstrumentToWriter(instrument, fileWriter, fileReader)

  return Buffer.from(fileWriter.bytes)
}

/**
 * Dumps an M8 Scale file to bytes.
 *
 * @param {module:m8-js/lib/types.Scale} scale - The M8 Scale to generate bytes for
 *
 * @returns {module:m8-js.Buffer}
 */
const dumpScale = (scale) => {
  const fileWriter = new M8FileWriter(M8FileTypes.Scale, scale.m8Version)

  writeScaleToWriter(scale, fileWriter)

  return Buffer.from(fileWriter.bytes)
}

/**
 * Dumps an M8 Song file to bytes.
 *
 * @param {module:m8-js/lib/types.Song} song - The M8 Song to generate bytes for
 * @param {module:m8-js/lib/types.M8FileReader} [fileReader] - The optional M8 file reader for using skipped bytes
 *
 * @returns {module:m8-js.Buffer}
 */
const dumpSong = (song, fileReader) => {
  const fileWriter = new M8FileWriter(M8FileTypes.Song, song.m8Version)
  const startLen = fileWriter.bytes.length

  fileWriter.writeStr(song.directory, 128)

  // Unlike useSkippedBytes, we need to go and backfill the "garbage" after the directory name.
  for (let i = startLen + song.directory.length + 1; i < startLen + 128; i++) {
    let skippedValue = 0x00

    if (fileReader?.skipped.indexOf(i) > -1) {
      skippedValue = fileReader.buffer[i]
    }

    fileWriter.bytes[i] = skippedValue
  }

  fileWriter.write(song.transpose)

  // Convert tempo as float into a 32-bit byte array
  fileWriter.writeFloat32(song.tempo)

  fileWriter.write(song.quantize)
  fileWriter.writeStr(song.name, 12)

  // Write MIDI Settings
  fileWriter.writeBool(song.midiSettings.receiveSync)
  fileWriter.write(song.midiSettings.receiveTransport)
  fileWriter.writeBool(song.midiSettings.sendSync)
  fileWriter.write(song.midiSettings.sendTransport)
  fileWriter.write(song.midiSettings.recordNoteChannel)
  fileWriter.writeBool(song.midiSettings.recordNoteVelocity)
  fileWriter.write(song.midiSettings.recordNoteDelayKillCommands)
  fileWriter.write(song.midiSettings.controlMapChannel)
  fileWriter.write(song.midiSettings.songRowCueChannel)

  for (let i = 0; i < 8; i++) {
    fileWriter.write(song.midiSettings.trackInputChannel[i])
  }

  for (let i = 0; i < 8; i++) {
    fileWriter.write(song.midiSettings.trackInputInstrument[i])
  }

  fileWriter.writeBool(song.midiSettings.trackInputProgramChange)
  fileWriter.write(song.midiSettings.trackInputMode)

  fileWriter.write(song.key)

  // Write skipped data
  useSkippedBytes(fileWriter, fileReader, 18, 0x00)

  // Read Mixer Settings
  fileWriter.write(song.mixerSettings.masterVolume)
  fileWriter.write(song.mixerSettings.masterLimit)

  for (let i = 0; i < 8; i++) {
    fileWriter.write(song.mixerSettings.trackVolume[i])
  }

  fileWriter.write(song.mixerSettings.chorusVolume)
  fileWriter.write(song.mixerSettings.delayVolume)
  fileWriter.write(song.mixerSettings.reverbVolume)
  fileWriter.write(song.mixerSettings.analogInputVolume[0])
  fileWriter.write(song.mixerSettings.analogInputVolume[1])
  fileWriter.write(song.mixerSettings.usbInputVolume)
  fileWriter.write(song.mixerSettings.analogInputChorus[0])
  fileWriter.write(song.mixerSettings.analogInputDelay[0])
  fileWriter.write(song.mixerSettings.analogInputReverb[0])
  fileWriter.write(song.mixerSettings.analogInputChorus[1])
  fileWriter.write(song.mixerSettings.analogInputDelay[1])
  fileWriter.write(song.mixerSettings.analogInputReverb[1])
  fileWriter.write(song.mixerSettings.usbInputChorus)
  fileWriter.write(song.mixerSettings.usbInputDelay)
  fileWriter.write(song.mixerSettings.usbInputReverb)
  fileWriter.write(song.mixerSettings.djFilter)
  fileWriter.write(song.mixerSettings.djFilterPeak)

  // Write skipped data
  useSkippedBytes(fileWriter, fileReader, 5, 0x00)

  // Write Grooves
  for (let i = 0; i < song.grooves.length; i++) {
    const groove = song.grooves[i]

    for (let j = 0; j < groove.steps.length; j++) {
      fileWriter.write(groove.steps[j])
    }
  }

  // Write song steps
  for (let i = 0; i < 256; i++) {
    const step = song.steps[i]

    for (let j = 0; j < 8; j++) {
      fileWriter.write(step['track' + (j + 1)])
    }
  }

  // Write Phrases
  for (let i = 0; i < song.phrases.length; i++) {
    const phrase = song.phrases[i]

    for (let j = 0; j < phrase.steps.length; j++) {
      const step = phrase.steps[j]

      fileWriter.write(step.note)
      fileWriter.write(step.volume)
      fileWriter.write(step.instrument)

      for (let k = 0; k < 3; k++) {
        const fx = step['fx' + (k + 1)]

        fileWriter.write(fx.command)
        fileWriter.write(fx.value)
      }
    }
  }

  // Write Chains
  for (let i = 0; i < song.chains.length; i++) {
    const chain = song.chains[i]

    for (let j = 0; j < chain.steps.length; j++) {
      const step = chain.steps[j]

      fileWriter.write(step.phrase)
      fileWriter.write(step.transpose)
    }
  }

  // Write Tables
  for (let i = 0; i < song.tables.length; i++) {
    writeTableToWriter(song.tables[i], fileWriter)
  }

  // Write Instruments
  for (let i = 0; i < song.instruments.length; i++) {
    writeInstrumentToWriter(song.instruments[i], fileWriter, fileReader, 0xFF)
  }

  // Write skipped data
  useSkippedBytes(fileWriter, fileReader, 3, 0x00)

  // Write Effects
  fileWriter.write(song.effectsSettings.chorusModDepth)
  fileWriter.write(song.effectsSettings.chorusModFreq)
  fileWriter.write(song.effectsSettings.chorusWidth)
  fileWriter.write(song.effectsSettings.chorusReverbSend)

  // Write skipped data
  useSkippedBytes(fileWriter, fileReader, 3, 0x00)

  fileWriter.write(song.effectsSettings.delayFilter[0])
  fileWriter.write(song.effectsSettings.delayFilter[1])
  fileWriter.write(song.effectsSettings.delayTime[0])
  fileWriter.write(song.effectsSettings.delayTime[1])
  fileWriter.write(song.effectsSettings.delayFeedback)
  fileWriter.write(song.effectsSettings.delayWidth)
  fileWriter.write(song.effectsSettings.delayReverbSend)

  // Write skipped data
  useSkippedBytes(fileWriter, fileReader, 1, 0x00)

  fileWriter.write(song.effectsSettings.reverbFilter[0])
  fileWriter.write(song.effectsSettings.reverbFilter[1])
  fileWriter.write(song.effectsSettings.reverbSize)
  fileWriter.write(song.effectsSettings.reverbDamping)
  fileWriter.write(song.effectsSettings.reverbModDepth)
  fileWriter.write(song.effectsSettings.reverbModFreq)
  fileWriter.write(song.effectsSettings.reverbWidth)

  // Fill in the empty values between instruments and MIDI Mappings (when present)
  useSkippedBytes(fileWriter, fileReader, 0x1A5FE - fileWriter.bytes.length, 0xFF)

  // Write MIDI Mappings
  for (let i = 0; i < song.midiMappings.length; i++) {
    const midiMapping = song.midiMappings[i]

    fileWriter.write(midiMapping.channel)
    fileWriter.write(midiMapping.controlNum)
    fileWriter.write(midiMapping.value)
    fileWriter.write(midiMapping.type)
    fileWriter.write(midiMapping.paramIndex)
    fileWriter.write(midiMapping.minValue)
    fileWriter.write(midiMapping.maxValue)
  }

  // Write Scales (when supported)
  if (fileWriter.m8Version.compare(VERSION_2_5_0) >= 0) {
    // Fill in the empty values between MIDI Mappings and Scales (when present)
    useSkippedBytes(fileWriter, fileReader, 0x1AA7E - fileWriter.bytes.length, 0xFF)

    for (let i = 0; i < song.scales.length; i++) {
      writeScaleToWriter(song.scales[i], fileWriter, 0xFF)
    }
  } else {
    useSkippedBytes(fileWriter, fileReader, 256, 0x00)
  }

  return Buffer.from(fileWriter.bytes)
}

/**
 * Dumps an M8 Theme file to bytes.
 *
 * @param {module:m8-js/lib/types.Theme} theme - The M8 Theme to generate bytes for
 *
 * @returns {module:m8-js.Buffer}
 */
const dumpTheme = (theme) => {
  const fileWriter = new M8FileWriter(M8FileTypes.Theme, theme.m8Version)

  fileWriter.write(theme.background)
  fileWriter.write(theme.textEmpty)
  fileWriter.write(theme.textInfo)
  fileWriter.write(theme.textDefault)
  fileWriter.write(theme.textValue)
  fileWriter.write(theme.textTitle)
  fileWriter.write(theme.playMarker)
  fileWriter.write(theme.cursor)
  fileWriter.write(theme.selection)
  fileWriter.write(theme.scopeSlider)
  fileWriter.write(theme.meterLow)
  fileWriter.write(theme.meterMid)
  fileWriter.write(theme.meterPeak)

  return Buffer.from(fileWriter.bytes)
}

/**
 * Reads an M8 Instrument file.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Instrument}
 */
const loadInstrument = (fileReader) => {
  const startPos = fileReader.cursor

  // Read parameters that ALL instruments have
  const kind = fileReader.read()
  const name = fileReader.readStr(12)
  const transpose = Boolean(fileReader.read())
  const tableTick = fileReader.read()
  let volume = 0x00
  let pitch = 0x00
  let fineTune = 0x80

  // It appears that these are not present for 'MIDI OUT'
  if (kind !== 0x03) {
    volume = fileReader.read()
    pitch = fileReader.read()
    fineTune = fileReader.read()
  }

  let instr

  // Read instrument-specific parameters
  switch (kind) {
    case 0x00:
      instr = new Wavsynth(fileReader.m8Version)

      instr.instrParams.shape = fileReader.read()
      instr.instrParams.size = fileReader.read()
      instr.instrParams.mult = fileReader.read()
      instr.instrParams.warp = fileReader.read()
      instr.instrParams.mirror = fileReader.read()

      break
    case 0x01:
      instr = new Macrosynth(fileReader.m8Version)

      instr.instrParams.shape = fileReader.read()
      instr.instrParams.timbre = fileReader.read()
      instr.instrParams.color = fileReader.read()
      instr.instrParams.degrade = fileReader.read()
      instr.instrParams.redux = fileReader.read()

      break
    case 0x02:
      instr = new Sampler(fileReader.m8Version)

      instr.instrParams.playMode = fileReader.read()
      instr.instrParams.slice = fileReader.read()
      instr.instrParams.start = fileReader.read()
      instr.instrParams.loopStart = fileReader.read()
      instr.instrParams.length = fileReader.read()
      instr.instrParams.degrade = fileReader.read()

      break
    case 0x03:
      instr = new MIDIOut(fileReader.m8Version)

      instr.instrParams.port = fileReader.read()
      instr.instrParams.channel = fileReader.read()
      instr.instrParams.bankSelect = fileReader.read()
      instr.instrParams.programChange = fileReader.read()

      // Discard the next 3 bytes (unused data)
      fileReader.read(3)

      for (let i = 0; i < instr.instrParams.customCC.length; i++) {
        const customCC = instr.instrParams.customCC[i]

        customCC.number = fileReader.read()
        customCC.defaultValue = fileReader.read()
      }

      break
    case 0x04:
      instr = new FMSynth(fileReader.m8Version)

      instr.instrParams.algo = fileReader.read()

      // If supported, read the synth shapes
      if (fileReader.m8Version.compare(VERSION_1_4_0) >= 0) {
        for (let i = 0; i < instr.instrParams.operators.length; i++) {
          instr.instrParams.operators[i].shape = fileReader.read()
        }
      }

      // Read the ratios
      for (let i = 0; i < instr.instrParams.operators.length; i++) {
        const operator = instr.instrParams.operators[i]

        operator.ratio = fileReader.read()
        operator.ratioFine = fileReader.read()
      }

      // Read the feedback/volume of each operator
      for (let i = 0; i < instr.instrParams.operators.length; i++) {
        const operator = instr.instrParams.operators[i]

        operator.level = fileReader.read()
        operator.feedback = fileReader.read()
      }

      // Read first modulator slot controls
      for (let i = 0; i < instr.instrParams.operators.length; i++) {
        const operator = instr.instrParams.operators[i]

        operator.modA = fileReader.read()
      }

      // Read second modulator slot controls
      for (let i = 0; i < instr.instrParams.operators.length; i++) {
        const operator = instr.instrParams.operators[i]

        operator.modB = fileReader.read()
      }

      // Read modulation sources
      instr.instrParams.mod1 = fileReader.read()
      instr.instrParams.mod2 = fileReader.read()
      instr.instrParams.mod3 = fileReader.read()
      instr.instrParams.mod4 = fileReader.read()

      break
    case 0xFF:
      instr = new None(fileReader.m8Version)

      break
    default:
      /* istanbul ignore next */
      throw new TypeError(`Unsupported Instrument type: ${toM8HexStr(kind)}`)
  }

  // Read parameters that ALL instruments have
  // instr.kind is set by the instrument class itself
  instr.name = name
  instr.transpose = transpose
  instr.tableTick = tableTick

  // It appears that these are not present for 'MIDI OUT'
  if (instr.kindToStr() !== 'MIDI OUT') {
    instr.volume = volume
    instr.pitch = pitch
    instr.fineTune = fineTune
  }

  // Read filter parameters
  instr.filterParams.type = fileReader.read()
  instr.filterParams.cutoff = fileReader.read()
  instr.filterParams.res = fileReader.read()

  // Read amplifier parameters
  instr.ampParams.amp = fileReader.read()
  instr.ampParams.limit = fileReader.read()

  // Read mixer parameters
  instr.mixerParams.pan = fileReader.read()
  instr.mixerParams.dry = fileReader.read()
  instr.mixerParams.cho = fileReader.read()
  instr.mixerParams.del = fileReader.read()
  instr.mixerParams.rev = fileReader.read()

  // Read envelope parameters
  for (let i = 0; i < instr.env.length; i++) {
    const env = instr.env[i]

    env.dest = fileReader.read()
    env.amount = fileReader.read()
    env.attack = fileReader.read()
    env.hold = fileReader.read()
    env.decay = fileReader.read()
    env.retrigger = fileReader.read()
  }

  // Read LFO parameters
  for (let i = 0; i < instr.lfo.length; i++) {
    const lfo = instr.lfo[i]

    lfo.shape = fileReader.read()
    lfo.dest = fileReader.read()
    lfo.triggerMode = fileReader.read()
    lfo.freq = fileReader.read()
    lfo.amount = fileReader.read()
    lfo.retrigger = fileReader.read()
  }

  // Skip to the sample path (when present) and record the unused bytes
  fileReader.skipTo(startPos + 0x57) // Jump amount differs based on instrument type

  // Read Sample Path (Unfortunate that it happens here)
  if (instr.kindToStr() === 'SAMPLER') {
    instr.instrParams.samplePath = fileReader.readStr(127)

    // Discard the next byte
    fileReader.skip(1)
  } else {
    // Discard the bytes corresponding to the sample path when it's not present
    fileReader.skip(128)
  }

  // Read table data whenever the Instrument is read from an Instrument file versus being read from a Song file
  if (fileReader.fileTypeToStr() === 'Instrument') {
    instr.tableData = loadTable(fileReader)
  }

  return instr
}

/**
 * Reads an M8 Scale file.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Scale}
 */
const loadScale = (fileReader) => {
  const scale = new Scale(fileReader.m8Version)
  const noteMap = Buffer.from([fileReader.read(), fileReader.read()]).readUInt16LE(0)

  // Read interval enablements
  for (let i = 0; i < scale.intervals.length; i++) {
    const interval = scale.intervals[i]

    interval.enabled = Boolean((noteMap >> i) & 0x1)
  }

  // Read interval offsets
  for (let i = 0; i < scale.intervals.length; i++) {
    const interval = scale.intervals[i]

    interval.offsetA = fileReader.read()
    interval.offsetB = fileReader.read()
  }

  // Read name
  scale.name = fileReader.readStr(16)

  return scale
}

/**
 * Reads an M8 Song file.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Song}
 */
const loadSong = (fileReader) => {
  const song = new Song(fileReader.m8Version)

  song.directory = fileReader.readStr(128)
  song.transpose = fileReader.read()
  // Tempo is stored in 4 bytes as a 32-bit float
  song.tempo = Buffer.from(fileReader.read(4)).readFloatLE(0)
  song.quantize = fileReader.read()
  song.name = fileReader.readStr(12)

  // Read MIDI Settings
  song.midiSettings.receiveSync = Boolean(fileReader.read())
  song.midiSettings.receiveTransport = fileReader.read()
  song.midiSettings.sendSync = Boolean(fileReader.read())
  song.midiSettings.sendTransport = fileReader.read()
  song.midiSettings.recordNoteChannel = fileReader.read()
  song.midiSettings.recordNoteVelocity = Boolean(fileReader.read())
  song.midiSettings.recordNoteDelayKillCommands = fileReader.read()
  song.midiSettings.controlMapChannel = fileReader.read()
  song.midiSettings.songRowCueChannel = fileReader.read()

  for (let i = 0; i < 8; i++) {
    song.midiSettings.trackInputChannel[i] = fileReader.read()
  }

  for (let i = 0; i < 8; i++) {
    song.midiSettings.trackInputInstrument[i] = fileReader.read()
  }

  song.midiSettings.trackInputProgramChange = Boolean(fileReader.read())
  song.midiSettings.trackInputMode = fileReader.read()

  song.key = fileReader.read()

  // Discard the next 18 bytes (empty data)
  fileReader.skip(18)

  // Read Mixer Settings
  song.mixerSettings.masterVolume = fileReader.read()
  song.mixerSettings.masterLimit = fileReader.read()

  for (let i = 0; i < 8; i++) {
    song.mixerSettings.trackVolume[i] = fileReader.read()
  }

  song.mixerSettings.chorusVolume = fileReader.read()
  song.mixerSettings.delayVolume = fileReader.read()
  song.mixerSettings.reverbVolume = fileReader.read()
  song.mixerSettings.analogInputVolume = [fileReader.read(), fileReader.read()]
  song.mixerSettings.usbInputVolume = fileReader.read()
  song.mixerSettings.analogInputChorus[0] = fileReader.read()
  song.mixerSettings.analogInputDelay[0] = fileReader.read()
  song.mixerSettings.analogInputReverb[0] = fileReader.read()
  song.mixerSettings.analogInputChorus[1] = fileReader.read()
  song.mixerSettings.analogInputDelay[1] = fileReader.read()
  song.mixerSettings.analogInputReverb[1] = fileReader.read()
  song.mixerSettings.usbInputChorus = fileReader.read()
  song.mixerSettings.usbInputDelay = fileReader.read()
  song.mixerSettings.usbInputReverb = fileReader.read()
  song.mixerSettings.djFilter = fileReader.read()
  song.mixerSettings.djFilterPeak = fileReader.read()

  // Discard the next 5 bytes (unknown data)
  fileReader.skip(5)

  // Read Grooves
  for (let i = 0; i < song.grooves.length; i++) {
    const groove = song.grooves[i]

    for (let j = 0; j < groove.steps.length; j++) {
      groove.steps[j] = fileReader.read()
    }
  }

  // Read song steps
  for (let i = 0; i < 256; i++) {
    const step = song.steps[i]

    for (let j = 0; j < 8; j++) {
      step['track' + (j + 1)] = fileReader.read()
    }
  }

  // Read Phrases
  for (let i = 0; i < song.phrases.length; i++) {
    const phrase = song.phrases[i]

    for (let j = 0; j < phrase.steps.length; j++) {
      const step = phrase.steps[j]

      step.note = fileReader.read()
      step.volume = fileReader.read()
      step.instrument = fileReader.read()

      for (let k = 0; k < 3; k++) {
        const fx = step['fx' + (k + 1)]

        fx.command = fileReader.read()
        fx.value = fileReader.read()
      }
    }
  }

  // Read Chains
  for (let i = 0; i < song.chains.length; i++) {
    const chain = song.chains[i]

    for (let j = 0; j < chain.steps.length; j++) {
      const step = chain.steps[j]

      step.phrase = fileReader.read()
      step.transpose = fileReader.read()
    }
  }

  // Read Tables
  for (let i = 0; i < song.tables.length; i++) {
    song.tables[i] = loadTable(fileReader)
  }

  // Read Instruments
  for (let i = 0; i < song.instruments.length; i++) {
    song.instruments[i] = loadInstrument(fileReader)

    // Update the instrument's table data reference
    song.instruments[i].tableData = song.tables[i]
  }

  // Discard the next 3 bytes (unused data)
  fileReader.skip(3)

  // Read Effects
  song.effectsSettings.chorusModDepth = fileReader.read()
  song.effectsSettings.chorusModFreq = fileReader.read()
  song.effectsSettings.chorusWidth = fileReader.read()
  song.effectsSettings.chorusReverbSend = fileReader.read()

  // Discard the next 3 bytes (unused data)
  fileReader.skip(3)

  song.effectsSettings.delayFilter[0] = fileReader.read()
  song.effectsSettings.delayFilter[1] = fileReader.read()
  song.effectsSettings.delayTime[0] = fileReader.read()
  song.effectsSettings.delayTime[1] = fileReader.read()
  song.effectsSettings.delayFeedback = fileReader.read()
  song.effectsSettings.delayWidth = fileReader.read()
  song.effectsSettings.delayReverbSend = fileReader.read()

  // Discard the next 1 byte (unused data)
  fileReader.skip(1)

  song.effectsSettings.reverbFilter[0] = fileReader.read()
  song.effectsSettings.reverbFilter[1] = fileReader.read()
  song.effectsSettings.reverbSize = fileReader.read()
  song.effectsSettings.reverbDamping = fileReader.read()
  song.effectsSettings.reverbModDepth = fileReader.read()
  song.effectsSettings.reverbModFreq = fileReader.read()
  song.effectsSettings.reverbWidth = fileReader.read()

  // Skip ahead to this specific position (unknown data)
  // TODO: Look into this
  fileReader.skipTo(0x1A5FE)

  // Read MIDI Mappings
  for (let i = 0; i < song.midiMappings.length; i++) {
    const midiMapping = song.midiMappings[i]

    midiMapping.channel = fileReader.read()
    midiMapping.controlNum = fileReader.read()
    // TODO: Data stored for value doesn't match MIDI Mapping output
    midiMapping.value = fileReader.read()
    midiMapping.type = fileReader.read()
    midiMapping.paramIndex = fileReader.read()
    midiMapping.minValue = fileReader.read()
    midiMapping.maxValue = fileReader.read()
    midiMapping.empty = midiMapping.channel === 0x00
  }

  // Read Scales (when supported)
  if (fileReader.m8Version.compare(VERSION_2_5_0) >= 0) {
    // Skip ahead to this specific position (unknown data)
    // TODO: Look into this
    fileReader.skipTo(0x1AA7E)

    for (let i = 0; i < song.scales.length; i++) {
      song.scales[i] = loadScale(fileReader)
    }
  }

  return song
}

/**
 * Reads an M8 Table (from an Instrument or Song file).
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Table}
 */
const loadTable = (fileReader) => {
  const table = new Table()

  for (let i = 0; i < table.steps.length; i++) {
    const step = table.steps[i]

    step.transpose = fileReader.read()
    step.volume = fileReader.read()

    for (let j = 0; j < 3; j++) {
      const fx = step['fx' + (j + 1)]

      fx.command = fileReader.read()
      fx.value = fileReader.read()
    }
  }

  return table
}

/**
 * Reads an M8 Theme file.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Theme}
 */
const loadTheme = (fileReader) => {
  const theme = new Theme(fileReader.m8Version)

  theme.background = fileReader.read(3)
  theme.textEmpty = fileReader.read(3)
  theme.textInfo = fileReader.read(3)
  theme.textDefault = fileReader.read(3)
  theme.textValue = fileReader.read(3)
  theme.textTitle = fileReader.read(3)
  theme.playMarker = fileReader.read(3)
  theme.cursor = fileReader.read(3)
  theme.selection = fileReader.read(3)
  theme.scopeSlider = fileReader.read(3)
  theme.meterLow = fileReader.read(3)
  theme.meterMid = fileReader.read(3)
  theme.meterPeak = fileReader.read(3)

  return theme
}

/**
 * Reads an M8 file of unknown type.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Instrument|module:m8-js/lib/types.Scale|module:m8-js/lib/types.Song|module:m8-js/lib/types.Theme}}
 */
const loadM8File = (fileReader) => {
  switch (fileReader.fileTypeToStr()) {
    case 'Song':
      return loadSong(fileReader)
    case 'Instrument':
      return loadInstrument(fileReader)
    case 'Theme':
      return loadTheme(fileReader)
    case 'Scale':
      return loadScale(fileReader)
    default:
      throw new TypeError(`Unsupported file type: ${fileReader.fileTypeToStr()}`)
  }
}

// Exports
module.exports = {
  dumpInstrument,
  dumpScale,
  dumpSong,
  dumpTheme,
  loadInstrument,
  loadM8File,
  loadScale,
  loadSong,
  loadTheme
}
