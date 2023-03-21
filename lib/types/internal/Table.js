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
const TableStep = require('./TableStep')

/**
 * Represents a Table.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class Table extends Serializable {
  /** @member {Array<module:m8-js/lib/types/internal.TableStep>} */
  steps

  /**
   * Creates a Table.
   *
   * @param {Array<module:m8-js/lib/types/internal.TableStep>} [steps]
   */
  constructor (steps) {
    super()

    // eslint-disable-next-line no-unused-vars
    this.steps = Array.from({ length: 16 }, (e, i) => {
      let value = steps?.[i]

      if (typeof value === 'undefined' || value.constructor.name !== 'TableStep') {
        value = new TableStep()
      }

      return value
    })
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      steps: this.steps.map((fx) => fx.asObject())
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new Table(object?.steps?.map((step) => TableStep.fromObject(step)))
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['steps']
  }
}

// Exports
module.exports = Table
