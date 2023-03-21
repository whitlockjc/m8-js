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

const { toM8HexStr } = require('../../helpers')
const { LATEST_M8_VERSION, VERSION_2_6_0 } = require('../../constants')
const Serializable = require('./Serializable')

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
const MACROSYNTHShapesPre260 = MACROSYNTHShapes.slice(0, 31).concat(MACROSYNTHShapes.slice(32, MACROSYNTHShapes.length - 2))

/**
 * Represents the MACROSYNTH Instrument Parameters.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class MacrosynthParameters extends Serializable {
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
   *
   * @param {Number} [color=0x80]
   * @param {Number} [degrade=0x00]
   * @param {Number} [redux=0x00]
   * @param {Number} [shape=0x00]
   * @param {Number} [timbre=0x80]
   */
  constructor (color = 0x80, degrade = 0x00, redux = 0x00, shape = 0x00, timbre = 0x80) {
    super()

    this.color = color
    this.degrade = degrade
    this.redux = redux
    this.shape = shape
    this.timbre = timbre
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      color: this.color,
      degrade: this.degrade,
      redux: this.redux,
      shape: this.shape,
      // shapeStr CANNOT be set here
      timbre: this.timbre
    }
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

    return typeof shapeName === 'undefined' ? `UNK (${toM8HexStr(this.shape)})` : shapeName
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new MacrosynthParameters(object?.color, object?.degrade, object?.redux, object?.shape, object?.timbre)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['color', 'degrade', 'redux', 'shape', 'shapeStr', 'timbre']
  }
}

module.exports = MacrosynthParameters
