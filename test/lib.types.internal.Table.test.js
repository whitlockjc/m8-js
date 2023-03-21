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

const FX = require('../lib/types/internal/FX')
const TableStep = require('../lib/types/internal/TableStep')
const Table = require('../lib/types/internal/Table')

describe('Table tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const emptyTable = new Table()

      expect(emptyTable.steps.length).toEqual(16)

      for (let i = 0; i < emptyTable.steps.length; i++) {
        const step = emptyTable.steps[i]

        expect(step.transpose).toEqual(0x00)
        expect(step.volume).toEqual(0xFF)

        for (let j = 0; j < step.fx.length; j++) {
          const fx = step.fx[j]

          expect(fx.command).toEqual(0xFF)
          expect(fx.value).toEqual(0x00)
        }
      }
    })

    test('arguments', () => {
      // eslint-disable-next-line no-unused-vars
      const steps = Array.from({ length: 8 }, (e, i) => {
        // eslint-disable-next-line no-unused-vars
        const fx = Array.from({ length: 2 }, (e2, j) => new FX(j + 1, j + 1))
        const instrument = 0x01 + i
        const note = 0x02 + i
        const volume = 0x03 + i

        return new TableStep(fx, instrument, note, volume)
      })
      const table = new Table(steps)

      expect(table.steps).toEqual([...steps, ...Array.from({ length: 8 }, () => new TableStep())])
    })
  })

  test('#asObject', () => {
    const table = new Table()

    expect(table.asObject()).toEqual({
      steps: Array.from({ length: table.steps.length }, () => new TableStep())
    })
  })

  test('.fromObject', () => {
    const table = new Table()

    for (let i = 0; i < table.steps.length; i++) {
      if (i === 5) {
        continue
      }

      const step = table.steps[i]

      step.transpose = i
      step.volume = i

      step.fx.forEach((fx, j) => {
        fx.command = j
        fx.value = j
      })
    }

    const tableObject = table.asObject()

    // Necessary to avoid altering the original Groove steps
    tableObject.steps = [...tableObject.steps]

    tableObject.steps[5] = undefined

    expect(Table.fromObject(tableObject)).toEqual(table)
  })

  test('.getObjectProperties', () => {
    expect(Table.getObjectProperties()).toEqual(Object.keys(new Table().asObject()))
  })
})
