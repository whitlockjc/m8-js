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

const WavsynthParameters = require('../lib/types/internal/WavsynthParameters')

describe('WavsynthParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const wavsynthParams = new WavsynthParameters()

      expect(wavsynthParams.mirror).toEqual(0x00)
      expect(wavsynthParams.mult).toEqual(0x00)
      expect(wavsynthParams.shape).toEqual(0x00)
      expect(wavsynthParams.size).toEqual(0x20)
      expect(wavsynthParams.warp).toEqual(0x00)
    })

    test('arguments', () => {
      const mirror = 0x01
      const mult = 0x02
      const shape = 0x03
      const size = 0x04
      const warp = 0x05
      const wavsynthParams = new WavsynthParameters(mirror, mult, shape, size, warp)

      expect(wavsynthParams.mirror).toEqual(mirror)
      expect(wavsynthParams.mult).toEqual(mult)
      expect(wavsynthParams.shape).toEqual(shape)
      expect(wavsynthParams.size).toEqual(size)
      expect(wavsynthParams.warp).toEqual(warp)
    })
  })

  test('#asObject', () => {
    expect(new WavsynthParameters().asObject()).toEqual({
      mirror: 0x00,
      mult: 0x00,
      shape: 0x00,
      shapeStr: 'PULSE 12%',
      size: 0x20,
      warp: 0x00
    })
  })

  test('#shapeToStr', () => {
    ;[
      'PULSE 12%', // 0x00
      'PULSE 25%', // 0x01
      'PULSE 50%', // 0x02
      'PULSE 75%', // 0x03
      'SAW', // 0x04
      'TRIANGLE', // 0x05
      'SINE', // 0x06
      'NOISE PITCHED', // 0x07
      'NOISE', // 0x08
      'OVERFLOW'
    ].forEach((name, shape) => {
      expect(new WavsynthParameters(0x01, 0x02, shape).shapeToStr()).toEqual(name)
    })
  })

  test('.fromObject', () => {
    const wavsynthParams = new WavsynthParameters(0x01, 0x02, 0x03, 0x04, 0x05)

    expect(WavsynthParameters.fromObject(wavsynthParams.asObject())).toEqual(wavsynthParams)
  })

  test('.getObjectProperties', () => {
    expect(WavsynthParameters.getObjectProperties()).toEqual(Object.keys(new WavsynthParameters().asObject()))
  })
})
