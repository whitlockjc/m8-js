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

const DelaySettings = require('../lib/types/internal/DelaySettings')

describe('DelaySettings tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const ds = new DelaySettings()

      expect(ds.feedback).toEqual(0x80)
      expect(ds.filterHP).toEqual(0x40)
      expect(ds.filterLP).toEqual(0xFF)
      expect(ds.reverbSend).toEqual(0x00)
      expect(ds.timeL).toEqual(0x30)
      expect(ds.timeR).toEqual(0x30)
      expect(ds.width).toEqual(0xFF)
    })

    test('arguments', () => {
      const feedback = 0x01
      const filterHP = 0x02
      const filterLP = 0x03
      const reverbSend = 0x04
      const timeL = 0x05
      const timeR = 0x06
      const width = 0x07
      const ds = new DelaySettings(feedback, filterHP, filterLP, reverbSend, timeL, timeR, width)

      expect(ds.feedback).toEqual(feedback)
      expect(ds.filterHP).toEqual(filterHP)
      expect(ds.filterLP).toEqual(filterLP)
      expect(ds.reverbSend).toEqual(reverbSend)
      expect(ds.timeL).toEqual(timeL)
      expect(ds.timeR).toEqual(timeR)
      expect(ds.width).toEqual(width)
    })
  })

  test('#asObject', () => {
    expect(new DelaySettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07).asObject()).toEqual({
      feedback: 0x01,
      filterHP: 0x02,
      filterLP: 0x03,
      reverbSend: 0x04,
      timeL: 0x05,
      timeR: 0x06,
      width: 0x07
    })
  })

  test('.fromObject', () => {
    const cs = new DelaySettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)

    expect(DelaySettings.fromObject(cs.asObject())).toEqual(cs)
  })

  test('.getObjectProperties', () => {
    expect(DelaySettings.getObjectProperties()).toEqual(Object.keys(new DelaySettings().asObject()))
  })
})
