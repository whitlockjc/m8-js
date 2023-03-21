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
const { LATEST_M8_VERSION, VERSION_2_7_0 } = require('../../constants')
const MIDICC = require('./MIDICC')
const Serializable = require('./Serializable')

const MIDIOUTPortNames = [
  'MIDI+USB', // 0x00
  'MIDI', // 0x01
  'USB', // 0x02
  'INTERNAL' // 0x03 (Not available prior to 2.7.0)
]
const MIDIOUTPortNamesPre270 = MIDIOUTPortNames.slice(0, MIDIOUTPortNames.length - 1)

/**
 * Represents the MIDIOUT Instrument Parameters.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class MIDIOutParameters extends Serializable {
  /** @member {Number} */
  bankSelect
  /** @member {Number} */
  channel
  /** @member {Array<module:m8-js/lib/types/internal.MIDICC>} */
  customCC
  /** @member {Number} */
  port
  /** @member {Number} */
  programChange

  /**
   * Create the MIDIOUT Instrument Parameters.
   *
   * @param {Number} [bankSelect=0xFF]
   * @param {Number} [channel=0x01]
   * @param {Array<module:m8-js/lib/types/internal.MIDICC>} [customCC=[]]
   * @param {Number} [port=0x00]
   * @param {Number} [programChange=0xFF]
   */
  constructor (bankSelect = 0xFF, channel = 0x01, customCC = [], port = 0x00, programChange = 0xFF) {
    super()

    this.customCC = new Array(10)

    for (let i = 0; i < this.customCC.length; i++) {
      let cc = customCC[i]

      if (typeof cc === 'undefined') {
        cc = new MIDICC()
      }

      this.customCC[i] = cc
    }

    this.bankSelect = bankSelect
    this.channel = channel
    this.port = port
    this.programChange = programChange
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      bankSelect: this.bankSelect,
      channel: this.channel,
      customCC: this.customCC.map((cc) => cc.asObject()),
      port: this.port,
      // portStr CANNOT be set here
      programChange: this.programChange
    }
  }

  /**
   * Returns a string representation of the port.
   *
   * @param {module:m8-js/lib/types/internal.M8Version} [m8Version] - The M8 version (different versions of M8 use
   * different MIDIOUT port names)
   *
   * @returns {String}
   */
  portToStr (m8Version) {
    if (typeof m8Version === 'undefined') {
      m8Version = LATEST_M8_VERSION
    }

    let portName

    if (m8Version.compare(VERSION_2_7_0) < 0) {
      portName = MIDIOUTPortNamesPre270[this.port]
    } else {
      portName = MIDIOUTPortNames[this.port]
    }

    return typeof portName === 'undefined' ? `UNK (${toM8HexStr(this.port)})` : portName
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new MIDIOutParameters(object?.bankSelect, object?.channel,
                                 object?.customCC?.map(MIDICC.fromObject), object?.port,
                                 object?.programChange)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['bankSelect', 'channel', 'customCC', 'port', 'portStr', 'programChange']
  }
}

module.exports = MIDIOutParameters
