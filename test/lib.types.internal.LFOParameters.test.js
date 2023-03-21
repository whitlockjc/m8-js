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

const FMSynth = require('../lib/types/instruments/FMSynth')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const None = require('../lib/types/instruments/None')
const Sampler = require('../lib/types/instruments/Sampler')
const Wavsynth = require('../lib/types/instruments/Wavsynth')
const LFOParameters = require('../lib/types/internal/LFOParameters')

describe('LFOParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const lfoParams = new LFOParameters()

      expect(lfoParams.amount).toEqual(0xFF)
      expect(lfoParams.dest).toEqual(0x00)
      expect(lfoParams.freq).toEqual(0x10)
      expect(lfoParams.retrigger).toEqual(0x00)
      expect(lfoParams.shape).toEqual(0x00)
      expect(lfoParams.triggerMode).toEqual(0x00)
    })

    test('arguments', () => {
      const amount = 0x01
      const dest = 0x02
      const freq = 0x03
      const retrigger = 0x04
      const shape = 0x05
      const triggerMode = 0x06
      const lfoParams = new LFOParameters(amount, dest, freq, retrigger, shape, triggerMode)

      expect(lfoParams.amount).toEqual(amount)
      expect(lfoParams.dest).toEqual(dest)
      expect(lfoParams.freq).toEqual(freq)
      expect(lfoParams.retrigger).toEqual(retrigger)
      expect(lfoParams.shape).toEqual(shape)
      expect(lfoParams.triggerMode).toEqual(triggerMode)
    })
  })

  test('#asObject', () => {
    expect(new LFOParameters().asObject()).toEqual({
      amount: 0xFF,
      dest: 0x00,
      freq: 0x10,
      retrigger: 0x00,
      shape: 0x00,
      shapeStr: 'TRI',
      triggerMode: 0x00,
      triggerModeStr: 'FREE'
    })
  })

  describe('#destToStr', () => {
    function createLFOParams (dest) {
      return new LFOParameters(0x01, dest, 0x03, 0x04, 0x05, 0x06)
    }

    test('FMSYNTH', () => {
      ;[
        'OFF', // 0x00
        'VOLUME', // 0x01
        'PITCH', // 0x02
        'MOD 1', // 0x03
        'MOD 2', // 0x04
        'MOD 3', // 0x05
        'MOD 4', // 0x06
        'CUTOFF', // 0x07
        'RES', // 0x08
        'AMP', // 0x09
        'PAN', // 0x0A
        'UNK (0B)'
      ].forEach((name, dest) => {
        expect(createLFOParams(dest).destToStr(new FMSynth())).toEqual(name)
      })
    })

    test('MACROSYNTH', () => {
      ;[
        'OFF', // 0x00
        'VOLUME', // 0x01
        'PITCH', // 0x02
        'TIMBRE', // 0x03
        'COLOR', // 0x04
        'DEGRADE', // 0x05
        'REDUX', // 0x06
        'CUTOFF', // 0x07
        'RES', // 0x08
        'AMP', // 0x09
        'PAN', // 0x0A
        'UNK (0B)'
      ].forEach((name, dest) => {
        expect(createLFOParams(dest).destToStr(new Macrosynth())).toEqual(name)
      })
    })

    test('NONE', () => {
      expect(createLFOParams(0x00).destToStr(new None())).toEqual('UNK (00)')
    })

    test('SAMPLER', () => {
      ;[
        'OFF', // 0x00
        'VOLUME', // 0x01
        'PITCH', // 0x02
        'LOOP ST', // 0x03
        'LENGTH', // 0x04
        'DEGRADE', // 0x05
        'CUTOFF', // 0x06
        'RES', // 0x07
        'AMP', // 0x08
        'PAN', // 0x09
        'UNK (0A)'
      ].forEach((name, dest) => {
        expect(createLFOParams(dest).destToStr(new Sampler())).toEqual(name)
      })
    })

    test('WAVSYNTH', () => {
      ;[
        'OFF', // 0x00
        'VOLUME', // 0x01
        'PITCH', // 0x02
        'SIZE', // 0x03
        'MULT', // 0x04
        'WARP', // 0x05
        'MIRROR', // 0x06
        'CUTOFF', // 0x07
        'RES', // 0x08
        'AMP', // 0x09
        'PAN', // 0x0A
        'UNK (0B)'
      ].forEach((name, dest) => {
        expect(createLFOParams(dest).destToStr(new Wavsynth())).toEqual(name)
      })
    })
  })

  test('#shapeToStr', () => {
    ;[
      'TRI', // 0x00
      'SIN', // 0x01
      'RAMP DN', // 0x02
      'RAMP UP', // 0x03
      'EXP DN', // 0x04
      'EXP UP', // 0x05
      'SQU DN', // 0x06
      'SQU UP', // 0x07
      'RANDOM', // 0x08
      'DRUNK', // 0x09
      'TRI T', // 0x0A
      'SIN T', // 0x0B
      'RAMPD T', // 0x0C
      'RAMPU T', // 0x0D
      'EXPD T', // 0x0E
      'EXPU T', // 0x0F
      'SQ. D T', // 0x10
      'SQ. U T', // 0x11
      'RAND T', // 0x12
      'DRNK T', // 0x13
      'UNK (14)'
    ].forEach((name, shape) => {
      expect(new LFOParameters(0x01, 0x02, 0x03, 0x04, shape).shapeToStr()).toEqual(name)
    })
  })

  test('#triggerModeToStr', () => {
    ;[
      'FREE', // 0x00
      'RETRIG', // 0x01
      'HOLD', // 0x02
      'ONCE', // 0x03
      'UNK (04)'
    ].forEach((name, triggerMode) => {
      expect(new LFOParameters(0x01, 0x02, 0x03, 0x04, 0x05, triggerMode).triggerModeToStr()).toEqual(name)
    })
  })

  test('.fromObject', () => {
    const envParams = new LFOParameters(0x01, 0x02, 0x03, 0x04, 0x05, 0x06)

    expect(LFOParameters.fromObject(envParams.asObject())).toEqual(envParams)
  })

  test('.getObjectProperties', () => {
    // destStr is not included by default and only provided when exporting an Instrument in its entirety
    const expectedKeys = Object.keys(new LFOParameters().asObject()).concat('destStr').sort()

    expect(LFOParameters.getObjectProperties().sort()).toEqual(expectedKeys)
  })
})
