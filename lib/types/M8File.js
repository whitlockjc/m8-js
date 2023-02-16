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

const { M8FileHeader, M8FileTypes } = require('../constants')
const { toM8HexStr } = require('../helpers')

/**
 * Represents an M8 file.
 *
 * @class
 *
 * @augments module:m8-js/lib/types.Serializable
 * @memberof module:m8-js/lib/types
 */
class M8File extends Serializable {
  /** @private {module:m8-js/lib/types.M8FileReader} */
  #m8FileReader
  /** @private {Number} */
  #m8FileType
  /** @private {module:m8-js/lib/types.M8Version} */
  #m8FileVersion

  /**
   * Constructs an M8 file.
   *
   * @param {module:m8-js/lib/types.M8FileReader|Number} m8FileReaderOrType - The M8 file reader or M8 file type
   * @param {module:m8-js/lib/types.M8Version} [m8FileVersion] - The M8 version of the M8 file (required when
   * m8FileReaderOrType is not an M8FileReader)
   */
  constructor (m8FileReaderOrType, m8FileVersion) {
    super()

    if (typeof m8FileReaderOrType === 'undefined') {
      throw new TypeError('m8FileReaderOrType is required')
    }

    if (m8FileReaderOrType.constructor.name === 'M8FileReader') {
      this.#m8FileReader = m8FileReaderOrType
      this.#m8FileType = m8FileReaderOrType.fileType
      this.#m8FileVersion = m8FileReaderOrType.m8Version
    } else {
      if (typeof m8FileReaderOrType !== 'number') {
        throw new TypeError('m8FileReaderOrType must be an M8FileReader or a Number')
      } else if (typeof m8FileVersion === 'undefined') {
        throw new TypeError('m8FileVersion is required')
      } else if (m8FileVersion.constructor.name !== 'M8Version') {
        throw new TypeError('m8FileVersion must be an M8Version')
      }

      this.#m8FileType = m8FileReaderOrType
      this.#m8FileVersion = m8FileVersion
    }
  }

  get m8FileReader () {
    return this.#m8FileReader
  }

  get m8FileType () {
    return this.#m8FileType
  }

  get m8FileVersion () {
    return this.#m8FileVersion
  }

  /**
   * Returns the M8 file metadata's bytes.
   *
   * @returns {Array<Number>}
   */
  headerAsBytes () {
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
}

// Exports
module.exports = M8File
