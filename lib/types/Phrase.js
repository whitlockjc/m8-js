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

const FX = require('./FX')
const { getNote } = require('../helpers')

/**
 * Represents a Step (within a Phrase).
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class PhraseStep {
  /** @member {module:m8-js/lib/types.FX} */
  fx1
  /** @member {module:m8-js/lib/types.FX} */
  fx2
  /** @member {module:m8-js/lib/types.FX} */
  fx3
  /** @member {Number} */
  instrument
  /** @member {Number} */
  note
  /** @member {Number} */
  volume

  /**
   * Creates a Phrase.
   */
  constructor () {
    this.note = 0xFF
    this.volume = 0xFF
    this.instrument = 0xFF

    for (let i = 0; i < 3; i++) {
      const fx = new FX()

      this['fx' + (i + 1)] = fx
    }
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

      if (noteStr.length === 1) {
        noteStr += '-'
      }

      if (oct > 9) {
        if (oct === 10) {
          noteStr += 'A'
        } else {
          noteStr += 'B'
        }
      } else {
        noteStr += oct
      }
    }

    return noteStr
  }
}

/**
 * Represents a Phrase.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Phrase {
  /** @member {Array<module:m8-js/lib/types.PhraseStep>} */
  steps

  /**
   * Creates a Phrase.
   */
  constructor () {
    this.steps = new Array(16)

    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i] = new PhraseStep()
    }
  }

  /**
   * Finds the instrument number for a given phrase step, or for the whole phrase (in isolation).
   *
   * @param {Number} [phraseStep] - The optional phrase step (searches the whole phrase if not provided)
   *
   * @returns {Number} the instrument number of `0xFF` if not found
   */
  findPhraseStepInstrumentNum (phraseStep) {
    let instr = 0xFF

    for (let i = phraseStep || 0x0E; i >= 0; i--) {
      const step = this.steps[i]

      if (step.instrument !== 0xFF) {
        instr = step.instrument

        break
      }
    }

    return instr
  }
}

// Exports
module.exports = Phrase
