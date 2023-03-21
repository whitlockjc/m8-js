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

const M8File = require('../lib/types/internal/M8File')

describe('M8File tests', () => {
  test('constructor', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new M8File()
    }).toThrow(/^m8FileReaderOrType is required$/)

    expect(() => {
      // eslint-disable-next-line no-new
      new M8File('testing')
    }).toThrow(/^m8FileReaderOrType must be an M8FileReader or a Number$/)

    expect(() => {
      // eslint-disable-next-line no-new
      new M8File(M8File.TYPES.Instrument)
    }).toThrow(/^m8FileVersion is required$/)

    expect(() => {
      // eslint-disable-next-line no-new
      new M8File(M8File.TYPES.Instrument, '2.7.0')
    }).toThrow(/^m8FileVersion must be an M8Version$/)
  })

  test('#typeFromStr', () => {
    for (const [key, val] of Object.entries(M8File.TYPES)) {
      expect(M8File.typeFromStr(key)).toEqual(val)
    }

    expect(M8File.typeFromStr('Unknown')).toEqual(NaN)
  })

  test('#typeToStr', () => {
    for (const [key, val] of Object.entries(M8File.TYPES)) {
      expect(M8File.typeToStr(val)).toEqual(key)
    }

    expect(M8File.typeToStr(0xFF)).toEqual('Unknown (FF)')
  })
})
