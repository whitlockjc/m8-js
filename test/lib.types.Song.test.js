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

const { LATEST_M8_VERSION } = require('../lib/constants')
const Chain = require('../lib/types/Chain')
const { DefaultScales } = require('../lib/types/Scale')
const Groove = require('../lib/types/Groove')
const { None, FMSynth } = require('../lib/types/Instrument')
const M8Version = require('../lib/types/M8Version')
const Phrase = require('../lib/types/Phrase')
const Song = require('../lib/types/Song')
const Table = require('../lib/types/Table')

describe('Song tests', () => {
  test('constructor', () => {
    const emptySong = new Song()

    expect(emptySong.chains.length).toEqual(255)
    expect(emptySong.directory).toEqual('')
    expect(emptySong.grooves.length).toEqual(32)
    expect(emptySong.instruments.length).toEqual(128)
    expect(emptySong.key).toEqual(0x00)
    expect(emptySong.midiMappings.length).toEqual(128)
    expect(emptySong.name).toEqual('')
    expect(emptySong.phrases.length).toEqual(255)
    expect(emptySong.quantize).toEqual(0x00)
    expect(emptySong.scales.length).toEqual(16)
    expect(emptySong.steps.length).toEqual(256)
    expect(emptySong.tables.length).toEqual(256)
    expect(emptySong.tempo).toEqual(0x78)
    expect(emptySong.transpose).toEqual(0x00)
    expect(emptySong.version).toEqual(LATEST_M8_VERSION)

    emptySong.chains.forEach((chain) => {
      expect(chain).toEqual(new Chain())
    })

    expect(emptySong.effectsSettings.chorusModDepth).toEqual(0x40)
    expect(emptySong.effectsSettings.chorusModFreq).toEqual(0x80)
    expect(emptySong.effectsSettings.chorusReverbSend).toEqual(0x00)
    expect(emptySong.effectsSettings.chorusWidth).toEqual(0xFF)
    expect(emptySong.effectsSettings.delayFeedback).toEqual(0x80)
    expect(emptySong.effectsSettings.delayFilter).toEqual([0x40, 0xFF])
    expect(emptySong.effectsSettings.delayReverbSend).toEqual(0x00)
    expect(emptySong.effectsSettings.delayTime).toEqual([0x30, 0x30])
    expect(emptySong.effectsSettings.delayWidth).toEqual(0xFF)
    expect(emptySong.effectsSettings.reverbDamping).toEqual(0xC0)
    expect(emptySong.effectsSettings.reverbFilter).toEqual([0x10, 0xE0])
    expect(emptySong.effectsSettings.reverbModDepth).toEqual(0x10)
    expect(emptySong.effectsSettings.reverbModFreq).toEqual(0xFF)
    expect(emptySong.effectsSettings.reverbSize).toEqual(0xFF)
    expect(emptySong.effectsSettings.reverbWidth).toEqual(0xFF)

    emptySong.grooves.forEach((groove) => {
      expect(groove).toEqual(new Groove())
    })

    emptySong.instruments.forEach((instr) => {
      expect(instr).toEqual(new None())
    })

    emptySong.midiMappings.forEach((midiMapping) => {
      expect(midiMapping.channel).toEqual(0x00)
      expect(midiMapping.controlNum).toEqual(0x00)
      expect(midiMapping.empty).toEqual(true)
      expect(midiMapping.maxValue).toEqual(0x00)
      expect(midiMapping.minValue).toEqual(0x00)
      expect(midiMapping.paramIndex).toEqual(0x00)
      expect(midiMapping.type).toEqual(0x00)
      expect(midiMapping.value).toEqual(0x00)
      expect(midiMapping.destToStr()).toEqual('00')
    })

    expect(emptySong.midiSettings.controlMapChannel).toEqual(0x11)
    expect(emptySong.midiSettings.receiveSync).toEqual(false)
    expect(emptySong.midiSettings.receiveTransport).toEqual(0x00)
    expect(emptySong.midiSettings.recordNoteChannel).toEqual(0x09)
    expect(emptySong.midiSettings.recordNoteDelayKillCommands).toEqual(0x00)
    expect(emptySong.midiSettings.recordNoteVelocity).toEqual(true)
    expect(emptySong.midiSettings.sendSync).toEqual(false)
    expect(emptySong.midiSettings.sendTransport).toEqual(0x00)
    expect(emptySong.midiSettings.songRowCueChannel).toEqual(0x0B)
    expect(emptySong.midiSettings.trackInputChannel.length).toEqual(8)
    expect(emptySong.midiSettings.trackInputInstrument.length).toEqual(8)
    expect(emptySong.midiSettings.trackInputMode).toEqual(0x01)
    expect(emptySong.midiSettings.trackInputProgramChange).toEqual(true)
    expect(emptySong.midiSettings.trackInputModeToStr()).toEqual('LEGATO')

    for (let i = 0; i < 8; i++) {
      expect(emptySong.midiSettings.trackInputChannel[i]).toEqual(i + 1)
    }

    for (let i = 0; i < 8; i++) {
      expect(emptySong.midiSettings.trackInputInstrument[i]).toEqual(0x00)
    }

    expect(emptySong.mixerSettings.analogInputChorus).toEqual([0x00, 0x00])
    expect(emptySong.mixerSettings.analogInputDelay).toEqual([0x00, 0x00])
    expect(emptySong.mixerSettings.analogInputReverb).toEqual([0x00, 0x00])
    expect(emptySong.mixerSettings.analogInputVolume).toEqual([0x00, 0xFF])
    expect(emptySong.mixerSettings.chorusVolume).toEqual(0xE0)
    expect(emptySong.mixerSettings.delayVolume).toEqual(0xE0)
    expect(emptySong.mixerSettings.djFilter).toEqual(0x80)
    expect(emptySong.mixerSettings.djFilterPeak).toEqual(0x80)
    expect(emptySong.mixerSettings.masterLimit).toEqual(0x00)
    expect(emptySong.mixerSettings.masterVolume).toEqual(0xE0)
    expect(emptySong.mixerSettings.reverbVolume).toEqual(0xE0)
    expect(emptySong.mixerSettings.trackVolume.length).toEqual(8)
    expect(emptySong.mixerSettings.usbInputChorus).toEqual(0x00)
    expect(emptySong.mixerSettings.usbInputDelay).toEqual(0x00)
    expect(emptySong.mixerSettings.usbInputReverb).toEqual(0x00)
    expect(emptySong.mixerSettings.usbInputVolume).toEqual(0x00)

    for (let i = 0; i < 8; i++) {
      expect(emptySong.mixerSettings.trackVolume[i]).toEqual(0xE0)
    }

    emptySong.phrases.forEach((phrase) => {
      expect(phrase).toEqual(new Phrase())
    })

    expect(emptySong.scales).toEqual(DefaultScales)

    emptySong.steps.forEach((step) => {
      for (let i = 0; i < 8; i++) {
        expect(step['track' + (i + 1)]).toEqual(0xFF)
      }
    })

    emptySong.tables.forEach((table) => {
      expect(table).toEqual(new Table())
    })
  })

  describe('#findPhraseStepInstrument', () => {
    let emptySong
    let emptyFMSynth

    beforeEach(() => {
      emptySong = new Song()
      emptyFMSynth = new FMSynth()

      // Register instrument
      emptySong.instruments[0x00] = emptyFMSynth

      // Set chain for track
      emptySong.steps[0x00].track1 = 0x00
    })

    test('Same phrase step', () => {
      // Set phrase for chain
      emptySong.chains[0x00].steps[0x08].phrase = 0x00

      // Set instrument for phrase step
      emptySong.phrases[0x00].steps[0x05].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x01, 0x00, 0x08, 0x05)).toEqual(emptyFMSynth)
    })

    test('Same phrase but earlier step', () => {
      // Set phrase for chain
      emptySong.chains[0x00].steps[0x00].phrase = 0x00

      // Set instrument for phrase step
      emptySong.phrases[0x00].steps[0x00].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x01, 0x00, 0x00, 0x05)).toEqual(emptyFMSynth)
    })

    test('Different phrase but same chain', () => {
      // Set phrase in chain
      emptySong.chains[0x00].steps[0x00].phrase = 0x00
      emptySong.chains[0x00].steps[0x0A].phrase = 0x01

      // Set instrument for phrase step
      emptySong.phrases[0x00].steps[0x00].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x01, 0x00, 0x0A, 0x05)).toEqual(emptyFMSynth)
    })

    test('Different chain', () => {
      // Setup song steps
      emptySong.steps[0x05].track1 = 0x01
      emptySong.steps[0x0A].track1 = 0x02

      // Setup chains
      emptySong.chains[0x00].steps[0x00].phrase = 0x00
      emptySong.chains[0x01].steps[0x00].phrase = 0x01
      emptySong.chains[0x02].steps[0x00].phrase = 0x02

      // Setup phrases
      emptySong.phrases[0x00].steps[0x00].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x01, 0x0A, 0x00, 0x05)).toEqual(emptyFMSynth)
    })

    test('Not found', () => {
      // Setup song steps
      emptySong.steps[0x05].track1 = 0x01
      emptySong.steps[0x0A].track1 = 0x02

      // Setup chains
      emptySong.chains[0x00].steps[0x00].phrase = 0x00
      emptySong.chains[0x01].steps[0x00].phrase = 0x01
      emptySong.chains[0x02].steps[0x00].phrase = 0x02

      expect(emptySong.findPhraseStepInstrument(0x01, 0x0A, 0x00, 0x05)).toEqual(undefined)
    })
  })

  test('#isChainEmpty', () => {
    const emptySong = new Song()

    expect(emptySong.isChainEmpty(0)).toEqual(true)

    emptySong.chains[0].steps[0].phrase = 0x00
    emptySong.phrases[0].steps[0].note = 0x00

    expect(emptySong.isChainEmpty(0)).toEqual(false)

    emptySong.phrases[0].steps[0].note = 0xFF

    expect(emptySong.isChainEmpty(0)).toEqual(true)
  })

  test('#isPhraseEmpty', () => {
    const emptySong = new Song()

    expect(emptySong.isPhraseEmpty(0)).toEqual(true)

    emptySong.phrases[0].steps[0].note = 0x00

    expect(emptySong.isPhraseEmpty(0)).toEqual(false)

    emptySong.phrases[0].steps[0].note = 0xFF

    expect(emptySong.isPhraseEmpty(0)).toEqual(true)

    emptySong.phrases[0].steps[0].fx1.command = 0x05

    expect(emptySong.isPhraseEmpty(0)).toEqual(true)
  })

  describe('< 2.5.0', () => {
    test('constructor (scales should be undefined)', () => {
      const emptySong = new Song(new M8Version(2, 4, 0))

      expect(emptySong.scales).toEqual(undefined)
    })
  })

  describe('MIDIMapping', () => {
    test('#typeToChar', () => {
      const emptySong = new Song()

      ;[
        'I',
        'M',
        'E',
        'U (03)'
      ].forEach((str, i) => {
        emptySong.midiMappings[0].type = i

        expect(emptySong.midiMappings[0].typeToChar()).toEqual(str)
      })
    })
  })

  describe('MIDISettings', () => {
    test('#recordNoteDelayKillCommandsToStr', () => {
      const emptySong = new Song()

      ;[
        'OFF',
        'KILL',
        'DELAY',
        'BOTH',
        'UNKNOWN (04)'
      ].forEach((str, i) => {
        emptySong.midiSettings.recordNoteDelayKillCommands = i

        expect(emptySong.midiSettings.recordNoteDelayKillCommandsToStr()).toEqual(str)
      })
    })

    test('#trackInputModeToStr', () => {
      const emptySong = new Song()

      ;[
        'MONO',
        'LEGATO',
        'POLY',
        'UNKNOWN (03)'
      ].forEach((str, i) => {
        emptySong.midiSettings.trackInputMode = i

        expect(emptySong.midiSettings.trackInputModeToStr()).toEqual(str)
      })
    })

    test('#transportToStr', () => {
      const emptySong = new Song()

      ;[
        'OFF',
        'PATTERN',
        'SONG',
        'UNKNOWN (03)'
      ].forEach((str, i) => {
        expect(emptySong.midiSettings.transportToStr(i)).toEqual(str)
      })
    })
  })
})
