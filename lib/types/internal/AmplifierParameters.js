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
const Serializable = require('./Serializable')

/**
 * Represents the Amplifier Parameters of an Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class AmplifierParameters extends Serializable {
  /** @member {Number} */
  amp
  /** @member {Number} */
  limit
  /** @static */
  static LimitNames = [
    'CLIP',
    'SIN',
    'FOLD',
    'WRAP',
    'POST',
    'POST: AD'
  ]

  /**
   * Create an Instrument's Filter Parameters.
   *
   * @param {Number} [amp=0x00]
   * @param {Number} [limit=0x00]
   */
  constructor (amp = 0x00, limit = 0x00) {
    super()

    this.amp = amp
    this.limit = limit
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      amp: this.amp,
      limit: this.limit,
      limitStr: this.limitToStr()
    }
  }

  /**
   * Returns a string representation of the limit type.
   *
   * @returns {String}
   */
  limitToStr () {
    const limitStr = AmplifierParameters.LimitNames[this.limit]

    return typeof limitStr === 'undefined' ? `UNK (${toM8HexStr(this.limit)})` : limitStr
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new AmplifierParameters(object?.amp, object?.limit)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['amp', 'limit', 'limitStr']
  }
}

module.exports = AmplifierParameters
