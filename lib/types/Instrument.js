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

const { LATEST_M8_VERSION, M8FileTypes, VERSION_1_4_0, VERSION_2_5_1, VERSION_2_6_0, VERSION_2_7_0 } = require('../constants')
const { bytesFromBool, bytesForSkippedData, bytesFromString, toM8HexStr } = require('../helpers')
const M8File = require('./M8File')
const M8FileReader = require('./M8FileReader')
const Table = require('./Table')

function emptyAmplifierSettings (instr) {
  instr.ampParams.amp = 0xFF
  instr.ampParams.limit = 0xFF
}

function emptyFilterParameters (instr) {
  instr.filterParams.res = 0xFF
  instr.filterParams.type = 0xFF
}

function emptyMixerParameters (instr) {
  instr.mixerParams.cho = 0xFF
  instr.mixerParams.del = 0xFF
  instr.mixerParams.dry = 0xFF
  instr.mixerParams.rev = 0xFF
  instr.mixerParams.pan = 0xFF
}

function emptyEnvelopeParameters (instr) {
  instr.env.forEach((env) => {
    env.attack = 0xFF
    env.decay = 0xFF
    env.dest = 0xFF
    env.hold = 0xFF
    env.retrigger = 0xFF
  })
}
function emptyLFOParameters (instr) {
  instr.lfo.forEach((lfo) => {
    lfo.dest = 0xFF
    lfo.freq = 0xFF
    lfo.retrigger = 0xFF
    lfo.shape = 0xFF
    lfo.triggerMode = 0xFF
  })
}

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
// These are the FMSYNTH envelope destinations as of 2.6.0
const FMSYNTHEnvDests = [
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

// These are the oscillator shapes as of 2.7.0
const FMSYNTHOscShapes = [
  'SIN', // 0x00
  'SW2', // 0x01
  'SW3', // 0x02
  'SW4', // 0x03
  'SW5', // 0x04
  'SW6', // 0x05
  'TRI', // 0x06
  'SAW', // 0x07
  'SQR', // 0x08
  'PUL', // 0x09
  'IMP', // 0x0A
  'NOI', // 0x0B
  'NLP', // 0x0C (Not available prior to 2.7.0)
  'NHP', // 0x0D (Not available prior to 2.7.0)
  'NBP', // 0x0E (Not available prior to 2.7.0)
  'CLK' // 0x0F (Not available prior to 2.7.0)
]
// These are the oscillator shapes prior to 2.7.0
const FMSYNTHOscShapesPre270 = FMSYNTHOscShapes.slice(0, FMSYNTHOscShapes.length - 4)
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

// These are the LFO Shapes as of 2.6.0
const LFOShapes = [
  'TRI', // 0x00
  'SIN', // 0x01
  'RAMP DN', // 0x02
  'RAMP UP', // 0x03
  'EXP DN', // 0x04
  'EXP UP', // 0x05
  'SQU DN', // 0x06
  'SQU UP', // 0x07
  'RANDOM', // 0x08
  'DRUNK', // 0x09
  'TRI T', // 0x0A
  'SIN T', // 0x0B
  'RAMPD T', // 0x0C
  'RAMPU T', // 0x0D
  'EXPD T', // 0x0E
  'EXPU T', // 0x0F
  'SQ. D T', // 0x10
  'SQ. U T', // 0x11
  'RAND T', // 0x12
  'DRNK T' // 0x13
]
// These are the Trigger Mode names as of 2.6.0
const LFOTriggerModes = [
  'FREE', // 0x00
  'RETRIG', // 0x01
  'HOLD', // 0x02
  'ONCE' // 0x03
]
// These are the MACROSYN envelope/LFO destinations as of 2.6.0
const MACROSYNEnvDests = [
  'OFF', // 0x00
  'VOLUME', // 0x01
  'PITCH', // 0x02
  'TIMBRE', // 0x03
  'COLOR', // 0x04
  'DEGRADE', // 0x05
  'REDUX', // 0x06
  'CUTOFF', // 0x07
  'RES', // 0x08
  'AMP', // 0x09
  'PAN' // 0x0A
]
// These are the MIDI Mapping labels for MACROSYNTH
const MACROSYNTHMIDILabels = new Array(18)

MACROSYNTHMIDILabels.fill('UNUSED')
MACROSYNTHMIDILabels[4] = 'TIMBRE'
MACROSYNTHMIDILabels[5] = 'COLOR'
MACROSYNTHMIDILabels[6] = 'DEGRADE'
MACROSYNTHMIDILabels[7] = 'REDUX'
MACROSYNTHMIDILabels[9] = 'CUTOFF'
MACROSYNTHMIDILabels[10] = 'RES'
MACROSYNTHMIDILabels[11] = 'AMP'
MACROSYNTHMIDILabels[13] = 'PAN'
MACROSYNTHMIDILabels[14] = 'DRY'
MACROSYNTHMIDILabels[15] = 'CHO'
MACROSYNTHMIDILabels[16] = 'DEL'
MACROSYNTHMIDILabels[17] = 'REV'

const MACROSYNTHShapes = [
  'CSAW', // 0x00
  'MORPH', // 0x01
  'SAW SQUARE', // 0x02
  'SINE TRIANGLE', // 0x03
  'BUZZ', // 0x04
  'SQUARE SUB', // 0x05
  'SAW SUB', // 0x06
  'SQUARE SYNC', // 0x07
  'SAW SYNC', // 0x08
  'TRIPLE SAW', // 0x09
  'TRIPLE SQUARE', // 0x0A
  'TRIPLE TRIANGLE', // 0x0B
  'TRIPLE SIN', // 0x0C
  'TRIPLE RNG', // 0x0D
  'SAW SWARM', // 0x0E
  'SAW COMB', // 0x0F
  'TOY', // 0x10
  'DIGITAL FILTER LP', // 0x11
  'DIGITAL FILTER PK', // 0x12
  'DIGITAL FILTER BP', // 0x13
  'DIGITAL FILTER HP', // 0x14
  'VOSIM', // 0x15
  'VOWEL', // 0x16
  'VOWEL FOF', // 0x17
  'HARMONICS', // 0x18
  'FM', // 0x19
  'FEEDBACK FM', // 0x1A
  'CHAOTIC FEEDBACK FM', // 0x1B
  'PLUCKED', // 0x1C
  'BOWED', // 0x1D
  'BLOWN', // 0x1E
  'FLUTED', // 0x1F (Not available prior to 2.6.0)
  'STRUCK BELL', // 0x20
  'STRUCK DRUM', // 0x21
  'KICK', // 0x22
  'CYMBAL', // 0x23
  'SNARE', // 0x24
  'WAVETABLES', // 0x25
  'WAVE MAP', // 0x26
  'WAV LINE', // 0x27
  'WAV PARAPHONIC', // 0x28
  'FILTERED NOISE', // 0x29
  'TWIN PEAKS NOISE', // 0x2A
  'CLOCKED NOISE', // 0x2B
  'GRANULAR CLOUD', // 0x2C
  'PARTICLE NOISE', // 0x2D
  'DIGITAL MOD', // 0x2E (Not available prior to 2.6.0)
  'MORSE NOISE' // 0x2F (Not available prior to 2.6.0)
]
const MACROSYNTHShapesPre260 = MACROSYNTHShapes.slice(0, 30).concat(MACROSYNTHShapes.slice(31, MACROSYNTHShapes.length - 2))
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

const MIDIOUTPortNames = [
  'MIDI+USB', // 0x00
  'MIDI', // 0x01
  'USB', // 0x02
  'INTERNAL' // 0x03 (Not available prior to 2.7.0)
]
const MIDIOUTPortNamesPre270 = MIDIOUTPortNames.slice(0, MIDIOUTPortNames.length - 1)
// These are the SAMPLER envelope/LFO destinations as of 2.6.0
const SAMPLEREnvDests = [
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

// These are the WAVSYNTH envelope/LFO destinations as of 2.6.0
const WAVSYNTHEnvDests = [
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
// These are the WAVSYNTH Filter types
const WAVSYNTHFilterTypes = [
  'WAV LP',
  'WAV HP',
  'WAV BP',
  'WAV BS'
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

// Internal classes

/**
 * Represents the Amplifier Parameters of an Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class AmplifierParameters {
  /** @member {Number} */
  amp
  /** @member {Number} */
  limit

  /**
   * Create an Instrument's Filter Parameters.
   */
  constructor () {
    this.amp = 0x00
    this.limit = 0x00
  }

  /**
   * Returns a string representation of the limit type.
   *
   * @returns {String}
   */
  limitToStr () {
    switch (this.limit) {
      case 0:
        return 'CLIP'
      case 1:
        return 'SIN'
      case 2:
        return 'FOLD'
      case 3:
        return 'WRAP'
      case 4:
        return 'POST'
      case 5:
        return 'POST: AD'
      default:
        return `UNKNOWN (${toM8HexStr(this.limit)})`
    }
  }
}

/**
 * Represents the Envelope Parameters of an Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class EnvelopeParameters {
  /** @member {Number} */
  amount
  /** @member {Number} */
  attack
  /** @member {Number} */
  decay
  /** @member {Number} */
  dest
  /** @member {Number} */
  hold
  /** @member {Number} */
  retrigger

  /**
   * Create an Instrument's Envelope Parameters.
   */
  constructor () {
    this.amount = 0xFF
    this.attack = 0x00
    this.decay = 0x80
    this.dest = 0x00
    this.hold = 0x00
    this.retrigger = 0x00
  }
}

/**
 * Represents the Filter Parameters of an Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class FilterParameters {
  /** @member {Number} */
  cutoff
  /** @member {Number} */
  res
  /** @member {Number} */
  type

  /**
   * Create an Instrument's Filter Parameters.
   */
  constructor () {
    this.cutoff = 0xFF
    this.res = 0x00
    this.type = 0x00
  }
}

/**
 * Represents the FMSYNTH Operator.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class FMSynthOperator {
  /** @member {Number} */
  feedback
  /** @member {Number} */
  level
  /** @member {Number} */
  modA
  /** @member {Number} */
  modB
  /** @member {Number} */
  ratio
  /** @member {Number} */
  ratioFine
  /** @member {Number} */
  shape

  /**
   * Create the FMSYNTH Operator.
   */
  constructor () {
    this.feedback = 0x00
    this.level = 0x80
    this.modA = 0x00
    this.modB = 0x00
    this.ratio = 0x01
    this.ratioFine = 0x00
    this.shape = 0x00
  }

  /**
   * Returns a string representation of the oscillator shape.
   *
   * @param {module:m8-js/lib/types.M8Version} [m8Version] - The M8 version (different versions of M8 use different
   * FMSYNTH shapes)
   *
   * @returns {String}
   */
  shapeToStr (m8Version) {
    if (typeof m8Version === 'undefined') {
      m8Version = LATEST_M8_VERSION
    }

    let oscName

    if (m8Version.compare(VERSION_2_7_0) < 0) {
      oscName = FMSYNTHOscShapesPre270[this.shape]
    } else {
      oscName = FMSYNTHOscShapes[this.shape]
    }

    return typeof oscName === 'undefined' ? 'UNK' : oscName
  }
}

/**
 * Represents the FMSYNTH Instrument Parameters
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class FMSynthParameters {
  /** @member {Number} */
  algo
  /** @member {Number} */
  mod1
  /** @member {Number} */
  mod2
  /** @member {Number} */
  mod3
  /** @member {Number} */
  mod4
  /** @member {Array<module:m8-js/lib/types.FMSynthOperator>} */
  operators

  /**
   * Create the FMSYNTH Instrument Parameters.
   */
  constructor () {
    this.algo = 0x00
    this.mod1 = 0x00
    this.mod2 = 0x00
    this.mod3 = 0x00
    this.mod4 = 0x00
    this.operators = new Array(4)

    for (let i = 0; i < this.operators.length; i++) {
      this.operators[i] = new FMSynthOperator()
    }
  }

  /**
   * Returns a string representation of the algo
   *
   * @returns {String}
   */
  algoToStr () {
    switch (this.algo) {
      case 0:
        return 'A>B>C>D'
      case 1:
        return '[A+B]>C>D'
      case 2:
        return '[A>B+C]>D'
      case 3:
        return '[A>B+A>C]>D'
      case 4:
        return '[A+B+C]>D'
      case 5:
        return '[A>B>C]+D'
      case 6:
        return '[A>B>C]+[A>B>D]'
      case 7:
        return '[A>B]+[C>D]'
      case 8:
        return '[A>B]+[A>C]+[A>D]'
      case 9:
        return '[A>B]+[A>C]+D'
      case 10:
        return '[A>B]+C+D'
      case 11:
        return 'A+B+C+D'
      default:
        return `UNKNOWN (${toM8HexStr(this.algo)})`
    }
  }

  /**
   * Returns a string representation of a modulator.
   *
   * @param {String} mod - The modulator
   *
   * @returns {String}
   */
  modToStr (mod) {
    switch (mod) {
      case 1:
        return '1>LEV'
      case 2:
        return '2>LEV'
      case 3:
        return '3>LEV'
      case 4:
        return '4>LEV'
      case 5:
        return '1>RAT'
      case 6:
        return '2>RAT'
      case 7:
        return '3>RAT'
      case 8:
        return '4>RAT'
      case 9:
        return '1>PIT'
      case 10:
        return '2>PIT'
      case 11:
        return '3>PIT'
      case 12:
        return '4>PIT'
      case 13:
        return '1>FBK'
      case 14:
        return '2>FBK'
      case 15:
        return '3>FBK'
      case 16:
        return '4>FBK'
      default:
        return '-----'
    }
  }
}

/**
 * Represents the LFO Parameters of an Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class LFOParameters {
  /** @member {Number} */
  amount
  /** @member {Number} */
  dest
  /** @member {Number} */
  freq
  /** @member {Number} */
  retrigger
  /** @member {Number} */
  shape
  /** @member {Number} */
  triggerMode

  /**
   * Create an Instrument's LFO Parameters.
   */
  constructor () {
    this.amount = 0xFF
    this.dest = 0x00
    this.freq = 0x10
    this.retrigger = 0x00
    this.shape = 0x00
    this.triggerMode = 0x00
  }

  /**
   * Returns a string representation of the LFO shape.
   *
   * @returns {String}
   */
  shapeToStr () {
    return LFOShapes[this.shape] || `UNKNOWN (${toM8HexStr(this.shape)})`
  }

  triggerModeToStr () {
    return LFOTriggerModes[this.triggerMode] || `UNKNOWN (${toM8HexStr(this.triggerMode)})`
  }
}

/**
 * Represents the MACROSYNGTH Instrument Parameters.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MacrosynthParameters {
  /** @member {Number} */
  color
  /** @member {Number} */
  degrade
  /** @member {Number} */
  redux
  /** @member {Number} */
  shape
  /** @member {Number} */
  timbre

  /**
   * Create the MACROSYNTH Instrument Parameters.
   */
  constructor () {
    this.color = 0x80
    this.degrade = 0x00
    this.redux = 0x00
    this.shape = 0x00
    this.timbre = 0x80
  }

  /**
   * Returns a string representation of the wave shape.
   *
   * @param {module:m8-js/lib/types.M8Version} [m8Version] - The M8 version (different versions of M8 use different
   * MACROSYNTH shapes)
   *
   * @returns {String}
   */
  shapeToStr (m8Version) {
    if (typeof m8Version === 'undefined') {
      m8Version = LATEST_M8_VERSION
    }

    let shapeName

    if (m8Version.compare(VERSION_2_6_0) < 0) {
      shapeName = MACROSYNTHShapesPre260[this.shape]
    } else {
      shapeName = MACROSYNTHShapes[this.shape]
    }

    return typeof shapeName === 'undefined' ? `UNKNOWN (${toM8HexStr(this.shape)})` : shapeName
  }
}

/**
 * Represents a MIDI CC.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MIDICC {
  /** @member {Number} */
  number
  /** @member {Number} */
  defaultValue

  /**
   * Creates an MIDI CC.
   */
  constructor () {
    this.defaultValue = 0xFF
    this.number = 0xFF
  }
}

/**
 * Represents the MIDIOUT Instrument Parameters.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MIDIOutParameters {
  /** @member {Number} */
  bankSelect
  /** @member {Number} */
  channel
  /** @member {Array<module:m8-js/lib/types.MIDICC>} */
  customCC
  /** @member {Number} */
  port
  /** @member {Number} */
  programChange

  /**
   * Create the MIDIOUT Instrument Parameters.
   */
  constructor () {
    this.customCC = new Array(10)

    for (let i = 0; i < this.customCC.length; i++) {
      this.customCC[i] = new MIDICC()
    }

    this.bankSelect = 0xFF
    this.channel = 0x01
    this.port = 0x00
    this.programChange = 0xFF
  }

  /**
   * Returns a string representation of the port.
   *
   * @param {module:m8-js/lib/types.M8Version} [m8Version] - The M8 version (different versions of M8 use different
   * MIDIOUT port names)
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

    return typeof portName === 'undefined' ? `UNKNOWN (${toM8HexStr(this.port)})` : portName
  }
}

/**
 * Represents the Mixer Parameters of an Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MixerParameters {
  /** @member {Number} */
  cho
  /** @member {Number} */
  del
  /** @member {Number} */
  dry
  /** @member {Number} */
  pan
  /** @member {Number} */
  rev

  /**
   * Create an Instrument's Mixer Parameters.
   */
  constructor () {
    this.cho = 0x00
    this.del = 0x00
    this.dry = 0xC0
    this.pan = 0x80
    this.rev = 0x00
  }
}

/**
 * Represents the SAMPLER Instrument Parameters.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class SamplerParameters {
  /** @member {Number} */
  degrade
  /** @member {Number} */
  length
  /** @member {Number} */
  loopStart
  /** @member {Number} */
  playMode
  /** @member {String} */
  samplePath // Unfortunately, this is set by the Instrument class due to M8 file structure
  /** @member {Number} */
  slice
  /** @member {Number} */
  start

  /**
   * Create the SAMPLER Instrument Parameters.
   */
  constructor () {
    this.degrade = 0x00
    this.length = 0xFF
    this.loopStart = 0x00
    this.playMode = 0x00
    this.samplePath = ''
    this.slice = 0x00
    this.start = 0x00
  }

  /**
   * Returns a string representation of the play mode.
   *
   * @returns {String}
   */
  playModeToStr () {
    switch (this.playMode) {
      case 0:
        return 'FWD'
      case 1:
        return 'REV'
      case 2:
        return 'FWDLOOP'
      case 3:
        return 'REVLOOP'
      case 4:
        return 'FWD PP'
      case 5:
        return 'REV PP'
      case 6:
        return 'OSC'
      case 7:
        return 'OSC REV'
      case 8:
        return 'OSC PP'
      default:
        return `UNKNOWN (${toM8HexStr(this.playMode)})`
    }
  }

  /**
   * Returns a sanitized representation of the sample path.
   *
   * @returns {String}
   */
  samplePathToStr () {
    const samplePathParts = this.samplePath.split('/')
    let sanitizedSamplePath

    // Remove any folder hierarchy
    sanitizedSamplePath = samplePathParts[samplePathParts.length - 1]
    // Remove the file extension
    sanitizedSamplePath = sanitizedSamplePath.split('.').slice(0, -1).join('.')

    if (sanitizedSamplePath.length > 16) {
      // Trim to 16 characters (first 8, _, last 7)
      sanitizedSamplePath = sanitizedSamplePath.slice(0, 8) + '_' + sanitizedSamplePath.slice(sanitizedSamplePath.length - 7)
    }

    // Upper case
    return sanitizedSamplePath.toUpperCase()
  }
}

/**
 * Represents the WAVSYNTH Instrument Parameters.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class WavsynthParameters {
  /** @member {Number} */
  mirror
  /** @member {Number} */
  mult
  /** @member {Number} */
  shape
  /** @member {Number} */
  size
  /** @member {Number} */
  warp

  /**
   * Create the WAVSYNTH Instrument Parameters.
   */
  constructor () {
    this.mirror = 0x00
    this.mult = 0x00
    this.shape = 0x00
    this.size = 0x20
    this.warp = 0x00
  }

  /**
   * Returns a string representation of the wave shape.
   *
   * @returns {String}
   */
  shapeToStr () {
    switch (this.shape) {
      case 0:
        return 'PULSE 12%'
      case 1:
        return 'PULSE 25%'
      case 2:
        return 'PULSE 50%'
      case 3:
        return 'PULSE 75%'
      case 4:
        return 'SAW'
      case 5:
        return 'TRIANGLE'
      case 6:
        return 'SINE'
      case 7:
        return 'NOISE PITCHED'
      case 8:
        return 'NOISE'
      default:
        // Anything 9 and over is 'OVERFLOW'
        return 'OVERFLOW'
    }
  }
}

// Exported classes

/**
 * Represents an Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types.M8File
 * @memberof module:m8-js/lib/types
 */
class Instrument extends M8File {
  /** @member {module:m8-js/lib/types.AmplifierParameters} */
  ampParams
  /** @member {String} */
  author
  /** @member {Array<module:m8-js/lib/types.EnvelopeParameters>} */
  env
  /** @member {module:m8-js/lib/types.FilterParameters} */
  filterParams
  /** @member {Number} */
  fineTune
  /** @member {module:m8-js/lib/types.FMSynthParameters|module:m8-js/lib/types.MacrosynthParameters|module:m8-js/lib/types.MIDIOutParameters|module:m8-js/lib/types.SamplerParameters|module:m8-js/lib/types.WavsynthParameters} */
  instrParams
  /** @member {Number} */
  kind
  /** @member {Array<module:m8-js/lib/types.LFOParameters>} */
  lfo
  /** @member {module:m8-js/lib/types.MixerParameters} */
  mixerParams
  /** @member {String} */
  name
  /** @member {Number} */
  pitch
  /** @member {module:m8-js/lib/types.Table} */
  tableData
  /** @member {Number} */
  tableTick
  /** @member {Boolean} */
  transpose
  /** @member {Number} */
  volume
  /** @private */
  #kindStr

  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} [m8FileReaderOrVersion] - The M8
   * version of the Instrument (or the M8FileReader used to read the M8 file)
   * @param {Number} kind - The M8 instrument kind
   * @param {String} kindStr - The M8 instrument kind as string
   * @param {module:m8-js/lib/types.FMSynthParameters|module:m8-js/lib/types.MacrosynthParameters|module:m8-js/lib/types.MIDIOutParameters|module:m8-js/lib/types.SamplerParameters|module:m8-js/lib/types.WavsynthParameters} [instrParams] - The instrument parameters
   */
  constructor (m8FileReaderOrVersion, kind, kindStr, instrParams) {
    if (typeof m8FileReaderOrVersion === 'undefined') {
      super(M8FileTypes.Instrument, LATEST_M8_VERSION)
    } else {
      if (m8FileReaderOrVersion.constructor.name === 'M8FileReader') {
        super(m8FileReaderOrVersion)
      } else {
        super(M8FileTypes.Instrument, m8FileReaderOrVersion)
      }
    }

    this.ampParams = new AmplifierParameters()
    this.env = new Array(2)
    this.filterParams = new FilterParameters()
    this.fineTune = 0x80
    this.instrParams = instrParams
    this.kind = kind
    this.mixerParams = new MixerParameters()
    this.name = ''
    this.pitch = 0x00
    this.tableData = new Table()
    this.tableTick = 0x01
    this.transpose = true // 0x01
    this.volume = 0x00
    this.#kindStr = kindStr

    for (let i = 0; i < this.env.length; i++) {
      this.env[i] = new EnvelopeParameters()
    }

    if (this.m8FileVersion.compare(VERSION_1_4_0) < 0) {
      this.lfo = new Array(1)
    } else {
      this.lfo = new Array(2)
    }

    for (let i = 0; i < this.lfo.length; i++) {
      this.lfo[i] = new LFOParameters()
    }
  }

  /**
   * Returns a string representation of the destination.
   *
   * @param {String} dest - The destination
   */
  destToStr (dest) {
    let envDests

    switch (this.kind) {
      case 0x00:
        envDests = WAVSYNTHEnvDests
        break
      case 0x01:
        envDests = MACROSYNEnvDests
        break
      case 0x02:
        envDests = SAMPLEREnvDests
        break
      case 0x04:
        envDests = FMSYNTHEnvDests
        break
      default:
        envDests = []
    }

    return envDests[dest] || `UNKNOWN (${toM8HexStr(dest)})`
  }

  /**
   * Returns a string representation of the Filter type.
   *
   * @returns {String}
   */
  filterTypeToStr () {
    let filterName

    if (this.kindToStr() === 'WAVSYNTH') {
      if (this.m8FileVersion.compare(VERSION_2_5_1) >= 0) {
        filterName = FilterTypes.concat(WAVSYNTHFilterTypes)[this.filterParams.type]
      } else {
        filterName = FilterTypesPre251.concat(WAVSYNTHFilterTypes)[this.filterParams.type]
      }
    } else {
      filterName = FilterTypes[this.filterParams.type]
    }

    return typeof filterName === 'undefined' ? `UNKNOWN (${toM8HexStr(this.filterParams.type)})` : filterName
  }

  /**
   * Returns a string representation of the Instrument kind.
   *
   * @returns {String}
   */
  kindToStr () {
    return this.#kindStr
  }

  /**
   * @inheritdoc
   */
  asBytes () {
    const bytes = []

    bytes.push(...this.headerAsBytes())
    bytes.push(...this.asEmbeddedBytes(bytes.length, true))

    return bytes
  }

  /**
   * Returns the M8 Instruments embedded (raw, no header or other information) bytes.
   *
   * @param {Number} offset - The offset
   * @param {Boolean} includeTable - Whether or not to include the table bytes
   *
   * @returns {Array<Number>}
   */
  asEmbeddedBytes (offset, includeTable) {
    const bytes = []

    bytes.push(this.kind)
    bytes.push(...bytesFromString(this.name, 12, this.kind === 0xFF ? 0xFF : 0x00))
    bytes.push(bytesFromBool(this.transpose))
    bytes.push(this.tableTick)

    // Do not write these values for 'MIDI OUT', they aren't here when reading
    if (this.kind !== 0x03) {
      bytes.push(this.volume)
      bytes.push(this.pitch)
      bytes.push(this.fineTune)
    }

    // Instrument-specific parameters
    // Read instrument-specific parameters
    switch (this.kind) {
      // WAVSYNTH
      case 0x00:
        bytes.push(this.instrParams.shape)
        bytes.push(this.instrParams.size)
        bytes.push(this.instrParams.mult)
        bytes.push(this.instrParams.warp)
        bytes.push(this.instrParams.mirror)

        break

      // MACROSYNTH
      case 0x01:
        bytes.push(this.instrParams.shape)
        bytes.push(this.instrParams.timbre)
        bytes.push(this.instrParams.color)
        bytes.push(this.instrParams.degrade)
        bytes.push(this.instrParams.redux)

        break

      // SAMPLER
      case 0x02:
        bytes.push(this.instrParams.playMode)
        bytes.push(this.instrParams.slice)
        bytes.push(this.instrParams.start)
        bytes.push(this.instrParams.loopStart)
        bytes.push(this.instrParams.length)
        bytes.push(this.instrParams.degrade)

        break

      // MIDIOUT
      case 0x03:
        bytes.push(this.instrParams.port)
        bytes.push(this.instrParams.channel)
        bytes.push(this.instrParams.bankSelect)
        bytes.push(this.instrParams.programChange)

        // Write 3 empty bytes (unused data)
        bytes.push(0x00, 0x00, 0x00)

        for (let i = 0; i < this.instrParams.customCC.length; i++) {
          const customCC = this.instrParams.customCC[i]

          bytes.push(customCC.number)
          bytes.push(customCC.defaultValue)
        }

        break

      // FMSYNTH
      case 0x04:
        bytes.push(this.instrParams.algo)

        // If supported, write the synth shapes
        if (this.m8FileVersion.compare(VERSION_1_4_0) >= 0) {
          for (let i = 0; i < this.instrParams.operators.length; i++) {
            bytes.push(this.instrParams.operators[i].shape)
          }
        }

        // Read the ratios
        for (let i = 0; i < this.instrParams.operators.length; i++) {
          const operator = this.instrParams.operators[i]

          bytes.push(operator.ratio)
          bytes.push(operator.ratioFine)
        }

        // Read the feedback/volume of each operator
        for (let i = 0; i < this.instrParams.operators.length; i++) {
          const operator = this.instrParams.operators[i]

          bytes.push(operator.level)
          bytes.push(operator.feedback)
        }

        // Read first modulator slot controls
        for (let i = 0; i < this.instrParams.operators.length; i++) {
          const operator = this.instrParams.operators[i]

          bytes.push(operator.modA)
        }

        // Read second modulator slot controls
        for (let i = 0; i < this.instrParams.operators.length; i++) {
          const operator = this.instrParams.operators[i]

          bytes.push(operator.modB)
        }

        // Read modulation sources
        bytes.push(this.instrParams.mod1)
        bytes.push(this.instrParams.mod2)
        bytes.push(this.instrParams.mod3)
        bytes.push(this.instrParams.mod4)

        break

      // NONE
      case 0xFF:
        // Do nothing

        break
      default:
        /* istanbul ignore next */
        throw new TypeError(`Unsupported Instrument type: ${toM8HexStr(this.kind)}`)
    }

    // Filter parameters
    bytes.push(this.filterParams.type)
    bytes.push(this.filterParams.cutoff)
    bytes.push(this.filterParams.res)

    // Amplifier parameters
    bytes.push(this.ampParams.amp)
    bytes.push(this.ampParams.limit)

    // Write mixer parameters
    bytes.push(this.mixerParams.pan)
    bytes.push(this.mixerParams.dry)
    bytes.push(this.mixerParams.cho)
    bytes.push(this.mixerParams.del)
    bytes.push(this.mixerParams.rev)

    // Envelope parameters
    for (let i = 0; i < this.env.length; i++) {
      const env = this.env[i]

      bytes.push(env.dest)
      bytes.push(env.amount)
      bytes.push(env.attack)
      bytes.push(env.hold)
      bytes.push(env.decay)
      bytes.push(env.retrigger)
    }

    // LFO parameters
    for (let i = 0; i < this.lfo.length; i++) {
      const lfo = this.lfo[i]

      bytes.push(lfo.shape)
      bytes.push(lfo.dest)
      bytes.push(lfo.triggerMode)
      bytes.push(lfo.freq)
      bytes.push(lfo.amount)
      bytes.push(lfo.retrigger)
    }

    // Fill in the empty values between instrument parameters and the sample path (when present)
    bytes.push(...bytesForSkippedData(this.m8FileReader,
                                      offset + bytes.length,
                                      (offset + 0x57) - (offset + bytes.length),
                                      0xFF))

    // Sample Path (when present)
    bytes.push(...bytesFromString(this.kind === 0x02 ? this.instrParams.samplePath : '', 128))

    // Write table data whenever writing an Instrument file versus being writing a Song file
    if (includeTable) {
      bytes.push(...this.tableData.asBytes())
    }

    return bytes
  }

  /**
   * Returns an Instrument based on the raw M8 file bytes.
   *
   * @param {Array<Number>} bytes - The Instruments's raw bytes
   *
   * @returns {module:m8-js/lib/types.Instrument}
   */
  static fromBytes (bytes) {
    return Instrument.fromFileReader(new M8FileReader(bytes))
  }

  /**
   * Returns an Instrument from its bytes.
   *
   * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader for reading the Song
   *
   * @returns {module:m8-js/lib/types.Instrument}
   */
  static fromFileReader (fileReader) {
    const startPos = fileReader.cursor

    // Read parameters that ALL instruments have
    const kind = fileReader.read()
    const name = fileReader.readStr(12)
    const transpose = Boolean(fileReader.read())
    const tableTick = fileReader.read()
    let volume = 0x00
    let pitch = 0x00
    let fineTune = 0x80

    // It appears that these are not present for 'MIDI OUT'
    if (kind !== 0x03) {
      volume = fileReader.read()
      pitch = fileReader.read()
      fineTune = fileReader.read()
    }

    let instr

    // Read instrument-specific parameters
    switch (kind) {
      case 0x00:
        instr = new Wavsynth(fileReader)

        instr.instrParams.shape = fileReader.read()
        instr.instrParams.size = fileReader.read()
        instr.instrParams.mult = fileReader.read()
        instr.instrParams.warp = fileReader.read()
        instr.instrParams.mirror = fileReader.read()

        break
      case 0x01:
        instr = new Macrosynth(fileReader)

        instr.instrParams.shape = fileReader.read()
        instr.instrParams.timbre = fileReader.read()
        instr.instrParams.color = fileReader.read()
        instr.instrParams.degrade = fileReader.read()
        instr.instrParams.redux = fileReader.read()

        break
      case 0x02:
        instr = new Sampler(fileReader)

        instr.instrParams.playMode = fileReader.read()
        instr.instrParams.slice = fileReader.read()
        instr.instrParams.start = fileReader.read()
        instr.instrParams.loopStart = fileReader.read()
        instr.instrParams.length = fileReader.read()
        instr.instrParams.degrade = fileReader.read()

        break
      case 0x03:
        instr = new MIDIOut(fileReader)

        instr.instrParams.port = fileReader.read()
        instr.instrParams.channel = fileReader.read()
        instr.instrParams.bankSelect = fileReader.read()
        instr.instrParams.programChange = fileReader.read()

        // Discard the next 3 bytes (unused data)
        fileReader.read(3)

        for (let i = 0; i < instr.instrParams.customCC.length; i++) {
          const customCC = instr.instrParams.customCC[i]

          customCC.number = fileReader.read()
          customCC.defaultValue = fileReader.read()
        }

        break
      case 0x04:
        instr = new FMSynth(fileReader)

        instr.instrParams.algo = fileReader.read()

        // If supported, read the synth shapes
        if (fileReader.m8Version.compare(VERSION_1_4_0) >= 0) {
          for (let i = 0; i < instr.instrParams.operators.length; i++) {
            instr.instrParams.operators[i].shape = fileReader.read()
          }
        }

        // Read the ratios
        for (let i = 0; i < instr.instrParams.operators.length; i++) {
          const operator = instr.instrParams.operators[i]

          operator.ratio = fileReader.read()
          operator.ratioFine = fileReader.read()
        }

        // Read the feedback/volume of each operator
        for (let i = 0; i < instr.instrParams.operators.length; i++) {
          const operator = instr.instrParams.operators[i]

          operator.level = fileReader.read()
          operator.feedback = fileReader.read()
        }

        // Read first modulator slot controls
        for (let i = 0; i < instr.instrParams.operators.length; i++) {
          const operator = instr.instrParams.operators[i]

          operator.modA = fileReader.read()
        }

        // Read second modulator slot controls
        for (let i = 0; i < instr.instrParams.operators.length; i++) {
          const operator = instr.instrParams.operators[i]

          operator.modB = fileReader.read()
        }

        // Read modulation sources
        instr.instrParams.mod1 = fileReader.read()
        instr.instrParams.mod2 = fileReader.read()
        instr.instrParams.mod3 = fileReader.read()
        instr.instrParams.mod4 = fileReader.read()

        break
      case 0xFF:
        instr = new None(fileReader)

        break
      default:
        /* istanbul ignore next */
        throw new TypeError(`Unsupported Instrument type: ${toM8HexStr(kind)}`)
    }

    // Read parameters that ALL instruments have
    // instr.kind is set by the instrument class itself
    instr.name = name
    instr.transpose = transpose
    instr.tableTick = tableTick

    // It appears that these are not present for 'MIDI OUT'
    if (instr.kindToStr() !== 'MIDI OUT') {
      instr.volume = volume
      instr.pitch = pitch
      instr.fineTune = fineTune
    }

    // Read filter parameters
    instr.filterParams.type = fileReader.read()
    instr.filterParams.cutoff = fileReader.read()
    instr.filterParams.res = fileReader.read()

    // Read amplifier parameters
    instr.ampParams.amp = fileReader.read()
    instr.ampParams.limit = fileReader.read()

    // Read mixer parameters
    instr.mixerParams.pan = fileReader.read()
    instr.mixerParams.dry = fileReader.read()
    instr.mixerParams.cho = fileReader.read()
    instr.mixerParams.del = fileReader.read()
    instr.mixerParams.rev = fileReader.read()

    // Read envelope parameters
    for (let i = 0; i < instr.env.length; i++) {
      const env = instr.env[i]

      env.dest = fileReader.read()
      env.amount = fileReader.read()
      env.attack = fileReader.read()
      env.hold = fileReader.read()
      env.decay = fileReader.read()
      env.retrigger = fileReader.read()
    }

    // Read LFO parametersj
    for (let i = 0; i < instr.lfo.length; i++) {
      const lfo = instr.lfo[i]

      lfo.shape = fileReader.read()
      lfo.dest = fileReader.read()
      lfo.triggerMode = fileReader.read()
      lfo.freq = fileReader.read()
      lfo.amount = fileReader.read()
      lfo.retrigger = fileReader.read()
    }

    // Skip to the sample path (when present) and record the unused bytes
    fileReader.skipTo(startPos + 0x57) // Jump amount differs based on instrument type

    // Read Sample Path (Unfortunate that it happens here)
    if (instr.kindToStr() === 'SAMPLER') {
      instr.instrParams.samplePath = fileReader.readStr(127)

      // Discard the next byte
      fileReader.skip(1)
    } else {
      // Discard the bytes corresponding to the sample path when it's not present
      fileReader.skip(128)
    }

    // Read table data whenever the Instrument is read from an Instrument file versus being read from a Song file
    if (fileReader.fileTypeToStr() === 'Instrument') {
      instr.tableData = Table.fromFileReader(fileReader)
    }

    return instr
  }
}

/**
 * Represents an FMSYNTH Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types.Instrument
 * @memberof module:m8-js/lib/types
 */
class FMSynth extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion, 0x04, 'FMSYNTH', new FMSynthParameters())
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @returns {Array<Number>}
   */
  static getMIDIDestLabels () {
    return [
      ...FMSYNTHMIDILabels,
      ...INSTRUMENTMIDILabels
    ]
  }
}

/**
 * Represents an Macrosynth Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Macrosynth extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion, 0x01, 'MACROSYN', new MacrosynthParameters())
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @returns {Array<Number>}
   */
  static getMIDIDestLabels () {
    return [
      ...MACROSYNTHMIDILabels,
      ...INSTRUMENTMIDILabels
    ]
  }
}

/**
 * Represents an MIDI Out Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class MIDIOut extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion, 0x03, 'MIDI OUT', new MIDIOutParameters())

    // Empty out the necessary values
    emptyAmplifierSettings(this)
    emptyEnvelopeParameters(this)
    emptyFilterParameters(this)
    emptyLFOParameters(this)
    emptyMixerParameters(this)
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @returns {Array<Number>}
   */
  static getMIDIDestLabels () {
    return MIDIOUTMIDILabels
  }
}

/**
 * Represents a None (empty) Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class None extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion, 0xFF, 'NONE')

    // Empty out the necessary values
    this.fineTune = 0xFF
    this.pitch = 0xFF
    this.volume = 0xFF

    emptyAmplifierSettings(this)
    emptyEnvelopeParameters(this)
    emptyFilterParameters(this)
    emptyLFOParameters(this)
    emptyMixerParameters(this)
  }
}

/**
 * Represents an Sampler Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Sampler extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion, 0x02, 'SAMPLER', new SamplerParameters())
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @returns {Array<Number>}
   */
  static getMIDIDestLabels () {
    return [
      ...SAMPLERMIDILabels,
      ...INSTRUMENTMIDILabels
    ]
  }
}

/**
 * Represents an Wavnsynth Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Wavsynth extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8FileReader|module:m8-js/lib/types.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion, 0x00, 'WAVSYNTH', new WavsynthParameters())
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @static
   *
   * @returns {Array<Number>}
   */
  static getMIDIDestLabels () {
    return [
      ...WAVSYNTHMIDILabels,
      ...INSTRUMENTMIDILabels
    ]
  }
}

// Exports
module.exports = {
  FMSynth,
  Instrument,
  Macrosynth,
  MIDIOut,
  None,
  Sampler,
  Wavsynth
}
