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

const M8Version = require('./M8Version')
const { readUInt16LE, toM8HexStr } = require('../helpers')
const { M8FileTypes } = require('../constants')

/**
 * M8 file reader.
 *
 * Note: This class is written purely to read an M8 file from start to finish.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class M8FileReader {
  /** @member {Array<Number>} */
  bytes
  /** @member {Number} */
  cursor
  /** @member {Number} */
  fileType
  /** @member {module:m8-js/lib/types.M8Version} */
  m8Version
  /** @member {Array<Number>} */
  skipped

  /**
   * Creates an M8 File Reader.
   *
   * @param {Array<Number>} bytes - The raw M8 file content as bytes
   */
  constructor (bytes) {
    if (typeof bytes === 'undefined') {
      throw new TypeError('bytes is required')
    }

    this.cursor = 0
    this.bytes = bytes
    this.skipped = []

    // Read and discard the first 9 bytes (M8VERSION)
    this.readStr(9)

    // Discard the next byte
    this.skip()

    // Read the M8 file version details
    const rawData = readUInt16LE(this.read(2))
    const patchVersion = rawData & 0x0F
    const minorVersion = (rawData >> 4) & 0x0F
    const majorVersion = (rawData >> 8) & 0x0F

    this.m8Version = new M8Version(majorVersion, minorVersion, patchVersion)

    // Discard the next byte
    this.skip()

    this.fileType = this.read()
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
   * Returns an array of bytes at the current cursor position.
   *
   * @param {Number} [len] - The number of bytes to read (default: 1)
   *
   * @returns {Array<Number>}
   */
  read (len) {
    if (typeof len === 'undefined') {
      len = 1
    }

    const data = []

    for (let i = 0; i < len; i++) {
      data.push(this.bytes[this.cursor])

      this.cursor += 1
    }

    return len > 1 ? data : data[0]
  }

  /**
   * Reads a number of bytes and returns its string representation.
   *
   * @param {Number} len - The length of the string to read
   *
   * @returns {String}
   */
  readStr (len) {
    const chars = []
    let i = 0
    let char

    for (i; i < len; i++) {
      char = this.read()

      if (char === 0x00 || char === 0xFF) {
        break
      }

      chars.push(char)
    }

    // Increment the len cursor to avoid processing twice
    i++

    for (i; i < len; i++) {
      // Record each byte as skipped
      this.skip()
    }

    return String.fromCharCode(...chars)
  }

  /**
   * Records the skipped offset to allow for writing files.
   *
   * @param {Number} [len] - The number of bytes to skip (default: 1)
   */
  skip (len) {
    if (typeof len === 'undefined') {
      len = 1
    }

    for (let i = 0; i < len; i++) {
      this.skipped.push(this.cursor)

      this.read()
    }
  }

  /**
    * Advances the cursor to the specified offset.
    *
    * @param {Number} offset - The offset to skip to
    */
  skipTo (offset) {
    this.skip(offset - this.cursor)
  }
}

// Exports
module.exports = M8FileReader
