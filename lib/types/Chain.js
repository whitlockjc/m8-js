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
 * Represents a Chain Row.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class ChainStep {
  /** @member {Number} */
  phrase
  /** @member {Number} */
  transpose

  /**
   * Creates a Chain.
   */
  constructor () {
    this.phrase = 0xFF
    this.transpose = 0x00
  }
}

/**
 * Represents a Chain.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Chain {
  /** @member {Array<module:m8-js/lib/types.ChainStep>} */
  steps

  /**
   * Creates a Chain.
   */
  constructor () {
    this.steps = new Array(16)

    // Pre-populate the chain steps
    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i] = new ChainStep()
    }
  }
}

module.exports = Chain
