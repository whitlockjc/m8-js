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

const Serializable = require('./Serializable')

/**
 * Represents a Groove.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class Groove extends Serializable {
  /** @member {Array<Number>} */
  steps

  /**
   * Create a Groove.
   *
   * @param {Array<Number>} [steps]
   */
  constructor (steps) {
    super()

    this.steps = new Array(16)

    // eslint-disable-next-line no-unused-vars
    this.steps = Array.from({ length: 16 }, (e, i) => {
      let value = steps?.[i]

      if (typeof value !== 'number') {
        if (i < 2) {
          value = 0x06
        } else {
          value = 0xFF
        }
      }

      return value
    })
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      steps: this.steps
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new Groove(object?.steps)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['steps']
  }
}

// Exports
module.exports = Groove
