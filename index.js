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
 * Module for loading/interacting with {@link https://dirtywave.com/|Dirtywave} M8 instrument/song files.
 *
 * @see {@link https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9} for original Nim sources.
 *
 * @module m8-js
 */

const { readFileSync } = require('fs')
const { Instrument, M8Version, Scale, Song, Theme } = require('./lib/types')

/**
 * M8 file reader.
 *
 * @class
 */
class M8FileReader {
  /** @member {Buffer} */
  buffer
  /** @member {Number} */
  cursor
  /** @member {String} */
  filePath
  /** @member {String} */
  fileType
  /** @member {M8Version} */
  m8Version

  constructor (filePath) {
    this.cursor = 0
    this.filePath = filePath
    this.buffer = readFileSync(filePath)

    // Read and discard the first 9 bytes (M8VERSION)
    this.readStr(9)

    // Discard the next byte
    this.readUInt8()

    // Read the M8 file version details
    this.m8Version = this.readM8Version()

    // Discard the next byte
    this.readUInt8()

    this.fileType = this.readUInt8() >> 4
  }

  /**
   * Returns an array of bytes at the current cursor position.
   *
   * @param {Number} len
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
   * Reads an M8 version at the current cursor position.
   *
   * @returns {M8Version}
   */
  readM8Version () {
    // Read the M8 file version details
    const rawData = Buffer.from([this.readUInt8(), this.readUInt8()]).readUInt16LE(0)

    const patchVersion = rawData & 0x0F
    const minorVersion = (rawData >> 4) & 0x0F
    const majorVersion = (rawData >> 8) & 0x0F

    return new M8Version(majorVersion, minorVersion, patchVersion)
  }

  /**
   * Reads a number of bytes and returns its string representation.
   *
   * @param {Number} len
   *
   * @returns {String}
   */
  readStr (len) {
    const chars = []
    let i = 0
    let char

    for (i; i < len; i++) {
      char = this.readUInt8()

      if (char === 0 || char === 0xff) {
        break
      }

      chars.push(char)
    }

    // Increment the len cursor to avoid processing twice
    i++

    for (i; i < len; i++) {
      // Discard remaining
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
}

/**
 * Reads an M8 file from disk.
 *
 * @param {String} filePath - The path of the file to read
 *
 * @returns {Instrument|Scale|Song|Theme} the M8 file
 */
const loadM8File = (filePath) => {
  const fileReader = new M8FileReader(filePath)

  switch (fileReader.fileType) {
    // Song
    case 0:
      return new Song(fileReader)
    // Instrument
    case 1:
      return new Instrument(fileReader.m8Version, fileReader)
    // Theme
    case 2:
      return new Theme(fileReader)
    // Scale
    case 3:
      return new Scale(fileReader)
    default:
      throw new TypeError(`Unsupported file type: ${fileReader.fileType}`)
  }
}

module.exports = {
  loadM8File
}
