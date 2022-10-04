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

const Table = require('./Table')
const { LATEST_M8_VERSION, VERSION_1_4_0, VERSION_2_5_1, VERSION_2_6_0, VERSION_2_7_0 } = require('../constants')
const { toM8HexStr } = require('../helpers')

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
  /** @private */
  #m8Version

  /**
   * Create the FMSYNTH Operator.
   *
   * @param {M8Version} m8Version - The M8 version (different versions of M8 use different FMSYNTH oscillator shapes)
   */
  constructor (m8Version) {
    this.feedback = 0x00
    this.level = 0x80
    this.modA = 0x00
    this.modB = 0x00
    this.ratio = 0x01
    this.ratioFine = 0x00
    this.shape = 0x00
    this.#m8Version = m8Version || LATEST_M8_VERSION
  }

  /**
   * Returns a string representation of the oscillator shape.
   *
   * @returns {String}
   */
  shapeToStr () {
    let oscName

    if (this.#m8Version.compare(VERSION_2_7_0) < 0) {
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
   *
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version (different versions of M8 use different FMSYNTH oscillator shapes)
   */
  constructor (m8Version) {
    this.algo = 0x00
    this.mod1 = 0x00
    this.mod2 = 0x00
    this.mod3 = 0x00
    this.mod4 = 0x00
    this.operators = new Array(4)

    for (let i = 0; i < this.operators.length; i++) {
      this.operators[i] = new FMSynthOperator(m8Version)
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
  /** @member {module:m8-js/lib/types.M8Version} */
  #m8Version

  /**
   * Create the MACROSYNTH Instrument Parameters.
   *
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version (different versions of M8 use different MACROSYNTH shapes)
   */
  constructor (m8Version) {
    this.color = 0x80
    this.degrade = 0x00
    this.redux = 0x00
    this.shape = 0x00
    this.timbre = 0x80
    this.#m8Version = m8Version || LATEST_M8_VERSION
  }

  /**
   * Returns a string representation of the wave shape.
   *
   * @returns {String}
   */
  shapeToStr () {
    let shapeName

    if (this.#m8Version.compare(VERSION_2_6_0) < 0) {
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
  /** @private */
  #m8Version

  /**
   * Create the MIDIOUT Instrument Parameters.
   *
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version (different versions of M8 use different MIDI ports)
   */
  constructor (m8Version) {
    this.customCC = new Array(10)
    this.#m8Version = m8Version || LATEST_M8_VERSION

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
   * @returns {String}
   */
  portToStr () {
    let portName

    if (this.#m8Version.compare(VERSION_2_7_0) < 0) {
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
 * @memberof module:m8-js/lib/types
 */
class Instrument {
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
  /** @member {module:m8-js/lib/types.M8Version} */
  version
  /** @member {Number} */
  volume
  /** @private */
  #kindStr
  /** @private */
  #unusedBytes

  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   * @param {Number} kind - The M8 instrument kind
   * @param {String} kindStr - The M8 instrument kind as string
   * @param {module:m8-js/lib/types.FMSynthParameters|module:m8-js/lib/types.MacrosynthParameters|module:m8-js/lib/types.MIDIOutParameters|module:m8-js/lib/types.SamplerParameters|module:m8-js/lib/types.WavsynthParameters} [instrParams] - The instrument parameters
   */
  constructor (m8Version, kind, kindStr, instrParams) {
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
    this.version = m8Version || LATEST_M8_VERSION
    this.volume = 0x00
    this.#kindStr = kindStr
    this.#unusedBytes = {}

    for (let i = 0; i < this.env.length; i++) {
      this.env[i] = new EnvelopeParameters()
    }

    if (this.version.compare(VERSION_1_4_0) < 0) {
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
      if (this.version.compare(VERSION_2_5_1) >= 0) {
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
   * Returns the unused bytes map.
   *
   * @returns {Object} the unused bytes map
   */
  getUnusedBytes () {
    return this.#unusedBytes
  }

  /**
   * Updates the unused bytes map.
   *
   * @param {Object} unusedBytes - The unused bytes map
   */
  updateUnusedBytes (unusedBytes) {
    Object.keys(unusedBytes).forEach((offset) => {
      this.#unusedBytes[offset] = unusedBytes[offset]
    })
  }
}

/**
 * Represents an FMSYNTH Instrument.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class FMSynth extends Instrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   */
  constructor (m8Version) {
    super(m8Version, 0x04, 'FMSYNTH', new FMSynthParameters(m8Version))
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
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   */
  constructor (m8Version) {
    super(m8Version, 0x01, 'MACROSYN', new MacrosynthParameters(m8Version))
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
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   */
  constructor (m8Version) {
    super(m8Version, 0x03, 'MIDI OUT', new MIDIOutParameters(m8Version))

    // Empty out the necessary values
    emptyAmplifierSettings(this)
    emptyEnvelopeParameters(this)
    emptyFilterParameters(this)
    emptyLFOParameters(this)
    emptyMixerParameters(this)
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
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   */
  constructor (m8Version) {
    super(m8Version, 0xFF, 'NONE')

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
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   */
  constructor (m8Version) {
    super(m8Version, 0x02, 'SAMPLER', new SamplerParameters())
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
   * @param {module:m8-js/lib/types.M8Version} m8Version - The M8 version of the instrument
   */
  constructor (m8Version) {
    super(m8Version, 0x00, 'WAVSYNTH', new WavsynthParameters())
  }
}

// Exports
module.exports = {
  FMSynth,
  Macrosynth,
  MIDIOut,
  None,
  Sampler,
  Wavsynth
}
