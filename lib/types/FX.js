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

const { toM8HexStr } = require('../helpers')

// These are the FMSYNTH commands as of 2.6.0
const FMSYNTHCommands = [
  'VOL', // 0x80
  'PIT', // 0x81
  'FIN', // 0x82
  'ALG', // 0x83
  'FM1', // 0x84
  'FM2', // 0x85
  'FM3', // 0x86
  'FM4', // 0x87
  'FIL', // 0x88
  'CUT', // 0x89
  'RES', // 0x8A
  'AMP', // 0x8B
  'LIM', // 0x8C
  'PAN', // 0x8D
  'DRY', // 0x8E
  'SCH', // 0x8F
  'SDL', // 0x90
  'SRV', // 0x91
  'EA1', // 0x92
  'AT1', // 0x93
  'HO1', // 0x94
  'DE1', // 0x95
  'ET1', // 0x96
  'EA2', // 0x97
  'AT2', // 0x98
  'HO2', // 0x99
  'DE2', // 0x9A
  'ET2', // 0x9B
  'LA1', // 0x9C
  'LF1', // 0x9D
  'LT1', // 0x9E
  'LA2', // 0x9F
  'LF2', // 0xA0
  'LT2', // 0xA1
  'FMP' // 0xA2
]

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

// These are the MACROSYN commands as of 2.6.0
const MACROSYNCommands = [
  'VOL', // 0x80
  'PIT', // 0x81
  'FIN', // 0x82
  'OSC', // 0x83
  'TBR', // 0x84
  'COL', // 0x85
  'DEG', // 0x86
  'RED', // 0x87
  'FIL', // 0x88
  'CUT', // 0x89
  'RES', // 0x8A
  'AMP', // 0x8B
  'LIM', // 0x8C
  'PAN', // 0x8D
  'DRY', // 0x8E
  'SCH', // 0x8F
  'SDL', // 0x90
  'SRV', // 0x91
  'EA1', // 0x92
  'AT1', // 0x93
  'HO1', // 0x94
  'DE1', // 0x95
  'ET1', // 0x96
  'EA2', // 0x97
  'AT2', // 0x98
  'HO2', // 0x99
  'DE2', // 0x9A
  'ET2', // 0x9B
  'LA1', // 0x9C
  'LF1', // 0x9D
  'LT1', // 0x9E
  'LA2', // 0x9F
  'LF2', // 0xA0
  'LT2', // 0xA1
  'TRG' // 0xA2
]

// These are the MIDIOUT commands as of 2.6.0
const MIDIOUTCommands = [
  'MPG', // 0x80
  'MPB', // 0x81
  'ADD', // 0x82
  'CHD', // 0x83
  'CCA', // 0x84
  'CCB', // 0x85
  'CCC', // 0x86
  'CCD', // 0x87
  'CCE', // 0x88
  'CCF', // 0x89
  'CCG', // 0x8A
  'CCH', // 0x8B
  'CCI', // 0x8C
  'CCJ' // 0x8D
]

// These are the SAMPLER commands as of 2.6.0
const SAMPLERCommands = [
  'VOL', // 0x80
  'PIT', // 0x81
  'FIN', // 0x82
  'PLY', // 0x83
  'STA', // 0x84
  'LOP', // 0x85
  'LEN', // 0x86
  'DEG', // 0x87
  'FLT', // 0x88
  'CUT', // 0x89
  'RES', // 0x8A
  'AMP', // 0x8B
  'LIM', // 0x8C
  'PAN', // 0x8D
  'DRY', // 0x8E
  'SCH', // 0x8F
  'SDL', // 0x90
  'SRV', // 0x91
  'EA1', // 0x92
  'AT1', // 0x93
  'HO1', // 0x94
  'DE1', // 0x95
  'ET1', // 0x96
  'EA2', // 0x97
  'AT2', // 0x98
  'HO2', // 0x99
  'DE2', // 0x9A
  'ET2', // 0x9B
  'LA1', // 0x9C
  'LF1', // 0x9D
  'LT1', // 0x9E
  'LA2', // 0x9F
  'LF2', // 0xA0
  'LT2', // 0xA1
  'SLI' // 0xA2
]

// These are the WAVSYNTH commands as of 2.6.0
const WAVSYNTHCommands = [
  'VOL', // 0x80
  'PIT', // 0x81
  'FIN', // 0x82
  'OSC', // 0x83
  'SIZ', // 0x84
  'MUL', // 0x85
  'WRP', // 0x86
  'MIR', // 0x87
  'FIL', // 0x88
  'CUT', // 0x89
  'RES', // 0x8A
  'AMP', // 0x8B
  'LIM', // 0x8C
  'PAN', // 0x8D
  'DRY', // 0x8E
  'SCH', // 0x8F
  'SDL', // 0x90
  'SRV', // 0x91
  'EA1', // 0x92
  'AT1', // 0x93
  'HO1', // 0x94
  'DE1', // 0x95
  'ET1', // 0x96
  'EA2', // 0x97
  'AT2', // 0x98
  'HO2', // 0x99
  'DE2', // 0x9A
  'ET2', // 0x9B
  'LA1', // 0x9C
  'LF1', // 0x9D
  'LT1', // 0x9E
  'LA2', // 0x9F
  'LF2', // 0xA0
  'LT2' // 0xA1
]

/**
 * Represents an FX configuration.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class FX {
  /** @member {Number} */
  command
  /** @member {Number} */
  value

  /**
   * Creates an FX configuration.
   */
  constructor () {
    this.command = 0xFF
    this.value = 0x00
  }

  /**
   * Get the command name for the FX and optional instrument type.
   *
   * @param {String} [instrKind] - The Instrument kind the command will affect
   *
   * @returns {String}
   */
  commandToStr (instrKind) {
    const commands = [].concat(SequencerCommands, FXAndMixerCommands)
    let cmdStr = '---'

    if (this.command !== 0xFF) {
      let instrumentCommands = []

      if (this.command >= 0x80) {
        switch (instrKind) {
          case 'FMSYNTH':
            instrumentCommands = FMSYNTHCommands
            break
          case 'MIDI OUT':
            instrumentCommands = MIDIOUTCommands
            break
          case 'MACROSYN':
            instrumentCommands = MACROSYNCommands
            break
          case 'SAMPLER':
            instrumentCommands = SAMPLERCommands
            break
          case 'WAVSYNTH':
            instrumentCommands = WAVSYNTHCommands
            break
          default:
            // No-op
        }

        instrumentCommands.forEach((cmd, index) => {
          commands[0x80 + index] = cmd
        })
      }

      cmdStr = commands[this.command]

      if (typeof cmdStr === 'undefined' && instrumentCommands.length > 0) {
        cmdStr = `${toM8HexStr(this.command)}?`
      }
    }

    return typeof cmdStr === 'undefined' ? `${toM8HexStr(this.command)}?` : cmdStr
  }
}

// Exports
module.exports = FX
