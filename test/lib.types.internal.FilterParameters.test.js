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

const { InstrumentKinds, VERSION_2_5_0 } = require('../lib/constants')
const FilterParameters = require('../lib/types/internal/FilterParameters')

describe('FilterParamters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const filterParams = new FilterParameters()

      expect(filterParams.cutoff).toEqual(0xFF)
      expect(filterParams.res).toEqual(0x00)
      expect(filterParams.type).toEqual(0x00)
    })

    test('arguments', () => {
      const cutoff = 0x01
      const res = 0x02
      const type = 0x03
      const filterParams = new FilterParameters(cutoff, res, type)

      expect(filterParams.cutoff).toEqual(cutoff)
      expect(filterParams.res).toEqual(res)
      expect(filterParams.type).toEqual(type)
    })
  })

  test('#asObject', () => {
    expect(new FilterParameters().asObject()).toEqual({
      cutoff: 0xFF,
      res: 0x00,
      type: 0x00
    })
  })

  describe('#typeToStr', () => {
    function createFilterParameters (type) {
      return new FilterParameters(0x01, 0x02, type)
    }

    describe('WAVSYNTH', () => {
      test('M8 version < 2.5.1', () => {
        ;[
          'OFF', // 0x00
          'LOWPASS', // 0x01
          'HIGHPASS', // 0x02
          'BANDPASS', // 0x03
          'BANDSTOP', // 0x04
          'WAV LP', // 0x05
          'WAV HP', // 0x06
          'WAV BP', // 0x07
          'WAV BS', // 0x08
          'UNK (09)' // 0x09
        ].forEach((name, type) => {
          expect(createFilterParameters(type).typeToStr(InstrumentKinds.WAVSYNTH, VERSION_2_5_0)).toEqual(name)
        })
      })

      test('M8 version >= 2.5.1', () => {
        ;[
          'OFF', // 0x00
          'LOWPASS', // 0x01
          'HIGHPASS', // 0x02
          'BANDPASS', // 0x03
          'BANDSTOP', // 0x04
          'LP>HP', // 0x05
          'WAV LP', // 0x06
          'WAV HP', // 0x07
          'WAV BP', // 0x08
          'WAV BS', // 0x09
          'UNK (0A)' // 0x0A
        ].forEach((name, type) => {
          expect(createFilterParameters(type).typeToStr(InstrumentKinds.WAVSYNTH)).toEqual(name)
        })
      })
    })

    test('FMSYNTH/MACROSYNTH/MIDIOUT/SAMPLER', () => {
      ;[
        InstrumentKinds.FMSYNTH,
        InstrumentKinds.MACROSYNTH,
        InstrumentKinds.MIDIOUT,
        InstrumentKinds.SAMPLER
      ].forEach((kind) => {
        ;[
          'OFF', // 0x00
          'LOWPASS', // 0x01
          'HIGHPASS', // 0x02
          'BANDPASS', // 0x03
          'BANDSTOP', // 0x04
          'LP>HP', // 0x05
          'UNK (06)'
        ].forEach((name, type) => {
          expect(createFilterParameters(type).typeToStr(kind)).toEqual(name)
        })
      })
    })
  })

  test('.fromObject', () => {
    const origFilterParams = new FilterParameters(0x01, 0x02, 0x03)

    expect(FilterParameters.fromObject(origFilterParams.asObject())).toEqual(origFilterParams)
  })

  test('.getObjectProperties', () => {
    const expectedKeys = Object.keys(new FilterParameters().asObject()).concat('typeStr').sort()

    expect(FilterParameters.getObjectProperties().sort()).toEqual(expectedKeys)
  })
})
