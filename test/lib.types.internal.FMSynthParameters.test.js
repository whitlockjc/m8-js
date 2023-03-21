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

const FMSynthOperator = require('../lib/types/internal/FMSynthOperator')
const FMSynthParameters = require('../lib/types/internal/FMSynthParameters')

describe('FMSynthParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const fmSynthParams = new FMSynthParameters()

      expect(fmSynthParams.algo).toEqual(0x00)
      expect(fmSynthParams.mod1).toEqual(0x00)
      expect(fmSynthParams.mod2).toEqual(0x00)
      expect(fmSynthParams.mod3).toEqual(0x00)
      expect(fmSynthParams.mod4).toEqual(0x00)
      expect(fmSynthParams.operators).toEqual([
        new FMSynthOperator(),
        new FMSynthOperator(),
        new FMSynthOperator(),
        new FMSynthOperator()
      ])
    })

    test('arguments', () => {
      const algo = 0x01
      const mod1 = 0x02
      const mod2 = 0x03
      const mod3 = 0x04
      const mod4 = 0x05
      const op = new FMSynthOperator(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
      const ops = [op]
      const fmSynthParams = new FMSynthParameters(algo, mod1, mod2, mod3, mod4, ops)

      expect(fmSynthParams.algo).toEqual(algo)
      expect(fmSynthParams.mod1).toEqual(mod1)
      expect(fmSynthParams.mod2).toEqual(mod2)
      expect(fmSynthParams.mod3).toEqual(mod3)
      expect(fmSynthParams.mod4).toEqual(mod4)
      expect(fmSynthParams.operators).toEqual([
        op,
        new FMSynthOperator(),
        new FMSynthOperator(),
        new FMSynthOperator()
      ])
    })
  })

  test('#algoToStr', () => {
    ;[
      'A>B>C>D', // 0x00
      '[A+B]>C>D', // 0x01
      '[A>B+C]>D', // 0x02
      '[A>B+A>C]>D', // 0x03
      '[A+B+C]>D', // 0x04
      '[A>B>C]+D', // 0x05
      '[A>B>C]+[A>B>D]', // 0x06
      '[A>B]+[C>D]', // 0x07
      '[A>B]+[A>C]+[A>D]', // 0x08
      '[A>B]+[A>C]+D', // 0x09
      '[A>B]+C+D', // 0x0A
      'A+B+C+D', // 0x0B
      'UNK (0C)'
    ].forEach((name, algo) => {
      expect(new FMSynthParameters(algo).algoToStr()).toEqual(name)
    })
  })

  test('#asObject', () => {
    expect(new FMSynthParameters().asObject()).toEqual({
      algo: 0x00,
      algoStr: 'A>B>C>D',
      mod1: 0x00,
      mod1Str: '-----',
      mod2: 0x00,
      mod2Str: '-----',
      mod3: 0x00,
      mod3Str: '-----',
      mod4: 0x00,
      mod4Str: '-----',
      operators: [
        new FMSynthOperator().asObject(),
        new FMSynthOperator().asObject(),
        new FMSynthOperator().asObject(),
        new FMSynthOperator().asObject()
      ]
    })
  })

  test('#modToStr', () => {
    ;[
      '-----', // 0x00
      '1>LEV', // 0x01
      '2>LEV', // 0x02
      '3>LEV', // 0x03
      '4>LEV', // 0x04
      '1>RAT', // 0x05
      '2>RAT', // 0x06
      '3>RAT', // 0x07
      '4>RAT', // 0x08
      '1>PIT', // 0x09
      '2>PIT', // 0x0A
      '3>PIT', // 0x0B
      '4>PIT', // 0x0C
      '1>FBK', // 0x0D
      '2>FBK', // 0x0E
      '3>FBK', // 0x0F
      '4>FBK', // 0x10
      'U(11)'
    ].forEach((name, mod) => {
      const fmSynthParams = new FMSynthParameters(0x00, mod, mod, mod, mod)

      expect(fmSynthParams.modToStr(fmSynthParams.mod1)).toEqual(name)
      expect(fmSynthParams.modToStr(fmSynthParams.mod2)).toEqual(name)
      expect(fmSynthParams.modToStr(fmSynthParams.mod3)).toEqual(name)
      expect(fmSynthParams.modToStr(fmSynthParams.mod4)).toEqual(name)
    })
  })

  test('.fromObject', () => {
    const op = new FMSynthOperator(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)
    const ops = [op]
    const origAmpParams = new FMSynthParameters(0x01, 0x02, 0x03, 0x04, 0x05, ops)

    expect(FMSynthParameters.fromObject(origAmpParams.asObject())).toEqual(origAmpParams)
  })

  test('.getObjectProperties', () => {
    expect(FMSynthParameters.getObjectProperties()).toEqual(Object.keys(new FMSynthParameters().asObject()))
  })
})
