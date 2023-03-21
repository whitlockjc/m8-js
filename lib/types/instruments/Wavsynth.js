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

const { instrFromObject } = require('../internal/helpers')
const BaseInstrument = require('../internal/BaseInstrument')
const WavsynthParameters = require('../internal/WavsynthParameters')

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

// These are the WAVSYNTH envelope/LFO destinations as of 2.6.0
const WAVSYNTHEnvLFODests = [
  'OFF', // 0x00
  'VOLUME', // 0x01
  'PITCH', // 0x02
  'SIZE', // 0x03
  'MULT', // 0x04
  'WARP', // 0x05
  'MIRROR', // 0x06
  'CUTOFF', // 0x07
  'RES', // 0x08
  'AMP', // 0x09
  'PAN' // 0x0A
]

// These are the MIDI Mapping labels for WAVSYNTH
const WAVSYNTHMIDILabels = new Array(18)

WAVSYNTHMIDILabels.fill('UNUSED')
WAVSYNTHMIDILabels[4] = 'SIZE'
WAVSYNTHMIDILabels[5] = 'MULT'
WAVSYNTHMIDILabels[6] = 'WARP'
WAVSYNTHMIDILabels[7] = 'MIRROR'
WAVSYNTHMIDILabels[9] = 'CUTOFF'
WAVSYNTHMIDILabels[10] = 'RES'
WAVSYNTHMIDILabels[11] = 'AMP'
WAVSYNTHMIDILabels[13] = 'PAN'
WAVSYNTHMIDILabels[14] = 'DRY'
WAVSYNTHMIDILabels[15] = 'CHO'
WAVSYNTHMIDILabels[16] = 'DEL'
WAVSYNTHMIDILabels[17] = 'REV'

/**
 * Represents an Wavnsynth Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/instruments/internal.BaseInstrument
 * @memberof module:m8-js/lib/types/instruments
 */
class Wavsynth extends BaseInstrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion)

    this.instrParams = new WavsynthParameters()
  }

  /**
   * @inheritdoc
   */
  getCommands () {
    return WAVSYNTHCommands
  }

  /**
   * @inheritdoc
   */
  getEnvLfoDests () {
    return WAVSYNTHEnvLFODests
  }

  /**
   * @inheritdoc
   */
  getMIDIDestLabels () {
    return [
      ...WAVSYNTHMIDILabels,
      ...super.getMIDIDestLabels()
    ]
  }

  /**
   * @inheritdoc
   */
  kind () {
    return 0x00
  }

  /**
   * @inheritdoc
   */
  kindToStr () {
    return 'WAVSYNTH'
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return instrFromObject(Wavsynth, WavsynthParameters, object)
  }
}

module.exports = Wavsynth
