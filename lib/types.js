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

// TODO: Add debug support
// TODO: Add error handling
// TODO: Create a Project type?
// TODO: Remove all uses of Buffer
// TODO: Use M8 Change Log as reference for feature/parsing (https://github.com/Dirtywave/M8Firmware/blob/main/changelog.txt)

const { fxCmdToStr, getNote, toM8HexStr } = require('./helpers')

// These are the filter types as of 2.5.1
const FilterTypes = [
  'OFF',
  'LOWPASS',
  'HIGHPASS',
  'BANDPASS',
  'BANDSTOP',
  'LP>HP'
]

// These are the filter types prior to 2.5.1
const FilterTypesPre251 = FilterTypes.slice(0, FilterTypes.length - 1)

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
  'NLP', // 0x0C
  'NHP', // 0x0D
  'NBP', // 0x0E
  'CLK' // 0x0F
]

// These are the oscillator shapes prior to 2.7.0
const FMSYNTHOscShapesPre270 = FMSYNTHOscShapes.slice(0, FMSYNTHOscShapes.length - 4)

// These are the LFO Shape as of 2.6.0
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

// These are the WAVSYNTH Filter types
const WAVSYNTHFilterTypes = [
  'WAV LP',
  'WAV HP',
  'WAV BP',
  'WAV BS'
]

const MACROSYNTHShapes = [
  'CSAW',
  'MORPH',
  'SAW SQUARE',
  'SINE TRIANGLE',
  'BUZZ',
  'SQUARE SUB',
  'SAW SUB',
  'SQUARE SYNC',
  'SAW SYNC',
  'TRIPLE SAW',
  'TRIPLE SQUARE',
  'TRIPLE TRIANGLE',
  'TRIPLE SIN',
  'TRIPLE RNG',
  'SAW SWARM',
  'SAW COMB',
  'TOY',
  'DIGITAL FILTER LP',
  'DIGITAL FILTER PK',
  'DIGITAL FILTER BP',
  'DIGITAL FILTER HP',
  'VOSIM',
  'VOWEL',
  'VOWEL FOF',
  'HARMONICS',
  'FM',
  'FEEDBACK FM',
  'CHAOTIC FEEDBACK FM',
  'PLUCKED',
  'BOWED',
  'BLOWN',
  'FLUTED', // Not available prior to 2.6.0
  'STRUCK BELL',
  'STRUCK DRUM',
  'KICK',
  'CYMBAL',
  'SNARE',
  'WAVETABLES',
  'WAVE MAP',
  'WAV LINE',
  'WAV PARAPHONIC',
  'FILTERED NOISE',
  'TWIN PEAKS NOISE',
  'CLOCKED NOISE',
  'GRANULAR CLOUD',
  'PARTICLE NOISE',
  'DIGITAL MOD', // Not available prior to 2.6.0
  'MORSE NOISE' // Not available prior to 2.6.0
]

const MACROSYNTHShapesPre260 = MACROSYNTHShapes.slice(0, 30).concat(MACROSYNTHShapes.slice(31, MACROSYNTHShapes.length - 2))

const MIDIOUTPortNames = [
  'MIDI+USB', // 0x00
  'MIDI', // 0x01
  'USB', // 0x02
  'INTERNAL' // 0x03 (Not available prior to 2.7.0)
]

const MIDIOUTPortNamesPre270 = MIDIOUTPortNames.slice(0, MIDIOUTPortNames.length - 1)

// Base Classes

/**
 * M8 version.
 *
 * @class
 */
class M8Version {
  /** @member {Number} */
  majorVersion
  /** @member {Number} */
  minorVersion
  /** @member {Number} */
  patchVersion

  /**
   * Creates an M8 version.
   *
   * @param {Number} majorVersion
   * @param {Number} minorVersion
   * @param {Number} patchVersion
   */
  constructor (majorVersion, minorVersion, patchVersion) {
    this.majorVersion = majorVersion
    this.minorVersion = minorVersion
    this.patchVersion = patchVersion
  }

  toString () {
    return `${this.majorVersion}.${this.minorVersion}.${this.patchVersion}`
  }

  /**
   * Compares two M8 versions and returns -1 if this < other, 1 if this > other and 0 of this === other.
   *
   * @param {M8Version} other - The second M8 version to compare
   *
   * @returns {Number}
   */
  compare (other) {
    if (this.majorVersion > other.majorVersion) {
      return 1
    } else if (this.majorVersion < other.majorVersion) {
      return -1
    } else {
      if (this.minorVersion > other.minorVersion) {
        return 1
      } else if (this.minorVersion < other.minorVersion) {
        return -1
      } else {
        if (this.patchVersion > other.patchVersion) {
          return 1
        } else if (this.patchVersion < other.patchVersion) {
          return -1
        } else {
          return 0
        }
      }
    }
  }
}

/** @const {M8Version} */
const VERSION_1_4_0 = new M8Version(1, 4, 0)
const VERSION_2_5_0 = new M8Version(2, 5, 0)
const VERSION_2_5_1 = new M8Version(2, 5, 1)
const VERSION_2_6_0 = new M8Version(2, 6, 0)
const VERSION_2_7_0 = new M8Version(2, 7, 0)
const VERSION_LAST_CHANGE = VERSION_2_7_0

// Classes

/**
 * Represents a Chain.
 *
 * @class
 */
class Chain {
  /** @member {Boolean} */
  empty
  /** @member {Array<Array<Number>>} */
  rows

  /**
   * Creates a Chain.
   *
   * @param {Song} song - THe song the chain corresponds to
   * @param {FileReader} [fileReader] - The file reader to use when reading the chain (when available)
   */
  constructor (song, fileReader) {
    this.empty = true
    this.rows = new Array(16)

    // Pre-populate the chain rows
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i] = new Array(2)
    }

    if (typeof fileReader === 'undefined') {
      return
    }

    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i]

      for (let j = 0; j < row.length; j++) {
        row[j] = fileReader.readUInt8()
      }

      // A chain is considered empty if all of its phrases are empty
      if (row[0] !== 0xFF) {
        if (this.empty && !song.phrases[row[0]].empty) {
          this.empty = false
        }
      }
    }
  }
}

/**
 * Represents the Amplifier Parameters of an Instrument.
 */
class AmplifierParameters {
  /** @member {Number} */
  amp
  /** @member {Number} */
  lim

  /**
   * Create an Instrument's Filter Parameters.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the amplifier parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.amp = fileReader.readUInt8()
    this.lim = fileReader.readUInt8()
  }

  /**
   * Returns a string representation of the limit type.
   *
   * @returns {String}
   */
  getLimitStr () {
    switch (this.lim) {
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
    }
  }
}

/**
 * Represents the Envelope Parameters of an Instrument.
 *
 * @class
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
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the envelope parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.dest = fileReader.readUInt8()
    this.amount = fileReader.readUInt8()
    this.attack = fileReader.readUInt8()
    this.hold = fileReader.readUInt8()
    this.decay = fileReader.readUInt8()
    this.retrigger = fileReader.readUInt8()
  }
}

/**
 * Represents the Filter Parameters of an Instrument.
 *
 * @class
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
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the filter parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.type = fileReader.readUInt8()
    this.cutoff = fileReader.readUInt8()
    this.res = fileReader.readUInt8()
  }
}

/**
 * Represents the FMSYNTH Instrument Parameters
 *
 * @class
 */
class FMSynthParameters {
  /** @member {Number} */
  algo
  /** @member {Array<Number>} */
  fb
  /** @member {Array<Number>} */
  level
  /** @member {Array<Number>} */
  modA
  /** @member {Array<Number>} */
  modB
  /** @member {Array<Number>} */
  operators
  /** @member {Array<Number>} */
  ratio
  /** @member {Array<Number>} */
  ratioFine
  /** @member {Array<Number>} */
  shape
  /** @private @member {M8Version} */
  #m8Version

  /**
   * Create the FMSYNTH Instrument Parameters.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the Instrument Parameters (when available)
   */
  constructor (fileReader) {
    this.fb = new Array(4)
    this.level = new Array(4)
    this.modA = new Array(4)
    this.modB = new Array(4)
    this.operators = new Array(4)
    this.ratio = new Array(4)
    this.ratioFine = new Array(4)
    this.shape = new Array(4)

    if (typeof fileReader === 'undefined') {
      this.#m8Version = VERSION_LAST_CHANGE
      return
    }

    this.algo = fileReader.readUInt8()

    // If supported, read the synth shapes
    if (fileReader.m8Version.compare(VERSION_1_4_0) >= 0) {
      for (let i = 0; i < this.shape.length; i++) {
        this.shape[i] = fileReader.readUInt8()
      }
    } else {
      this.shape = undefined
    }

    // Read the ratios
    for (let i = 0; i < this.ratio.length; i++) {
      this.ratio[i] = fileReader.readUInt8()
      this.ratioFine[i] = fileReader.readUInt8()
    }

    // Read the feedback/volume of each operator
    for (let i = 0; i < this.level.length; i++) {
      this.level[i] = fileReader.readUInt8()
      this.fb[i] = fileReader.readUInt8()
    }

    // Read first modulator slot controls
    for (let i = 0; i < this.modA.length; i++) {
      this.modA[i] = fileReader.readUInt8()
    }

    // Read second modulator slot controls
    for (let i = 0; i < this.modB.length; i++) {
      this.modB[i] = fileReader.readUInt8()
    }

    // Read operator shapes
    for (let i = 0; i < this.operators.length; i++) {
      this.operators[i] = fileReader.readUInt8()
    }

    this.#m8Version = fileReader.m8Version
  }

  /**
   * Returns a string representation of the algo
   *
   * @returns {String}
   */
  getAlgoStr () {
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
        return ''
    }
  }

  /**
   * Returns a string representation of a modulator.
   *
   * @param {String} mod - The modulator
   *
   * @returns {String}
   */
  getModStr (mod) {
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

  /**
   * Returns a string representation of the oscillator shape.
   *
   * @param {String} osc - The oscillator shape
   *
   * @returns {String}
   */
  getOscShapeStr (osc) {
    let oscName

    if (this.#m8Version.compare(VERSION_2_7_0) < 0) {
      oscName = FMSYNTHOscShapesPre270[osc]
    } else {
      oscName = FMSYNTHOscShapes[osc]
    }

    return typeof oscName === 'undefined' ? 'UNK' : oscName
  }
}

/**
 * Represents the LFO Parameters of an Instrument.
 *
 * @class
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
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the envelope parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.shape = fileReader.readUInt8()
    this.dest = fileReader.readUInt8()
    this.triggerMode = fileReader.readUInt8()
    this.freq = fileReader.readUInt8()
    this.amount = fileReader.readUInt8()
    this.retrigger = fileReader.readUInt8()
  }

  /**
   * Returns a string representation of the LFO shape.
   *
   * @returns {String}
   */
  getShapeStr () {
    return LFOShapes[this.shape] || `UNKNOWN (${this.shape})`
  }

  getTriggerModeStr () {
    return LFOTriggerModes[this.triggerMode] || `UNKNOWN (${this.this.triggerMode})`
  }
}

/**
 * Represents the MACROSYNGTH Instrument Parameters.
 *
 * @class
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
  /** @member {M8Version} */
  #m8Version

  /**
   * Create the MACROSYNTH Instrument Parameters.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the Instrument Parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      this.#m8Version = VERSION_LAST_CHANGE
      return
    }

    this.shape = fileReader.readUInt8()
    this.timbre = fileReader.readUInt8()
    this.color = fileReader.readUInt8()
    this.degrade = fileReader.readUInt8()
    this.redux = fileReader.readUInt8()
    this.#m8Version = fileReader.m8Version
  }

  /**
   * Returns a string representation of the wave shape.
   *
   * @returns {String}
   */
  getShapeStr () {
    let shapeName

    if (this.#m8Version.compare(VERSION_2_6_0) < 0) {
      shapeName = MACROSYNTHShapesPre260[this.shape]
    } else {
      shapeName = MACROSYNTHShapes[this.shape]
    }

    return typeof shapeName === 'undefined' ? `UNKNOWN (${this.shape})` : shapeName
  }
}

/**
 * Represents the MIDIOUT Instrument Parameters.
 *
 * @class
 */
class MIDIOutParameters {
  /** @member {Number} */
  bankSelect
  /** @member {Number} */
  channel
  /** @member {Array<Array<Number>} */
  customCC
  /** @member {Number} */
  port
  /** @member {Number} */
  programChange
  /** @private @member {M8Version} */
  #m8Version

  /**
   * Create the MIDIOUT Instrument Parameters.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the Instrument Parameters (when available)
   */
  constructor (fileReader) {
    this.customCC = new Array(10)

    for (let i = 0; i < this.customCC.length; i++) {
      this.customCC[i] = new Array(2)
    }

    if (typeof fileReader === 'undefined') {
      this.#m8Version = VERSION_LAST_CHANGE
      return
    }

    this.port = fileReader.readUInt8()
    this.channel = fileReader.readUInt8()
    this.bankSelect = fileReader.readUInt8()
    this.programChange = fileReader.readUInt8()
    this.#m8Version = fileReader.m8Version

    // Discard the next 3 bytes (unused data)
    fileReader.read(3)

    for (let i = 0; i < this.customCC.length; i++) {
      for (let j = 0; j < 2; j++) {
        this.customCC[i][j] = fileReader.readUInt8()
      }
    }
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

    return typeof portName === 'undefined' ? 'UNKNOWN' : portName
  }
}

/**
 * Represents the Mixer Parameters of an Instrument.
 *
 * @class
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
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the mixer parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.pan = fileReader.readUInt8()
    this.dry = fileReader.readUInt8()
    this.cho = fileReader.readUInt8()
    this.del = fileReader.readUInt8()
    this.rev = fileReader.readUInt8()
  }
}

/**
 * Represents the SAMPLER Instrument Parameters.
 *
 * @class
 */
class SamplerParameters {
  /** @member {Number} */
  degrade
  /** @member {Number} */
  detune
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
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the Instrument Parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.playMode = fileReader.readUInt8()
    this.slice = fileReader.readUInt8()
    this.start = fileReader.readUInt8()
    this.loopStart = fileReader.readUInt8()
    this.length = fileReader.readUInt8()
    this.degrade = fileReader.readUInt8()

    // this.detune appears to be the overall instrument's fineTune parameter based on reverse engineering
  }

  /**
   * Returns a string representation of the play mode.
   *
   * @returns {String}
   */
  getPlayModeStr () {
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
        return `UNKNOWN (${this.playMode})`
    }
  }
}

/**
 * Represents the WAVSYNTH Instrument Parameters.
 *
 * @class
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
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the Instrument Parameters (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.shape = fileReader.readUInt8()
    this.size = fileReader.readUInt8()
    this.mult = fileReader.readUInt8()
    this.warp = fileReader.readUInt8()
    this.mirror = fileReader.readUInt8()
  }

  /**
   * Returns a string representation of the wave shape.
   *
   * @returns {String}
   */
  getShapeStr () {
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

/**
 * Represents a Groove.
 *
 * @class
 */
class Groove {
  /** @member {Array<Number>} */
  rows

  /**
   * Create a Groove.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the groove (when available)
   */
  constructor (fileReader) {
    this.rows = new Array(16)

    if (typeof fileReader === 'undefined') {
      return
    }

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i] = fileReader.readUInt8()
    }
  }
}

class Instrument {
  /** @member {AmplificationParameters} */
  ampParams
  /** @member {String} */
  author
  /** @member {Array<EnvelopeParameters>} */
  /** @member {FilterParameters} */
  filterParams
  /** @member {Number} */
  fineTune
  /** @member {FMSynthParameters|MacroSynthParameters|MIDIOutParameters|SamplerParameters|WavsynthParameters} */
  instrParams
  /** @member {InstrumentType} */
  kind
  /** @member {Array<LFOParameters} */
  lfo
  /** @member {MixerParameters} */
  mixerParams
  /** @member {String} */
  name
  /** @member {Number} */
  pitch
  /** @member {Table} */
  tableData
  /** @member {Number} */
  tableTick
  /** @member {Boolean} */
  transpose
  /** @member {M8Version} */
  version
  /** @member {Number} */
  volume

  /**
   * Create an Instrument.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the instrument (when available)
   */
  constructor (fileReader) {
    this.env = new Array(2)
    this.lfo = new Array(2)
    this.version = VERSION_LAST_CHANGE

    if (typeof fileReader === 'undefined') {
      return
    }

    if (this.version.compare(VERSION_1_4_0) < 0) {
      this.lfo = new Array(1)
    }

    const startPos = fileReader.cursor

    // Read parameters that ALL instruments have
    this.kind = fileReader.readUInt8()
    this.name = fileReader.readStr(12)
    this.transpose = Boolean(fileReader.readUInt8())
    this.tableTick = fileReader.readUInt8()

    // It appears that these are not present for 'MIDI OUT'
    if (this.kindToStr() !== 'MIDI OUT') {
      this.volume = fileReader.readUInt8()
      this.pitch = fileReader.readUInt8()
      this.fineTune = fileReader.readUInt8()
    }

    // Read instrument-specific parameters
    switch (this.kind) {
      case 0:
        this.instrParams = new WavsynthParameters(fileReader)
        break
      case 1:
        this.instrParams = new MacrosynthParameters(fileReader)
        break
      case 2:
        this.instrParams = new SamplerParameters(fileReader)
        break
      case 3:
        this.instrParams = new MIDIOutParameters(fileReader)
        break
      case 4:
        this.instrParams = new FMSynthParameters(fileReader)
        break
      case 0xFF:
        // Do nothing
        break
      default:
        throw new TypeError(`Unsupported Instrument type: ${this.kindToStr()}`)
    }

    // Read filter parameters
    this.filterParams = new FilterParameters(fileReader)

    // Read amplifier parameters
    this.ampParams = new AmplifierParameters(fileReader)

    // Read mixer parameters
    this.mixerParams = new MixerParameters(fileReader)

    // Read envelope parameters
    for (let i = 0; i < this.env.length; i++) {
      this.env[i] = new EnvelopeParameters(fileReader)
    }

    // Read LFO parameters
    for (let i = 0; i < this.lfo.length; i++) {
      this.lfo[i] = new LFOParameters(fileReader)
    }

    // Manually forward the file reader (unknown data)
    // TODO: Look into this
    fileReader.cursor = startPos + 0x57

    // Read Sample Path (Unfortunate that it happens here)
    if (this.kindToStr() === 'SAMPLE') {
      this.instrParams.samplePath = fileReader.readStr(127)
    }

    // Manually forward the file reader (unknown data)
    // TODO: Look into this
    fileReader.cursor = startPos + 0xD7
  }

  /**
   * Returns a string representation of the Instrument kind.
   *
   * @returns {String}
   */
  kindToStr () {
    switch (this.kind) {
      case 0:
        return 'WAVSYNTH'
      case 1:
        return 'MACROSYN'
      case 2:
        return 'SAMPLE'
      case 3:
        return 'MIDI OUT'
      case 4:
        return 'FMSYNTH'
      case 0xFF:
        return 'NONE'
      default:
        return `UNKNOWN (${this.kind})`
    }
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

    return typeof filterName === 'undefined' ? `UNKNOWN (${this.filterParams.type})` : filterName
  }
}

/**
 * Represents an FX configuration.
 *
 * @class
 */
class FX {
  command
  value

  /**
   * Creates an FX configuration.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the FX configuration (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.command = fileReader.readUInt8()
    this.value = fileReader.readUInt8()
  }
}

/**
 * Represents a Step (within a Phrase).
 *
 * @class
 */
class PhraseStep {
  /** @member {FX} */
  fx1
  /** @member {FX} */
  fx2
  /** @member {FX} */
  fx3
  /** @member {Number} */
  instrument
  /** @member {Number} */
  note
  /** @member {Number} */
  volume

  /**
   * Creates a Phrase.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the phrase step (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.note = fileReader.readUInt8()
    this.volume = fileReader.readUInt8()
    this.instrument = fileReader.readUInt8()
    this.fx1 = new FX(fileReader)
    this.fx2 = new FX(fileReader)
    this.fx3 = new FX(fileReader)
  }

  /**
   * Returns the string representation of the phrase note.
   *
   * @returns {String}
   */
  noteToStr () {
    const oct = Math.trunc(this.note / 12) + 1
    const key = this.note % 12
    let noteStr = ''

    if (this.note === 0xFF) {
      noteStr = '---'
    } else {
      noteStr = getNote(key)

      if (noteStr.length === 1 && noteStr !== '?') {
        noteStr += '-'
      }

      noteStr += oct
    }

    return noteStr
  }
}

/**
 * Represents a Phrase.
 *
 * @class
 */
class Phrase {
  /** @member {Boolean} */
  empty
  /** @member {Array<Step>} */
  steps

  /**
   * Creates a Phrase.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the phrase (when available)
   */
  constructor (fileReader) {
    this.empty = true
    this.steps = new Array(16)

    if (typeof fileReader === 'undefined') {
      return
    }

    for (let i = 0; i < this.steps.length; i++) {
      const step = new PhraseStep(fileReader)

      this.steps[i] = step

      // Documentation says that a phrase is empty if it doesn't have any notes but it appears that FX can be present
      // without a note and count as non-empty.
      //
      // fxCmdToStr is called without a song and that is only because we don't care about the real value, just if it's
      // empty of the 'KIL' command.
      if ([step.note, fxCmdToStr(step.fx1), fxCmdToStr(step.fx2), fxCmdToStr(step.fx3)].filter((val, i) => {
        if (i === 0) {
          return val !== 0xFF
        } else {
          return ['---', 'KIL'].indexOf(val) === -1
        }
      }).length > 0) {
        this.empty = false
      }
    }
  }
}

/**
 * Represents the Effects Settings.
 *
 * @class
 */
class EffectsSettings {
  /** @member {Number} */
  chorusModDepth
  /** @member {Number} */
  chorusModFreq
  /** @member {Number} */
  chorusReverbSend
  /** @member {Number} */
  chorusWidth
  /** @member {Number} */
  delayFeedback
  /** @member {Array<Number>} */
  delayFilter
  /** @member {Number} */
  delayReverbSend
  /** @member {Array<Number>} */
  delayTime
  /** @member {Number} */
  delayWidth
  /** @member {Number} */
  reverbDamping
  /** @member {Array<Number>} */
  reverbFilter
  /** @member {Number} */
  reverbModDepth
  /** @member {Number} */
  reverbModFreq
  /** @member {Number} */
  reverbSize
  /** @member {Number} */
  reverbWidth

  /**
   * Create an Effects Settings.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the Effects Settings (when available)
   */
  constructor (fileReader) {
    this.delayFilter = new Array(2)
    this.delayTime = new Array(2)
    this.reverbFilter = new Array(2)

    if (typeof fileReader === 'undefined') {
      return
    }

    // Discard the next 3 bytes (unused data)
    fileReader.read(3)

    this.chorusModDepth = fileReader.readUInt8()
    this.chorusModFreq = fileReader.readUInt8()
    this.chorusWidth = fileReader.readUInt8()
    this.chorusReverbSend = fileReader.readUInt8()

    // Discard the next 3 bytes (unused data)
    fileReader.read(3)

    this.delayFilter[0] = fileReader.readUInt8()
    this.delayFilter[1] = fileReader.readUInt8()
    this.delayTime[0] = fileReader.readUInt8()
    this.delayTime[1] = fileReader.readUInt8()
    this.delayFeedback = fileReader.readUInt8()
    this.delayWidth = fileReader.readUInt8()
    this.delayReverbSend = fileReader.readUInt8()

    // Discard the next 1 byte (unused data)
    fileReader.read(1)

    this.reverbFilter[0] = fileReader.readUInt8()
    this.reverbFilter[1] = fileReader.readUInt8()
    this.reverbSize = fileReader.readUInt8()
    this.reverbDamping = fileReader.readUInt8()
    this.reverbModDepth = fileReader.readUInt8()
    this.reverbModFreq = fileReader.readUInt8()
    this.reverbWidth = fileReader.readUInt8()
  }
}

/**
 * Represents a MIDI Mapping.
 *
 * @class
 */
class MIDIMapping {
  /** @member {Number} */
  channel
  /** @member {Number} */
  controlNum
  /** @member {Boolean} */
  empty
  /** @member {Number} */
  maxValue
  /** @member {Number} */
  minValue
  /** @member {Number} */
  paramIndex
  /** @member {Number} */
  type
  /** @member {Number} */
  value

  /**
   * Create a MIDI Mapping.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading a MIDI Mapping (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.channel = fileReader.readUInt8()
    this.controlNum = fileReader.readUInt8()
    // TODO: Data stored for value doesn't match MIDI Mapping output
    this.value = fileReader.readUInt8()
    this.type = fileReader.readUInt8()
    this.paramIndex = fileReader.readUInt8()
    this.minValue = fileReader.readUInt8()
    this.maxValue = fileReader.readUInt8()
    this.empty = this.channel === 0x00
  }

  /**
   * Returns the string representation of the mapping destination.
   *
   * @returns {String}
   */
  destToStr () {
    // TODO: Figure out a way to create a mapping from parameter index to string
    return toM8HexStr(this.paramIndex)
  }

  /**
   * Returns a single-character string representation of the mapping type.
   *
   * @returns {String}
   */
  typeToChar () {
    switch (this.type) {
      case 0:
        return 'I'
      case 1:
        return 'M'
      case 2:
        return 'E'
      default:
        return `U (${this.type})`
    }
  }
}

/**
 * Represents the MIDI Settings.
 *
 * @class
 */
class MIDISettings {
  /** @member {Number} */
  controlMapChannel
  /** @member {Boolean} */
  receiveSync
  /** @member {Boolean} */
  receiveTransport
  /** @member {Number} */
  recordNoteChannel
  /** @member {Boolean} */
  recordNoteDelayKillCommands
  /** @member {Boolean} */
  recordNoteVelocity
  /** @member {Boolean} */
  sendSync
  /** @member {Boolean} */
  sendTransport
  /** @member {Number} */
  songRowCueChannel
  /** @member {Array<Number>} */
  trackInputChannel
  /** @member {Array<Number>} */
  trackInputInstrument
  /** @member {Number} */
  trackInputMode
  /** @member {Boolean} */
  trackInputProgramChange

  /**
   * Create a MIDI Settings.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the MIDI Settings (when available)
   */
  constructor (fileReader) {
    this.trackInputChannel = new Array(8)
    this.trackInputInstrument = new Array(8)

    if (typeof fileReader === 'undefined') {
      return
    }

    this.receiveSync = Boolean(fileReader.readUInt8())
    this.receiveTransport = Boolean(fileReader.readUInt8())
    this.sendSync = Boolean(fileReader.readUInt8())
    this.sendTransport = Boolean(fileReader.readUInt8())
    this.recordNoteChannel = fileReader.readUInt8()
    this.recordNoteVelocity = Boolean(fileReader.readUInt8())
    this.recordNoteDelayKillCommands = Boolean(fileReader.readUInt8())
    this.controlMapChannel = fileReader.readUInt8()
    this.songRowCueChannel = fileReader.readUInt8()

    for (let i = 0; i < 8; i++) {
      this.trackInputChannel[i] = fileReader.readUInt8()
    }

    for (let i = 0; i < 8; i++) {
      this.trackInputInstrument[i] = fileReader.readUInt8()
    }

    this.trackInputProgramChange = Boolean(fileReader.readUInt8())
    this.trackInputMode = fileReader.readUInt8()
  }

  trackInputModeToStr () {
    switch (this.trackInputMode) {
      case 0:
        return 'MONO'
      case 1:
        return 'LEGATO'
      case 2:
        return 'POLY'
      default:
        return `UNKNOWN (${this.trackInputMode})`
    }
  }
}

/**
 * Represents the Mixer Settings.
 *
 * @class
 */
class MixerSettings {
  /** @member {Array<Number>} */
  analogInputChorus
  /** @member {Array<Number>} */
  analogInputDelay
  /** @member {Array<Number>} */
  analogInputReverb
  /** @member {Array<Number>} */
  analogInputVolume
  /** @member {Number} */
  chorusVolume
  /** @member {Number} */
  delayVolume
  /** @member {Number} */
  djFilter
  /** @member {Number} */
  djFilterPeak
  /** @member {Number} */
  masterLimit
  /** @member {Number} */
  masterVolume
  /** @member {Number} */
  reverbVolume
  /** @member {Array<Number>} */
  trackVolume
  /** @member {Number} */
  usbInputChorus
  /** @member {Number} */
  usbInputDelay
  /** @member {Number} */
  usbInputReverb
  /** @member {Number} */
  usbInputVolume

  /**
   * Create a MIDI Settings.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the MIDI Settings (when available)
   */
  constructor (fileReader) {
    this.analogInputChorus = new Array(2)
    this.analogInputDelay = new Array(2)
    this.analogInputReverb = new Array(2)
    this.analogInputVolume = new Array(2)
    this.trackVolume = new Array(8)

    if (typeof fileReader === 'undefined') {
      return
    }

    this.masterVolume = fileReader.readUInt8()
    this.masterLimit = fileReader.readUInt8()

    for (let i = 0; i < 8; i++) {
      this.trackVolume[i] = fileReader.readUInt8()
    }

    this.chorusVolume = fileReader.readUInt8()
    this.delayVolume = fileReader.readUInt8()
    this.reverbVolume = fileReader.readUInt8()
    this.analogInputVolume = [fileReader.readUInt8(), fileReader.readUInt8()]
    this.usbInputVolume = fileReader.readUInt8()
    this.analogInputChorus[0] = fileReader.readUInt8()
    this.analogInputDelay[0] = fileReader.readUInt8()
    this.analogInputReverb[0] = fileReader.readUInt8()
    this.analogInputChorus[1] = fileReader.readUInt8()
    this.analogInputDelay[1] = fileReader.readUInt8()
    this.analogInputReverb[1] = fileReader.readUInt8()
    this.usbInputChorus = fileReader.readUInt8()
    this.usbInputDelay = fileReader.readUInt8()
    this.usbInputReverb = fileReader.readUInt8()
    this.djFilter = fileReader.readUInt8()
    this.djFilterPeak = fileReader.readUInt8()
  }
}

/**
 * Represents a Scale.
 *
 * @class
 */
class Scale {
  /** @member {String} */
  name
  /** @member {Array<Boolean>} */
  notes
  /** @member {Array<Array<Number>>} */
  offsets // tuple

  /**
   * Creates a Scale.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the scale (when available)
   */
  constructor (fileReader) {
    this.notes = new Array(12)
    this.offsets = new Array(12)

    if (typeof fileReader === 'undefined') {
      return
    }

    const noteMap = Buffer.from([fileReader.readUInt8(), fileReader.readUInt8()]).readUInt16LE(0)

    // Read note map
    for (let i = 0; i < this.notes.length; i++) {
      this.notes[i] = Boolean((noteMap >> i) & 0x1)
    }

    // Read offsets
    for (let i = 0; i < this.offsets.length; i++) {
      this.offsets[i] = [fileReader.readUInt8(), fileReader.readUInt8()]
    }

    // Read name
    this.name = fileReader.readStr(16)
  }

  /**
   * String representation of the offset.
   *
   * @param {Number} num - The offset number
   */
  offsetToStr (num) {
    let str = ''
    const offset = this.offsets[num]

    if (typeof offset === 'undefined') {
      throw new RangeError(`There is no Scale offset number: ${toM8HexStr(num)}`)
    }

    let total

    if (offset[0] >= offset[1]) {
      total = offset[0] + (offset[1] * 256)
    } else {
      total = ((offset[1] - 256) * 256) + offset[0]
    }

    if (total < 0) {
      str += '-'
    }

    total = Math.abs(total)

    str += Math.trunc(total / 100).toString().padStart(2, 0)
    str += '.'
    str += (total % 100).toString().padStart(2, 0)

    return str
  }
}

/**
 * Represents a Song.
 *
 * @class
 */
class Song {
  /** @member {Array<Number>} */
  chainCursor
  /** @member {Array<Chain>} */
  chains
  /** @member {Number} */
  currentChain
  /** @member {Number} */
  currentInstrument
  /** @member {Number} */
  currentPhrase
  /** @member {Number} */
  currentTrack
  /** @member {String} */
  directory
  /** @member {Array<Groove>} */
  grooves
  /** @member {Array<Instrument>} */
  instruments
  /** @member {Number} */
  key
  /** @member {Array<Number>} */
  lastInstrument
  /** @member {MIDISettings} */
  midiSettings
  /** @member {MixerSettings} */
  mixerSettings
  /** @member {Array<Number>} */
  phraseCursor
  /** @member {Array<Phrase>} */
  phrases
  /** @member {String} */
  projectName
  /** @member {Number} */
  quantize
  /** @member {Array<Scale>} */
  scales
  /** @member {Array<Number>} */
  songCursor
  /** @member {Array<Array<Number>>} */
  songOrder
  /** @member {Array<Table>} */
  tables
  /** @member {Number} */
  tempo
  /** @member {Number} */
  transpose
  /** @member {M8Version} */
  version

  /**
   * Create/Reads a Song.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the song (when available)
   */
  constructor (fileReader) {
    this.chains = new Array(255)
    this.currentChain = 0xff
    this.grooves = new Array(32)
    this.instruments = new Array(128)
    this.midiMappings = new Array(128)
    this.phrases = new Array(255)
    this.songOrder = new Array(256)
    this.tables = new Array(256)

    // Pre-populate the song order array
    for (let i = 0; i < this.songOrder.length; i++) {
      this.songOrder[i] = new Array(8)
    }

    if (typeof fileReader === 'undefined') {
      return
    }

    if (fileReader.m8Version.compare(VERSION_2_5_0) >= 0) {
      this.scales = new Array(16)
    }

    this.version = fileReader.m8Version
    this.directory = fileReader.readStr(128)
    this.transpose = fileReader.readUInt8()
    // This is a 32-bit float and has to be read as such
    this.tempo = Buffer.from(fileReader.read(4)).readFloatLE(0)
    this.quantize = fileReader.readUInt8()
    this.projectName = fileReader.readStr(12)
    this.midiSettings = new MIDISettings(fileReader)
    this.key = fileReader.readUInt8()

    // Discard the next 18 bytes (empty data)
    fileReader.read(18)

    this.mixerSettings = new MixerSettings(fileReader)

    // Discard the next 5 bytes (unknown data)
    fileReader.read(5)

    // Read Grooves
    for (let i = 0; i < this.grooves.length; i++) {
      this.grooves[i] = new Groove(fileReader)
    }

    // Read song data
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 8; j++) {
        this.songOrder[i][j] = fileReader.readUInt8()
      }
    }

    // Read Phrases
    for (let i = 0; i < this.phrases.length; i++) {
      this.phrases[i] = new Phrase(fileReader)
    }

    // Read Chains
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i] = new Chain(this, fileReader)
    }

    // Read Tables
    for (let i = 0; i < this.tables.length; i++) {
      this.tables[i] = new Table(fileReader)
    }

    // Read Instruments
    for (let i = 0; i < this.instruments.length; i++) {
      this.instruments[i] = new Instrument(fileReader)

      // Update the instrument's table data reference
      this.instruments[i].tableData = this.tables[i]
    }

    // Read Effects
    this.effectsSettings = new EffectsSettings(fileReader)

    // Skip ahead to this specific position (unknown data)
    // TODO: Look into this
    fileReader.cursor = 0x1A5FE

    // Read MIDI Mappings
    for (let i = 0; i < this.instruments.length; i++) {
      this.midiMappings[i] = new MIDIMapping(fileReader)
    }

    // Read Scales (when supported)
    if (fileReader.m8Version.compare(VERSION_2_5_0) >= 0) {
      // Skip ahead to this specific position (unknown data)
      // TODO: Look into this
      fileReader.cursor = 0x1AA7E

      for (let i = 0; i < this.scales.length; i++) {
        this.scales[i] = new Scale(fileReader)
      }
    }
  }
}

/**
 * Represents a Step (within a Table).
 *
 * @class
 */
class TableStep {
  /** @member {FX} */
  fx1
  /** @member {FX} */
  fx2
  /** @member {FX} */
  fx3
  /** @member {Number} */
  transpose
  /** @member {Number} */
  volume

  /**
   * Creates a Phrase.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the table step (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.transpose = fileReader.readUInt8()
    this.volume = fileReader.readUInt8()
    this.fx1 = new FX(fileReader)
    this.fx2 = new FX(fileReader)
    this.fx3 = new FX(fileReader)
  }
}

/**
 * Represents a Table.
 *
 * @class
 */
class Table {
  /** @member {Array<Step>} */
  steps

  /**
   * Creates a Table.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the table (when available)
   */
  constructor (fileReader) {
    this.steps = new Array(16)

    if (typeof fileReader === 'undefined') {
      return
    }

    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i] = new TableStep(fileReader)
    }
  }
}

/**
 * Represents a Theme.
 *
 * @class
 */
class Theme {
  /** @member {Array<Number>} */
  background
  /** @member {Array<Number>} */
  textEmpty
  /** @member {Array<Number>} */
  textInfo
  /** @member {Array<Number>} */
  textDefault
  /** @member {Array<Number>} */
  textValue
  /** @member {Array<Number>} */
  textTitle
  /** @member {Array<Number>} */
  playMarker
  /** @member {Array<Number>} */
  cursor
  /** @member {Array<Number>} */
  selection
  /** @member {Array<Number>} */
  scopeSlider
  /** @member {Array<Number>} */
  meterLow
  /** @member {Array<Number>} */
  meterMid
  /** @member {Array<Number>} */
  meterPeak

  /**
   * Creates a Theme.
   *
   * @param {FileReader} [fileReader] - The file reader to use when reading the theme (when available)
   */
  constructor (fileReader) {
    if (typeof fileReader === 'undefined') {
      return
    }

    this.background = fileReader.read(3)
    this.textEmpty = fileReader.read(3)
    this.textInfo = fileReader.read(3)
    this.textDefault = fileReader.read(3)
    this.textValue = fileReader.read(3)
    this.textTitle = fileReader.read(3)
    this.playMarker = fileReader.read(3)
    this.cursor = fileReader.read(3)
    this.selection = fileReader.read(3)
    this.scopeSlider = fileReader.read(3)
    this.meterLow = fileReader.read(3)
    this.meterMid = fileReader.read(3)
    this.meterPeak = fileReader.read(3)
  }
}

// Build a default theme based on the one M8 ships with
const DefaultTheme = new Theme()

DefaultTheme.background = [0x00, 0x00, 0x00]
DefaultTheme.textEmpty = [0x1E, 0x1E, 0x28]
DefaultTheme.textInfo = [0x60, 0x60, 0x8E]
DefaultTheme.textDefault = [0x8C, 0x8C, 0xBA]
DefaultTheme.textValue = [0xFA, 0xFA, 0xFA]
DefaultTheme.textTitle = [0x32, 0xEC, 0xFF]
DefaultTheme.playMarker = [0x00, 0xFF, 0x70]
DefaultTheme.cursor = [0x32, 0xEC, 0xFF]
DefaultTheme.selection = [0xFF, 0x00, 0xD2]
DefaultTheme.scopeSlider = [0x32, 0xEC, 0xFF]
DefaultTheme.meterLow = [0x00, 0xFF, 0x50]
DefaultTheme.meterMid = [0xFF, 0xE0, 0x00]
DefaultTheme.meterPeak = [0xFF, 0x30, 0x70]

// Exports
module.exports = {
  DefaultTheme,
  Instrument,
  M8Version,
  Scale,
  Song,
  Theme,
  VERSION_1_4_0,
  VERSION_2_5_0,
  VERSION_2_5_1,
  VERSION_2_6_0,
  VERSION_2_7_0,
  VERSION_LATEST_SUPPORTED: VERSION_LAST_CHANGE
}
