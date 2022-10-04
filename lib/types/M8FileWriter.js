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

const { LATEST_M8_VERSION, M8FileTypes } = require('../constants')
const { toM8HexStr } = require('../helpers')

/**
 * M8 File Writer.
 *
 * Note: This class is written purely to turn an M8 file in API form to bytes.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class M8FileWriter {
  /** @member {Array<Number>} */
  bytes
  /** @member {Number} */
  fileType
  /** @member {module:m8-js/lib/types.M8Version} */
  m8Version

  /**
   * Creates an M8 File Writer.
   *
   * @param {Number} fileType - The M8 file type
   * @param {module:m8-js/lib/types.M8Version} [m8Version] - The optional M8 version _(defaults to the latest version)_
   */
  constructor (fileType, m8Version) {
    if (typeof fileType === 'undefined') {
      throw new TypeError('fileType is required')
    }

    if (typeof m8Version === 'undefined') {
      m8Version = LATEST_M8_VERSION
    }

    this.fileType = fileType
    this.m8Version = m8Version

    // Start with 'M8VERSION' bytes
    this.bytes = [0x4D, 0x38, 0x56, 0x45, 0x52, 0x53, 0x49, 0x4F, 0x4E]

    this.bytes.push(0x00)

    const majorBits = m8Version.majorVersion === 0
      ? '0000'
      : m8Version.majorVersion.toString(2)
    const minorBits = m8Version.minorVersion === 0
      ? '0000'
      : m8Version.minorVersion.toString(2).padStart(4, '0')
    const patchBits = m8Version.patchVersion === 0
      ? '0000'
      : m8Version.patchVersion.toString(2).padStart(4, '0')
    const rawM8Version = parseInt(majorBits + minorBits + patchBits, 2)

    this.bytes.push(rawM8Version & 0xFF)
    this.bytes.push((rawM8Version >> 8) & 0xFF)

    this.bytes.push(0x00)

    // File type
    this.bytes.push(this.fileType)
  }

  /**
   * Returns the file type as string.
   *
   * @returns {String}
   */
  fileTypeToStr () {
    switch (this.fileType) {
      case M8FileTypes.Song:
        return 'Song'
      case M8FileTypes.Instrument:
        return 'Instrument'
      case M8FileTypes.Theme:
        return 'Theme'
      case M8FileTypes.Scale:
        return 'Scale'
      default:
        return `Unknown (${toM8HexStr(this.fileType)})`
    }
  }

  /**
   * Write the byte or bytes to the file's buffer.
   *
   * @param {Number|Array<Number>} byteOrBytes - The byte or bytes to write
   */
  write (byteOrBytes) {
    if (!Array.isArray(byteOrBytes)) {
      byteOrBytes = [byteOrBytes]
    }

    this.bytes.push(...byteOrBytes)
  }

  /**
   * Write the boolean to the file's buffer.
   *
   * @param {Boolean} bool - The boolean to write
   */
  writeBool (bool) {
    this.bytes.push(bool ? 0x01 : 0x00)
  }

  /**
   * Write the string to the file's buffer and pad the end with empty values when necessar.
   *
   * @param {String} theString - The string value to write
   * @param {Number} padTo - The number of bytes in storage to use regardless of string length
   */
  writeStr (theString, padTo) {
    for (let i = 0; i < padTo; i++) {
      const charCode = theString.charCodeAt(i)

      if (isNaN(charCode)) {
        this.write(0x00)
      } else {
        this.write(charCode)
      }
    }
  }
}

// Exports
module.exports = M8FileWriter
