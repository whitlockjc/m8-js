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
 * Represents an M8 file.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types/internal
 */
class Serializable {
  // The reason byte serialization is not in Serializable is because many of the M8 types are not a sequential array of
  // bytes, and representing each type via asBytes could become confusing. The only time byte serialization matters is
  // when working with M8 files at the byte level and that only happens with raw M8 files.

  /**
   * Returns the M8 file as a JavaScript Object.
   *
   * @param {Boolean} [skipHeader=false] - Whether or not to include the M8 file's header in the returneed bytes
   *
   * @returns {Object}
   *
   * @abstract
   */
  /* istanbul ignore next */
  // eslint-disable-next-line no-unused-vars
  asObject (skipHeader) {
    throw new TypeError('asObject must be implemented by extending class')
  }

  /**
   * Returns an implementation of Serializable based on the JavaScript Object.
   *
   * @param {Object} object - The M8 file's JavaScript Object representation
   *
   * @returns {module:m8-js/lib/types.Serializable}
   *
   * @abstract
   */
  /* istanbul ignore next */
  // eslint-disable-next-line no-unused-vars
  static fromObject (object) {
    throw new TypeError('fromObject must be implemented by extending class')
  }

  /**
   * Returns the known JavaScript Object properties.
   *
   * @returns {Array<String>}
   *
   * @abstract
   */
  static getObjectProperties () {
    throw new TypeError('getObjectProperties must be implemented by extending class')
  }
}

// Exports
module.exports = Serializable
