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

const ChorusSettings = require('../lib/types/internal/ChorusSettings')

describe('ChorusSettings tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const cs = new ChorusSettings()

      expect(cs.modDepth).toEqual(0x40)
      expect(cs.modFreq).toEqual(0x80)
      expect(cs.reverbSend).toEqual(0x00)
      expect(cs.width).toEqual(0xFF)
    })

    test('arguments', () => {
      const modDepth = 0x01
      const modFreq = 0x02
      const reverbSend = 0x03
      const width = 0x04
      const cs = new ChorusSettings(modDepth, modFreq, reverbSend, width)

      expect(cs.modDepth).toEqual(modDepth)
      expect(cs.modFreq).toEqual(modFreq)
      expect(cs.reverbSend).toEqual(reverbSend)
      expect(cs.width).toEqual(width)
    })
  })

  test('#asObject', () => {
    expect(new ChorusSettings(0x01, 0x02, 0x03, 0x04).asObject()).toEqual({
      modDepth: 0x01,
      modFreq: 0x02,
      reverbSend: 0x03,
      width: 0x04
    })
  })

  test('.fromObject', () => {
    const cs = new ChorusSettings(0x01, 0x02, 0x03, 0x04)

    expect(ChorusSettings.fromObject(cs.asObject())).toEqual(cs)
  })

  test('.getObjectProperties', () => {
    expect(ChorusSettings.getObjectProperties()).toEqual(Object.keys(new ChorusSettings().asObject()))
  })
})
