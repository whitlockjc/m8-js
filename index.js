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

const Scale = require('./lib/types/Scale')
const Song = require('./lib/types/Song')
const Table = require('./lib/types/Table')
const Theme = require('./lib/types/Theme')
const { FMSynth, Macrosynth, MIDIOut, None, Sampler, Wavsynth } = require('./lib/types/Instrument')
const { LATEST_M8_VERSION, VERSION_1_4_0, VERSION_2_5_0 } = require('./lib/constants')
const { toM8HexStr } = require('./lib/helpers')

// TODO: Add debug support
// TODO: Add error handling
// TODO: Create a Project type?

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
 * Dumps an M8Version file to bytes.
 *
 * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version
 *
 * @returns {Array<Number>}
 */
const dumpM8Version = (m8Version) => {
  // Start with 'M8VERSION' bytes
  const bytes = [0x4D, 0x38, 0x56, 0x45, 0x52, 0x53, 0x49, 0x4F, 0x4E]

  bytes.push(0x00)

  const majorBits = m8Version.majorVersion === 0
    ? '0000'
    : m8Version.majorVersion.toString(2)
  const minorBits = m8Version.minorVersion === 0
    ? '0000'
    : m8Version.minorVersion.toString(2).padStart(4, '0')
  const patchBits = m8Version.patchVersion === 0
    ? '0000'
    : m8Version.patchVersion.toString(2).padStart(4, '0')
  const rawM8Version = parseInt(majorBits + minorBits + patchBits, 2)

  bytes.push(rawM8Version & 0xFF)
  bytes.push((rawM8Version >> 8) & 0xFF)

  bytes.push(0x00)

  return bytes
}

/**
 * Dumps an M8 Scale file to bytes.
 *
 * @param {module:m8-js/lib/types.Scale} theme - The M8 theme file
 * @param {module:m8-js/lib/types.M8Version} [m8Version] - The optional M8 version _(defaults to the latest version)_
 *
 * @returns {module:m8-js.Buffer}
 */
const dumpScale = (scale, m8Version) => {
  const bytes = dumpM8Version(m8Version || LATEST_M8_VERSION)

  // File type
  bytes.push(3 << 4)

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

  for (let i = 0; i < 16; i++) {
    const nameCharCode = scale.name.charCodeAt(i)

    if (isNaN(nameCharCode)) {
      bytes.push(0x00)
    } else {
      bytes.push(nameCharCode)
    }
  }

  return Buffer.from(bytes)
}

/**
 * Dumps an M8 Theme file to bytes.
 *
 * @param {module:m8-js/lib/types.Theme} theme - The M8 theme file
 * @param {module:m8-js/lib/types.M8Version} [m8Version] - The optional M8 version _(defaults to the latest version)_
 *
 * @returns {module:m8-js.Buffer}
 */
const dumpTheme = (theme, m8Version) => {
  const bytes = dumpM8Version(m8Version || LATEST_M8_VERSION)

  // File type
  bytes.push(2 << 4)

  bytes.push(...theme.background)
  bytes.push(...theme.textEmpty)
  bytes.push(...theme.textInfo)
  bytes.push(...theme.textDefault)
  bytes.push(...theme.textValue)
  bytes.push(...theme.textTitle)
  bytes.push(...theme.playMarker)
  bytes.push(...theme.cursor)
  bytes.push(...theme.selection)
  bytes.push(...theme.scopeSlider)
  bytes.push(...theme.meterLow)
  bytes.push(...theme.meterMid)
  bytes.push(...theme.meterPeak)

  return Buffer.from(bytes)
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
  if (kind !== 3) {
    volume = fileReader.read()
    pitch = fileReader.read()
    fineTune = fileReader.read()
  }

  let instr

  // Read instrument-specific parameters
  switch (kind) {
    case 0:
      instr = new Wavsynth(fileReader.m8Version)

      instr.instrParams.shape = fileReader.read()
      instr.instrParams.size = fileReader.read()
      instr.instrParams.mult = fileReader.read()
      instr.instrParams.warp = fileReader.read()
      instr.instrParams.mirror = fileReader.read()

      break
    case 1:
      instr = new Macrosynth(fileReader.m8Version)

      instr.instrParams.shape = fileReader.read()
      instr.instrParams.timbre = fileReader.read()
      instr.instrParams.color = fileReader.read()
      instr.instrParams.degrade = fileReader.read()
      instr.instrParams.redux = fileReader.read()

      break
    case 2:
      instr = new Sampler(fileReader.m8Version)

      instr.instrParams.playMode = fileReader.read()
      instr.instrParams.slice = fileReader.read()
      instr.instrParams.start = fileReader.read()
      instr.instrParams.loopStart = fileReader.read()
      instr.instrParams.length = fileReader.read()
      instr.instrParams.degrade = fileReader.read()

      break
    case 3:
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
    case 4:
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

  // Skip to the sample path (when present)
  fileReader.skipTo(startPos + 0x57) // Jump amount differs based on instrument type

  // Read Sample Path (Unfortunate that it happens here)
  if (instr.kindToStr() === 'SAMPLER') {
    instr.instrParams.samplePath = fileReader.readStr(127)

    fileReader.skip(1)
  } else {
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
  const scale = new Scale()
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
  // This is a 32-bit float and has to be read as such
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

  // Read song data
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

    // TODO: Research table data being stored within the instrument

    // Update the instrument's table data reference
    song.instruments[i].tableData = song.tables[i]
  }

  // Discard the next 3 bytes (unused data)
  fileReader.read(3)

  // Read Effects
  song.effectsSettings.chorusModDepth = fileReader.read()
  song.effectsSettings.chorusModFreq = fileReader.read()
  song.effectsSettings.chorusWidth = fileReader.read()
  song.effectsSettings.chorusReverbSend = fileReader.read()

  // Discard the next 3 bytes (unused data)
  fileReader.read(3)

  song.effectsSettings.delayFilter[0] = fileReader.read()
  song.effectsSettings.delayFilter[1] = fileReader.read()
  song.effectsSettings.delayTime[0] = fileReader.read()
  song.effectsSettings.delayTime[1] = fileReader.read()
  song.effectsSettings.delayFeedback = fileReader.read()
  song.effectsSettings.delayWidth = fileReader.read()
  song.effectsSettings.delayReverbSend = fileReader.read()

  // Discard the next 1 byte (unused data)
  fileReader.read(1)

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

  for (let j = 0; j < table.steps.length; j++) {
    const step = table.steps[j]

    step.transpose = fileReader.read()
    step.volume = fileReader.read()

    for (let k = 0; k < 3; k++) {
      const fx = step['fx' + (k + 1)]

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
  const theme = new Theme(fileReader)

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
  dumpScale,
  dumpTheme,
  loadInstrument,
  loadM8File,
  loadScale,
  loadSong,
  loadTable,
  loadTheme
}
