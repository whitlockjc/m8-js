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
 * Represents the Mixer Parameters of an Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class MixerParameters extends Serializable {
  /** @member {Number} */
  cho
  /** @member {Number} */
  del
  /** @member {Number} */
  dry
  /** @member {Number} */
  pan
  /** @member {Number} */
  rev

  /**
   * Create an Instrument's Mixer Parameters.
   *
   * @param {Number} [cho=0x00]
   * @param {Number} [del=0x00]
   * @param {Number} [dry=0xC0]
   * @param {Number} [pan=0x80]
   * @param {Number} [rev=0x00]
   */
  constructor (cho = 0x00, del = 0x00, dry = 0xC0, pan = 0x80, rev = 0x00) {
    super()

    this.cho = cho
    this.del = del
    this.dry = dry
    this.pan = pan
    this.rev = rev
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      cho: this.cho,
      del: this.del,
      dry: this.dry,
      pan: this.pan,
      rev: this.rev
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new MixerParameters(object?.cho, object?.del, object?.dry, object?.pan, object?.rev)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['cho', 'del', 'dry', 'pan', 'rev']
  }
}

module.exports = MixerParameters
