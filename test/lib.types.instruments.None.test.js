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
const { testEmptyInstrument, testInstrumentOjbect } = require('./helpers')
const None = require('../lib/types/instruments/None')

const EMPTYProperties = ['ampParams', 'envelopes', 'filterParams', 'instrParams', 'lfos', 'mixerParams']

describe('None tests', () => {
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

  test('#asObject', () => {
    const none = new None()
    const noneObject = none.asObject()

    testInstrumentOjbect(none)

    EMPTYProperties.forEach((prop) => {
      expect(noneObject[prop]).toBeUndefined()
    })
  })

  test('.fromObject', () => {
    const none = new None()

    expect(None.fromObject(none.asObject())).toEqual(none)
  })

  test('.getObjectProperties', () => {
    expect(None.getObjectProperties().sort()).toEqual(Object.keys(new None().asObject()).sort())
  })
})
