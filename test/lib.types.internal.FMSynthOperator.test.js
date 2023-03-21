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

const { VERSION_2_5_0 } = require('../lib/constants')
const FMSynthOperator = require('../lib/types/internal/FMSynthOperator')

describe('FMSynthOperator tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const op = new FMSynthOperator()

      expect(op.feedback).toEqual(0x00)
      expect(op.level).toEqual(0x80)
      expect(op.modA).toEqual(0x00)
      expect(op.modB).toEqual(0x00)
      expect(op.ratio).toEqual(0x01)
      expect(op.ratioFine).toEqual(0x00)
      expect(op.shape).toEqual(0x00)
    })

    test('arguments', () => {
      const feedback = 0x01
      const level = 0x02
      const modA = 0x03
      const modB = 0x04
      const ratio = 0x05
      const ratioFine = 0x06
      const shape = 0x07
      const op = new FMSynthOperator(feedback, level, modA, modB, ratio, ratioFine, shape)

      expect(op.feedback).toEqual(feedback)
      expect(op.level).toEqual(level)
      expect(op.modA).toEqual(modA)
      expect(op.modB).toEqual(modB)
      expect(op.ratio).toEqual(ratio)
      expect(op.ratioFine).toEqual(ratioFine)
      expect(op.shape).toEqual(shape)
    })
  })

  test('#asObject', () => {
    expect(new FMSynthOperator().asObject()).toEqual({
      feedback: 0x00,
      level: 0x80,
      modA: 0x00,
      modB: 0x00,
      ratio: 0x01,
      ratioFine: 0x00,
      shape: 0x00
    })
  })

  describe('#shapeToStr', () => {
    function createFMSynthOperator (shape) {
      return new FMSynthOperator(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, shape)
    }

    test('M8 version < 2.7.0', () => {
      ;[
        'SIN', // 0x00
        'SW2', // 0x01
        'SW3', // 0x02
        'SW4', // 0x03
        'SW5', // 0x04
        'SW6', // 0x05
        'TRI', // 0x06
        'SAW', // 0x07
        'SQR', // 0x08
        'PUL', // 0x09
        'IMP', // 0x0A
        'NOI', // 0x0B
        'UNK'
      ].forEach((name, shape) => {
        expect(createFMSynthOperator(shape).shapeToStr(VERSION_2_5_0)).toEqual(name)
      })
    })

    test('M8 version < 2.7.0', () => {
      ;[
        'SIN', // 0x00
        'SW2', // 0x01
        'SW3', // 0x02
        'SW4', // 0x03
        'SW5', // 0x04
        'SW6', // 0x05
        'TRI', // 0x06
        'SAW', // 0x07
        'SQR', // 0x08
        'PUL', // 0x09
        'IMP', // 0x0A
        'NOI', // 0x0B
        'NLP', // 0x0C (Not available prior to 2.7.0)
        'NHP', // 0x0D (Not available prior to 2.7.0)
        'NBP', // 0x0E (Not available prior to 2.7.0)
        'CLK', // 0x0F (Not available prior to 2.7.0)
        'UNK'
      ].forEach((name, shape) => {
        expect(createFMSynthOperator(shape).shapeToStr()).toEqual(name)
      })
    })
  })

  test('.fromObject', () => {
    const origFilterParams = new FMSynthOperator(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)

    expect(FMSynthOperator.fromObject(origFilterParams.asObject())).toEqual(origFilterParams)
  })

  test('.getObjectProperties', () => {
    const expectedKeys = Object.keys(new FMSynthOperator().asObject()).concat('shapeStr').sort()

    expect(FMSynthOperator.getObjectProperties().sort()).toEqual(expectedKeys)
  })
})
