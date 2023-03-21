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

const RGB = require('../lib/types/internal/RGB')

describe('RGB tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const rgb = new RGB()

      expect(rgb.r).toEqual(0x00)
      expect(rgb.g).toEqual(0x00)
      expect(rgb.b).toEqual(0x00)
    })

    test('arguments', () => {
      const r = 0x01
      const g = 0x02
      const b = 0x03
      const rgb = new RGB(r, g, b)

      expect(rgb.r).toEqual(r)
      expect(rgb.g).toEqual(g)
      expect(rgb.b).toEqual(b)
    })
  })

  test('#asObject', () => {
    expect(new RGB().asObject()).toEqual({
      r: 0x00,
      g: 0x00,
      b: 0x00
    })
  })

  test('.fromObject', () => {
    const rgb = new RGB(0x01, 0x02, 0x03)

    expect(RGB.fromObject(rgb.asObject())).toEqual(rgb)
  })

  test('.getObjectProperties', () => {
    expect(RGB.getObjectProperties()).toEqual(Object.keys(new RGB().asObject()))
  })
})
