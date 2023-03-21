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

const { emptyAmplifierParameters, emptyEnvelopeParameters, emptyFilterParameters, emptyLFOParameters, emptyMixerParameters, instrFromObject } = require('../internal/helpers')
const BaseInstrument = require('../internal/BaseInstrument')
const MIDIOutParameters = require('../internal/MIDIOutParameters')

// These are JSON Object properties that should be removed (empty)
const EMPTYProperties = ['ampParams', 'envelopes', 'filterParams', 'lfos', 'mixerParams']

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

// These are the MIDI Mapping labels for MIDIOUT
const MIDIOUTMIDILabels = new Array(27)

MIDIOUTMIDILabels.fill('UNUSED')
MIDIOUTMIDILabels[8] = 'CCA VAL'
MIDIOUTMIDILabels[10] = 'CCB VAL'
MIDIOUTMIDILabels[12] = 'CCC VAL'
MIDIOUTMIDILabels[14] = 'CCD VAL'
MIDIOUTMIDILabels[16] = 'CCE VAL'
MIDIOUTMIDILabels[18] = 'CCF VAL'
MIDIOUTMIDILabels[20] = 'CCG VAL'
MIDIOUTMIDILabels[22] = 'CCH VAL'
MIDIOUTMIDILabels[24] = 'CCI VAL'
MIDIOUTMIDILabels[26] = 'CCJ VAL'

/**
 * Represents an MIDI Out Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/instruments/internal.BaseInstrument
 * @memberof module:m8-js/lib/types/instruments
 */
class MIDIOut extends BaseInstrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion)

    this.instrParams = new MIDIOutParameters()

    // Empty out the necessary values
    emptyAmplifierParameters(this)
    emptyEnvelopeParameters(this)
    emptyFilterParameters(this)
    emptyLFOParameters(this)
    emptyMixerParameters(this)
  }

  /**
   * @inheritdoc
   */
  asObject () {
    const object = super.asObject()

    // Delete the empty properties
    EMPTYProperties.forEach((prop) => {
      delete object[prop]
    })

    return object
  }

  /**
   * @inheritdoc
   */
  getCommands () {
    return MIDIOUTCommands
  }

  /**
   * @inheritdoc
   */
  getEnvLfoDests () {
    return []
  }

  /**
   * @inheritdoc
   */
  getMIDIDestLabels () {
    return MIDIOUTMIDILabels
  }

  /**
   * @inheritdoc
   */
  kind () {
    return 0x03
  }

  /**
   * @inheritdoc
   */
  kindToStr () {
    return 'MIDI OUT'
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return instrFromObject(MIDIOut, MIDIOutParameters, object)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    const props = BaseInstrument.getObjectProperties()
    // Items to delete by indexe in reverse order so we can delete them incrementally
    const indicesToDelete = EMPTYProperties.map((prop) => props.indexOf(prop)).sort((a, b) => b - a)

    indicesToDelete.forEach((index) => {
      props.splice(index, 1)
    })

    return props
  }
}

module.exports = MIDIOut
