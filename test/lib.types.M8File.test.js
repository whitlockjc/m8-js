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

const { M8FileTypes, LATEST_M8_VERSION } = require('../lib/constants')
const M8File = require('../lib/types/M8File')

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
      new M8File(M8FileTypes.Instrument)
    }).toThrow(/^m8FileVersion is required$/)

    expect(() => {
      // eslint-disable-next-line no-new
      new M8File(M8FileTypes.Instrument, '2.7.0')
    }).toThrow(/^m8FileVersion must be an M8Version$/)
  })

  test('#typeToStr', () => {
    const m8FileTypes = {
      Instrument: M8FileTypes.Instrument,
      Scale: M8FileTypes.Scale,
      Song: M8FileTypes.Song,
      Theme: M8FileTypes.Theme
    }

    Object.keys(m8FileTypes).forEach((key) => {
      expect(new M8File(m8FileTypes[key], LATEST_M8_VERSION).typeToStr()).toEqual(key)
    })

    expect(new M8File(0xFF, LATEST_M8_VERSION).typeToStr()).toEqual('Unknown (FF)')
  })
})
