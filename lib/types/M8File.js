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

const { toM8HexStr } = require('../helpers')
const { M8FileHeader, M8FileTypes } = require('../constants')

/**
 * Represents an M8 file.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class M8File {
  /** @member {Number} */
  m8FileType
  /** @member {module:m8-js/lib/types.M8Version} */
  m8FileVersion

  /**
   * Constructs an M8 file.
   *
   * @param {Number} m8FileType - The raw M8 file type
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the M8 file
   */
  constructor (m8FileType, m8FileVersion) {
    if (typeof m8FileType === 'undefined') {
      throw new TypeError('m8FileType is required')
    }

    if (typeof m8FileVersion === 'undefined') {
      throw new TypeError('m8FileVersion is required')
    }

    this.m8FileType = m8FileType
    this.m8FileVersion = m8FileVersion
  }

  /**
   * Returns the M8 file metadata's bytes.
   *
   * @returns {Array<Number>}
   */
  getHeaderBytes () {
    const bytes = []

    // M8 file header
    bytes.push(...M8FileHeader)

    bytes.push(0x00)

    // M8 file version
    const majorBits = this.m8FileVersion.majorVersion === 0
      ? '0000'
      : this.m8FileVersion.majorVersion.toString(2)
    const minorBits = this.m8FileVersion.minorVersion === 0
      ? '0000'
      : this.m8FileVersion.minorVersion.toString(2).padStart(4, '0')
    const patchBits = this.m8FileVersion.patchVersion === 0
      ? '0000'
      : this.m8FileVersion.patchVersion.toString(2).padStart(4, '0')
    const rawM8Version = parseInt(majorBits + minorBits + patchBits, 2)

    bytes.push(rawM8Version & 0xFF)
    bytes.push((rawM8Version >> 8) & 0xFF)

    bytes.push(0x00)

    // M8 file type
    bytes.push(this.m8FileType)

    return bytes
  }

  /**
   * Returns the file type as string.
   *
   * @returns {String}
   */
  typeToStr () {
    switch (this.m8FileType) {
      case M8FileTypes.Song:
        return 'Song'
      case M8FileTypes.Instrument:
        return 'Instrument'
      case M8FileTypes.Theme:
        return 'Theme'
      case M8FileTypes.Scale:
        return 'Scale'
      default:
        return `Unknown (${toM8HexStr(this.m8FileType)})`
    }
  }

  /**
   * Returns the M8 file's bytes.
   *
   * @returns {Array<Number>}
   *
   * @abstract
   */
  /* istanbul ignore next */
  getBytes () {
    throw new TypeError('getBytes must be implemented by extending class')
  }

  /**
   * Returns an extension of M8File based on the raw M8 file bytes (after header).
   *
   * @param {Array<Number>} bytes - The M8 file's raw bytes
   *
   * @returns {module:m8-js/lib/types.M8File}
   *
   * @abstract
   */
  /* istanbul ignore next */
  // eslint-disable-next-line no-unused-vars
  static fromBytes (bytes) {
    throw new TypeError('fromBytes must be implemented by extending class')
  }
}

// Exports
module.exports = M8File
