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
 * Represents the Chorus Settings.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class ChorusSettings extends Serializable {
  /** @member {Number} */
  modDepth
  /** @member {Number} */
  modFreq
  /** @member {Number} */
  reverbSend
  /** @member {Number} */
  width

  /**
   * Creates a Chorus Settings.
   *
   * @param {Number} [modDepth=0x40]
   * @param {Number} [modFreq=0x80]
   * @param {Number} [reverbSend=0x00]
   * @param {Number} [width=0xFF]
   */
  constructor (modDepth = 0x40, modFreq = 0x80, reverbSend = 0x00, width = 0xFF) {
    super()

    this.modDepth = modDepth
    this.modFreq = modFreq
    this.reverbSend = reverbSend
    this.width = width
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      modDepth: this.modDepth,
      modFreq: this.modFreq,
      reverbSend: this.reverbSend,
      width: this.width
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new ChorusSettings(object?.modDepth, object?.modFreq, object?.reverbSend, object?.width)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['modDepth', 'modFreq', 'reverbSend', 'width']
  }
}

module.exports = ChorusSettings
