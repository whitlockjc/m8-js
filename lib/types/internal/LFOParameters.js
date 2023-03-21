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
const Serializable = require('./Serializable')

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

/**
 * Represents the LFO Parameters of an Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class LFOParameters extends Serializable {
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
   * @param {Number} [amount=0xFF]
   * @param {Number} [dest=0x00]
   * @param {Number} [freq=0x10]
   * @param {Number} [retrigger=0x00]
   * @param {Number} [shape=0x00]
   * @param {Number} [triggerMode=0x00]
   */
  constructor (amount = 0xFF, dest = 0x00, freq = 0x10, retrigger = 0x00, shape = 0x00, triggerMode = 0x00) {
    super()

    this.amount = amount
    this.dest = dest
    this.freq = freq
    this.retrigger = retrigger
    this.shape = shape
    this.triggerMode = triggerMode
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      amount: this.amount,
      dest: this.dest,
      // destStr CANNOT be set here
      freq: this.freq,
      retrigger: this.retrigger,
      shape: this.shape,
      shapeStr: this.shapeToStr(),
      triggerMode: this.triggerMode,
      triggerModeStr: this.triggerModeToStr()
    }
  }

  /**
   * Returns a string representation of the destination.
   *
   * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The instrument
   */
  destToStr (instr) {
    const envLFODests = instr.getEnvLfoDests()

    return envLFODests[this.dest] || `UNK (${toM8HexStr(this.dest)})`
  }

  /**
   * Returns a string representation of the LFO shape.
   *
   * @returns {String}
   */
  shapeToStr () {
    return LFOShapes[this.shape] || `UNK (${toM8HexStr(this.shape)})`
  }

  triggerModeToStr () {
    return LFOTriggerModes[this.triggerMode] || `UNK (${toM8HexStr(this.triggerMode)})`
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new LFOParameters(object?.amount, object?.dest, object?.freq, object?.retrigger, object?.shape,
                             object?.triggerMode)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['amount', 'dest', 'destStr', 'freq', 'retrigger', 'shape', 'shapeStr', 'triggerMode', 'triggerModeStr']
  }
}

module.exports = LFOParameters
