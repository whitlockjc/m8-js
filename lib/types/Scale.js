/* Copyright 2022 Jeremy Whitlock
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

/**
 * Represents a Note Interval.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class NoteInterval {
  /** @member {Boolean} */
  enabled
  /** @member {Number} */
  offsetA
  /** @member {Number} */
  offsetB

  /**
   * Creates a Note Interval.
   */
  constructor () {
    this.enabled = true
    this.offsetA = 0x00
    this.offsetB = 0x00
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
}

/**
 * Represents a Scale.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Scale {
  /** @member {String} */
  name
  /** @member {Array<module:m8-js/lib/types.NoteInterval>} */
  intervals

  /**
   * Creates a Scale.
   */
  constructor () {
    this.intervals = new Array(12)
    this.name = ''

    for (let i = 0; i < this.intervals.length; i++) {
      this.intervals[i] = new NoteInterval()
    }
  }
}

// Exports
module.exports = Scale
