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
 * Various helper methods that don't belong within a specific type (just yet).
 *
 * @module m8-js/lib/helpers
 */

/**
 * Returns the bytes of unknown/unused data from the original M8 File Reader when present, or a default value.
 *
 * @param {module:m8-js/lib/types.M8FileReader} [fileReader] - The M8 file reader
 * @param {Number} offset - The offset
 * @param {Number} length - The number of bytes to write
 * @param {Number} defaultValue - The default value when the offest value wasn't skipped or there is no M8 file reader
 *
 * @returns {Array<Number>}
 */
const bytesForSkippedData = (fileReader, offset, length, defaultValue) => {
  const bytes = []

  for (let i = 0; i < length; i++) {
    let skippedValue = defaultValue

    if (fileReader?.skipped.indexOf(offset + i) > -1) {
      skippedValue = fileReader.bytes[offset + i]
    }

    bytes.push(skippedValue)
  }

  return bytes
}

/**
 * Returns the byte representation of th boolean.
 *
 * @param {Boolean} bool - The boolean
 *
 * @returns {Number}
 */
const bytesFromBool = (bool) => {
  return bool ? 0x01 : 0x00
}

/**
 * Returns a 4-byte array for the 32-bit, little-endian float.
 *
 * @param {Number} num - The 32-bit, little-endian float
 *
 * @returns {Array<Number>}
 */
const bytesFromFloatLE = (num) => {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer, 0)

  view.setFloat32(0, num.toFixed(2), true)

  return new Uint8Array(buffer)
}

/**
 * Write the string to the file's content and pad the end with empty values when necessar.
 *
 * @param {String} theString - The string value to write
 * @param {Number} padTo - The number of bytes in storage to use regardless of string length
 * @param {Number} [padValue] - The pad value to use
 *
 * @returns {Array<Number>}
 */
const bytesFromString = (theString, padTo, padValue) => {
  const bytes = []

  if (typeof padValue === 'undefined') {
    padValue = 0x00
  }

  for (let i = 0; i < padTo; i++) {
    const charCode = theString.charCodeAt(i)

    if (isNaN(charCode)) {
      bytes.push(padValue)
    } else {
      bytes.push(charCode)
    }
  }

  return bytes
}

/**
 * Returns a String representation of a Number note value.
 *
 * @param {Number} val - The raw note value
 *
 * @returns {Number}
 */
const getNote = (val) => {
  switch (val) {
    case 0:
      return 'C'
    case 1:
      return 'C#'
    case 2:
      return 'D'
    case 3:
      return 'D#'
    case 4:
      return 'E'
    case 5:
      return 'F'
    case 6:
      return 'F#'
    case 7:
      return 'G'
    case 8:
      return 'G#'
    case 9:
      return 'A'
    case 10:
      return 'A#'
    case 11:
      return 'B'
    default:
      return '?'
  }
}

/**
 * Reads a 32-bit, little-endian float from the 4 bytes.
 *
 * @param {Array<Number>} bytes - The bytes
 *
 * @returns {Number}
 */
const readFloatLE = (bytes) => {
  const buffer = new ArrayBuffer(bytes.length)
  const view = new DataView(buffer, 0)

  for (let i = 0; i < bytes.length; i++) {
    view.setUint8(i, bytes[i])
  }

  return view.getFloat32(0, true)
}

/**
 * Reads an unsigned, little-endian 16-bit integer from the two bytes.
 *
 * @param {Array<Number>} bytes - The bytes
 *
 * @returns {Number}
 */
const readUInt16LE = (bytes) => {
  const buffer = new ArrayBuffer(bytes.length)
  const view = new DataView(buffer, 0)

  for (let i = 0; i < bytes.length; i++) {
    view.setUint8(i, bytes[i])
  }

  return view.getUint16(0, true)
}

/**
 * Turns the boolean to `ON` or `OFF`.
 *
 * @param {Boolean} val - the boolean to pretty print
 *
 * @returns {String}
 */
const toM8Bool = (val) => {
  return val === true ? 'ON' : 'OFF'
}

/**
 * Raw number with zero padding of configurable length
 *
 * @param {Number} val - the number to pretty print
 * @param {Number} [len=2] - the optional length of the number
 *
 * @returns {String}
 */
const toM8Num = (val, len) => {
  return val.toString().padStart(typeof len === 'undefined' ? 2 : len, '0')
}

/**
 * Turns the number into a string representation with 2 digit padding, upper case.
 *
 * @param {Number} val - the number to convert to pretty printed hex
 * @param {Number} [len=2] - the optional length of the number
 *
 * @returns {String}
 */
const toM8HexStr = (val, len) => {
  return val.toString(16).padStart(typeof len === 'undefined' ? 2 : len, '0').toUpperCase()
}

module.exports = {
  bytesForSkippedData,
  bytesFromBool,
  bytesFromFloatLE,
  bytesFromString,
  getNote,
  readFloatLE,
  readUInt16LE,
  toM8Bool,
  toM8HexStr,
  toM8Num
}
