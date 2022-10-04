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

const { Scale } = require('../lib/types/Scale')

describe('NodeInterval tests', () => {
  test('#offsetToStr negative', () => {
    const emptyScale = new Scale()
    const interval = emptyScale.intervals[0]

    interval.offsetA = 160
    interval.offsetB = 246

    expect(interval.offsetToStr()).toEqual('-24.00')
  })
})
describe('Scale tests', () => {
  test('constructor', () => {
    const emptyScale = new Scale()

    expect(emptyScale.name).toEqual('')
    expect(emptyScale.intervals.length).toEqual(12)

    emptyScale.intervals.forEach((interval) => {
      expect(interval.enabled).toEqual(true)
      expect(interval.offsetA).toEqual(0x00)
      expect(interval.offsetB).toEqual(0x00)
      expect(interval.offsetToStr()).toEqual('00.00')
    })
  })
})
