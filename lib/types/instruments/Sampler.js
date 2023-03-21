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
const SamplerParameters = require('../internal/SamplerParameters')

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

// These are the SAMPLER envelope/LFO destinations as of 2.6.0
const SAMPLEREnvLFODests = [
  'OFF', // 0x00
  'VOLUME', // 0x01
  'PITCH', // 0x02
  'LOOP ST', // 0x03
  'LENGTH', // 0x04
  'DEGRADE', // 0x05
  'CUTOFF', // 0x06
  'RES', // 0x07
  'AMP', // 0x08
  'PAN' // 0x09
]

// These are the MIDI Mapping labels for WAVSYNTH
const SAMPLERMIDILabels = new Array(19)

SAMPLERMIDILabels.fill('UNUSED')
SAMPLERMIDILabels[2] = 'DETUNE'
SAMPLERMIDILabels[5] = 'START'
SAMPLERMIDILabels[6] = 'LOOP ST'
SAMPLERMIDILabels[7] = 'LENGTH'
SAMPLERMIDILabels[8] = 'DEGRADE'
SAMPLERMIDILabels[10] = 'CUTOFF'
SAMPLERMIDILabels[11] = 'RES'
SAMPLERMIDILabels[12] = 'AMP'
SAMPLERMIDILabels[14] = 'PAN'
SAMPLERMIDILabels[15] = 'DRY'
SAMPLERMIDILabels[16] = 'CHO'
SAMPLERMIDILabels[17] = 'DEL'
SAMPLERMIDILabels[18] = 'REV'

/**
 * Represents an Sampler Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/instruments/internal.BaseInstrument
 * @memberof module:m8-js/lib/types/instruments
 */
class Sampler extends BaseInstrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion)

    this.instrParams = new SamplerParameters()
  }

  /**
   * @inheritdoc
   */
  getCommands () {
    return SAMPLERCommands
  }

  /**
   * @inheritdoc
   */
  getEnvLfoDests () {
    return SAMPLEREnvLFODests
  }

  /**
   * @inheritdoc
   */
  getMIDIDestLabels () {
    return [
      ...SAMPLERMIDILabels,
      ...super.getMIDIDestLabels()
    ]
  }

  /**
   * @inheritdoc
   */
  kind () {
    return 0x02
  }

  /**
   * @inheritdoc
   */
  kindToStr () {
    return 'SAMPLER'
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return instrFromObject(Sampler, SamplerParameters, object)
  }
}

module.exports = Sampler
