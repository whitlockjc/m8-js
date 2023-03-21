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

const MixerSettings = require('../lib/types/internal/MixerSettings')

describe('MixerSettings tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const ms = new MixerSettings()

      expect(ms.analogInputChorus).toEqual(Array(2).fill(0x00))
      expect(ms.analogInputDelay).toEqual(Array(2).fill(0x00))
      expect(ms.analogInputReverb).toEqual(Array(2).fill(0x00))
      expect(ms.analogInputVolume).toEqual([0x00, 0xFF])
      expect(ms.chorusVolume).toEqual(0xE0)
      expect(ms.delayVolume).toEqual(0xE0)
      expect(ms.djFilter).toEqual(0x80)
      expect(ms.djFilterPeak).toEqual(0x80)
      expect(ms.masterLimit).toEqual(0x00)
      expect(ms.masterVolume).toEqual(0xE0)
      expect(ms.reverbVolume).toEqual(0xE0)
      expect(ms.trackVolume).toEqual(Array(8).fill(0xE0))
      expect(ms.usbInputChorus).toEqual(0x00)
      expect(ms.usbInputDelay).toEqual(0x00)
      expect(ms.usbInputReverb).toEqual(0x00)
      expect(ms.usbInputVolume).toEqual(0x00)
    })

    test('arguments', () => {
      const analogInputChorus = [0x01]
      const analogInputDelay = [0x02]
      const analogInputReverb = [0x03]
      const analogInputVolume = [0x04, 0x05]
      const chorusVolume = 0x06
      const delayVolume = 0x07
      const djFilter = 0x08
      const djFilterPeak = 0x09
      const masterLimit = 0x0A
      const masterVolume = 0x0B
      const reverbVolume = 0x0C
      const trackVolume = [8, 7, 6]
      const usbInputChorus = 0x0D
      const usbInputDelay = 0x0E
      const usbInputReverb = 0x0F
      const usbInputVolume = 0x10
      const ms = new MixerSettings(analogInputChorus, analogInputDelay, analogInputReverb, analogInputVolume,
                                   chorusVolume, delayVolume, djFilter, djFilterPeak, masterLimit, masterVolume,
                                   reverbVolume, trackVolume, usbInputChorus, usbInputDelay, usbInputReverb,
                                   usbInputVolume)

      expect(ms.analogInputChorus).toEqual([0x01, 0x00])
      expect(ms.analogInputDelay).toEqual([0x02, 0x00])
      expect(ms.analogInputReverb).toEqual([0x03, 0x00])
      expect(ms.analogInputVolume).toEqual([0x04, 0x05])
      expect(ms.chorusVolume).toEqual(chorusVolume)
      expect(ms.delayVolume).toEqual(delayVolume)
      expect(ms.djFilter).toEqual(djFilter)
      expect(ms.djFilterPeak).toEqual(djFilterPeak)
      expect(ms.masterLimit).toEqual(masterLimit)
      expect(ms.masterVolume).toEqual(masterVolume)
      expect(ms.reverbVolume).toEqual(reverbVolume)
      expect(ms.trackVolume).toEqual([8, 7, 6, 0xE0, 0xE0, 0xE0, 0xE0, 0xE0])
      expect(ms.usbInputChorus).toEqual(usbInputChorus)
      expect(ms.usbInputDelay).toEqual(usbInputDelay)
      expect(ms.usbInputReverb).toEqual(usbInputReverb)
      expect(ms.usbInputVolume).toEqual(usbInputVolume)
    })
  })

  test('#asObject', () => {
    const analogInputChorus = [0x01]
    const analogInputDelay = [0x02]
    const analogInputReverb = [0x03]
    const analogInputVolume = [0x04, 0x05]
    const chorusVolume = 0x06
    const delayVolume = 0x07
    const djFilter = 0x08
    const djFilterPeak = 0x09
    const masterLimit = 0x0A
    const masterVolume = 0x0B
    const reverbVolume = 0x0C
    const trackVolume = [8, 7, 6]
    const usbInputChorus = 0x0D
    const usbInputDelay = 0x0E
    const usbInputReverb = 0x0F
    const usbInputVolume = 0x10
    const ms = new MixerSettings(analogInputChorus, analogInputDelay, analogInputReverb, analogInputVolume,
                                 chorusVolume, delayVolume, djFilter, djFilterPeak, masterLimit, masterVolume,
                                 reverbVolume, trackVolume, usbInputChorus, usbInputDelay, usbInputReverb,
                                 usbInputVolume)

    expect(ms.asObject()).toEqual({
      analogInputChorus: [0x01, 0x00],
      analogInputDelay: [0x02, 0x00],
      analogInputReverb: [0x03, 0x00],
      analogInputVolume: [0x04, 0x05],
      chorusVolume,
      delayVolume,
      djFilter,
      djFilterPeak,
      masterLimit,
      masterVolume,
      reverbVolume,
      trackVolume: [8, 7, 6, 0xE0, 0xE0, 0xE0, 0xE0, 0xE0],
      usbInputChorus,
      usbInputDelay,
      usbInputReverb,
      usbInputVolume
    })
  })

  test('.fromObject', () => {
    const analogInputChorus = [0x01]
    const analogInputDelay = [0x02]
    const analogInputReverb = [0x03]
    const analogInputVolume = [0x04, 0x05]
    const chorusVolume = 0x06
    const delayVolume = 0x07
    const djFilter = 0x08
    const djFilterPeak = 0x09
    const masterLimit = 0x0A
    const masterVolume = 0x0B
    const reverbVolume = 0x0C
    const trackVolume = [8, 7, 6]
    const usbInputChorus = 0x0D
    const usbInputDelay = 0x0E
    const usbInputReverb = 0x0F
    const usbInputVolume = 0x10
    const ms = new MixerSettings(analogInputChorus, analogInputDelay, analogInputReverb, analogInputVolume,
                                 chorusVolume, delayVolume, djFilter, djFilterPeak, masterLimit, masterVolume,
                                 reverbVolume, trackVolume, usbInputChorus, usbInputDelay, usbInputReverb,
                                 usbInputVolume)

    expect(MixerSettings.fromObject(ms.asObject())).toEqual(ms)
  })

  test('.getObjectProperties', () => {
    expect(MixerSettings.getObjectProperties()).toEqual(Object.keys(new MixerSettings().asObject()))
  })
})
