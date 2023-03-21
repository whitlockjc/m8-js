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

const SamplerParameters = require('../lib/types/internal/SamplerParameters')

describe('SamplerParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const samplerParams = new SamplerParameters()

      expect(samplerParams.degrade).toEqual(0x00)
      expect(samplerParams.length).toEqual(0xFF)
      expect(samplerParams.loopStart).toEqual(0x00)
      expect(samplerParams.playMode).toEqual(0x00)
      expect(samplerParams.samplePath).toEqual('')
      expect(samplerParams.slice).toEqual(0x00)
      expect(samplerParams.start).toEqual(0x00)
    })

    test('arguments', () => {
      const degrade = 0x01
      const length = 0xF2
      const loopStart = 0x03
      const playMode = 0x04
      const samplePath = '/Some/Path/Sample.wav'
      const slice = 0x06
      const start = 0x07
      const samplerParams = new SamplerParameters(degrade, length, loopStart, playMode, samplePath, slice, start)

      expect(samplerParams.degrade).toEqual(degrade)
      expect(samplerParams.length).toEqual(length)
      expect(samplerParams.loopStart).toEqual(loopStart)
      expect(samplerParams.playMode).toEqual(playMode)
      expect(samplerParams.samplePath).toEqual(samplePath)
      expect(samplerParams.slice).toEqual(slice)
      expect(samplerParams.start).toEqual(start)
    })
  })

  test('#asObject', () => {
    expect(new SamplerParameters().asObject()).toEqual({
      degrade: 0x00,
      length: 0xFF,
      loopStart: 0x00,
      playMode: 0x00,
      playModeStr: 'FWD',
      samplePath: '',
      slice: 0x00,
      start: 0x00
    })
  })

  test('#playModeStr', () => {
    ;[
      'FWD', // 0x00
      'REV', // 0x01
      'FWDLOOP', // 0x02
      'REVLOOP', // 0x03
      'FWD PP', // 0x04
      'REV PP', // 0x05
      'OSC', // 0x06
      'OSC REV', // 0x07
      'OSC PP', // 0x08
      'U (09)'
    ].forEach((name, playMode) => {
      expect(new SamplerParameters(0x01, 0x02, 0x03, playMode).playModeToStr()).toEqual(name)
    })
  })

  test('#samplePathToStr', () => {
    expect(new SamplerParameters(0x01, 0x02, 0x02, 0x04, __filename).samplePathToStr()).toEqual('LIB.TYPE_RS.TEST')
  })

  test('.fromObject', () => {
    const samplerParams = new SamplerParameters(0x01, 0x02, 0x03, 0x04, '/Some/Path/sample.wav', 0x06, 0x07)

    expect(SamplerParameters.fromObject(samplerParams.asObject())).toEqual(samplerParams)
  })

  test('.getObjectProperties', () => {
    expect(SamplerParameters.getObjectProperties()).toEqual(Object.keys(new SamplerParameters().asObject()))
  })
})
