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
const { toM8HexStr } = require('../helpers')

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
  /** @member {module:m8-js.Buffer} */
  buffer
  /** @member {Number} */
  cursor
  /** @member {String} */
  fileType
  /** @member {module:m8-js/lib/types.M8Version} */
  m8Version
  /** @member {Array<Number>} */
  skipped

  /**
   * Creates an M8 File Reader.
   *
   * @param {module:m8-js/Buffer} buffer - The buffer containing the raw M8 file content
   */
  constructor (buffer) {
    this.cursor = 0
    this.buffer = buffer
    this.skipped = []

    // Read and discard the first 9 bytes (M8VERSION)
    this.readStr(9)

    // Discard the next byte
    this.skip(1)

    // Read the M8 file version details
    const rawData = Buffer.from(this.read(2)).readUInt16LE(0)
    const patchVersion = rawData & 0x0F
    const minorVersion = (rawData >> 4) & 0x0F
    const majorVersion = (rawData >> 8) & 0x0F

    this.m8Version = new M8Version(majorVersion, minorVersion, patchVersion)

    // Discard the next byte
    this.skip(1)

    const rawFileType = this.readUInt8() >> 4

    switch (rawFileType) {
      case 0:
        this.fileType = 'Song'
        break
      case 1:
        this.fileType = 'Instrument'
        break
      case 2:
        this.fileType = 'Theme'
        break
      case 3:
        this.fileType = 'Scale'
        break
      default:
        this.fileType = `Unknown (${toM8HexStr(rawFileType)})`
    }
  }

  /**
   * Returns an array of bytes at the current cursor position.
   *
   * @param {Number} len - The number of bytes to read
   *
   * @returns {Array<Number>}
   */
  read (len) {
    const data = []

    for (let i = 0; i < len; i++) {
      data.push(this.buffer[this.cursor])

      this.cursor += 1
    }

    return data
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
      char = this.readUInt8()

      if (char === 0 || char === 0xFF) {
        break
      }

      chars.push(char)
    }

    // Increment the len cursor to avoid processing twice
    i++

    for (i; i < len; i++) {
      // Discard remaining (don't skip, because this data is known to be empty)
      this.readUInt8()
    }

    return String.fromCharCode(...chars)
  }

  /**
   * Reads a number at the current position.
   *
   * @returns {Number}
   */
  readUInt8 () {
    return this.read(1)[0]
  }

  /**
   * Records the skipped offset to allow for writing files.
   *
   * @param {Number} len - The number of bytes to skip
   */
  skip (len) {
    for (let i = 0; i < len; i++) {
      this.skipped.push(this.cursor)

      this.read(1)
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
