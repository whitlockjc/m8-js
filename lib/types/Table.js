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

  /**
   * Returns the Table's bytes.
   *
   * @returns {Array<Number>}
   */
  asBytes () {
    const bytes = []

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i]

      bytes.push(step.transpose)
      bytes.push(step.volume)

      for (let j = 0; j < 3; j++) {
        const fx = step['fx' + (j + 1)]

        bytes.push(fx.command)
        bytes.push(fx.value)
      }
    }

    return bytes
  }

  /**
   * Returns a Table from its bytes.
   *
   * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader for reading the Table
   *
   * @returns {module:m8-js/lib/types.Table}
   */
  static fromFileReader (fileReader) {
    const table = new Table()

    for (let i = 0; i < table.steps.length; i++) {
      const step = table.steps[i]

      step.transpose = fileReader.read()
      step.volume = fileReader.read()

      for (let j = 0; j < 3; j++) {
        const fx = step['fx' + (j + 1)]

        fx.command = fileReader.read()
        fx.value = fileReader.read()
      }
    }

    return table
  }
}

// Exports
module.exports = Table
