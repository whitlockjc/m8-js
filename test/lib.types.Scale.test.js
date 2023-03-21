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

const { LATEST_M8_VERSION } = require('../lib/constants')
const { DefaultScales, Scale } = require('../lib/types/Scale')

function testEmptyScale (scale) {
  expect(scale.name).toEqual('')
  expect(scale.intervals.length).toEqual(12)

  scale.intervals.forEach((interval) => {
    expect(interval.enabled).toEqual(true)
    expect(interval.offsetA).toEqual(0x00)
    expect(interval.offsetB).toEqual(0x00)
    expect(interval.offsetToStr()).toEqual('00.00')
  })
}

function testScaleAsObject (scale, skipHeader = false) {
  expect(scale.asObject(skipHeader)).toEqual({
    ...(skipHeader ? {} : { fileMetadata: { type: 'Scale', version: LATEST_M8_VERSION.asObject() } }),
    name: scale.name,
    intervals: scale.intervals.map((interval) => interval.asObject())
  })
}

describe('Scale tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyScale(new Scale())
    })

    describe('arguments', () => {
      // M8FileReder is tested by index.js tests

      test('M8Version', () => {
        testEmptyScale(new Scale(LATEST_M8_VERSION))
      })
    })
  })

  describe('#asObject', () => {
    test('empty', () => {
      testScaleAsObject(DefaultScales[0])
    })

    test('skipHeader', () => {
      testScaleAsObject(DefaultScales[0], true)
    })
  })

  test('.fromObject', () => {
    const scale = new Scale()

    scale.name = 'TESTING'
    scale.intervals[0].enabled = false
    scale.intervals[0].offsetA = 0x01
    scale.intervals[0].offsetB = 0x01

    expect(Scale.fromObject(scale.asObject())).toEqual(scale)
  })

  test('.getObjectProperties', () => {
    expect(Scale.getObjectProperties()).toEqual(Object.keys(new Scale().asObject()))
  })
})
