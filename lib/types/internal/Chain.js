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

const ChainStep = require('./ChainStep')
const Serializable = require('./Serializable')

/**
 * Represents a Chain.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types
 */
class Chain extends Serializable {
  /** @member {Array<module:m8-js/lib/types/internal.ChainStep>} */
  steps

  /**
   * Creates a Chain.
   *
   * @param {Array<module:m8-js/lib/types/internal.ChainStep>} [steps]
   */
  constructor (steps) {
    super()

    // eslint-disable-next-line no-unused-vars
    this.steps = Array.from({ length: 16 }, (e, i) => {
      let value = steps?.[i]

      if (typeof value === 'undefined' || value.constructor.name !== 'ChainStep') {
        value = new ChainStep()
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
   * @inheritdoc
   */
  static fromObject (object) {
    return new Chain(object?.steps?.map((step) => ChainStep.fromObject(step)))
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['steps']
  }
}

module.exports = Chain
