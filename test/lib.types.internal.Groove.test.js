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

const Groove = require('../lib/types/internal/Groove')

describe('Groove tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const defaultGroove = new Groove()

      for (let i = 0; i < defaultGroove.steps; i++) {
        let expectedValue = 0xFF

        if (i < 2) {
          expectedValue = 0x06
        }

        expectedValue(defaultGroove.steps[i]).toEqual(expectedValue)
      }
    })

    test('arguments', () => {
      const groove = new Groove([undefined, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])

      expect(groove.steps).toEqual([0x06, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, ...Array(8).fill(0xFF)])
    })
  })

  test('#asObject', () => {
    expect(new Groove().asObject()).toEqual({
      steps: [0x06, 0x06].concat(Array(14).fill(0xFF))
    })
  })

  test('.fromObject', () => {
    const groove = new Groove()

    for (let i = 0; i < groove.steps.length; i++) {
      if (i === 5) {
        continue
      }

      groove.steps[i] = i
    }

    const grooveObject = groove.asObject()

    // Necessary to avoid altering the original Groove steps
    grooveObject.steps = [...grooveObject.steps]

    grooveObject.steps[5] = undefined

    expect(Groove.fromObject(grooveObject)).toEqual(groove)
  })

  test('.getObjectProperties', () => {
    expect(Groove.getObjectProperties()).toEqual(Object.keys(new Groove().asObject()))
  })
})
