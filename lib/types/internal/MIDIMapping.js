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

/**
 * Represents a MIDI Mapping.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class MIDIMapping extends Serializable {
  /** @member {Number} */
  channel
  /** @member {Number} */
  controlNum
  /** @member {Number} */
  instrIndex
  /** @member {Number} */
  maxValue
  /** @member {Number} */
  minValue
  /** @member {Number} */
  paramIndex
  /** @member {Number} */
  type

  /**
   * Create a MIDI Mapping.
   *
   * @param {Number} [channel=0x00]
   * @param {Number} [controlNum=0x00]
   * @param {Number} [instrIndex=0x00]
   * @param {Number} [maxValue=0x00]
   * @param {Number} [minValue=0x00]
   * @param {Number} [paramIndex=0x00]
   * @param {Number} [type=0x00]
   */
  constructor (channel = 0x00, controlNum = 0x00, instrIndex = 0x00, maxValue = 0x00, minValue = 0x00,
               paramIndex = 0x00, type = 0x00) {
    super()

    this.channel = channel
    this.controlNum = controlNum
    this.instrIndex = instrIndex
    this.maxValue = maxValue
    this.minValue = minValue
    this.paramIndex = paramIndex
    this.type = type
  }

  /**
   * Returns if the MIDI Mapping is empty.
   *
   * @return {Boolean}
   */
  get empty () {
    return this.channel === 0x00
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      channel: this.channel,
      controlNum: this.controlNum,
      instrIndex: this.instrIndex,
      maxValue: this.maxValue,
      minValue: this.minValue,
      paramIndex: this.paramIndex,
      type: this.type,
      typeStr: this.typeToStr()
    }
  }

  /**
   * Returns a single-character string representation of the mapping type.
   *
   * @returns {String}
   */
  typeToStr () {
    switch (this.type >> 2) {
      case 1:
        return 'I'
      case 2:
        return 'X'
      case 3:
        return 'M'
      default:
        return `U (${toM8HexStr(this.type)})`
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new MIDIMapping(object?.channel, object?.controlNum, object?.instrIndex, object?.maxValue, object?.minValue,
                           object?.paramIndex, object?.type)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['channel', 'controlNum', 'instrIndex', 'maxValue', 'minValue', 'paramIndex', 'type', 'typeStr']
  }
}

module.exports = MIDIMapping
