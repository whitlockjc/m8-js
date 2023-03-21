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

const { InstrumentKinds, VERSION_2_5_1, LATEST_M8_VERSION } = require('../../constants')
const { toM8HexStr } = require('../../helpers')
const Serializable = require('./Serializable')

// These are the filter types as of 2.5.1
const FilterTypes = [
  'OFF', // 0x00
  'LOWPASS', // 0x01
  'HIGHPASS', // 0x02
  'BANDPASS', // 0x03
  'BANDSTOP', // 0x04
  'LP>HP' // 0x05
]
// These are the filter types prior to 2.5.1
const FilterTypesPre251 = FilterTypes.slice(0, FilterTypes.length - 1)
// These are the WAVSYNTH Filter types
const WAVSYNTHFilterTypes = [
  'WAV LP',
  'WAV HP',
  'WAV BP',
  'WAV BS'
]

/**
 * Represents the Filter Parameters of an Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class FilterParameters extends Serializable {
  /** @member {Number} */
  cutoff
  /** @member {Number} */
  res
  /** @member {Number} */
  type

  /**
   * Create an Instrument's Filter Parameters.
   *
   * @param {Number} [cutoff=0xFF]
   * @param {Number} [res=0x00]
   * @param {Number} [type=0x00]
   */
  constructor (cutoff = 0xFF, res = 0x00, type = 0x00) {
    super()

    this.cutoff = cutoff
    this.res = res
    this.type = type
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      cutoff: this.cutoff,
      res: this.res,
      type: this.type
      // typeStr CANNOT be set here
    }
  }

  /**
   * Returns a string representation of the Filter type.
   *
   * @param {Number} kind - The instrument kind
   * @param {module:m8-js/lib/types/internal.M8Version} [m8Version] - The M8 version
   *
   * @returns {String}
   */
  typeToStr (kind, m8Version) {
    let filterName

    if (typeof m8Version === 'undefined') {
      m8Version = LATEST_M8_VERSION
    }

    if (kind === InstrumentKinds.WAVSYNTH) {
      if (m8Version.compare(VERSION_2_5_1) >= 0) {
        filterName = FilterTypes.concat(WAVSYNTHFilterTypes)[this.type]
      } else {
        filterName = FilterTypesPre251.concat(WAVSYNTHFilterTypes)[this.type]
      }
    } else {
      filterName = FilterTypes[this.type]
    }

    return typeof filterName === 'undefined' ? `UNK (${toM8HexStr(this.type)})` : filterName
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new FilterParameters(object?.cutoff, object?.res, object?.type)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['cutoff', 'res', 'type', 'typeStr']
  }
}

module.exports = FilterParameters
