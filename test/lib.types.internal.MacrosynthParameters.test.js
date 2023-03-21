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

const { VERSION_2_5_1 } = require('../lib/constants')
const MacrosynthParameters = require('../lib/types/internal/MacrosynthParameters')

describe('MacrosynthParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const macroSynthParams = new MacrosynthParameters()

      expect(macroSynthParams.color).toEqual(0x80)
      expect(macroSynthParams.degrade).toEqual(0x00)
      expect(macroSynthParams.redux).toEqual(0x00)
      expect(macroSynthParams.shape).toEqual(0x00)
      expect(macroSynthParams.timbre).toEqual(0x80)
    })

    test('arguments', () => {
      const color = 0x01
      const degrade = 0x02
      const redux = 0x03
      const shape = 0x04
      const timbre = 0x05
      const macroSynthParams = new MacrosynthParameters(color, degrade, redux, shape, timbre)

      expect(macroSynthParams.color).toEqual(color)
      expect(macroSynthParams.degrade).toEqual(degrade)
      expect(macroSynthParams.redux).toEqual(redux)
      expect(macroSynthParams.shape).toEqual(shape)
      expect(macroSynthParams.timbre).toEqual(timbre)
    })
  })

  test('#asObject', () => {
    expect(new MacrosynthParameters().asObject()).toEqual({
      color: 0x80,
      degrade: 0x00,
      redux: 0x00,
      shape: 0x00,
      timbre: 0x80
    })
  })

  describe('#shapeToStr', () => {
    function createMacrosynthParams (shape) {
      return new MacrosynthParameters(0x01, 0x02, 0x03, shape, 0x05)
    }

    test('M8 version < 2.6.0', () => {
      ;[
        'CSAW', // 0x00
        'MORPH', // 0x01
        'SAW SQUARE', // 0x02
        'SINE TRIANGLE', // 0x03
        'BUZZ', // 0x04
        'SQUARE SUB', // 0x05
        'SAW SUB', // 0x06
        'SQUARE SYNC', // 0x07
        'SAW SYNC', // 0x08
        'TRIPLE SAW', // 0x09
        'TRIPLE SQUARE', // 0x0A
        'TRIPLE TRIANGLE', // 0x0B
        'TRIPLE SIN', // 0x0C
        'TRIPLE RNG', // 0x0D
        'SAW SWARM', // 0x0E
        'SAW COMB', // 0x0F
        'TOY', // 0x10
        'DIGITAL FILTER LP', // 0x11
        'DIGITAL FILTER PK', // 0x12
        'DIGITAL FILTER BP', // 0x13
        'DIGITAL FILTER HP', // 0x14
        'VOSIM', // 0x15
        'VOWEL', // 0x16
        'VOWEL FOF', // 0x17
        'HARMONICS', // 0x18
        'FM', // 0x19
        'FEEDBACK FM', // 0x1A
        'CHAOTIC FEEDBACK FM', // 0x1B
        'PLUCKED', // 0x1C
        'BOWED', // 0x1D
        'BLOWN', // 0x1E
        'STRUCK BELL', // 0x1F
        'STRUCK DRUM', // 0x20
        'KICK', // 0x21
        'CYMBAL', // 0x22
        'SNARE', // 0x23
        'WAVETABLES', // 0x24
        'WAVE MAP', // 0x25
        'WAV LINE', // 0x26
        'WAV PARAPHONIC', // 0x27
        'FILTERED NOISE', // 0x28
        'TWIN PEAKS NOISE', // 0x29
        'CLOCKED NOISE', // 0x2A
        'GRANULAR CLOUD', // 0x2B
        'PARTICLE NOISE', // 0x2C
        'UNK (2D)'
      ].forEach((name, shape) => {
        expect(createMacrosynthParams(shape).shapeToStr(VERSION_2_5_1)).toEqual(name)
      })
    })

    test('M8 version >= 2.6.0', () => {
      ;[
        'CSAW', // 0x00
        'MORPH', // 0x01
        'SAW SQUARE', // 0x02
        'SINE TRIANGLE', // 0x03
        'BUZZ', // 0x04
        'SQUARE SUB', // 0x05
        'SAW SUB', // 0x06
        'SQUARE SYNC', // 0x07
        'SAW SYNC', // 0x08
        'TRIPLE SAW', // 0x09
        'TRIPLE SQUARE', // 0x0A
        'TRIPLE TRIANGLE', // 0x0B
        'TRIPLE SIN', // 0x0C
        'TRIPLE RNG', // 0x0D
        'SAW SWARM', // 0x0E
        'SAW COMB', // 0x0F
        'TOY', // 0x10
        'DIGITAL FILTER LP', // 0x11
        'DIGITAL FILTER PK', // 0x12
        'DIGITAL FILTER BP', // 0x13
        'DIGITAL FILTER HP', // 0x14
        'VOSIM', // 0x15
        'VOWEL', // 0x16
        'VOWEL FOF', // 0x17
        'HARMONICS', // 0x18
        'FM', // 0x19
        'FEEDBACK FM', // 0x1A
        'CHAOTIC FEEDBACK FM', // 0x1B
        'PLUCKED', // 0x1C
        'BOWED', // 0x1D
        'BLOWN', // 0x1E
        'FLUTED', // 0x1F (Not available prior to 2.6.0)
        'STRUCK BELL', // 0x20
        'STRUCK DRUM', // 0x21
        'KICK', // 0x22
        'CYMBAL', // 0x23
        'SNARE', // 0x24
        'WAVETABLES', // 0x25
        'WAVE MAP', // 0x26
        'WAV LINE', // 0x27
        'WAV PARAPHONIC', // 0x28
        'FILTERED NOISE', // 0x29
        'TWIN PEAKS NOISE', // 0x2A
        'CLOCKED NOISE', // 0x2B
        'GRANULAR CLOUD', // 0x2C
        'PARTICLE NOISE', // 0x2D
        'DIGITAL MOD', // 0x2E (Not available prior to 2.6.0)
        'MORSE NOISE', // 0x2F (Not available prior to 2.6.0)
        'UNK (30)'
      ].forEach((name, shape) => {
        expect(createMacrosynthParams(shape).shapeToStr()).toEqual(name)
      })
    })
  })

  test('.fromObject', () => {
    const macroSynthParams = new MacrosynthParameters(0x01, 0x02, 0x03, 0x04, 0x05)

    expect(MacrosynthParameters.fromObject(macroSynthParams.asObject())).toEqual(macroSynthParams)
  })

  test('.getObjectProperties', () => {
    const expectedKeys = Object.keys(new MacrosynthParameters().asObject()).concat('shapeStr').sort()

    expect(MacrosynthParameters.getObjectProperties()).toEqual(expectedKeys)
  })
})
