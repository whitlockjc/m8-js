/* Copyright 2023 Jeremy Whitlock
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
const { readFileSync } = require('fs')
const { testEmptyInstrument, testInstrumentOjbect } = require('./helpers')
const Wavsynth = require('../lib/types/instruments/Wavsynth')
const LFOParameters = require('../lib/types/internal/LFOParameters')
const M8 = require('..')
const M8Version = require('../lib/types/internal/M8Version')
const path = require('path')

describe('Wavsynth tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyInstrument(new Wavsynth(), 0x00, 'WAVSYNTH', 'WavsynthParameters')
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        testEmptyInstrument(new Wavsynth(LATEST_M8_VERSION), 0x00, 'WAVSYNTH', 'WavsynthParameters')
      })
    })
  })

  test('defaults', () => {
    const wavSynth = new Wavsynth()

    wavSynth.name = 'DEF_WAV'

    M8.loadM8File(Array.from(readFileSync(path.join(__dirname, 'files/Instruments/DEF_WAV.m8i'))))
  })

  describe('#asObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const wavSynth = new Wavsynth(m8Version)
      const wavSynthObject = wavSynth.asObject()

      testInstrumentOjbect(wavSynth)
      expect(wavSynthObject.lfos.length).toEqual(1)
    })

    test('M8 version >= 1.4.0', () => {
      const wavSynth = new Wavsynth()
      const wavSynthObject = wavSynth.asObject()

      testInstrumentOjbect(wavSynth)
      expect(wavSynthObject.lfos.length).toEqual(2)
    })
  })

  describe('.fromObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const wavSynth = new Wavsynth(m8Version)
      const wavSynthAsObject = wavSynth.asObject()

      // Add an extra LFO to ensure we don't mistakenly add it.
      wavSynthAsObject.lfos.push(new LFOParameters())

      expect(Wavsynth.fromObject(wavSynthAsObject)).toEqual(wavSynth)
    })

    test('M8 version >= 1.4.0', () => {
      const wavSynth = new Wavsynth()

      expect(Wavsynth.fromObject(wavSynth.asObject())).toEqual(wavSynth)
    })
  })

  test('.getObjectProperties', () => {
    expect(Wavsynth.getObjectProperties().sort()).toEqual(Object.keys(new Wavsynth().asObject()).sort())
  })
})
