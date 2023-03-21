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

const ReverbSettings = require('../lib/types/internal/ReverbSettings')

describe('ReverbSettings tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const rs = new ReverbSettings()

      expect(rs.damping).toEqual(0xC0)
      expect(rs.filterHP).toEqual(0x10)
      expect(rs.filterLP).toEqual(0xE0)
      expect(rs.modDepth).toEqual(0x10)
      expect(rs.modFreq).toEqual(0xFF)
      expect(rs.size).toEqual(0xFF)
      expect(rs.width).toEqual(0xFF)
    })

    test('arguments', () => {
      const damping = 0x01
      const filterHP = 0x02
      const filterLP = 0x03
      const modDepth = 0x04
      const modFreq = 0x05
      const size = 0x06
      const width = 0x07
      const rs = new ReverbSettings(damping, filterHP, filterLP, modDepth, modFreq, size, width)

      expect(rs.damping).toEqual(damping)
      expect(rs.filterHP).toEqual(filterHP)
      expect(rs.filterLP).toEqual(filterLP)
      expect(rs.modDepth).toEqual(modDepth)
      expect(rs.modFreq).toEqual(modFreq)
      expect(rs.size).toEqual(size)
      expect(rs.width).toEqual(width)
    })
  })

  test('#asObject', () => {
    expect(new ReverbSettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07).asObject()).toEqual({
      damping: 0x01,
      filterHP: 0x02,
      filterLP: 0x03,
      modDepth: 0x04,
      modFreq: 0x05,
      size: 0x06,
      width: 0x07
    })
  })

  test('.fromObject', () => {
    const rs = new ReverbSettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)

    expect(ReverbSettings.fromObject(rs.asObject())).toEqual(rs)
  })

  test('.getObjectProperties', () => {
    expect(ReverbSettings.getObjectProperties()).toEqual(Object.keys(new ReverbSettings().asObject()))
  })
})
