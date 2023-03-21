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

const Chain = require('../lib/types/internal/Chain')
const ChainStep = require('../lib/types/internal/ChainStep')

describe('Chain tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const emptyChain = new Chain()

      expect(emptyChain.steps.length).toEqual(16)

      for (let i = 0; i < emptyChain.steps.length; i++) {
        const step = emptyChain.steps[i]

        expect(step.phrase).toEqual(0xFF)
        expect(step.transpose).toEqual(0x00)
      }
    })

    test('arguments', () => {
      // eslint-disable-next-line no-unused-vars
      const steps = Array.from({ length: 8 }, (e, i) => new ChainStep(i + 1, i + 1))
      const chain = new Chain(steps)

      expect(chain.steps).toEqual([...steps, ...Array.from({ length: 8 }, () => new ChainStep())])
    })
  })

  test('#asObject', () => {
    expect(new Chain().asObject()).toEqual({
      steps: Array.from({ length: 16 }, () => new ChainStep().asObject())
    })
  })

  test('.fromObject', () => {
    const chain = new Chain()

    for (let i = 0; i < chain.steps.length; i++) {
      const step = chain.steps[i]

      if (i === 5) {
        continue
      }

      step.phrase = i
      step.transpose = i
    }

    const chainObject = chain.asObject()

    chainObject.steps[5] = undefined

    expect(Chain.fromObject(chainObject)).toEqual(chain)
  })

  test('.getObjectProperties', () => {
    expect(Chain.getObjectProperties()).toEqual(Object.keys(new Chain().asObject()))
  })
})
