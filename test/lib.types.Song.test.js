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

const { DefaultScales, Scale } = require('../lib/types/Scale')
const { LATEST_M8_VERSION, VERSION_1_4_0 } = require('../lib/constants')
const Song = require('../lib/types/Song')
const Chain = require('../lib/types/internal/Chain')
const FMSynth = require('../lib/types/instruments/FMSynth')
const Groove = require('../lib/types/internal/Groove')
const M8Version = require('../lib/types/internal/M8Version')
const MIDIMapping = require('../lib/types/internal/MIDIMapping')
const None = require('../lib/types/instruments/None')
const Phrase = require('../lib/types/internal/Phrase')
const Table = require('../lib/types/internal/Table')
const MIDISettings = require('../lib/types/internal/MIDISettings')
const MixerSettings = require('../lib/types/internal/MixerSettings')
const SongStep = require('../lib/types/internal/SongStep')
const ChainStep = require('../lib/types/internal/ChainStep')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const MIDIOut = require('../lib/types/instruments/MIDIOut')
const Sampler = require('../lib/types/instruments/Sampler')
const Wavsynth = require('../lib/types/instruments/Wavsynth')
const TableStep = require('../lib/types/internal/TableStep')
const FX = require('../lib/types/internal/FX')
const PhraseStep = require('../lib/types/internal/PhraseStep')

function testEmptySong (song) {
  expect(song.chains).toEqual(Array.from({ length: 255 }, () => new Chain()))
  expect(song.directory).toEqual('')
  expect(song.grooves).toEqual(Array.from({ length: 32 }, () => new Groove()))
  expect(song.instruments).toEqual(Array.from({ length: 128 }, () => new None(song.m8FileReader)))
  expect(song.key).toEqual(0x00)
  expect(song.midiMappings).toEqual(Array.from({ length: 128 }, () => new MIDIMapping()))
  expect(song.midiSettings).toEqual(new MIDISettings())
  expect(song.mixerSettings).toEqual(new MixerSettings())
  expect(song.name).toEqual('')
  expect(song.phrases).toEqual(Array.from({ length: 255 }, () => new Phrase()))
  expect(song.quantize).toEqual(0x00)
  expect(song.scales).toEqual(DefaultScales)
  expect(song.steps).toEqual(Array.from({ length: 256 }, () => new SongStep()))
  expect(song.tables).toEqual(Array.from({ length: 256 }, () => new Table()))
  expect(song.tempo).toEqual(0x78)
  expect(song.transpose).toEqual(0x00)
  expect(song.m8FileVersion).toEqual(LATEST_M8_VERSION)
}

describe('Song tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptySong(new Song())
    })

    describe('arguments', () => {
      // M8FileReder is tested by index.js tests

      test('>= 2.5.0', () => {
        testEmptySong(new Song(LATEST_M8_VERSION))
      })

      test('< 2.5.0', () => {
        expect(new Song(new M8Version(2, 4, 0)).scales).toEqual(undefined)
      })
    })
  })

  test('#asObject', () => {
    const song = new Song()
    const songObject = song.asObject()

    expect(songObject.fileMetadata).toEqual({
      type: 'Song',
      version: LATEST_M8_VERSION.asObject()
    })
    expect(songObject.chains).toEqual(song.chains.map((chain) => chain.asObject()))
    expect(songObject.directory).toEqual(song.directory)
    expect(songObject.effectsSettings).toEqual(song.effectsSettings.asObject())
    expect(songObject.grooves).toEqual(song.grooves.map((groove) => groove.asObject()))
    expect(songObject.instruments).toEqual(song.instruments.map((instrument) => instrument.asObject()))
    expect(songObject.key).toEqual(song.key)
    expect(songObject.midiMappings).toEqual(song.midiMappings.map((mapping) => mapping.asObject()))
    expect(songObject.midiSettings).toEqual(song.midiSettings.asObject())
    expect(songObject.mixerSettings).toEqual(song.mixerSettings.asObject())
    expect(songObject.name).toEqual(song.name)
    expect(songObject.phrases).toEqual(song.phrases.map((phrase) => phrase.asObject()))
    expect(songObject.quantize).toEqual(song.quantize)
    expect(songObject.scales).toEqual(song.scales?.map((scale) => scale.asObject()))
    expect(songObject.steps).toEqual(song.steps.map((step) => step.asObject()))
    expect(songObject.tables).toEqual(song.tables.map((table) => table.asObject()))
    expect(songObject.tempo).toEqual(song.tempo)
    expect(songObject.transpose).toEqual(song.transpose)
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
      emptySong.steps[0x00].tracks[0] = 0x00
    })

    test('Same phrase step', () => {
      // Set phrase for chain
      emptySong.chains[0x00].steps[0x08].phrase = 0x00

      // Set instrument for phrase step
      emptySong.phrases[0x00].steps[0x05].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x00, 0x00, 0x08, 0x05)).toEqual(emptyFMSynth)
    })

    test('Same phrase but earlier step', () => {
      // Set phrase for chain
      emptySong.chains[0x00].steps[0x00].phrase = 0x00

      // Set instrument for phrase step
      emptySong.phrases[0x00].steps[0x00].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x00, 0x00, 0x00, 0x05)).toEqual(emptyFMSynth)
    })

    test('Different phrase but same chain', () => {
      // Set phrase in chain
      emptySong.chains[0x00].steps[0x00].phrase = 0x00
      emptySong.chains[0x00].steps[0x0A].phrase = 0x01

      // Set instrument for phrase step
      emptySong.phrases[0x00].steps[0x00].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x00, 0x00, 0x0A, 0x05)).toEqual(emptyFMSynth)
    })

    test('Different chain', () => {
      // Setup song steps
      emptySong.steps[0x05].tracks[0x00] = 0x01
      emptySong.steps[0x0A].tracks[0x00] = 0x02

      // Setup chains
      emptySong.chains[0x00].steps[0x00].phrase = 0x00
      emptySong.chains[0x01].steps[0x00].phrase = 0x01
      emptySong.chains[0x02].steps[0x00].phrase = 0x02

      // Setup phrases
      emptySong.phrases[0x00].steps[0x00].instrument = 0x00

      expect(emptySong.findPhraseStepInstrument(0x00, 0x0A, 0x00, 0x05)).toEqual(emptyFMSynth)
    })

    test('Not found', () => {
      // Setup song steps
      emptySong.steps[0x05].tracks[0x00] = 0x01
      emptySong.steps[0x0A].tracks[0x00] = 0x02

      // Setup chains
      emptySong.chains[0x00].steps[0x00].phrase = 0x00
      emptySong.chains[0x01].steps[0x00].phrase = 0x01
      emptySong.chains[0x02].steps[0x00].phrase = 0x02

      expect(emptySong.findPhraseStepInstrument(0x00, 0x0A, 0x00, 0x05)).toEqual(undefined)
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

    emptySong.phrases[0].steps[0].fx[0].command = 0x05

    expect(emptySong.isPhraseEmpty(0)).toEqual(true)
  })

  describe('.fromObject', () => {
    test('M8 version >= 2.5.0', () => {
      const chainStep = new ChainStep(0x01, 0x02)
      const scale = new Scale()
      const song = new Song()
      const wavSynth = new Wavsynth()

      scale.name = 'TESTING'
      wavSynth.table = new Table([new TableStep([new FX(0x01, 0x02)], 0x02, 0x03)])

      song.chains[0] = new Chain([chainStep])
      song.directory = '/Songs/'
      song.grooves[0] = new Groove([0x01, 0x02, 0x03])
      song.instruments[0] = new FMSynth()
      song.instruments[1] = new Macrosynth()
      song.instruments[2] = new MIDIOut()
      song.instruments[3] = new Sampler()
      song.instruments[4] = wavSynth
      song.key = 0x02
      song.midiMappings[0] = new MIDIMapping(0x01)
      song.midiSettings = new MIDISettings(0x01)
      song.mixerSettings = new MixerSettings(0x01)
      song.name = 'TESTING'
      song.phrases[0] = new Phrase([new PhraseStep(new FX(0x01, 0x02, 0x03), 0x02, 0x03, 0x04)])
      song.scales[0] = scale
      song.steps[0] = new SongStep([0x01])
      song.tables[4] = wavSynth.table
      song.tempo = 0x03
      song.transpose = 0x04

      const songObject = song.asObject()

      songObject.chains.splice(1)
      songObject.grooves.splice(1)
      songObject.instruments.splice(5)
      songObject.phrases.splice(1)
      songObject.scales.splice(1)
      songObject.steps.splice(1)

      expect(Song.fromObject(songObject)).toEqual(song)
    })

    test('M8 version < 2.5.0', () => {
      const song = new Song(VERSION_1_4_0)
      const songObject = song.asObject()

      songObject.scales = DefaultScales.map((scale) => scale.asObject())

      expect(Song.fromObject(songObject)).toEqual(song)
    })
  })

  test('.getObjectProperties', () => {
    expect(Song.getObjectProperties().sort()).toEqual(Object.keys(new Song().asObject()).sort())
  })
})
