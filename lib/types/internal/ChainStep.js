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

const Serializable = require('./Serializable')

/**
 * Represents a Chain step.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class ChainStep extends Serializable {
  /** @member {Number} */
  phrase
  /** @member {Number} */
  transpose

  /**
   * Creates a ChainStep.
   *
   * @param {Number} [phrase=0xFF]
   * @param {Number} [transpose=0x00]
   */
  constructor (phrase = 0xFF, transpose = 0x00) {
    super()

    this.phrase = phrase
    this.transpose = transpose
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      phrase: this.phrase,
      transpose: this.transpose
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new ChainStep(object?.phrase, object?.transpose)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['phrase', 'transpose']
  }
}

module.exports = ChainStep
