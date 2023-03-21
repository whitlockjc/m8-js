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

const AmplifierParameters = require('../lib/types/internal/AmplifierParameters')

describe('AmplifierParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const ampParams = new AmplifierParameters()

      expect(ampParams.amp).toEqual(0x00)
      expect(ampParams.limit).toEqual(0x00)
    })

    test('arguments', () => {
      const amp = 0x01
      const limit = 0x02
      const ampParams = new AmplifierParameters(amp, limit)

      expect(ampParams.amp).toEqual(amp)
      expect(ampParams.limit).toEqual(limit)
    })
  })

  test('#asObject', () => {
    expect(new AmplifierParameters().asObject()).toEqual({
      amp: 0x00,
      limit: 0x00,
      limitStr: 'CLIP'
    })
  })

  test('#limitToStr', () => {
    AmplifierParameters.LimitNames.forEach((name, i) => {
      const ampParams = new AmplifierParameters(0x00, i)

      expect(ampParams.limitToStr()).toEqual(name)
    })

    expect(new AmplifierParameters(0x00, 0xFF).limitToStr()).toEqual('UNK (FF)')
  })

  test('.fromObject', () => {
    const origAmpParams = new AmplifierParameters(0x01, 0x02)

    expect(AmplifierParameters.fromObject(origAmpParams.asObject())).toEqual(origAmpParams)
  })

  test('.getObjectProperties', () => {
    expect(AmplifierParameters.getObjectProperties()).toEqual(Object.keys(new AmplifierParameters().asObject()))
  })
})
