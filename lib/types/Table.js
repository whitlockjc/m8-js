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

/**
 * Represents a Step (within a Table).
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class TableStep {
  /** @member {module:m8-js/lib/types.FX} */
  fx1
  /** @member {module:m8-js/lib/types.FX} */
  fx2
  /** @member {module:m8-js/lib/types.FX} */
  fx3
  /** @member {Number} */
  transpose
  /** @member {Number} */
  volume

  /**
   * Creates a Phrase.
   */
  constructor () {
    this.transpose = 0x00
    this.volume = 0xFF
    this.fx1 = new FX()
    this.fx2 = new FX()
    this.fx3 = new FX()

    for (let i = 0; i < 3; i++) {
      const fx = new FX()

      this['fx' + (i + 1)] = fx
    }
  }
}

/**
 * Represents a Table.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Table {
  /** @member {Array<module:m8-js/lib/types.TableStep>} */
  steps

  /**
   * Creates a Table.
   */
  constructor () {
    this.steps = new Array(16)

    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i] = new TableStep()
    }
  }
}

// Exports
module.exports = Table
