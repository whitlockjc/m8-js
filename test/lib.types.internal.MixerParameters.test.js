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

const MixerParameters = require('../lib/types/internal/MixerParameters')

describe('MixerParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const mixerParams = new MixerParameters()

      expect(mixerParams.cho).toEqual(0x00)
      expect(mixerParams.del).toEqual(0x00)
      expect(mixerParams.dry).toEqual(0xC0)
      expect(mixerParams.pan).toEqual(0x80)
      expect(mixerParams.rev).toEqual(0x00)
    })

    test('arguments', () => {
      const cho = 0x01
      const del = 0x02
      const dry = 0x03
      const pan = 0x04
      const rev = 0x05
      const mixerParams = new MixerParameters(cho, del, dry, pan, rev)

      expect(mixerParams.cho).toEqual(cho)
      expect(mixerParams.del).toEqual(del)
      expect(mixerParams.dry).toEqual(dry)
      expect(mixerParams.pan).toEqual(pan)
      expect(mixerParams.rev).toEqual(rev)
    })
  })

  test('#asObject', () => {
    expect(new MixerParameters().asObject()).toEqual({
      cho: 0x00,
      del: 0x00,
      dry: 0xC0,
      pan: 0x80,
      rev: 0x00
    })
  })

  test('.fromObject', () => {
    const mixerParams = new MixerParameters(0x01, 0x02, 0x03, 0x04, 0x05)

    expect(MixerParameters.fromObject(mixerParams.asObject())).toEqual(mixerParams)
  })

  test('.getObjectProperties', () => {
    expect(MixerParameters.getObjectProperties()).toEqual(Object.keys(new MixerParameters().asObject()))
  })
})
