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
  getNote,
  toM8Bool,
  toM8HexStr,
  toM8Num
}
