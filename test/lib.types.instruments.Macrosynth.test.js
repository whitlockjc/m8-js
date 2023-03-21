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
const M8 = require('..')
const M8Version = require('../lib/types/internal/M8Version')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const path = require('path')

describe('Macrosynth tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyInstrument(new Macrosynth(), 0x01, 'MACROSYN', 'MacrosynthParameters')
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        testEmptyInstrument(new Macrosynth(LATEST_M8_VERSION), 0x01, 'MACROSYN', 'MacrosynthParameters')
      })
    })
  })

  test('defaults', () => {
    const macroSynth = new Macrosynth()

    macroSynth.name = 'DEF_MAC'

    M8.loadM8File(Array.from(readFileSync(path.join(__dirname, 'files/Instruments/DEF_MAC.m8i'))))
  })

  describe('#asObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const macroSynth = new Macrosynth(m8Version)
      const macroSynthObject = macroSynth.asObject()

      testInstrumentOjbect(macroSynth)
      expect(macroSynthObject.lfos.length).toEqual(1)
    })

    test('M8 version >= 1.4.0', () => {
      const macroSynth = new Macrosynth()
      const macroSynthObject = macroSynth.asObject()

      testInstrumentOjbect(macroSynth)
      expect(macroSynthObject.lfos.length).toEqual(2)
    })
  })

  test('.fromObject', () => {
    const macroSynth = new Macrosynth()

    expect(Macrosynth.fromObject(macroSynth.asObject())).toEqual(macroSynth)
  })

  test('.getObjectProperties', () => {
    expect(Macrosynth.getObjectProperties().sort()).toEqual(Object.keys(new Macrosynth().asObject()).sort())
  })
})
