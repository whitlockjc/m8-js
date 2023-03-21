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
 * Represents a Note Interval.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class NoteInterval extends Serializable {
  /** @member {Boolean} */
  enabled
  /** @member {Number} */
  offsetA
  /** @member {Number} */
  offsetB

  /**
   * Creates a Note Interval.
   *
   * @param {Boolean} [enabled=true] - Whether or not the note interval is enabled
   * @param {Number} [offsetA=0x00] - The offset A
   * @param {Number} [offsetB=0x00] - The offset B
   */
  constructor (enabled = true, offsetA = 0x00, offsetB = 0x00) {
    super()

    this.enabled = enabled
    this.offsetA = offsetA
    this.offsetB = offsetB
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      enabled: this.enabled,
      offsetA: this.offsetA,
      offsetB: this.offsetB,
      offsetStr: this.offsetToStr()
    }
  }

  /**
   * String representation of the offset.
   *
   * @returns {String}
   */
  offsetToStr () {
    let str = ''

    let total

    if (this.offsetA >= this.offsetB) {
      total = this.offsetA + (this.offsetB * 256)
    } else {
      total = ((this.offsetB - 256) * 256) + this.offsetA
    }

    if (total < 0) {
      str += '-'
    }

    total = Math.abs(total)

    str += Math.trunc(total / 100).toString().padStart(2, 0)
    str += '.'
    str += (total % 100).toString().padStart(2, 0)

    return str
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new NoteInterval(object?.enabled, object?.offsetA, object?.offsetB)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['enabled', 'offsetA', 'offsetB', 'offsetStr']
  }
}

module.exports = NoteInterval
