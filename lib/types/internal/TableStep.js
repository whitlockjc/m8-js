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

const FX = require('./FX')
const Serializable = require('./Serializable')

/**
 * Represents a Step (within a Table).
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal` `
 */
class TableStep extends Serializable {
  /** @member {Array<module:m8-js/lib/types.FX>} */
  fx
  /** @member {Number} */
  transpose
  /** @member {Number} */
  volume

  /**
   * Creates a Phrase.
   *
   * @param {Array<module:m8-js/lib/types/internal.FX>} [fx]
   * @param {Number} [transpose=0x00]
   * @param {Number} [volume=0xFF]
   */
  constructor (fx, transpose = 0x00, volume = 0xFF) {
    super()

    // eslint-disable-next-line no-unused-vars
    this.fx = Array.from({ length: 3 }, (e, i) => {
      let value = fx?.[i]

      if (typeof value === 'undefined' || value.constructor.name !== 'FX') {
        value = new FX()
      }

      return value
    })
    this.transpose = transpose
    this.volume = volume
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      fx: this.fx.map((fx) => fx.asObject()),
      transpose: this.transpose,
      volume: this.volume
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new TableStep(object?.fx?.map((fx) => FX.fromObject(fx)), object?.transpose, object?.volume)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['fx', 'transpose', 'volume']
  }
}

module.exports = TableStep
