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
const Sampler = require('../lib/types/instruments/Sampler')
const LFOParameters = require('../lib/types/internal/LFOParameters')
const M8 = require('..')
const M8Version = require('../lib/types/internal/M8Version')
const path = require('path')

describe('Sampler tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyInstrument(new Sampler(), 0x02, 'SAMPLER', 'SamplerParameters')
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        testEmptyInstrument(new Sampler(LATEST_M8_VERSION), 0x02, 'SAMPLER', 'SamplerParameters')
      })
    })
  })

  test('defaults', () => {
    const sampler = new Sampler()

    sampler.name = 'DEF_SAM'

    M8.loadM8File(Array.from(readFileSync(path.join(__dirname, 'files/Instruments/DEF_SAM.m8i'))))
  })

  describe('#asObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const sampler = new Sampler(m8Version)
      const samplerObject = sampler.asObject()

      testInstrumentOjbect(sampler)
      expect(samplerObject.lfos.length).toEqual(1)
    })

    test('M8 version >= 1.4.0', () => {
      const sampler = new Sampler()
      const samplerObject = sampler.asObject()

      testInstrumentOjbect(sampler)
      expect(samplerObject.lfos.length).toEqual(2)
    })
  })

  describe('.fromObject', () => {
    test('M8 version < 1.4.0', () => {
      const m8Version = new M8Version(1, 3, 9)
      const sampler = new Sampler(m8Version)
      const samplerAsObject = sampler.asObject()

      // Add an extra LFO to ensure we don't mistakenly add it.
      samplerAsObject.lfos.push(new LFOParameters())

      expect(Sampler.fromObject(samplerAsObject)).toEqual(sampler)
    })

    test('M8 version >= 1.4.0', () => {
      const sampler = new Sampler()

      expect(Sampler.fromObject(sampler.asObject())).toEqual(sampler)
    })
  })

  test('.getObjectProperties', () => {
    expect(Sampler.getObjectProperties().sort()).toEqual(Object.keys(new Sampler().asObject()).sort())
  })
})
