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

/**
 * Represents a Groove.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Groove {
  /** @member {Array<Number>} */
  steps

  /**
   * Create a Groove.
   */
  constructor () {
    this.steps = new Array(16)

    for (let i = 0; i < this.steps.length; i++) {
      if (i < 2) {
        this.steps[i] = 0x06
      } else {
        this.steps[i] = 0xFF
      }
    }
  }
}

// Exports
module.exports = Groove
