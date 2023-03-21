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

const NoteInterval = require('../lib/types/internal/NoteInterval')

describe('NoteInterval tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const ni = new NoteInterval()

      expect(ni.enabled).toEqual(true)
      expect(ni.offsetA).toEqual(0x00)
      expect(ni.offsetB).toEqual(0x00)
    })

    test('arguments', () => {
      const enabled = false
      const offsetA = 0x01
      const offsetB = 0x02
      const ni = new NoteInterval(enabled, offsetA, offsetB)

      expect(ni.enabled).toEqual(enabled)
      expect(ni.offsetA).toEqual(offsetA)
      expect(ni.offsetB).toEqual(offsetB)
    })
  })

  test('#asObject', () => {
    const enabled = false
    const offsetA = 0xA0
    const offsetB = 0xF6
    const offsetStr = '-24.00'
    const ni = new NoteInterval(enabled, offsetA, offsetB)

    expect(ni.asObject()).toEqual({
      enabled,
      offsetA,
      offsetB,
      offsetStr
    })
  })

  test('.fromObject', () => {
    const ni = new NoteInterval(false, 0x01, 0x03)

    expect(NoteInterval.fromObject(ni.asObject())).toEqual(ni)
  })

  test('.getObjectProperties', () => {
    expect(NoteInterval.getObjectProperties()).toEqual(Object.keys(new NoteInterval().asObject()))
  })
})
