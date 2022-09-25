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
 * Represents a Theme.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class Theme {
  /** @member {Array<Number>} */
  background
  /** @member {Array<Number>} */
  textEmpty
  /** @member {Array<Number>} */
  textInfo
  /** @member {Array<Number>} */
  textDefault
  /** @member {Array<Number>} */
  textValue
  /** @member {Array<Number>} */
  textTitle
  /** @member {Array<Number>} */
  playMarker
  /** @member {Array<Number>} */
  cursor
  /** @member {Array<Number>} */
  selection
  /** @member {Array<Number>} */
  scopeSlider
  /** @member {Array<Number>} */
  meterLow
  /** @member {Array<Number>} */
  meterMid
  /** @member {Array<Number>} */
  meterPeak

  /**
   * Creates a Theme.
   */
  constructor () {
    // Uses the same values as the 'DEFAULT.m8t' theme
    this.background = [0x00, 0x00, 0x00]
    this.cursor = [0x32, 0xEC, 0xFF]
    this.meterLow = [0x00, 0xFF, 0x50]
    this.meterMid = [0xFF, 0xE0, 0x00]
    this.meterPeak = [0xFF, 0x30, 0x70]
    this.playMarker = [0x00, 0xFF, 0x70]
    this.scopeSlider = [0x32, 0xEC, 0xFF]
    this.selection = [0xFF, 0x00, 0xD2]
    this.textDefault = [0x8C, 0x8C, 0xBA]
    this.textEmpty = [0x1E, 0x1E, 0x28]
    this.textInfo = [0x60, 0x60, 0x8E]
    this.textTitle = [0x32, 0xEC, 0xFF]
    this.textValue = [0xFA, 0xFA, 0xFA]
  }
}

// Exports
module.exports = Theme
