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

const { LATEST_M8_VERSION, VERSION_2_7_0 } = require('../../constants')
const Serializable = require('./Serializable')

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

/**
 * Represents the FMSYNTH Operator.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class FMSynthOperator extends Serializable {
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
   *
   * @param {Number} [feedback=0x00]
   * @param {Number} [level=0x80]
   * @param {Number} [modA=0x00]
   * @param {Number} [modB=0x00]
   * @param {Number} [ratio=0x01]
   * @param {Number} [ratioFine=0x00]
   * @param {Number} [shape=0x00]
   */
  constructor (feedback = 0x00, level = 0x80, modA = 0x00, modB = 0x00, ratio = 0x01, ratioFine = 0x00, shape = 0x00) {
    super()

    this.feedback = feedback
    this.level = level
    this.modA = modA
    this.modB = modB
    this.ratio = ratio
    this.ratioFine = ratioFine
    this.shape = shape
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      feedback: this.feedback,
      level: this.level,
      modA: this.modA,
      modB: this.modB,
      ratio: this.ratio,
      ratioFine: this.ratioFine,
      shape: this.shape
      // shapeStr CANNOT be set here
    }
  }

  /**
   * Returns a string representation of the oscillator shape.
   *
   * @param {module:m8-js/lib/types/internal.M8Version} [m8Version] - The M8 version (different versions of M8 use different
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

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new FMSynthOperator(object?.feedback, object?.level, object?.modA, object?.modB, object?.ratio,
                               object?.ratioFine, object?.shape)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['feedback', 'level', 'modA', 'modB', 'ratio', 'ratioFine', 'shape', 'shapeStr']
  }
}

module.exports = FMSynthOperator
