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

const ChainStep = require('../lib/types/internal/ChainStep')

describe('ChainStep tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const step = new ChainStep()

      expect(step.phrase).toEqual(0xFF)
      expect(step.transpose).toEqual(0x00)
    })

    test('arguments', () => {
      const phrase = 0x01
      const transpose = 0x01
      const step = new ChainStep(phrase, transpose)

      expect(step.phrase).toEqual(phrase)
      expect(step.transpose).toEqual(transpose)
    })
  })

  test('#asObject', () => {
    const phrase = 0x01
    const transpose = 0x01

    expect(new ChainStep(phrase, transpose).asObject()).toEqual({
      phrase,
      transpose
    })
  })

  test('.fromObject', () => {
    const step = new ChainStep(0x01, 0x01)

    expect(ChainStep.fromObject(step.asObject())).toEqual(step)
  })

  test('.getObjectProperties', () => {
    expect(ChainStep.getObjectProperties()).toEqual(Object.keys(new ChainStep().asObject()))
  })
})
