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

const { toM8HexStr } = require('../../helpers')
const FMSynthOperator = require('./FMSynthOperator')
const Serializable = require('./Serializable')

const FMSYNTHAlgos = [
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
  'A+B+C+D' // 0x0B
]

const FMSYNTHMods = [
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
  '4>FBK' // 0x10
]

/**
 * Represents the FMSYNTH Instrument Parameters
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class FMSynthParameters extends Serializable {
  /** @member {Number} */
  algo
  /** @member {Number} */
  mod1
  /** @member {Number} */
  mod2
  /** @member {Number} */
  mod3
  /** @member {Number} */
  mod4
  /** @member {Array<module:m8-js/lib/types/internal.FMSynthOperator>} */
  operators

  /**
   * Create the FMSYNTH Instrument Parameters.
   *
   * @param {Number} [algo=0x00]
   * @param {Number} [mod1=0x00]
   * @param {Number} [mod2=0x00]
   * @param {Number} [mod3=0x00]
   * @param {Number} [mod4=0x00]
   * @param {Array<module:m8-js/lib/types/internal.FMSynthOperator>} [operators=[]]
   */
  constructor (algo = 0x00, mod1 = 0x00, mod2 = 0x00, mod3 = 0x00, mod4 = 0x00, operators = []) {
    super()

    this.algo = algo
    this.mod1 = mod1
    this.mod2 = mod2
    this.mod3 = mod3
    this.mod4 = mod4
    // eslint-disable-next-line no-unused-vars
    this.operators = Array.from({ length: 4 }, (e, i) => {
      let value = operators?.[i]

      if (typeof value === 'undefined' || value.constructor.name !== 'FMSynthOperator') {
        value = new FMSynthOperator()
      }

      return value
    })
  }

  /**
   * Returns a string representation of the algo
   *
   * @returns {String}
   */
  algoToStr () {
    const algoStr = FMSYNTHAlgos[this.algo]

    return typeof algoStr === 'undefined' ? `UNK (${toM8HexStr(this.algo)})` : algoStr
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      algo: this.algo,
      algoStr: this.algoToStr(),
      mod1: this.mod1,
      mod1Str: this.modToStr(this.mod1),
      mod2: this.mod2,
      mod2Str: this.modToStr(this.mod2),
      mod3: this.mod3,
      mod3Str: this.modToStr(this.mod3),
      mod4: this.mod4,
      mod4Str: this.modToStr(this.mod4),
      operators: this.operators.map((op) => op.asObject())
    }
  }

  /**
   * Returns a string representation of a modulator.
   *
   * @param {String} mod - The modulator
   *
   * @returns {String}
   */
  modToStr (mod) {
    const modStr = FMSYNTHMods[mod]

    return typeof modStr === 'undefined' ? `U(${toM8HexStr(mod)})` : modStr
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new FMSynthParameters(object?.algo, object?.mod1, object?.mod2, object?.mod3, object?.mod4,
                                 object?.operators?.map(FMSynthOperator.fromObject))
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['algo', 'algoStr', 'mod1', 'mod1Str', 'mod2', 'mod2Str', 'mod3', 'mod3Str', 'mod4', 'mod4Str', 'operators']
  }
}

module.exports = FMSynthParameters
