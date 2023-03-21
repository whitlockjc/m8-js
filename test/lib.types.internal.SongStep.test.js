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

const SongStep = require('../lib/types/internal/SongStep')

describe('SongStep tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const step = new SongStep()

      expect(step.tracks).toEqual(Array(8).fill(0xFF))
    })

    test('arguments', () => {
      const step = new SongStep([1, 2, 3])

      expect(step.tracks).toEqual([1, 2, 3, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
    })
  })

  test('#asObject', () => {
    const step = new SongStep([1, 2, 3])

    expect(step.asObject()).toEqual({
      tracks: [1, 2, 3, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
    })
  })

  test('.fromObject', () => {
    const step = new SongStep([1, 2, 3])

    expect(SongStep.fromObject(step.asObject())).toEqual(step)
  })

  test('.getObjectProperties', () => {
    expect(SongStep.getObjectProperties()).toEqual(Object.keys(new SongStep().asObject()))
  })
})
