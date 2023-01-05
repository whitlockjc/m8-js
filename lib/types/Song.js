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

const { bytesForSkippedData, bytesFromBool, bytesFromFloatLE, bytesFromString, readFloatLE, toM8HexStr } = require('../helpers')

const { DefaultScales, Scale } = require('./Scale')
const { Instrument, None } = require('./Instrument')
const Chain = require('./Chain')
const Groove = require('./Groove')
const M8File = require('./M8File')
const M8FileReader = require('./M8FileReader')
const Phrase = require('./Phrase')
const Table = require('./Table')

const { LATEST_M8_VERSION, M8FileTypes, VERSION_2_5_0 } = require('../constants')

/**
 * Represents the Effects Settings.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class EffectsSettings {
  /** @member {Number} */
  chorusModDepth
  /** @member {Number} */
  chorusModFreq
  /** @member {Number} */
  chorusReverbSend
  /** @member {Number} */
  chorusWidth
  /** @member {Number} */
  delayFeedback
  /** @member {Array<Number>} */
  delayFilter
  /** @member {Number} */
  delayReverbSend
  /** @member {Array<Number>} */
  delayTime
  /** @member {Number} */
  delayWidth
  /** @member {Number} */
  reverbDamping
  /** @member {Array<Number>} */
  reverbFilter
  /** @member {Number} */
  reverbModDepth
  /** @member {Number} */
  reverbModFreq
  /** @member {Number} */
  reverbSize
  /** @member {Number} */
  reverbWidth

  /**
   * Create an Effects Settings.
   */
  constructor () {
    this.chorusModDepth = 0x40
    this.chorusModFreq = 0x80
    this.chorusReverbSend = 0x00
    this.chorusWidth = 0xFF
    this.delayFeedback = 0x80
    this.delayFilter = [0x40, 0xFF]
    this.delayReverbSend = 0x00
    this.delayTime = [0x30, 0x30]
    this.delayWidth = 0xFF
    this.reverbDamping = 0xC0
    this.reverbFilter = [0x10, 0xE0]
    this.reverbModDepth = 0x10
    this.reverbModFreq = 0xFF
    this.reverbSize = 0xFF
    this.reverbWidth = 0xFF
  }
}

/**
 * Represents a MIDI Mapping.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MIDIMapping {
  /** @member {Number} */
  channel
  /** @member {Number} */
  controlNum
  /** @member {Boolean} */
  empty
  /** @member {Number} */
  maxValue
  /** @member {Number} */
  minValue
  /** @member {Number} */
  paramIndex
  /** @member {Number} */
  type
  /** @member {Number} */
  value

  /**
   * Create a MIDI Mapping.
   */
  constructor () {
    this.channel = 0x00
    this.controlNum = 0x00
    this.empty = true
    this.maxValue = 0x00
    this.minValue = 0x00
    this.paramIndex = 0x00
    this.type = 0x00
    this.value = 0x00
  }

  /**
   * Returns the string representation of the mapping destination.
   *
   * @returns {String}
   */
  destToStr () {
    // TODO: Figure out a way to create a mapping from parameter index to string
    return toM8HexStr(this.paramIndex)
  }

  /**
   * Returns a single-character string representation of the mapping type.
   *
   * @returns {String}
   */
  typeToChar () {
    switch (this.type) {
      case 0:
        return 'I'
      case 1:
        return 'M'
      case 2:
        return 'E'
      default:
        return `U (${toM8HexStr(this.type)})`
    }
  }
}

/**
 * Represents the MIDI Settings.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MIDISettings {
  /** @member {Number} */
  controlMapChannel
  /** @member {Boolean} */
  receiveSync
  /** @member {Number} */
  receiveTransport
  /** @member {Number} */
  recordNoteChannel
  /** @member {Boolean} */
  recordNoteDelayKillCommands
  /** @member {Boolean} */
  recordNoteVelocity
  /** @member {Boolean} */
  sendSync
  /** @member {Number} */
  sendTransport
  /** @member {Number} */
  songRowCueChannel
  /** @member {Array<Number>} */
  trackInputChannel
  /** @member {Array<Number>} */
  trackInputInstrument
  /** @member {Number} */
  trackInputMode
  /** @member {Boolean} */
  trackInputProgramChange

  /**
   * Create a MIDI Settings.
   */
  constructor () {
    this.controlMapChannel = 0x11 // ALL
    this.receiveSync = false
    this.receiveTransport = 0x00
    this.recordNoteChannel = 0x09
    this.recordNoteDelayKillCommands = 0x00
    this.recordNoteVelocity = true
    this.sendSync = false
    this.sendTransport = 0x00
    this.songRowCueChannel = 0x0B
    this.trackInputChannel = new Array(8)
    this.trackInputInstrument = new Array(8)
    this.trackInputMode = 0x01 // LEGATO
    this.trackInputProgramChange = true

    for (let i = 0; i < 8; i++) {
      this.trackInputChannel[i] = i + 1
    }

    for (let i = 0; i < 8; i++) {
      this.trackInputInstrument[i] = 0x00
    }
  }

  /**
   * Returns a string representation of the record delay/kill commands.
   *
   * @returns {String}
   */
  recordNoteDelayKillCommandsToStr () {
    switch (this.recordNoteDelayKillCommands) {
      case 0x00:
        return 'OFF'
      case 0x01:
        return 'KILL'
      case 0x02:
        return 'DELAY'
      case 0x03:
        return 'BOTH'
      default:
        return `UNKNOWN (${toM8HexStr(this.recordNoteDelayKillCommands)})`
    }
  }

  /**
   * Returns a string representation of the track input mode.
   *
   * @returns {String}
   */
  trackInputModeToStr () {
    switch (this.trackInputMode) {
      case 0:
        return 'MONO'
      case 1:
        return 'LEGATO'
      case 2:
        return 'POLY'
      default:
        return `UNKNOWN (${toM8HexStr(this.trackInputMode)})`
    }
  }

  /**
   * Returns a string representation of the transport mode.
   *
   * @param {String} transport - The raw transport value
   *
   * @returns {String}
   */
  transportToStr (transport) {
    switch (transport) {
      case 0x00:
        return 'OFF'
      case 0x01:
        return 'PATTERN'
      case 0x02:
        return 'SONG'
      default:
        return `UNKNOWN (${toM8HexStr(transport)})`
    }
  }
}

/**
 * Represents a Song step.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class SongStep {
  /** @member {Number} */
  track1
  /** @member {Number} */
  track2
  /** @member {Number} */
  track3
  /** @member {Number} */
  track4
  /** @member {Number} */
  track5
  /** @member {Number} */
  track6
  /** @member {Number} */
  track7
  /** @member {Number} */
  track8

  /**
   * Create a Song Step.
   */
  constructor () {
    this.track1 = 0xFF
    this.track2 = 0xFF
    this.track3 = 0xFF
    this.track4 = 0xFF
    this.track5 = 0xFF
    this.track6 = 0xFF
    this.track7 = 0xFF
    this.track8 = 0xFF
  }
}

/**
 * Represents the Mixer Settings.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MixerSettings {
  /** @member {Array<Number>} */
  analogInputChorus
  /** @member {Array<Number>} */
  analogInputDelay
  /** @member {Array<Number>} */
  analogInputReverb
  /** @member {Array<Number>} */
  analogInputVolume
  /** @member {Number} */
  chorusVolume
  /** @member {Number} */
  delayVolume
  /** @member {Number} */
  djFilter
  /** @member {Number} */
  djFilterPeak
  /** @member {Number} */
  masterLimit
  /** @member {Number} */
  masterVolume
  /** @member {Number} */
  reverbVolume
  /** @member {Array<Number>} */
  trackVolume
  /** @member {Number} */
  usbInputChorus
  /** @member {Number} */
  usbInputDelay
  /** @member {Number} */
  usbInputReverb
  /** @member {Number} */
  usbInputVolume

  /**
   * Create a MIDI Settings.
   */
  constructor () {
    this.analogInputChorus = [0x00, 0x00]
    this.analogInputDelay = [0x00, 0x00]
    this.analogInputReverb = [0x00, 0x00]
    this.analogInputVolume = [0x00, 0xFF]
    this.chorusVolume = 0xE0
    this.delayVolume = 0xE0
    this.djFilter = 0x80
    this.djFilterPeak = 0x80
    this.masterLimit = 0x00
    this.masterVolume = 0xE0
    this.reverbVolume = 0xE0
    this.trackVolume = new Array(8)
    this.usbInputChorus = 0x00
    this.usbInputDelay = 0x00
    this.usbInputReverb = 0x00
    this.usbInputVolume = 0x00

    for (let i = 0; i < 8; i++) {
      this.trackVolume[i] = 0xE0
    }
  }
}

/**
 * Represents a Song.
 *
 * @class
 *
 * @augments module:m8-js/lib/types.M8File
 * @memberof module:m8-js/lib/types
 */
class Song extends M8File {
  /** @member {Array<module:m8-js/lib/types.Chain>} */
  chains
  /** @member {String} */
  directory
  /** @member {module:m8-js/lib/types.EffectsSettings} */
  effectsSettings
  /** @member {Array<module:m8-js/lib/types.Groove>} */
  grooves
  /** @member {Array<module:m8-js/lib/types.Instrument>} */
  instruments
  /** @member {Number} */
  key
  /** @member {module:m8-js/lib/types.MIDISettings} */
  midiSettings
  /** @member {module:m8-js/lib/types.MixerSettings} */
  mixerSettings
  /** @member {String} */
  name
  /** @member {Array<module:m8-js/lib/types.Phrase>} */
  phrases
  /** @member {Number} */
  quantize
  /** @member {Array<module:m8-js/lib/types.Scale>} */
  scales
  /** @member {Array<module:m8-js/lib/types.SongStep>} */
  steps
  /** @member {Array<module:m8-js/lib/types.Table>} */
  tables
  /** @member {Number} */
  tempo
  /** @member {Number} */
  transpose
  /** @private */
  #fileReader

  /**
   * Create a Song.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Song
   */
  constructor (m8ReaderOrVersion) {
    let m8Version = LATEST_M8_VERSION
    let m8FileReader

    if (typeof m8ReaderOrVersion !== 'undefined') {
      if (m8ReaderOrVersion.constructor.name === 'M8Version') {
        m8Version = m8ReaderOrVersion
      } else {
        m8FileReader = m8ReaderOrVersion
        m8Version = m8ReaderOrVersion.m8Version
      }
    }

    super(M8FileTypes.Song, m8Version)

    this.#fileReader = m8FileReader
    this.chains = new Array(255)
    this.directory = ''
    this.effectsSettings = new EffectsSettings()
    this.grooves = new Array(32)
    this.instruments = new Array(128)
    this.key = 0x00
    this.midiMappings = new Array(128)
    this.midiSettings = new MIDISettings()
    this.mixerSettings = new MixerSettings()
    this.name = ''
    this.phrases = new Array(255)
    this.quantize = 0x00
    this.scales = new Array(16)
    this.steps = new Array(256)
    this.tables = new Array(256)
    this.tempo = 0x78 // 120
    this.transpose = 0x00

    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i] = new Chain()
    }

    for (let i = 0; i < this.grooves.length; i++) {
      this.grooves[i] = new Groove()
    }

    for (let i = 0; i < this.instruments.length; i++) {
      this.instruments[i] = new None(m8ReaderOrVersion)
    }

    for (let i = 0; i < this.midiMappings.length; i++) {
      this.midiMappings[i] = new MIDIMapping()
    }

    for (let i = 0; i < this.phrases.length; i++) {
      this.phrases[i] = new Phrase()
    }

    if (this.m8FileVersion.compare(VERSION_2_5_0) >= 0) {
      this.scales = DefaultScales
    } else {
      this.scales = undefined
    }

    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i] = new SongStep()
    }

    for (let i = 0; i < this.tables.length; i++) {
      this.tables[i] = new Table()
    }
  }

  findPhraseStepInstrument (trackNum, songStepNum, chainStepNum, phraseStepNum) {
    const songStep = this.steps[songStepNum]
    const chainName = songStep['track' + trackNum]

    if (chainName === 0xFF) {
      return undefined
    }

    const chain = this.chains[chainName]
    const chainStep = chain.steps[chainStepNum]

    if (chainStep.phrase === 0xFF) {
      return undefined
    }

    // Collect all parent chains
    const chains = []

    for (let i = 0; i <= chainStepNum; i++) {
      const chainName = this.steps[i]['track' + trackNum]

      if (chainName !== 0xFF) {
        chains.push(this.chains[chainName])
      }
    }

    // Collect all parent phrases for the phrase step
    const phrases = []

    for (let i = 0; i < phraseStepNum - 1; i++) {
      const chainStep = chain.steps[i]

      if (chainStep.phrase !== 0xFF) {
        phrases.push(this.phrases[chainStep.phrase])
      }
    }

    // Attempt to see if the phrase step can identify its own instrument
    let instrNum = this.phrases[chainStep.phrase].findPhraseStepInstrumentNum(phraseStepNum)
    let instr

    if (instrNum !== 0xFF) {
      instr = this.instruments[instrNum]
    }

    while (typeof instr === 'undefined') {
      // Attempt to see if the phrase can identify its instrument
      while (phrases.length > 0) {
        const phrase = phrases.pop()

        instrNum = phrase.findPhraseStepInstrumentNum()

        if (instrNum !== 0xFF) {
          instr = this.instruments[instrNum]

          break
        }
      }

      if (typeof instr !== 'undefined') {
        break
      }

      const chain = chains.pop()

      if (typeof chain === 'undefined') {
        break
      }

      for (let i = 0; i < chain.steps.length; i++) {
        const phraseNum = chain.steps[i].phrase

        if (phraseNum !== 0xFF) {
          phrases.push(this.phrases[phraseNum])
        }
      }
    }

    return instr
  }

  /**
   * @inheritdoc
   */
  getBytes () {
    const bytes = this.getHeaderBytes()
    const startLen = bytes.length

    bytes.push(...bytesFromString(this.directory, 128))

    // Unlike useSkippedBytes, we need to go and backfill the "garbage" after the directory name.
    for (let i = startLen + this.directory.length + 1; i < startLen + 128; i++) {
      let skippedValue = 0x00

      if (this.#fileReader?.skipped.indexOf(i) > -1) {
        skippedValue = this.#fileReader.bytes[i]
      }

      bytes[i] = skippedValue
    }

    bytes.push(this.transpose)
    bytes.push(...bytesFromFloatLE(this.tempo))
    bytes.push(this.quantize)
    bytes.push(...bytesFromString(this.name, 12))

    // MIDI Settings
    bytes.push(bytesFromBool(this.midiSettings.receiveSync))
    bytes.push(this.midiSettings.receiveTransport)
    bytes.push(bytesFromBool(this.midiSettings.sendSync))
    bytes.push(this.midiSettings.sendTransport)
    bytes.push(this.midiSettings.recordNoteChannel)
    bytes.push(bytesFromBool(this.midiSettings.recordNoteVelocity))
    bytes.push(this.midiSettings.recordNoteDelayKillCommands)
    bytes.push(this.midiSettings.controlMapChannel)
    bytes.push(this.midiSettings.songRowCueChannel)

    for (let i = 0; i < 8; i++) {
      bytes.push(this.midiSettings.trackInputChannel[i])
    }

    for (let i = 0; i < 8; i++) {
      bytes.push(this.midiSettings.trackInputInstrument[i])
    }

    bytes.push(bytesFromBool(this.midiSettings.trackInputProgramChange))
    bytes.push(this.midiSettings.trackInputMode)

    // Song key and skipped/unknown data
    bytes.push(this.key)
    bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 18, 0x00))

    // Read Mixer Settings
    bytes.push(this.mixerSettings.masterVolume)
    bytes.push(this.mixerSettings.masterLimit)

    for (let i = 0; i < 8; i++) {
      bytes.push(this.mixerSettings.trackVolume[i])
    }

    bytes.push(this.mixerSettings.chorusVolume)
    bytes.push(this.mixerSettings.delayVolume)
    bytes.push(this.mixerSettings.reverbVolume)
    bytes.push(this.mixerSettings.analogInputVolume[0])
    bytes.push(this.mixerSettings.analogInputVolume[1])
    bytes.push(this.mixerSettings.usbInputVolume)
    bytes.push(this.mixerSettings.analogInputChorus[0])
    bytes.push(this.mixerSettings.analogInputDelay[0])
    bytes.push(this.mixerSettings.analogInputReverb[0])
    bytes.push(this.mixerSettings.analogInputChorus[1])
    bytes.push(this.mixerSettings.analogInputDelay[1])
    bytes.push(this.mixerSettings.analogInputReverb[1])
    bytes.push(this.mixerSettings.usbInputChorus)
    bytes.push(this.mixerSettings.usbInputDelay)
    bytes.push(this.mixerSettings.usbInputReverb)
    bytes.push(this.mixerSettings.djFilter)
    bytes.push(this.mixerSettings.djFilterPeak)

    // Skipped data
    bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 5, 0x00))

    // Grooves
    for (let i = 0; i < this.grooves.length; i++) {
      const groove = this.grooves[i]

      for (let j = 0; j < groove.steps.length; j++) {
        bytes.push(groove.steps[j])
      }
    }

    // Song steps
    for (let i = 0; i < 256; i++) {
      const step = this.steps[i]

      for (let j = 0; j < 8; j++) {
        bytes.push(step['track' + (j + 1)])
      }
    }

    // Phrases
    for (let i = 0; i < this.phrases.length; i++) {
      const phrase = this.phrases[i]

      for (let j = 0; j < phrase.steps.length; j++) {
        const step = phrase.steps[j]

        bytes.push(step.note)
        bytes.push(step.volume)
        bytes.push(step.instrument)

        for (let k = 0; k < 3; k++) {
          const fx = step['fx' + (k + 1)]

          bytes.push(fx.command)
          bytes.push(fx.value)
        }
      }
    }

    // Chains
    for (let i = 0; i < this.chains.length; i++) {
      const chain = this.chains[i]

      for (let j = 0; j < chain.steps.length; j++) {
        const step = chain.steps[j]

        bytes.push(step.phrase)
        bytes.push(step.transpose)
      }
    }

    // Tables
    for (let i = 0; i < this.tables.length; i++) {
      bytes.push(...this.tables[i].getBytes())
    }

    // Instruments
    for (let i = 0; i < this.instruments.length; i++) {
      bytes.push(...this.instruments[i].getEmbeddedBytes(bytes.length, this.#fileReader))
    }

    // Skipped data
    bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 3, 0x00))

    // Effects
    bytes.push(this.effectsSettings.chorusModDepth)
    bytes.push(this.effectsSettings.chorusModFreq)
    bytes.push(this.effectsSettings.chorusWidth)
    bytes.push(this.effectsSettings.chorusReverbSend)

    // Skipped data
    bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 3, 0x00))

    bytes.push(this.effectsSettings.delayFilter[0])
    bytes.push(this.effectsSettings.delayFilter[1])
    bytes.push(this.effectsSettings.delayTime[0])
    bytes.push(this.effectsSettings.delayTime[1])
    bytes.push(this.effectsSettings.delayFeedback)
    bytes.push(this.effectsSettings.delayWidth)
    bytes.push(this.effectsSettings.delayReverbSend)

    // Skipped data
    bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 1, 0x00))

    bytes.push(this.effectsSettings.reverbFilter[0])
    bytes.push(this.effectsSettings.reverbFilter[1])
    bytes.push(this.effectsSettings.reverbSize)
    bytes.push(this.effectsSettings.reverbDamping)
    bytes.push(this.effectsSettings.reverbModDepth)
    bytes.push(this.effectsSettings.reverbModFreq)
    bytes.push(this.effectsSettings.reverbWidth)

    // Skipped data between Instruments and MIDI Mappings (when present)
    bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 0x1A5FE - bytes.length, 0xFF))

    // MIDI Mappings
    for (let i = 0; i < this.midiMappings.length; i++) {
      const midiMapping = this.midiMappings[i]

      bytes.push(midiMapping.channel)
      bytes.push(midiMapping.controlNum)
      bytes.push(midiMapping.value)
      bytes.push(midiMapping.type)
      bytes.push(midiMapping.paramIndex)
      bytes.push(midiMapping.minValue)
      bytes.push(midiMapping.maxValue)
    }

    // Scales (when supported)
    if (this.m8FileVersion.compare(VERSION_2_5_0) >= 0) {
      // Skipped data between MIDI Mappings and Scales (when present)
      bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 0x1AA7E - bytes.length, 0xFF))

      for (let i = 0; i < this.scales.length; i++) {
        bytes.push(...this.scales[i].getEmbeddedBytes(0xFF))
      }
    } else {
      bytes.push(...bytesForSkippedData(this.#fileReader, bytes.length, 256, 0x00))
    }

    return bytes
  }

  isChainEmpty (num) {
    const chain = this.chains[num]
    let empty = true

    for (let i = 0; i < chain.steps.length; i++) {
      // If we already know the chain is empty, no sense in continuing to check
      if (!empty) {
        break
      }

      const step = chain.steps[i]

      // A chain is considered empty if all of its phrases are empty
      if (step.phrase !== 0xFF) {
        if (!this.isPhraseEmpty(step.phrase)) {
          empty = false
        }
      }
    }

    return empty
  }

  isPhraseEmpty (num) {
    const phrase = this.phrases[num]
    let empty = true

    // Documentation says that a phrase is empty if it doesn't have any notes but it appears that FX can be present
    // without a note and count as non-empty.
    //
    // fxCmdToStr is called without a song and that is only because we don't care about the real value, just if it's
    // empty of the 'KIL' command.
    for (let i = 0; i < phrase.steps.length; i++) {
      const step = phrase.steps[i]
      const instrKind = 'NONE' // We don't care about instrument commands at this point

      if ([step.note, step.fx1.commandToStr(instrKind), step.fx2.commandToStr(instrKind), step.fx3.commandToStr(instrKind)].filter((val, j) => {
        if (j === 0) {
          return val !== 0xFF
        } else {
          return ['---', 'KIL'].indexOf(val) === -1
        }
      }).length > 0) {
        empty = false
      }
    }

    return empty
  }

  /**
   * Returns a Song based on the raw M8 file bytes.
   *
   * @param {Array<Number>} bytes - The Song's raw bytes
   *
   * @returns {module:m8-js/lib/types.Song}
   */
  static fromBytes (bytes) {
    const m8FileReader = new M8FileReader(bytes)
    const song = new Song(m8FileReader)

    song.directory = m8FileReader.readStr(128)
    song.transpose = m8FileReader.read()
    // Tempo is stored in 4 bytes as a 32-bit float
    song.tempo = readFloatLE(m8FileReader.read(4))
    song.quantize = m8FileReader.read()
    song.name = m8FileReader.readStr(12)

    // Read MIDI Settings
    song.midiSettings.receiveSync = Boolean(m8FileReader.read())
    song.midiSettings.receiveTransport = m8FileReader.read()
    song.midiSettings.sendSync = Boolean(m8FileReader.read())
    song.midiSettings.sendTransport = m8FileReader.read()
    song.midiSettings.recordNoteChannel = m8FileReader.read()
    song.midiSettings.recordNoteVelocity = Boolean(m8FileReader.read())
    song.midiSettings.recordNoteDelayKillCommands = m8FileReader.read()
    song.midiSettings.controlMapChannel = m8FileReader.read()
    song.midiSettings.songRowCueChannel = m8FileReader.read()

    for (let i = 0; i < 8; i++) {
      song.midiSettings.trackInputChannel[i] = m8FileReader.read()
    }

    for (let i = 0; i < 8; i++) {
      song.midiSettings.trackInputInstrument[i] = m8FileReader.read()
    }

    song.midiSettings.trackInputProgramChange = Boolean(m8FileReader.read())
    song.midiSettings.trackInputMode = m8FileReader.read()

    song.key = m8FileReader.read()

    // Discard the next 18 bytes (empty data)
    m8FileReader.skip(18)

    // Read Mixer Settings
    song.mixerSettings.masterVolume = m8FileReader.read()
    song.mixerSettings.masterLimit = m8FileReader.read()

    for (let i = 0; i < 8; i++) {
      song.mixerSettings.trackVolume[i] = m8FileReader.read()
    }

    song.mixerSettings.chorusVolume = m8FileReader.read()
    song.mixerSettings.delayVolume = m8FileReader.read()
    song.mixerSettings.reverbVolume = m8FileReader.read()
    song.mixerSettings.analogInputVolume = [m8FileReader.read(), m8FileReader.read()]
    song.mixerSettings.usbInputVolume = m8FileReader.read()
    song.mixerSettings.analogInputChorus[0] = m8FileReader.read()
    song.mixerSettings.analogInputDelay[0] = m8FileReader.read()
    song.mixerSettings.analogInputReverb[0] = m8FileReader.read()
    song.mixerSettings.analogInputChorus[1] = m8FileReader.read()
    song.mixerSettings.analogInputDelay[1] = m8FileReader.read()
    song.mixerSettings.analogInputReverb[1] = m8FileReader.read()
    song.mixerSettings.usbInputChorus = m8FileReader.read()
    song.mixerSettings.usbInputDelay = m8FileReader.read()
    song.mixerSettings.usbInputReverb = m8FileReader.read()
    song.mixerSettings.djFilter = m8FileReader.read()
    song.mixerSettings.djFilterPeak = m8FileReader.read()

    // Discard the next 5 bytes (unknown data)
    m8FileReader.skip(5)

    // Read Grooves
    for (let i = 0; i < song.grooves.length; i++) {
      const groove = song.grooves[i]

      for (let j = 0; j < groove.steps.length; j++) {
        groove.steps[j] = m8FileReader.read()
      }
    }

    // Read song steps
    for (let i = 0; i < 256; i++) {
      const step = song.steps[i]

      for (let j = 0; j < 8; j++) {
        step['track' + (j + 1)] = m8FileReader.read()
      }
    }

    // Read Phrases
    for (let i = 0; i < song.phrases.length; i++) {
      const phrase = song.phrases[i]

      for (let j = 0; j < phrase.steps.length; j++) {
        const step = phrase.steps[j]

        step.note = m8FileReader.read()
        step.volume = m8FileReader.read()
        step.instrument = m8FileReader.read()

        for (let k = 0; k < 3; k++) {
          const fx = step['fx' + (k + 1)]

          fx.command = m8FileReader.read()
          fx.value = m8FileReader.read()
        }
      }
    }

    // Read Chains
    for (let i = 0; i < song.chains.length; i++) {
      const chain = song.chains[i]

      for (let j = 0; j < chain.steps.length; j++) {
        const step = chain.steps[j]

        step.phrase = m8FileReader.read()
        step.transpose = m8FileReader.read()
      }
    }

    // Read Tables
    for (let i = 0; i < song.tables.length; i++) {
      song.tables[i] = Table.fromFileReader(m8FileReader)
    }

    // Read Instruments
    for (let i = 0; i < song.instruments.length; i++) {
      song.instruments[i] = Instrument.fromFileReader(m8FileReader)

      // Update the instrument's table data reference
      song.instruments[i].tableData = song.tables[i]
    }

    // Discard the next 3 bytes (unused data)
    m8FileReader.skip(3)

    // Read Effects
    song.effectsSettings.chorusModDepth = m8FileReader.read()
    song.effectsSettings.chorusModFreq = m8FileReader.read()
    song.effectsSettings.chorusWidth = m8FileReader.read()
    song.effectsSettings.chorusReverbSend = m8FileReader.read()

    // Discard the next 3 bytes (unused data)
    m8FileReader.skip(3)

    song.effectsSettings.delayFilter[0] = m8FileReader.read()
    song.effectsSettings.delayFilter[1] = m8FileReader.read()
    song.effectsSettings.delayTime[0] = m8FileReader.read()
    song.effectsSettings.delayTime[1] = m8FileReader.read()
    song.effectsSettings.delayFeedback = m8FileReader.read()
    song.effectsSettings.delayWidth = m8FileReader.read()
    song.effectsSettings.delayReverbSend = m8FileReader.read()

    // Discard the next 1 byte (unused data)
    m8FileReader.skip(1)

    song.effectsSettings.reverbFilter[0] = m8FileReader.read()
    song.effectsSettings.reverbFilter[1] = m8FileReader.read()
    song.effectsSettings.reverbSize = m8FileReader.read()
    song.effectsSettings.reverbDamping = m8FileReader.read()
    song.effectsSettings.reverbModDepth = m8FileReader.read()
    song.effectsSettings.reverbModFreq = m8FileReader.read()
    song.effectsSettings.reverbWidth = m8FileReader.read()

    // Skip ahead to this specific position (unknown data)
    // TODO: Look into this
    m8FileReader.skipTo(0x1A5FE)

    // Read MIDI Mappings
    for (let i = 0; i < song.midiMappings.length; i++) {
      const midiMapping = song.midiMappings[i]

      midiMapping.channel = m8FileReader.read()
      midiMapping.controlNum = m8FileReader.read()
      // TODO: Data stored for value doesn't match MIDI Mapping output
      midiMapping.value = m8FileReader.read()
      midiMapping.type = m8FileReader.read()
      midiMapping.paramIndex = m8FileReader.read()
      midiMapping.minValue = m8FileReader.read()
      midiMapping.maxValue = m8FileReader.read()
      midiMapping.empty = midiMapping.channel === 0x00
    }

    // Read Scales (when supported)
    if (m8FileReader.m8Version.compare(VERSION_2_5_0) >= 0) {
      // Skip ahead to this specific position (unknown data)
      // TODO: Look into this
      m8FileReader.skipTo(0x1AA7E)

      for (let i = 0; i < song.scales.length; i++) {
        song.scales[i] = Scale.fromFileReader(m8FileReader)
      }
    }

    return song
  }
}

// Exports
module.exports = Song
