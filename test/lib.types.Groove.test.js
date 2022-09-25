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

const Groove = require('../lib/types/Groove')

describe('Groove tests', () => {
  test('constructor', () => {
    const defaultGroove = new Groove()

    for (let i = 0; i < defaultGroove.steps; i++) {
      let expectedValue = 0xFF

      if (i < 2) {
        expectedValue = 0x06
      }

      expectedValue(defaultGroove.steps[i]).toEqual(expectedValue)
    }
  })
})
