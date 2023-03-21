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
const FMSynth = require('../lib/types/instruments/FMSynth')
const LFOParameters = require('../lib/types/internal/LFOParameters')
const M8 = require('..')
const M8Version = require('../lib/types/internal/M8Version')
const path = require('path')

describe('FMSynth tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyInstrument(new FMSynth(), 0x04, 'FMSYNTH', 'FMSynthParameters')
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        testEmptyInstrument(new FMSynth(LATEST_M8_VERSION), 0x04, 'FMSYNTH', 'FMSynthParameters')
      })
    })
  })

  test('defaults', () => {
    const fmSynth = new FMSynth()

    fmSynth.name = 'DEF_FM'

    M8.loadM8File(Array.from(readFileSync(path.join(__dirname, 'files/Instruments/DEF_FM.m8i'))))
  })

  describe('#asObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const fmSynth = new FMSynth(m8Version)
      const fmSynthObject = fmSynth.asObject()

      testInstrumentOjbect(fmSynth)
      expect(fmSynthObject.lfos.length).toEqual(1)
    })

    test('M8 version >= 1.4.0', () => {
      const fmSynth = new FMSynth()
      const fmSynthObject = fmSynth.asObject()

      testInstrumentOjbect(fmSynth)
      expect(fmSynthObject.lfos.length).toEqual(2)
    })
  })

  describe('.fromObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const fmSynth = new FMSynth(m8Version)
      const fmSynthAsObject = fmSynth.asObject()

      // Add an extra LFO to ensure we don't mistakenly add it.
      fmSynthAsObject.lfos.push(new LFOParameters())

      expect(FMSynth.fromObject(fmSynthAsObject)).toEqual(fmSynth)
    })

    test('M8 version >= 1.4.0', () => {
      const fmSynth = new FMSynth()

      expect(FMSynth.fromObject(fmSynth.asObject())).toEqual(fmSynth)
    })
  })

  test('.getObjectProperties', () => {
    expect(FMSynth.getObjectProperties().sort()).toEqual(Object.keys(new FMSynth().asObject()).sort())
  })
})
