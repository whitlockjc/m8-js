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
const DelaySettings = require('../lib/types/internal/DelaySettings')
const EffectsSettings = require('../lib/types/internal/EffectsSettings')
const ReverbSettings = require('../lib/types/internal/ReverbSettings')

describe('EffectsSettings tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const es = new EffectsSettings()

      expect(es.chorusSettings).toEqual(new ChorusSettings())
      expect(es.delaySettings).toEqual(new DelaySettings())
      expect(es.reverbSettings).toEqual(new ReverbSettings())
    })

    test('arguments', () => {
      const chorusSettings = new ChorusSettings(0x01, 0x02, 0x03, 0x04)
      const delaySettings = new DelaySettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
      const reverbSettings = new ReverbSettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
      const es = new EffectsSettings(chorusSettings, delaySettings, reverbSettings)

      expect(es.chorusSettings).toEqual(chorusSettings)
      expect(es.delaySettings).toEqual(delaySettings)
      expect(es.reverbSettings).toEqual(reverbSettings)
    })
  })

  test('#asObject', () => {
    const chorusSettings = new ChorusSettings(0x01, 0x02, 0x03, 0x04)
    const delaySettings = new DelaySettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
    const reverbSettings = new ReverbSettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
    const es = new EffectsSettings(chorusSettings, delaySettings, reverbSettings)

    expect(es.asObject()).toEqual({
      chorusSettings: chorusSettings.asObject(),
      delaySettings: delaySettings.asObject(),
      reverbSettings: reverbSettings.asObject()
    })
  })

  test('.fromObject', () => {
    const chorusSettings = new ChorusSettings(0x01, 0x02, 0x03, 0x04)
    const delaySettings = new DelaySettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
    const reverbSettings = new ReverbSettings(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
    const es = new EffectsSettings(chorusSettings, delaySettings, reverbSettings)

    expect(EffectsSettings.fromObject(es.asObject())).toEqual(es)
  })

  test('.getObjectProperties', () => {
    expect(EffectsSettings.getObjectProperties()).toEqual(Object.keys(new EffectsSettings().asObject()))
  })
})
