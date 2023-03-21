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

const { DefaultScales, Scale } = require('./Scale')
const { LATEST_M8_VERSION, VERSION_2_5_0 } = require('../constants')
const Chain = require('./internal/Chain')
const EffectsSettings = require('./internal/EffectsSettings')
const Groove = require('./internal/Groove')
const M8File = require('./internal/M8File')
const M8Version = require('./internal/M8Version')
const MIDIMapping = require('./internal/MIDIMapping')
const MIDISettings = require('./internal/MIDISettings')
const MixerSettings = require('./internal/MixerSettings')
const None = require('./instruments/None')
const Phrase = require('./internal/Phrase')
const SongStep = require('./internal/SongStep')
const Table = require('./internal/Table')
const FMSynth = require('./instruments/FMSynth')
const Macrosynth = require('./instruments/Macrosynth')
const MIDIOut = require('./instruments/MIDIOut')
const Sampler = require('./instruments/Sampler')
const Wavsynth = require('./instruments/Wavsynth')

/**
 * Represents a Song.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.M8File
 * @memberof module:m8-js/lib/types
 */
class Song extends M8File {
  /** @member {Array<module:m8-js/lib/types/internal.Chain>} */
  chains
  /** @member {String} */
  directory
  /** @member {module:m8-js/lib/types/internal.EffectsSettings} */
  effectsSettings
  /** @member {Array<module:m8-js/lib/types/internal.Groove>} */
  grooves
  /** @member {Array<module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH>} */
  instruments
  /** @member {Number} */
  key
  /** @member {module:m8-js/lib/types/internal.MIDISettings} */
  midiSettings
  /** @member {module:m8-js/lib/types/internal.MixerSettings} */
  mixerSettings
  /** @member {String} */
  name
  /** @member {Array<module:m8-js/lib/types/internal.Phrase>} */
  phrases
  /** @member {Number} */
  quantize
  /** @member {Array<module:m8-js/lib/types.Scale>} */
  scales
  /** @member {Array<module:m8-js/lib/types/internal.SongStep>} */
  steps
  /** @member {Array<module:m8-js/lib/types/internal.Table>} */
  tables
  /** @member {Number} */
  tempo
  /** @member {Number} */
  transpose

  /**
   * Create a Song.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} [m8FileReaderOrVersion] - The M8
   * version of the Song (or the M8FileReader used to read the M8 file)
   */
  constructor (m8FileReaderOrVersion) {
    if (typeof m8FileReaderOrVersion === 'undefined') {
      super(M8File.TYPES.Song, LATEST_M8_VERSION)
    } else {
      if (m8FileReaderOrVersion.constructor.name === 'M8FileReader') {
        super(m8FileReaderOrVersion)
      } else {
        super(M8File.TYPES.Song, m8FileReaderOrVersion)
      }
    }

    this.chains = Array.from({ length: 255 }, () => new Chain())
    this.directory = ''
    this.effectsSettings = new EffectsSettings()
    this.grooves = Array.from({ length: 32 }, () => new Groove())
    this.instruments = Array.from({ length: 128 }, () => new None(this.m8FileReader))
    this.key = 0x00
    this.midiMappings = Array.from({ length: 128 }, () => new MIDIMapping())
    this.midiSettings = new MIDISettings()
    this.mixerSettings = new MixerSettings()
    this.name = ''
    this.phrases = Array.from({ length: 255 }, () => new Phrase())
    this.quantize = 0x00
    // scales is initialized below
    this.steps = Array.from({ length: 256 }, () => new SongStep())
    this.tables = Array.from({ length: 256 }, () => new Table())
    this.tempo = 0x78 // 120
    this.transpose = 0x00

    if (this.m8FileVersion.compare(VERSION_2_5_0) >= 0) {
      this.scales = DefaultScales
    } else {
      this.scales = undefined
    }

    // Link Instrument tables
    for (let i = 0; i < this.instruments.length; i++) {
      this.instruments[i].table = this.tables[i]
    }
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      ...this.headerAsObject(),
      chains: this.chains.map((chain) => chain.asObject()),
      directory: this.directory,
      effectsSettings: this.effectsSettings.asObject(),
      grooves: this.grooves.map((groove) => groove.asObject()),
      instruments: this.instruments.map((instrument) => instrument.asObject()),
      key: this.key,
      midiMappings: this.midiMappings.map((mapping) => mapping.asObject()),
      midiSettings: this.midiSettings.asObject(),
      mixerSettings: this.mixerSettings.asObject(),
      name: this.name,
      phrases: this.phrases.map((phrase) => phrase.asObject()),
      quantize: this.quantize,
      scales: this.scales?.map((scale) => scale.asObject()),
      steps: this.steps.map((step) => step.asObject()),
      tables: this.tables.map((table) => table.asObject()),
      tempo: this.tempo,
      transpose: this.transpose
    }
  }

  /**
   * Returns the Instrument instance for the provided Phrase step.
   *
   * @param {Number} trackNum - The track number (0-based)
   * @param {Number} songStepNum - The song step
   * @param {Number} chainStepNum - The Chain step
   * @param {Number} phraseStepNum - The Phrase step
   *
   * @returns {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH}
   */
  findPhraseStepInstrument (trackNum, songStepNum, chainStepNum, phraseStepNum) {
    const songStep = this.steps[songStepNum]
    const chainName = songStep.tracks[trackNum]

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
      const chainName = this.steps[i].tracks[trackNum]

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
   * Returns whether the Chain is considered empty.
   *
   * @param {Number} num - The Chain number
   *
   * @returns {Boolean}
   */
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

  /**
   * Returns whether the Phrase is considered empty.
   *
   * @param {Number} num - The Phrase number
   *
   * @returns {Boolean}
   */
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
      const instr = new None() // We don't care about instrument commands at this point

      if ([step.note, step.fx[0].commandToStr(instr), step.fx[1].commandToStr(instr), step.fx[2].commandToStr(instr)].filter((val, j) => {
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
   * Returns whether or not the phrase in question is used elsewhere
   *
   * @param {Number} num - The phrase number
   *
   * @returns {Boolean}
   */
  isPhraseUsageUnique (num) {
    let phraseUsageCount = 0

    // Documentation says that the displayed phrase name will have an '*'  when used elsewhere in the chain or song.
    for (let i = 0; i < this.chains.length; i++) {
      // If we know that a phrase isn't unique (used more than once), we don't need to keep looking
      if (phraseUsageCount > 1) {
        break
      }

      const chain = this.chains[i]

      for (let j = 0; j < chain.steps.length; j++) {
        if (chain.steps[j].phrase === num) {
          phraseUsageCount += 1

          // If we know that a phrase isn't unique (used more than once), we don't need to keep looking
          if (phraseUsageCount > 1) {
            break
          }
        }
      }
    }

    return phraseUsageCount > 1
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    const m8Version = M8Version.fromObject(object?.fileMetadata?.version)
    const song = new Song(m8Version)

    // Do not overwrite the default value if there was no provided value
    ;['directory', 'key', 'name', 'quantize', 'tempo', 'transpose'].forEach((prop) => {
      const value = object?.[prop]

      if (typeof value !== 'undefined') {
        song[prop] = value
      }
    })

    for (let i = 0; i < song.chains.length; i++) {
      const value = object?.chains?.[i]

      if (typeof value === 'object') {
        song.chains[i] = Chain.fromObject(value)
      }
    }

    song.effectsSettings = EffectsSettings.fromObject(object?.effectsSettings)

    for (let i = 0; i < song.grooves.length; i++) {
      const value = object?.grooves?.[i]

      if (typeof value === 'object') {
        song.grooves[i] = Groove.fromObject(value)
      }
    }

    // We have to handle Tables before Instruments so that when handling Instruments, we can wire Tables up properly
    for (let i = 0; i < song.tables.length; i++) {
      const value = object?.tables?.[i]

      if (typeof value === 'object') {
        song.tables[i] = Table.fromObject(value)
      }
    }

    for (let i = 0; i < song.instruments.length; i++) {
      // We have to recreate the fileMetadata so that fromObject will wire up the proper M8 Version
      const value = {
        fileMetadata: {
          type: M8File.TYPES.Instrument,
          version: m8Version.asObject()
        },
        ...object?.instruments?.[i]
      }
      let instr

      if (typeof value === 'object') {
        switch (value.kindStr) {
          case 'FMSYNTH':
            instr = FMSynth.fromObject(value)

            break

          case 'MACROSYN':
            instr = Macrosynth.fromObject(value)

            break

          case 'MIDI OUT':
            instr = MIDIOut.fromObject(value)

            break

          case 'SAMPLER':
            instr = Sampler.fromObject(value)

            break

          case 'WAVSYNTH':
            instr = Wavsynth.fromObject(value)

            break

          default:
            instr = undefined
        }

        if (typeof instr !== 'undefined') {
          song.instruments[i] = instr

          if (typeof instr.table !== 'undefined') {
            song.tables[i] = instr.table
          } else {
            instr.table = song.tables[i]
          }
        }
      }
    }

    for (let i = 0; i < song.midiMappings.length; i++) {
      const value = object?.midiMappings?.[i]

      if (typeof value === 'object') {
        song.midiMappings[i] = MIDIMapping.fromObject(value)
      }
    }

    song.midiSettings = MIDISettings.fromObject(object?.midiSettings)
    song.mixerSettings = MixerSettings.fromObject(object?.mixerSettings)

    for (let i = 0; i < song.phrases.length; i++) {
      const value = object?.phrases?.[i]

      if (typeof value === 'object') {
        song.phrases[i] = Phrase.fromObject(value)
      }
    }

    if (song.m8FileVersion.compare(VERSION_2_5_0) >= 0) {
      for (let i = 0; i < song.scales.length; i++) {
        // We have to recreate the fileMetadata so that fromObject will wire up the proper M8 Version
        const value = {
          fileMetadata: {
            type: M8File.TYPES.Scale,
            version: m8Version.asObject()
          },
          ...object?.scales?.[i]
        }

        if (typeof value === 'object') {
          song.scales[i] = Scale.fromObject(value)
        }
      }
    }

    for (let i = 0; i < song.steps.length; i++) {
      const value = object?.steps?.[i]

      if (typeof value === 'object') {
        song.steps[i] = SongStep.fromObject(value)
      }
    }

    return song
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return [
      ...this.getHeaderObjectProperties(),
      'chains',
      'directory',
      'effectsSettings',
      'grooves',
      'instruments',
      'key',
      'midiMappings',
      'midiSettings',
      'mixerSettings',
      'name',
      'phrases',
      'quantize',
      'scales',
      'steps',
      'tables',
      'tempo',
      'transpose'
    ]
  }
}

// Exports
module.exports = Song
