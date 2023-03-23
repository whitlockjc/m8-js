/* Copyright 2022 Jeremy Whitlock
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use theme file except in compliance with the License.
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

const { bytesForSkippedData, bytesFromBool, bytesFromFloatLE, bytesFromString, readFloatLE, readUInt16LE, toM8HexStr } = require('./lib/helpers')
const { Scale } = require('./lib/types/Scale')
const { Theme } = require('./lib/types/Theme')
const { VERSION_1_4_0, VERSION_2_5_0, InstrumentKinds } = require('./lib/constants')
const FMSynth = require('./lib/types/instruments/FMSynth')
const M8File = require('./lib/types/internal/M8File')
const M8FileReader = require('./lib/types/internal/M8FileReader')
const Macrosynth = require('./lib/types/instruments/Macrosynth')
const MIDIOut = require('./lib/types/instruments/MIDIOut')
const None = require('./lib/types/instruments/None')
const RGB = require('./lib/types/internal/RGB')
const Sampler = require('./lib/types/instruments/Sampler')
const Song = require('./lib/types/Song')
const Table = require('./lib/types/internal/Table')
const Wavsynth = require('./lib/types/instruments/Wavsynth')

// TODO: Add debug support
// TODO: Add error handling (Arguments in constructors, functions, ...)
// TODO: Add support for all constructors to take arguments
// TODO: Consider @typedefs for JavaScript Object representation
// TODO: Consider options objects for constructor arguments ()

/**
 * Dumps an M8 Instrument to its bytes representation.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instrument - The M8 Instrument to dump
 * @param {Boolean} [skipHeader=false] - Whether or not to include the M8 file header in the returned bytes
 *
 * @returns {Array<Number>}
 */
const dumpInstrument = (instrument, skipHeader = false, offset = 0) => {
  const bytes = []

  if (!skipHeader) {
    bytes.push(...instrument.headerAsBytes())
  }

  offset += bytes.length

  bytes.push(instrument.kind())
  bytes.push(...bytesFromString(instrument.name, 12, instrument.kind() === 0xFF ? 0xFF : 0x00))
  bytes.push(bytesFromBool(instrument.transpose))
  bytes.push(instrument.tableTick)

  // Do not write these values for 'MIDI OUT', they aren't here when reading
  if (instrument.kind() !== 0x03) {
    bytes.push(instrument.volume)
    bytes.push(instrument.pitch)
    bytes.push(instrument.fineTune)
  }

  // Instrument-specific parameters
  // Read instrument-specific parameters
  switch (instrument.kind()) {
    // WAVSYNTH
    case 0x00:
      bytes.push(instrument.instrParams.shape)
      bytes.push(instrument.instrParams.size)
      bytes.push(instrument.instrParams.mult)
      bytes.push(instrument.instrParams.warp)
      bytes.push(instrument.instrParams.mirror)

      break

    // MACROSYNTH
    case 0x01:
      bytes.push(instrument.instrParams.shape)
      bytes.push(instrument.instrParams.timbre)
      bytes.push(instrument.instrParams.color)
      bytes.push(instrument.instrParams.degrade)
      bytes.push(instrument.instrParams.redux)

      break

    // SAMPLER
    case 0x02:
      bytes.push(instrument.instrParams.playMode)
      bytes.push(instrument.instrParams.slice)
      bytes.push(instrument.instrParams.start)
      bytes.push(instrument.instrParams.loopStart)
      bytes.push(instrument.instrParams.length)
      bytes.push(instrument.instrParams.degrade)

      break

    // MIDIOUT
    case 0x03:
      bytes.push(instrument.instrParams.port)
      bytes.push(instrument.instrParams.channel)
      bytes.push(instrument.instrParams.bankSelect)
      bytes.push(instrument.instrParams.programChange)

      // Write 3 empty bytes (unused data)
      bytes.push(0x00, 0x00, 0x00)

      for (let i = 0; i < instrument.instrParams.customCC.length; i++) {
        const customCC = instrument.instrParams.customCC[i]

        bytes.push(customCC.number)
        bytes.push(customCC.defaultValue)
      }

      break

    // FMSYNTH
    case 0x04:
      bytes.push(instrument.instrParams.algo)

      // If supported, write the synth shapes
      if (instrument.m8FileVersion.compare(VERSION_1_4_0) >= 0) {
        for (let i = 0; i < instrument.instrParams.operators.length; i++) {
          bytes.push(instrument.instrParams.operators[i].shape)
        }
      }

      // Read the ratios
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        bytes.push(operator.ratio)
        bytes.push(operator.ratioFine)
      }

      // Read the feedback/volume of each operator
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        bytes.push(operator.level)
        bytes.push(operator.feedback)
      }

      // Read first modulator slot controls
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        bytes.push(operator.modA)
      }

      // Read second modulator slot controls
      for (let i = 0; i < instrument.instrParams.operators.length; i++) {
        const operator = instrument.instrParams.operators[i]

        bytes.push(operator.modB)
      }

      // Read modulation sources
      bytes.push(instrument.instrParams.mod1)
      bytes.push(instrument.instrParams.mod2)
      bytes.push(instrument.instrParams.mod3)
      bytes.push(instrument.instrParams.mod4)

      break

    // NONE
    case 0xFF:
      // Do nothing

      break
    default:
      /* istanbul ignore next */
      throw new TypeError(`Unsupported Instrument type: ${toM8HexStr(instrument.kind())}`)
  }

  // Filter parameters
  bytes.push(instrument.filterParams.type)
  bytes.push(instrument.filterParams.cutoff)
  bytes.push(instrument.filterParams.res)

  // Amplifier parameters
  bytes.push(instrument.ampParams.amp)
  bytes.push(instrument.ampParams.limit)

  // Write mixer parameters
  bytes.push(instrument.mixerParams.pan)
  bytes.push(instrument.mixerParams.dry)
  bytes.push(instrument.mixerParams.cho)
  bytes.push(instrument.mixerParams.del)
  bytes.push(instrument.mixerParams.rev)

  // Envelope parameters
  for (let i = 0; i < instrument.envelopes.length; i++) {
    const env = instrument.envelopes[i]

    bytes.push(env.dest)
    bytes.push(env.amount)
    bytes.push(env.attack)
    bytes.push(env.hold)
    bytes.push(env.decay)
    bytes.push(env.retrigger)
  }

  // LFO parameters
  for (let i = 0; i < instrument.lfos.length; i++) {
    const lfo = instrument.lfos[i]

    bytes.push(lfo.shape)
    bytes.push(lfo.dest)
    bytes.push(lfo.triggerMode)
    bytes.push(lfo.freq)
    bytes.push(lfo.amount)
    bytes.push(lfo.retrigger)
  }

  const writeLength = skipHeader
    ? (offset + 0x57) - (offset + bytes.length)
    : (offset + 0x57) - bytes.length

  // Fill in the empty values between instrument parameters and the sample path (when present)
  bytes.push(...bytesForSkippedData(instrument.m8FileReader,
                                    offset + bytes.length,
                                    writeLength,
                                    0xFF))

  // Sample Path (when present)
  bytes.push(...bytesFromString(instrument.kind() === 0x02 ? instrument.instrParams.samplePath : '', 128))

  // Write table data whenever writing an Instrument file versus being writing a Song file
  if (!skipHeader) {
    bytes.push(...dumpTable(instrument.table))
  }

  return bytes
}

/**
 * Dumps an M8 Scale to its bytes representation.
 *
 * @param {module:m8-js/lib/types.Scale} scale - The M8 Scale to dump
 * @param {Boolean} [skipHeader=false] - Whether or not to include the M8 file header in the returned bytes
 *
 * @returns {Array<Number>}
 */
const dumpScale = (scale, skipHeader = false) => {
  const bytes = []
  const emptyByte = skipHeader ? 0xFF : 0x00

  if (!skipHeader) {
    bytes.push(...scale.headerAsBytes())
  }

  let noteBits = ''

  for (let i = 0; i < scale.intervals.length; i++) {
    noteBits += scale.intervals[i].enabled === true ? '1' : '0'
  }

  const rawNoteMap = parseInt(noteBits.split('').reverse().join(''), 2)

  bytes.push(rawNoteMap & 0xFF)
  bytes.push((rawNoteMap >> 8) & 0xFF)

  for (let i = 0; i < scale.intervals.length; i++) {
    const interval = scale.intervals[i]

    bytes.push(interval.offsetA)
    bytes.push(interval.offsetB)
  }

  bytes.push(...bytesFromString(scale.name, 16, emptyByte))

  return bytes
}

/**
 * Dumps an M8 Song to its bytes representation.
 *
 * @param {module:m8-js/lib/types.Song} song - The Song to dump
 *
 * @returns {Array<Number>}
 */
const dumpSong = (song) => {
  const bytes = song.headerAsBytes()
  const startLen = bytes.length

  bytes.push(...bytesFromString(song.directory, 128))

  // Unlike useSkippedBytes, we need to go and backfill the "garbage" after the directory name.
  for (let i = startLen + song.directory.length + 1; i < startLen + 128; i++) {
    let skippedValue = 0x00

    if (song.m8FileReader?.skipped.indexOf(i) > -1) {
      skippedValue = song.m8FileReader.bytes[i]
    }

    bytes[i] = skippedValue
  }

  bytes.push(song.transpose)
  bytes.push(...bytesFromFloatLE(song.tempo))
  bytes.push(song.quantize)
  bytes.push(...bytesFromString(song.name, 12))

  // MIDI Settings
  bytes.push(bytesFromBool(song.midiSettings.receiveSync))
  bytes.push(song.midiSettings.receiveTransport)
  bytes.push(bytesFromBool(song.midiSettings.sendSync))
  bytes.push(song.midiSettings.sendTransport)
  bytes.push(song.midiSettings.recordNoteChannel)
  bytes.push(bytesFromBool(song.midiSettings.recordNoteVelocity))
  bytes.push(song.midiSettings.recordNoteDelayKillCommands)
  bytes.push(song.midiSettings.controlMapChannel)
  bytes.push(song.midiSettings.songRowCueChannel)

  for (let i = 0; i < 8; i++) {
    bytes.push(song.midiSettings.trackInputChannel[i])
  }

  for (let i = 0; i < 8; i++) {
    bytes.push(song.midiSettings.trackInputInstrument[i])
  }

  bytes.push(bytesFromBool(song.midiSettings.trackInputProgramChange))
  bytes.push(song.midiSettings.trackInputMode)

  // Song key and skipped/unknown data
  bytes.push(song.key)
  bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 18, 0x00))

  // Read Mixer Settings
  bytes.push(song.mixerSettings.masterVolume)
  bytes.push(song.mixerSettings.masterLimit)

  for (let i = 0; i < 8; i++) {
    bytes.push(song.mixerSettings.trackVolume[i])
  }

  bytes.push(song.mixerSettings.chorusVolume)
  bytes.push(song.mixerSettings.delayVolume)
  bytes.push(song.mixerSettings.reverbVolume)
  bytes.push(song.mixerSettings.analogInputVolume[0])
  bytes.push(song.mixerSettings.analogInputVolume[1])
  bytes.push(song.mixerSettings.usbInputVolume)
  bytes.push(song.mixerSettings.analogInputChorus[0])
  bytes.push(song.mixerSettings.analogInputDelay[0])
  bytes.push(song.mixerSettings.analogInputReverb[0])
  bytes.push(song.mixerSettings.analogInputChorus[1])
  bytes.push(song.mixerSettings.analogInputDelay[1])
  bytes.push(song.mixerSettings.analogInputReverb[1])
  bytes.push(song.mixerSettings.usbInputChorus)
  bytes.push(song.mixerSettings.usbInputDelay)
  bytes.push(song.mixerSettings.usbInputReverb)
  bytes.push(song.mixerSettings.djFilter)
  bytes.push(song.mixerSettings.djFilterPeak)

  // Skipped data
  bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 5, 0x00))

  // Grooves
  for (let i = 0; i < song.grooves.length; i++) {
    const groove = song.grooves[i]

    for (let j = 0; j < groove.steps.length; j++) {
      bytes.push(groove.steps[j])
    }
  }

  // Song steps
  for (let i = 0; i < song.steps.length; i++) {
    const step = song.steps[i]

    for (let j = 0; j < step.tracks.length; j++) {
      bytes.push(step.tracks[j])
    }
  }

  // Phrases
  for (let i = 0; i < song.phrases.length; i++) {
    const phrase = song.phrases[i]

    for (let j = 0; j < phrase.steps.length; j++) {
      const step = phrase.steps[j]

      bytes.push(step.note)
      bytes.push(step.volume)
      bytes.push(step.instrument)

      for (let k = 0; k < 3; k++) {
        const fx = step.fx[k]

        bytes.push(fx.command)
        bytes.push(fx.value)
      }
    }
  }

  // Chains
  for (let i = 0; i < song.chains.length; i++) {
    const chain = song.chains[i]

    for (let j = 0; j < chain.steps.length; j++) {
      const step = chain.steps[j]

      bytes.push(step.phrase)
      bytes.push(step.transpose)
    }
  }

  // Tables
  for (let i = 0; i < song.tables.length; i++) {
    // We cannot assume that the tables are synced up for Instruments so use the Instrument table if possible
    bytes.push(...dumpTable(song.instruments[i]?.table || song.tables[i]))
  }

  // Instruments
  for (let i = 0; i < song.instruments.length; i++) {
    bytes.push(...dumpInstrument(song.instruments[i], true, bytes.length))
  }

  // Skipped data
  bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 3, 0x00))

  // Effects
  bytes.push(song.effectsSettings.chorusSettings.modDepth)
  bytes.push(song.effectsSettings.chorusSettings.modFreq)
  bytes.push(song.effectsSettings.chorusSettings.width)
  bytes.push(song.effectsSettings.chorusSettings.reverbSend)

  // Skipped data
  bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 3, 0x00))

  bytes.push(song.effectsSettings.delaySettings.filterHP)
  bytes.push(song.effectsSettings.delaySettings.filterLP)
  bytes.push(song.effectsSettings.delaySettings.timeL)
  bytes.push(song.effectsSettings.delaySettings.timeR)
  bytes.push(song.effectsSettings.delaySettings.feedback)
  bytes.push(song.effectsSettings.delaySettings.width)
  bytes.push(song.effectsSettings.delaySettings.reverbSend)

  // Skipped data
  bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 1, 0x00))

  bytes.push(song.effectsSettings.reverbSettings.filterHP)
  bytes.push(song.effectsSettings.reverbSettings.filterLP)
  bytes.push(song.effectsSettings.reverbSettings.size)
  bytes.push(song.effectsSettings.reverbSettings.damping)
  bytes.push(song.effectsSettings.reverbSettings.modDepth)
  bytes.push(song.effectsSettings.reverbSettings.modFreq)
  bytes.push(song.effectsSettings.reverbSettings.width)

  // Skipped data between Instruments and MIDI Mappings (when present)
  bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 0x1A5FE - bytes.length, 0xFF))

  // MIDI Mappings
  for (let i = 0; i < song.midiMappings.length; i++) {
    const midiMapping = song.midiMappings[i]

    bytes.push(midiMapping.channel)
    bytes.push(midiMapping.controlNum)
    bytes.push(midiMapping.type)
    bytes.push(midiMapping.instrIndex)
    bytes.push(midiMapping.paramIndex)
    bytes.push(midiMapping.minValue)
    bytes.push(midiMapping.maxValue)
  }

  // Scales (when supported)
  if (song.m8FileVersion.compare(VERSION_2_5_0) >= 0) {
    // Skipped data between MIDI Mappings and Scales (when present)
    bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 0x1AA7E - bytes.length, 0xFF))

    for (let i = 0; i < song.scales.length; i++) {
      bytes.push(...dumpScale(song.scales[i], true))
    }
  } else {
    bytes.push(...bytesForSkippedData(song.m8FileReader, bytes.length, 256, 0x00))
  }

  return bytes
}

/**
 * Dumps an M8 Table to its bytes representation.
 *
 * @param {module:m8-js/lib/types.Table} table - The Table to dump
 *
 * @returns {Array<Number>}
 */
const dumpTable = (table) => {
  const bytes = []

  for (let i = 0; i < table.steps.length; i++) {
    const step = table.steps[i]

    bytes.push(step.transpose)
    bytes.push(step.volume)

    for (let j = 0; j < step.fx.length; j++) {
      const fx = step.fx[j]

      bytes.push(fx.command)
      bytes.push(fx.value)
    }
  }

  return bytes
}

/**
 * Dumps an M8 Theme to its bytes representation.
 *
 * @param {module:m8-js/lib/types.Theme} theme - The M8 Theme to dump
 *
 * @returns {Array<Number>}
 */
const dumpTheme = (theme) => {
  const bytes = theme.headerAsBytes()

  bytes.push(theme.background.r, theme.background.g, theme.background.b)
  bytes.push(theme.textEmpty.r, theme.textEmpty.g, theme.textEmpty.b)
  bytes.push(theme.textInfo.r, theme.textInfo.g, theme.textInfo.b)
  bytes.push(theme.textDefault.r, theme.textDefault.g, theme.textDefault.b)
  bytes.push(theme.textValue.r, theme.textValue.g, theme.textValue.b)
  bytes.push(theme.textTitle.r, theme.textTitle.g, theme.textTitle.b)
  bytes.push(theme.playMarker.r, theme.playMarker.g, theme.playMarker.b)
  bytes.push(theme.cursor.r, theme.cursor.g, theme.cursor.b)
  bytes.push(theme.selection.r, theme.selection.g, theme.selection.b)
  bytes.push(theme.scopeSlider.r, theme.scopeSlider.g, theme.scopeSlider.b)
  bytes.push(theme.meterLow.r, theme.meterLow.g, theme.meterLow.b)
  bytes.push(theme.meterMid.r, theme.meterMid.g, theme.meterMid.b)
  bytes.push(theme.meterPeak.r, theme.meterPeak.g, theme.meterPeak.b)

  return bytes
}

/**
 * Loads an M8 Instrument from its bytes.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH}
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
      instr = new Wavsynth(fileReader)

      instr.instrParams.shape = fileReader.read()
      instr.instrParams.size = fileReader.read()
      instr.instrParams.mult = fileReader.read()
      instr.instrParams.warp = fileReader.read()
      instr.instrParams.mirror = fileReader.read()

      break
    case 0x01:
      instr = new Macrosynth(fileReader)

      instr.instrParams.shape = fileReader.read()
      instr.instrParams.timbre = fileReader.read()
      instr.instrParams.color = fileReader.read()
      instr.instrParams.degrade = fileReader.read()
      instr.instrParams.redux = fileReader.read()

      break
    case 0x02:
      instr = new Sampler(fileReader)

      instr.instrParams.playMode = fileReader.read()
      instr.instrParams.slice = fileReader.read()
      instr.instrParams.start = fileReader.read()
      instr.instrParams.loopStart = fileReader.read()
      instr.instrParams.length = fileReader.read()
      instr.instrParams.degrade = fileReader.read()

      break
    case 0x03:
      instr = new MIDIOut(fileReader)

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
      instr = new FMSynth(fileReader)

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
      instr = new None(fileReader)

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
  if (instr.kind() !== InstrumentKinds.MIDIOUT) {
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
  for (let i = 0; i < instr.envelopes.length; i++) {
    const env = instr.envelopes[i]

    env.dest = fileReader.read()
    env.amount = fileReader.read()
    env.attack = fileReader.read()
    env.hold = fileReader.read()
    env.decay = fileReader.read()
    env.retrigger = fileReader.read()
  }

  // Read LFO parametersj
  for (let i = 0; i < instr.lfos.length; i++) {
    const lfo = instr.lfos[i]

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
  if (instr.kind() === InstrumentKinds.SAMPLER) {
    instr.instrParams.samplePath = fileReader.readStr(127)

    // Discard the next byte
    fileReader.skip(1)
  } else {
    // Discard the bytes corresponding to the sample path when it's not present
    fileReader.skip(128)
  }

  // Read table data whenever the Instrument is read from an Instrument file versus being read from a Song file
  if (fileReader.fileTypeToStr() === 'Instrument') {
    instr.table = loadTable(fileReader)
  }

  return instr
}

/**
 * Loads an M8 Scale from its bytes.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Scale}
 */
const loadScale = (fileReader) => {
  const scale = new Scale(fileReader)
  const noteMap = readUInt16LE(fileReader.read(2))

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
 * Loads an M8 Song from its bytes.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Song}
 */
const loadSong = (fileReader) => {
  const song = new Song(fileReader)

  song.directory = fileReader.readStr(128)
  song.transpose = fileReader.read()
  // Tempo is stored in 4 bytes as a 32-bit float
  song.tempo = readFloatLE(fileReader.read(4))
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
      step.tracks[j] = fileReader.read()
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
        const fx = step.fx[k]

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
    song.instruments[i].table = song.tables[i]
  }

  // Discard the next 3 bytes (unused data)
  fileReader.skip(3)

  // Read Effects
  song.effectsSettings.chorusSettings.modDepth = fileReader.read()
  song.effectsSettings.chorusSettings.modFreq = fileReader.read()
  song.effectsSettings.chorusSettings.width = fileReader.read()
  song.effectsSettings.chorusSettings.reverbSend = fileReader.read()

  // Discard the next 3 bytes (unused data)
  fileReader.skip(3)

  song.effectsSettings.delaySettings.filterHP = fileReader.read()
  song.effectsSettings.delaySettings.filterLP = fileReader.read()
  song.effectsSettings.delaySettings.timeL = fileReader.read()
  song.effectsSettings.delaySettings.timeR = fileReader.read()
  song.effectsSettings.delaySettings.feedback = fileReader.read()
  song.effectsSettings.delaySettings.width = fileReader.read()
  song.effectsSettings.delaySettings.reverbSend = fileReader.read()

  // Discard the next 1 byte (unused data)
  fileReader.skip(1)

  song.effectsSettings.reverbSettings.filterHP = fileReader.read()
  song.effectsSettings.reverbSettings.filterLP = fileReader.read()
  song.effectsSettings.reverbSettings.size = fileReader.read()
  song.effectsSettings.reverbSettings.damping = fileReader.read()
  song.effectsSettings.reverbSettings.modDepth = fileReader.read()
  song.effectsSettings.reverbSettings.modFreq = fileReader.read()
  song.effectsSettings.reverbSettings.width = fileReader.read()

  // Skip ahead to this specific position (unknown data)
  // TODO: Look into this
  fileReader.skipTo(0x1A5FE)

  // Read MIDI Mappings
  for (let i = 0; i < song.midiMappings.length; i++) {
    const midiMapping = song.midiMappings[i]

    midiMapping.channel = fileReader.read()
    midiMapping.controlNum = fileReader.read()
    midiMapping.type = fileReader.read()
    midiMapping.instrIndex = fileReader.read()
    midiMapping.paramIndex = fileReader.read()
    midiMapping.minValue = fileReader.read()
    midiMapping.maxValue = fileReader.read()
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
 * Loads an M8 Table from its bytes.
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

    for (let j = 0; j < step.fx.length; j++) {
      const fx = step.fx[j]

      fx.command = fileReader.read()
      fx.value = fileReader.read()
    }
  }

  return table
}

/**
 * Loads an M8 Theme from its bytes.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Theme}
 */
const loadTheme = (fileReader) => {
  const theme = new Theme(fileReader)

  Theme.getObjectProperties().forEach((prop) => {
    // Skip the file metadata as it's not required
    if (prop === 'fileMetadata') {
      return
    }

    theme[prop] = new RGB(...fileReader.read(3))
  })

  return theme
}

/**
 * Dumps an M8 file and returns its bytes.
 *
 * @param {module:m8-js/lib/types.M8File} m8File - The M8File instance to dump
 *
 * @returns {Uint8Array}
 */
const dumpM8File = (m8File) => {
  const fileTypeStr = M8File.typeToStr(m8File.m8FileType)
  let bytes

  switch (fileTypeStr) {
    case 'Instrument':
      bytes = dumpInstrument(m8File)

      break

    case 'Scale':
      bytes = dumpScale(m8File)

      break

    case 'Song':
      bytes = dumpSong(m8File)

      break

    case 'Theme':
      bytes = dumpTheme(m8File)

      break

    default:
      throw new TypeError(`Unsupported file type: ${fileTypeStr}`)
  }

  return Uint8Array.from(bytes)
}

/**
 * Loads an M8 file and returns the appropriate corresdponding object.
 *
 * @param {Array<Number>} bytes - The raw M8 file bytes
 *
 * @returns {module:m8-js/lib/types.Scale|module:m8-js/lib/types.Song|module:m8-js/lib/types.Theme|module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH}
 */
const loadM8File = (bytes) => {
  const m8FileReader = new M8FileReader(bytes)

  switch (m8FileReader.fileTypeToStr()) {
    case 'Instrument':
      return loadInstrument(m8FileReader)
    case 'Scale':
      return loadScale(m8FileReader)
    case 'Song':
      return loadSong(m8FileReader)
    case 'Theme':
      return loadTheme(m8FileReader)
    default:
      throw new TypeError(`Unsupported file type: ${m8FileReader.fileTypeToStr()}`)
  }
}

// Exports
module.exports = {
  dumpM8File,
  loadM8File
}
