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

const Table = require('../lib/types/Table')

describe('Table tests', () => {
  test('constructor', () => {
    const emptyTable = new Table()

    expect(emptyTable.steps.length).toEqual(16)

    for (let i = 0; i < emptyTable.steps.length; i++) {
      const step = emptyTable.steps[i]

      expect(step.transpose).toEqual(0x00)
      expect(step.volume).toEqual(0xFF)

      for (let j = 0; j < 3; j++) {
        const fx = step['fx' + (j + 1)]

        expect(fx.command).toEqual(0xFF)
        expect(fx.value).toEqual(0x00)
      }
    }
  })
})
