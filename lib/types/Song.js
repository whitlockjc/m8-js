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

const { DefaultScales } = require('../constants')
const { toM8HexStr } = require('../helpers')

const Chain = require('./Chain')
const Groove = require('./Groove')
const { None } = require('./Instrument')
const Phrase = require('./Phrase')
const Table = require('./Table')

const { LATEST_M8_VERSION, VERSION_2_5_0 } = require('../constants')

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
 * @memberof module:m8-js/lib/types
 */
class Song {
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
  /** @member {module:m8-js/lib/types.M8Version} */
  version

  /**
   * Create a Song.
   *
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version (different versions of M8 use different M8 structures)
   */
  constructor (m8Version) {
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
    this.version = m8Version || LATEST_M8_VERSION

    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i] = new Chain()
    }

    for (let i = 0; i < this.grooves.length; i++) {
      this.grooves[i] = new Groove()
    }

    for (let i = 0; i < this.instruments.length; i++) {
      this.instruments[i] = new None(m8Version)
    }

    for (let i = 0; i < this.midiMappings.length; i++) {
      this.midiMappings[i] = new MIDIMapping()
    }

    for (let i = 0; i < this.phrases.length; i++) {
      this.phrases[i] = new Phrase()
    }

    if (this.version.compare(VERSION_2_5_0) >= 0) {
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
}

// Exports
module.exports = Song
