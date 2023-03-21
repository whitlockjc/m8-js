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

const PhraseStep = require('./PhraseStep')
const Serializable = require('./Serializable')

/**
 * Represents a Phrase.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class Phrase extends Serializable {
  /** @member {Array<module:m8-js/lib/types.PhraseStep>} */
  steps

  /**
   * Creates a Phrase.
   *
   * @param {Array<module:m8-js/lib/types.PhraseStep>} [steps]
   */
  constructor (steps) {
    super()

    // eslint-disable-next-line no-unused-vars
    this.steps = Array.from({ length: 16 }, (e, i) => {
      let value = steps?.[i]

      if (typeof value === 'undefined' || value.constructor.name !== 'PhraseStep') {
        value = new PhraseStep()
      }

      return value
    })
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      steps: this.steps.map((step) => step.asObject())
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

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new Phrase(object?.steps?.map((step) => PhraseStep.fromObject(step)))
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['steps']
  }
}

// Exports
module.exports = Phrase
