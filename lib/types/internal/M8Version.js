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

const Serializable = require('./Serializable')

/**
 * M8 version.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class M8Version extends Serializable {
  /** @member {Number} */
  majorVersion
  /** @member {Number} */
  minorVersion
  /** @member {Number} */
  patchVersion

  /**
   * Creates an M8 version.
   *
   * @param {Number} majorVersion
   * @param {Number} minorVersion
   * @param {Number} patchVersion
   */
  constructor (majorVersion, minorVersion, patchVersion) {
    if (typeof majorVersion === 'undefined') {
      throw new TypeError('majorVersion must be provided')
    } else if (typeof majorVersion !== 'number') {
      throw new TypeError('majorVersion must be a Number')
    } else if (typeof minorVersion === 'undefined') {
      throw new TypeError('minorVersion must be provided')
    } else if (typeof minorVersion !== 'number') {
      throw new TypeError('minorVersion must be a Number')
    } else if (typeof patchVersion === 'undefined') {
      throw new TypeError('patchVersion must be provided')
    } else if (typeof patchVersion !== 'number') {
      throw new TypeError('patchVersion must be a Number')
    }

    super()

    this.majorVersion = majorVersion
    this.minorVersion = minorVersion
    this.patchVersion = patchVersion
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      majorVersion: this.majorVersion,
      minorVersion: this.minorVersion,
      patchVersion: this.patchVersion
    }
  }

  /**
   * Compares two M8 versions and returns -1 if this < other, 1 if this > other and 0 of this === other.
   *
   * @param {module:m8-js/lib/types/internal.M8Version} other - The second M8 version to compare
   *
   * @returns {Number}
   */
  compare (other) {
    if (this.majorVersion > other.majorVersion) {
      return 1
    } else if (this.majorVersion < other.majorVersion) {
      return -1
    } else {
      if (this.minorVersion > other.minorVersion) {
        return 1
      } else if (this.minorVersion < other.minorVersion) {
        return -1
      } else {
        if (this.patchVersion > other.patchVersion) {
          return 1
        } else if (this.patchVersion < other.patchVersion) {
          return -1
        } else {
          return 0
        }
      }
    }
  }

  /**
   * Returns a String representation of the M8 version.
   *
   * @returns {String}
   */
  toString () {
    return `${this.majorVersion}.${this.minorVersion}.${this.patchVersion}`
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new M8Version(object?.majorVersion, object?.minorVersion, object?.patchVersion)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['majorVersion', 'minorVersion', 'patchVersion']
  }
}

// Exports
module.exports = M8Version
