/* Copyright 2023 Jeremy Whitlock
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

const { toM8HexStr } = require('../../helpers')
const Serializable = require('./Serializable')

const SAMPLERPlayModes = [
  'FWD', // 0x00
  'REV', // 0x01
  'FWDLOOP', // 0x02
  'REVLOOP', // 0x03
  'FWD PP', // 0x04
  'REV PP', // 0x05
  'OSC', // 0x06
  'OSC REV', // 0x07
  'OSC PP' // 0x08
]
/**
 * Represents the SAMPLER Instrument Parameters.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class SamplerParameters extends Serializable {
  /** @member {Number} */
  degrade
  /** @member {Number} */
  length
  /** @member {Number} */
  loopStart
  /** @member {Number} */
  playMode
  /** @member {String} */
  samplePath // Unfortunately, this is set by the Instrument class due to M8 file structure
  /** @member {Number} */
  slice
  /** @member {Number} */
  start

  /**
   * Create the SAMPLER Instrument Parameters.
   *
   * @param {Number} [degrade=0x00]
   * @param {Number} [length=0xFF]
   * @param {Number} [loopStart=0x00]
   * @param {Number} [playMode=0x00]
   * @param {String} [samplePath='']
   * @param {Number} [slice=0x00]
   * @param {Number} [start=0x00]
   */
  constructor (degrade = 0x00, length = 0xFF, loopStart = 0x00, playMode = 0x00, samplePath = '', slice = 0x00, start = 0x00) {
    super()

    this.degrade = degrade
    this.length = length
    this.loopStart = loopStart
    this.playMode = playMode
    this.samplePath = samplePath
    this.slice = slice
    this.start = start
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      degrade: this.degrade,
      length: this.length,
      loopStart: this.loopStart,
      playMode: this.playMode,
      playModeStr: this.playModeToStr(),
      samplePath: this.samplePath,
      slice: this.slice,
      start: this.start
    }
  }

  /**
   * Returns a string representation of the play mode.
   *
   * @returns {String}
   */
  playModeToStr () {
    const playModeStr = SAMPLERPlayModes[this.playMode]

    return typeof playModeStr === 'undefined' ? `U (${toM8HexStr(this.playMode)})` : playModeStr
  }

  /**
   * Returns a sanitized representation of the sample path.
   *
   * @returns {String}
   */
  samplePathToStr () {
    const samplePathParts = this.samplePath.split('/')
    let sanitizedSamplePath

    // Remove any folder hierarchy
    sanitizedSamplePath = samplePathParts[samplePathParts.length - 1]
    // Remove the file extension
    sanitizedSamplePath = sanitizedSamplePath.split('.').slice(0, -1).join('.')

    if (sanitizedSamplePath.length > 16) {
      // Trim to 16 characters (first 8, _, last 7)
      sanitizedSamplePath = sanitizedSamplePath.slice(0, 8) + '_' + sanitizedSamplePath.slice(sanitizedSamplePath.length - 7)
    }

    // Upper case
    return sanitizedSamplePath.toUpperCase()
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new SamplerParameters(object?.degrade, object?.length, object?.loopStart, object?.playMode,
                                 object?.samplePath, object?.slice, object?.start)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['degrade', 'length', 'loopStart', 'playMode', 'playModeStr', 'samplePath', 'slice', 'start']
  }
}

module.exports = SamplerParameters
