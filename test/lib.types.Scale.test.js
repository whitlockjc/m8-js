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

const { readFileSync } = require('fs')
const path = require('path')

const { Scale } = require('../lib/types/Scale')
const M8Version = require('../lib/types/M8Version')

const scaleFiles = {
  'TESTING.m8n': undefined
}

beforeAll(() => {
  Object.keys(scaleFiles).forEach((name) => {
    const filePath = path.join(__dirname, `files/Scales/${name}`)

    scaleFiles[name] = Scale.fromBytes(Array.from(readFileSync(filePath)))
  })
})

describe('NodeInterval tests', () => {
  test('#offsetToStr negative', () => {
    const emptyScale = new Scale()
    const interval = emptyScale.intervals[0]

    interval.offsetA = 160
    interval.offsetB = 246

    expect(interval.offsetToStr()).toEqual('-24.00')
  })
})
describe('Scale tests', () => {
  test('constructor', () => {
    const emptyScale = new Scale()

    expect(emptyScale.name).toEqual('')
    expect(emptyScale.intervals.length).toEqual(12)

    emptyScale.intervals.forEach((interval) => {
      expect(interval.enabled).toEqual(true)
      expect(interval.offsetA).toEqual(0x00)
      expect(interval.offsetB).toEqual(0x00)
      expect(interval.offsetToStr()).toEqual('00.00')
    })
  })

  test('#fromBytes TESTING.m8n', () => {
    const expectedScale = new Scale(new M8Version(2, 5, 0))
    const expectedOffsetStrs = [
      '-24.00',
      '00.00',
      '01.02',
      '00.00',
      '03.04',
      '00.00',
      '05.06',
      '-04.03',
      '00.00',
      '-02.01',
      '00.00',
      '24.00'
    ]

    expectedScale.name = 'TESTING'

    expectedScale.intervals[0].enabled = true
    expectedScale.intervals[0].offsetA = 0xA0
    expectedScale.intervals[0].offsetB = 0xF6

    expectedScale.intervals[1].enabled = false
    expectedScale.intervals[1].offsetA = 0x00
    expectedScale.intervals[1].offsetB = 0x00

    expectedScale.intervals[2].enabled = true
    expectedScale.intervals[2].offsetA = 0x66
    expectedScale.intervals[2].offsetB = 0x00

    expectedScale.intervals[3].enabled = false
    expectedScale.intervals[3].offsetA = 0x00
    expectedScale.intervals[3].offsetB = 0x00

    expectedScale.intervals[4].enabled = true
    expectedScale.intervals[4].offsetA = 0x30
    expectedScale.intervals[4].offsetB = 0x01

    expectedScale.intervals[5].enabled = false
    expectedScale.intervals[5].offsetA = 0x00
    expectedScale.intervals[5].offsetB = 0x00

    expectedScale.intervals[6].enabled = true
    expectedScale.intervals[6].offsetA = 0xFA
    expectedScale.intervals[6].offsetB = 0x01

    expectedScale.intervals[7].enabled = true
    expectedScale.intervals[7].offsetA = 0x6D
    expectedScale.intervals[7].offsetB = 0xFE

    expectedScale.intervals[8].enabled = false
    expectedScale.intervals[8].offsetA = 0x00
    expectedScale.intervals[8].offsetB = 0x00

    expectedScale.intervals[9].enabled = true
    expectedScale.intervals[9].offsetA = 0x37
    expectedScale.intervals[9].offsetB = 0xFF

    expectedScale.intervals[10].enabled = false
    expectedScale.intervals[10].offsetA = 0x00
    expectedScale.intervals[10].offsetB = 0x00

    expectedScale.intervals[11].enabled = true
    expectedScale.intervals[11].offsetA = 0x60
    expectedScale.intervals[11].offsetB = 0x09

    expect(scaleFiles['TESTING.m8n']).toEqual(expectedScale)
    expect(scaleFiles['TESTING.m8n'].intervals.reduce((actualOffsetStrs, interval) => {
      return actualOffsetStrs.concat(interval.offsetToStr())
    }, [])).toEqual(expectedOffsetStrs)
  })

  test('#fromBytes and #asBytes', () => {
    const filePath = path.join(__dirname, 'files/Scales/TESTING.m8n')
    const bytesFromDisk = Array.from(readFileSync(filePath))
    const scaleFromDisk = Scale.fromBytes(bytesFromDisk)

    // Ensure the raw bytes read from disk match the dumped bytes
    expect(bytesFromDisk).toEqual(scaleFromDisk.asBytes())

    let alteredScale = Scale.fromBytes(scaleFromDisk.asBytes())

    // Change the name
    alteredScale.name = 'MY SCALE'

    for (let i = 0; i < alteredScale.intervals.length; i++) {
      const interval = alteredScale.intervals[i]

      if (i % 2 === 0) {
        interval.enabled = false
        interval.offsetA = 0x00
        interval.offsetB = 0x00
      } else {
        interval.enabled = true
        interval.offsetA = 0x01
        interval.offsetB = 0x01
      }
    }

    // Dump altered theme (with latest version number due to not providing one)
    alteredScale = Scale.fromBytes(alteredScale.asBytes())

    // Ensure the files are the same
    expect(alteredScale.name).toEqual('MY SCALE')

    for (let i = 0; i < alteredScale.intervals.length; i++) {
      const interval = alteredScale.intervals[i]

      if (i % 2 === 0) {
        expect(interval.enabled).toEqual(false)
        expect(interval.offsetA).toEqual(0x00)
        expect(interval.offsetB).toEqual(0x00)
      } else {
        expect(interval.enabled).toEqual(true)
        expect(interval.offsetA).toEqual(0x01)
        expect(interval.offsetB).toEqual(0x01)
      }
    }
  })
})
