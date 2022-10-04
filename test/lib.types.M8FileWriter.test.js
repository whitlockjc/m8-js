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

const { LATEST_M8_VERSION, M8FileTypes, VERSION_2_6_0 } = require('../lib/constants')
const { toM8HexStr } = require('../lib/helpers')
const M8FileWriter = require('../lib/types/M8FileWriter')

describe('M8FileWriter tests', () => {
  describe('constructor', () => {
    test('invlalid', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new M8FileWriter()
      }).toThrow(/fileType is required/)
    })

    test('valid', () => {
      let m8fw = new M8FileWriter(M8FileTypes.Song, VERSION_2_6_0)

      expect(m8fw.fileType).toEqual(M8FileTypes.Song)
      expect(m8fw.fileTypeToStr()).toEqual('Song')
      expect(m8fw.m8Version).toEqual(VERSION_2_6_0)

      ;[M8FileTypes.Instrument, M8FileTypes.Scale, M8FileTypes.Song, M8FileTypes.Theme, 0xFF].forEach((rawFileType) => {
        m8fw = new M8FileWriter(rawFileType)

        let fileType

        switch (rawFileType) {
          case M8FileTypes.Song:
            fileType = 'Song'
            break

          case M8FileTypes.Instrument:
            fileType = 'Instrument'
            break

          case M8FileTypes.Theme:
            fileType = 'Theme'
            break

          case M8FileTypes.Scale:
            fileType = 'Scale'
            break

          default:
            fileType = `Unknown (${toM8HexStr(rawFileType)})`
        }

        expect(m8fw.fileTypeToStr()).toEqual(fileType)
        expect(m8fw.m8Version).toEqual(LATEST_M8_VERSION)
        expect(m8fw.bytes[m8fw.bytes.length - 1]).toEqual(rawFileType)
      })
    })
  })

  test('#write', () => {
    const m8fw = new M8FileWriter(M8FileTypes.Song)
    let testVal = 0x05

    m8fw.write(testVal)

    expect(m8fw.bytes[m8fw.bytes.length - 1]).toEqual(testVal)

    testVal = [0x01, 0x02, 0x03]

    m8fw.write(testVal)

    expect(m8fw.bytes.slice(m8fw.bytes.length - 3)).toEqual(testVal)
  })

  test('#writeBool', () => {
    const m8fw = new M8FileWriter(M8FileTypes.Song)

    m8fw.writeBool(false)

    expect(m8fw.bytes[m8fw.bytes.length - 1]).toEqual(0x00)

    m8fw.writeBool(true)

    expect(m8fw.bytes[m8fw.bytes.length - 1]).toEqual(0x01)
  })

  test('#writeStr', () => {
    const m8fw = new M8FileWriter(M8FileTypes.Song)
    const testStr = 'TEST'

    m8fw.writeStr(testStr, 4)

    const testBytes = testStr.split('').map((char) => {
      return char.charCodeAt(0)
    })

    m8fw.writeStr(testStr, 6)

    expect(m8fw.bytes.slice(m8fw.bytes.length - 6)).toEqual(testBytes.concat(0x00, 0x00))
  })
})
