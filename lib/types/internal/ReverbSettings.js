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
 * Represents the Reverb Settings.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class ReverbSettings extends Serializable {
  /** @member {Number} */
  damping
  /** @member {Number} */
  filterHP
  /** @member {Number} */
  filterLP
  /** @member {Number} */
  modDepth
  /** @member {Number} */
  modFreq
  /** @member {Number} */
  size
  /** @member {Number} */
  width

  /**
   * Creates a Reverb Settings.
   *
   * @param {Number} [damping=0xC0]
   * @param {Number} [filterHP=0x10]
   * @param {Number} [filterLP=0xE0]
   * @param {Number} [modDepth=0x10]
   * @param {Number} [modFreq=0xFF]
   * @param {Number} [size=0xFF]
   * @param {Number} [width=0xFF]
   */
  constructor (damping = 0xC0, filterHP = 0x10, filterLP = 0xE0, modDepth = 0x10, modFreq = 0xFF, size = 0xFF,
               width = 0xFF) {
    super()

    this.damping = damping
    this.filterHP = filterHP
    this.filterLP = filterLP
    this.modDepth = modDepth
    this.modFreq = modFreq
    this.size = size
    this.width = width
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      damping: this.damping,
      filterHP: this.filterHP,
      filterLP: this.filterLP,
      modDepth: this.modDepth,
      modFreq: this.modFreq,
      size: this.size,
      width: this.width
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new ReverbSettings(object?.damping, object?.filterHP, object?.filterLP, object?.modDepth, object?.modFreq,
                              object?.size, object?.width)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['damping', 'filterHP', 'filterLP', 'modDepth', 'modFreq', 'size', 'width']
  }
}

module.exports = ReverbSettings
