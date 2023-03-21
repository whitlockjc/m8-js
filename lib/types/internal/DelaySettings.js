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
 * Represents the Delay Settings.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class DelaySettings extends Serializable {
  /** @member {Number} */
  feedback
  /** @member {Number} */
  filterHP
  /** @member {Number} */
  filterLP
  /** @member {Number} */
  reverbSend
  /** @member {Number} */
  timeL
  /** @member {Number} */
  timeR
  /** @member {Number} */
  width

  /**
   * Creates a Chorus Settings.
   *
   * @param {Number} [feedback = 0x80]
   * @param {Number} [filterHP = 0x40]
   * @param {Number} [filterLP = 0xFF]
   * @param {Number} [reverbSend = 0x00]
   * @param {Number} [timeL = 0x30]
   * @param {Number} [timeR = 0x30]
   * @param {Number} [width = 0xFF]
   */
  constructor (feedback = 0x80, filterHP = 0x40, filterLP = 0xFF, reverbSend = 0x00, timeL = 0x30, timeR = 0x30,
               width = 0xFF) {
    super()

    this.feedback = feedback
    this.filterHP = filterHP
    this.filterLP = filterLP
    this.reverbSend = reverbSend
    this.timeL = timeL
    this.timeR = timeR
    this.width = width
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      feedback: this.feedback,
      filterHP: this.filterHP,
      filterLP: this.filterLP,
      reverbSend: this.reverbSend,
      timeL: this.timeL,
      timeR: this.timeR,
      width: this.width
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new DelaySettings(object?.feedback, object?.filterHP, object?.filterLP, object?.reverbSend, object?.timeL,
                             object?.timeR, object?.width)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['feedback', 'filterHP', 'filterLP', 'reverbSend', 'timeL', 'timeR', 'width']
  }
}

module.exports = DelaySettings
