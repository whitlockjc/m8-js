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

const MIDICC = require('../lib/types/internal/MIDICC')

describe('MIDICC tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const midiCC = new MIDICC()

      expect(midiCC.defaultValue).toEqual(0xFF)
      expect(midiCC.number).toEqual(0xFF)
    })

    test('arguments', () => {
      const defaultValue = 0x01
      const number = 0x02
      const midiCC = new MIDICC(defaultValue, number)

      expect(midiCC.defaultValue).toEqual(defaultValue)
      expect(midiCC.number).toEqual(number)
    })
  })

  test('#asObject', () => {
    expect(new MIDICC().asObject()).toEqual({
      defaultValue: 0xFF,
      number: 0xFF
    })
  })

  test('.fromObject', () => {
    const midiCC = new MIDICC(0x01, 0x02)

    expect(MIDICC.fromObject(midiCC.asObject())).toEqual(midiCC)
  })

  test('.getObjectProperties', () => {
    expect(MIDICC.getObjectProperties()).toEqual(Object.keys(new MIDICC().asObject()))
  })
})
