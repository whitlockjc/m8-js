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
const { testEmptyInstrument } = require('./helpers')
const None = require('../lib/types/instruments/None')
const M8Version = require('../lib/types/internal/M8Version')

describe('BaseInstrument tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyInstrument(new None(), 0xFF, 'NONE')
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        testEmptyInstrument(new None(LATEST_M8_VERSION), 0xFF, 'NONE')
      })
    })
  })

  describe('LFO count', () => {
    test('M8 version < 1.4.0 should have 1', () => {
      expect(new None(new M8Version(1, 3, 9)).lfos.length).toEqual(1)
    })

    test('M8 version >= 1.4.0 should have 2', () => {
      expect(new None().lfos.length).toEqual(2)
    })
  })
})
