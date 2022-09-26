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

const { toM8HexStr } = require('../lib/helpers')
const M8FileReader = require('../lib/types/M8FileReader')

const testBuffer = Buffer.from([
  0x4D,
  0x38,
  0x56,
  0x45,
  0x52,
  0x53,
  0x49,
  0x4F,
  0x4E,
  0x00,
  0x70,
  0x02,
  0x00,
  0x00
])

describe('M8FileReader tests', () => {
  test('constructor', () => {
    let m8fr = new M8FileReader(testBuffer)

    expect(m8fr.buffer).toEqual(testBuffer)
    expect(m8fr.cursor).toEqual(14) // Read the first 14 bytes so the current position is 14
    expect(m8fr.skipped).toEqual([9, 12]) // Skipped bytes 9 and 12
    expect(m8fr.fileTypeToStr()).toEqual('Song')

    const fileTypes = [0x00, 0x10, 0x20, 0x30, 0xFF]

    fileTypes.forEach((rawFileType) => {
      const bufferClone = [...testBuffer]

      bufferClone[bufferClone.length - 1] = rawFileType

      m8fr = new M8FileReader(bufferClone)

      let fileType

      switch (rawFileType) {
        case 0x00:
          fileType = 'Song'
          break

        case 0x10:
          fileType = 'Instrument'
          break

        case 0x20:
          fileType = 'Theme'
          break

        case 0x30:
          fileType = 'Scale'
          break

        default:
          fileType = `Unknown (${toM8HexStr(rawFileType)})`
      }

      expect(m8fr.fileTypeToStr()).toEqual(fileType)
    })
  })

  test('#readStr right padded', () => {
    const bufferClone = [...testBuffer]
    const testString = 'm8-js   '

    for (let i = 0; i < testString.length; i++) {
      if (testString[i] === ' ') {
        bufferClone.push(0xFF)
      } else {
        bufferClone.push(testString.charCodeAt(i))
      }
    }

    const m8fr = new M8FileReader(bufferClone)

    expect(m8fr.readStr(9)).toEqual('m8-js')
  })

  test('#skipTo', () => {
    const bufferClone = [...testBuffer]
    const extraData = [0x01, 0x02, 0x03, 0x04, 0x05]

    for (let i = 0; i < extraData.length; i++) {
      bufferClone.push(extraData[i])
    }

    const m8fr = new M8FileReader(bufferClone)

    expect(m8fr.cursor).toEqual(14)

    m8fr.skipTo(0x11)

    expect(m8fr.cursor).toEqual(17)
    expect(m8fr.skipped).toEqual([9, 12, 14, 15, 16])
  })
})
