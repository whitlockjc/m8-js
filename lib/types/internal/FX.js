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

const { toM8HexStr } = require('../../helpers')
const Serializable = require('./Serializable')

// These are the fx/mixer as of 2.6.0
const FXAndMixerCommands = [
  'VMV', // 0x17
  'XCM', // 0x18
  'XCF', // 0x19
  'XCW', // 0x1A
  'XCR', // 0x1B
  'XDT', // 0x1C
  'XDF', // 0x1D
  'XDW', // 0x1E
  'XDR', // 0x1F
  'XRS', // 0x20
  'XRD', // 0x21
  'XRM', // 0x22
  'XRF', // 0x23
  'XRW', // 0x24
  'XRZ', // 0x25
  'VCH', // 0x26
  'VCD', // 0x27
  'VRE', // 0x28
  'VT1', // 0x29
  'VT2', // 0x2A
  'VT3', // 0x2B
  'VT4', // 0x2C
  'VT5', // 0x2D
  'VT6', // 0x2E
  'VT7', // 0x2F
  'VT8', // 0x30
  'DJF', // 0x31
  'IVO', // 0x32
  'ICH', // 0x33
  'IDE', // 0x34
  'IRE', // 0x35
  'IV2', // 0x36
  'IC2', // 0x37
  'ID2', // 0x38
  'IR2', // 0x39
  'USB' // 0x3A
]

// These are the sequencer commands as of 2.6.0
const SequencerCommands = [
  'ARP', // 0x00
  'CHA', // 0x01
  'DEL', // 0x02
  'GRV', // 0x03
  'HOP', // 0x04
  'KIL', // 0x05
  'RAN', // 0x06
  'RET', // 0x07
  'REP', // 0x08
  'NTH', // 0x09
  'PSL', // 0x0A
  'PSN', // 0x0B
  'PVB', // 0x0C
  'PVX', // 0x0D
  'SCA', // 0x0E
  'SCG', // 0x0F
  'SED', // 0x10
  'SNG', // 0x11
  'TBL', // 0x12
  'THO', // 0x13
  'TIC', // 0x14
  'TPO', // 0x15
  'TSP' // 0x16
]

/**
 * Represents an FX configuration.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class FX extends Serializable {
  /** @member {Number} */
  command
  /** @member {Number} */
  value

  /**
   * Creates an FX configuration.
   *
   * @param {Number} [command=0xFF]
   * @param {Number} [value=0x00]
   */
  constructor (command = 0xFF, value = 0x00) {
    super()

    this.command = command
    this.value = value
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      command: this.command,
      value: this.value
    }
  }

  /**
   * Get the command name for the FX and optional Instrument.
   *
   * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} [instrument] - The M8 Instrument
   *
   * @returns {String}
   */
  commandToStr (instr) {
    const commands = [].concat(SequencerCommands, FXAndMixerCommands)
    let cmdStr = '---'

    if (this.command !== 0xFF) {
      const instrumentCommands = typeof instr === 'undefined' ? [] : instr.getCommands()

      instrumentCommands.forEach((cmd, index) => {
        commands[0x80 + index] = cmd
      })

      cmdStr = commands[this.command]

      if (typeof cmdStr === 'undefined' && instrumentCommands.length > 0) {
        cmdStr = `${toM8HexStr(this.command)}?`
      }
    }

    return typeof cmdStr === 'undefined' ? `${toM8HexStr(this.command)}?` : cmdStr
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new FX(object?.command, object?.value)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['command', 'value']
  }
}

// Exports
module.exports = FX
