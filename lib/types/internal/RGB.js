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
 * Represents a Theme color as RGB.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types
 */
class RGB extends Serializable {
  /** @member {Number} */
  b
  /** @member {Number} */
  g
  /** @member {Number} */
  r

  /**
   * Constructs a Theme color.
   *
   * @param {Number} [r=0x00]
   * @param {Number} [g=0x00]
   * @param {Number} [b=0x00]
   */
  constructor (r = 0x00, g = 0x00, b = 0x00) {
    super()

    this.r = r
    this.g = g
    this.b = b
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      r: this.r,
      g: this.g,
      b: this.b
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new RGB(object?.r, object?.g, object?.b)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['r', 'g', 'b']
  }
}

module.exports = RGB
