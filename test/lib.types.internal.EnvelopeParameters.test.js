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

const EnvelopeParameters = require('../lib/types/internal/EnvelopeParameters')
const FMSynth = require('../lib/types/instruments/FMSynth')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const None = require('../lib/types/instruments/None')
const Sampler = require('../lib/types/instruments/Sampler')
const Wavsynth = require('../lib/types/instruments/Wavsynth')

describe('EnvelopeParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const envParams = new EnvelopeParameters()

      expect(envParams.amount).toEqual(0xFF)
      expect(envParams.attack).toEqual(0x00)
      expect(envParams.decay).toEqual(0x80)
      expect(envParams.dest).toEqual(0x00)
      expect(envParams.hold).toEqual(0x00)
      expect(envParams.retrigger).toEqual(0x00)
    })

    test('arguments', () => {
      const amount = 0x01
      const attack = 0x02
      const decay = 0x03
      const dest = 0x04
      const hold = 0x05
      const retrigger = 0x06
      const envParams = new EnvelopeParameters(amount, attack, decay, dest, hold, retrigger)

      expect(envParams.amount).toEqual(amount)
      expect(envParams.attack).toEqual(attack)
      expect(envParams.decay).toEqual(decay)
      expect(envParams.dest).toEqual(dest)
      expect(envParams.hold).toEqual(hold)
      expect(envParams.retrigger).toEqual(retrigger)
    })
  })

  test('#asObject', () => {
    expect(new EnvelopeParameters().asObject()).toEqual({
      amount: 0xFF,
      attack: 0x00,
      decay: 0x80,
      dest: 0x00,
      hold: 0x00,
      retrigger: 0x00
    })
  })

  describe('#destToStr', () => {
    function createEnvelopeParams (dest) {
      return new EnvelopeParameters(0x01, 0x02, 0x03, dest, 0x05, 0x06)
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
        expect(createEnvelopeParams(dest).destToStr(new FMSynth())).toEqual(name)
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
        expect(createEnvelopeParams(dest).destToStr(new Macrosynth())).toEqual(name)
      })
    })

    test('NONE', () => {
      expect(createEnvelopeParams(0x00).destToStr(new None())).toEqual('UNK (00)')
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
        expect(createEnvelopeParams(dest).destToStr(new Sampler())).toEqual(name)
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
        expect(createEnvelopeParams(dest).destToStr(new Wavsynth())).toEqual(name)
      })
    })
  })

  test('.fromObject', () => {
    const envParams = new EnvelopeParameters(0x01, 0x02, 0x03, 0x04, 0x05, 0x06)

    expect(EnvelopeParameters.fromObject(envParams.asObject())).toEqual(envParams)
  })

  test('.getObjectProperties', () => {
    // destStr is not included by default and only provided when exporting an Instrument in its entirety
    const expectedKeys = Object.keys(new EnvelopeParameters().asObject()).concat('destStr').sort()

    expect(EnvelopeParameters.getObjectProperties().sort()).toEqual(expectedKeys)
  })
})
