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

const FX = require('../lib/types/internal/FX')
const TableStep = require('../lib/types/internal/TableStep')

describe('TableStep tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const step = new TableStep()

      expect(step.fx).toEqual(Array(3).fill(new FX()))
      expect(step.transpose).toEqual(0x00)
      expect(step.volume).toEqual(0xFF)
    })

    test('arguments', () => {
      const fx = [new FX(0x01, 0x02), true]
      const transpose = 0x01
      const volume = 0x02
      const ts = new TableStep(fx, transpose, volume)

      expect(ts.fx).toEqual([fx[0], new FX(), new FX()])
      expect(ts.transpose).toEqual(transpose)
      expect(ts.volume).toEqual(volume)
    })
  })

  test('#asObject', () => {
    const step = new TableStep()

    step.transpose = 0x01
    step.volume = 0x02

    step.fx[1].command = 0x01
    step.fx[1].value = 0x02

    expect(step.asObject()).toEqual({
      fx: step.fx.map((fx) => fx.asObject()),
      transpose: 0x01,
      volume: 0x02
    })
  })

  test('.fromObject', () => {
    const step = new TableStep()

    step.transpose = 0x01
    step.volume = 0x02

    step.fx[1].command = 0x01
    step.fx[1].value = 0x02

    expect(TableStep.fromObject(step.asObject())).toEqual(step)
  })

  test('.getObjectProperties', () => {
    expect(TableStep.getObjectProperties()).toEqual(Object.keys(new TableStep().asObject()))
  })
})
