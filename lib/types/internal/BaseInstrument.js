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

const { LATEST_M8_VERSION, VERSION_1_4_0 } = require('../../constants')
const AmplifierParameters = require('./AmplifierParameters')
const EnvelopeParameters = require('./EnvelopeParameters')
const FilterParameters = require('./FilterParameters')
const LFOParameters = require('./LFOParameters')
const MixerParameters = require('./MixerParameters')
const M8File = require('./M8File')
const Table = require('./Table')

// These are the MIDI Mapping labels for all Instruments (other than MIDIOUT)
const INSTRUMENTMIDILabels = new Array(23)

INSTRUMENTMIDILabels.fill('UNUSED')
INSTRUMENTMIDILabels[1] = 'AMOUNT'
INSTRUMENTMIDILabels[2] = 'ATTACK'
INSTRUMENTMIDILabels[3] = 'HOLD'
INSTRUMENTMIDILabels[4] = 'DECAY'
INSTRUMENTMIDILabels[7] = 'AMOUNT'
INSTRUMENTMIDILabels[8] = 'ATTACK'
INSTRUMENTMIDILabels[9] = 'HOLD'
INSTRUMENTMIDILabels[10] = 'DECAY'
INSTRUMENTMIDILabels[15] = 'FRQ'
INSTRUMENTMIDILabels[16] = 'AMT'
INSTRUMENTMIDILabels[21] = 'FRQ'
INSTRUMENTMIDILabels[22] = 'AMT'

/**
 * Base clase all Instruments should subclass.
 *
 * @class
 *
 * @abstract
 *
 * @augments module:m8-js/lib/types/internal.M8File
 * @memberof module:m8-js/lib/types/internal
 */
class BaseInstrument extends M8File {
  /** @member {module:m8-js/lib/types/instruments/internal.AmplifierParameters} */
  ampParams
  /** @member {Array<module:m8-js/lib/types/instruments/internal.EnvelopeParameters>} */
  envelopes
  /** @member {module:m8-js/lib/types/instruments/internal.FilterParameters} */
  filterParams
  /** @member {Number} */
  fineTune
  /** @member {module:m8-js/lib/types/instruments/internal.FMSynthParameters|module:m8-js/lib/types/instruments/internal.MacrosynthParameters|module:m8-js/lib/types/instruments/internal.MIDIOutParameters|module:m8-js/lib/types/instruments/internal.SamplerParameters|module:m8-js/lib/types/instruments/internal.WavsynthParameters} */
  instrParams
  /** @member {Array<module:m8-js/lib/types/instruments/internal.LFOParameters>} */
  lfos
  /** @member {module:m8-js/lib/types/instruments/internal.MixerParameters} */
  mixerParams
  /** @member {String} */
  name
  /** @member {Number} */
  pitch
  /** @member {module:m8-js/lib/types/internal.Table} */
  table
  /** @member {Number} */
  tableTick
  /** @member {Boolean} */
  transpose
  /** @member {Number} */
  volume
  /** @static */
  static TYPES = {
    WAVSYNTH: 0x00,
    MACROSYNTH: 0x01,
    SAMPLER: 0x02,
    MIDIOUT: 0x03,
    FMSYNTH: 0x04
  }

  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} [m8FileReaderOrVersion] - The M8
   * version of the Instrument (or the M8FileReader used to read the M8 file)
   */
  constructor (m8FileReaderOrVersion) {
    if (typeof m8FileReaderOrVersion === 'undefined') {
      super(M8File.TYPES.Instrument, LATEST_M8_VERSION)
    } else {
      if (m8FileReaderOrVersion.constructor.name === 'M8FileReader') {
        super(m8FileReaderOrVersion)
      } else {
        super(M8File.TYPES.Instrument, m8FileReaderOrVersion)
      }
    }

    let lfoCount = 2

    if (this.m8FileVersion.compare(VERSION_1_4_0) < 0) {
      lfoCount = 1
    }

    this.ampParams = new AmplifierParameters()
    this.envelopes = Array.from({ length: 2 }, () => new EnvelopeParameters())
    this.filterParams = new FilterParameters()
    this.fineTune = 0x80
    // instrParams is set by the subclass
    // kind is provided by the subclass
    // kindToStr is provided by the subclass
    this.lfos = Array.from({ length: lfoCount }, () => new LFOParameters())
    this.mixerParams = new MixerParameters()
    this.name = ''
    this.pitch = 0x00
    this.table = new Table()
    this.tableTick = 0x01
    this.transpose = true // 0x01
    this.volume = 0x00
  }

  /**
   * @inheritdoc
   */
  asObject (skipHeader = false) {
    const object = {
      ...(skipHeader ? {} : this.headerAsObject()),
      ampParams: this.ampParams.asObject(),
      envelopes: this.envelopes.map((env) => env.asObject()),
      filterParams: this.filterParams.asObject(),
      fineTune: this.fineTune,
      kind: this.kind(),
      kindStr: this.kindToStr(),
      lfos: this.lfos.map((lfo) => lfo.asObject()),
      mixerParams: this.mixerParams.asObject(),
      name: this.name,
      pitch: this.pitch,
      // table is handled below
      tableTick: this.tableTick,
      transpose: this.transpose,
      volume: this.volume
    }

    if (typeof this.instrParams !== 'undefined') {
      object.instrParams = this.instrParams.asObject()
    }

    if (!skipHeader) {
      object.table = this.table.asObject()
    }

    return object
  }

  /**
   * Returns an array of commands for the instrument.
   *
   * @returns {Array<String>}
   *
   * @abstract
   */
  /* istanbul ignore next */
  getCommands () {
    throw new TypeError('getCommands must be implemented by extending class')
  }

  /**
   * Returns an array of envelope/LFO destinations for the instrument.
   *
   * @returns {Array<String>}
   *
   * @abstract
   */
  /* istanbul ignore next */
  getEnvLfoDests () {
    throw new TypeError('getEnvLfoDests must be implemented by extending class')
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @returns {Array<Number>}
   */
  getMIDIDestLabels () {
    return INSTRUMENTMIDILabels
  }

  /**
   * Returns the Instrument kind.
   *
   * @returns {Number}
   *
   * @abstract
   */
  /* istanbul ignore next */
  kind () {
    throw new TypeError('kind must be implemented by extending class')
  }

  /**
   * Returns a string representation of the Instrument kind.
   *
   * @returns {String}
   *
   * @abstract
   */
  /* istanbul ignore next */
  kindToStr () {
    throw new TypeError('kindToStr must be implemented by extending class')
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return [
      ...this.getHeaderObjectProperties(),
      'ampParams',
      'envelopes',
      'filterParams',
      'fineTune',
      'instrParams',
      'kind',
      'kindStr',
      'lfos',
      'mixerParams',
      'name',
      'pitch',
      'table',
      'tableTick',
      'transpose',
      'volume'
    ]
  }
}

module.exports = BaseInstrument
