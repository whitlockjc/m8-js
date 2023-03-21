
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
const FMSynthParameters = require('../internal/FMSynthParameters')

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

// These are the FMSYNTH envelope/LFO destinations as of 2.6.0
const FMSYNTHEnvLFODests = [
  'OFF', // 0x00
  'VOLUME', // 0x01
  'PITCH', // 0x02
  'MOD 1', // 0x03
  'MOD 2', // 0x04
  'MOD 3', // 0x05
  'MOD 4', // 0x06
  'CUTOFF', // 0x07
  'RES', // 0x08
  'AMP', // 0x09
  'PAN' // 0x0A
]

// These are the MIDI Mapping labels for FMSYNTH
const FMSYNTHMIDILabels = new Array(46)

FMSYNTHMIDILabels.fill('UNUSED')
FMSYNTHMIDILabels[32] = 'MOD1'
FMSYNTHMIDILabels[33] = 'MOD2'
FMSYNTHMIDILabels[34] = 'MOD3'
FMSYNTHMIDILabels[35] = 'MOD4'
FMSYNTHMIDILabels[37] = 'CUTOFF'
FMSYNTHMIDILabels[38] = 'RES'
FMSYNTHMIDILabels[39] = 'AMP'
FMSYNTHMIDILabels[41] = 'PAN'
FMSYNTHMIDILabels[42] = 'DRY'
FMSYNTHMIDILabels[43] = 'CHO'
FMSYNTHMIDILabels[44] = 'DEL'
FMSYNTHMIDILabels[45] = 'REV'

/**
 * Represents an FMSYNTH Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/instruments/internal.BaseInstrument
 * @memberof module:m8-js/lib/types/instruments
 */
class FMSynth extends BaseInstrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion)

    this.instrParams = new FMSynthParameters()
  }

  /**
   * @inheritdoc
   */
  getCommands () {
    return FMSYNTHCommands
  }

  /**
   * @inheritdoc
   */
  getEnvLfoDests () {
    return FMSYNTHEnvLFODests
  }

  /**
   * @inheritdoc
   */
  getMIDIDestLabels () {
    return [
      ...FMSYNTHMIDILabels,
      ...super.getMIDIDestLabels()
    ]
  }

  /**
   * @inheritdoc
   */
  kind () {
    return 0x04
  }

  /**
   * @inheritdoc
   */
  kindToStr () {
    return 'FMSYNTH'
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return instrFromObject(FMSynth, FMSynthParameters, object)
  }
}

module.exports = FMSynth
