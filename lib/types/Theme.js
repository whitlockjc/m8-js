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

const { LATEST_M8_VERSION, M8FileTypes } = require('../constants')
const M8File = require('./M8File')
const M8FileReader = require('./M8FileReader')

const themeProperties = [
  'background',
  'textEmpty',
  'textInfo',
  'textDefault',
  'textValue',
  'textTitle',
  'playMarker',
  'cursor',
  'selection',
  'scopeSlider',
  'meterLow',
  'meterMid',
  'meterPeak'
]

/**
 * Represents a Theme color as RGB.
 *
 * @class
 *
 * @memberof module:m8-js/lib/types
 */
class RGB {
  /** @member {Number} */
  b
  /** @member {Number} */
  g
  /** @member {Number} */
  r

  /**
   * Constructs a Theme color.
   *
   * @param {Number} r - The Theme color's red parameter
   * @param {Number} g - The Theme color's green parameter
   * @param {Number} b - The Theme color's blue parameter
   */
  constructor (r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }

  /**
   * Returns the RGB value as a byte array ([r, g, b]).
   *
   * @returns {Array<Number>}
   */
  getBytes () {
    return [this.r, this.g, this.b]
  }
}

/**
 * Represents a Theme.
 *
 * @class
 *
 * @augments module:m8-js/lib/types.M8File
 * @memberof module:m8-js/lib/types
 */
class Theme extends M8File {
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
   *
   * @param {module:m8-js/lib/types.M8Version} [m8Version] - The M8 version of the Theme
   */
  constructor (m8Version) {
    super(M8FileTypes.Theme, m8Version || LATEST_M8_VERSION)

    // Uses the same values as the 'DEFAULT.m8t' theme
    this.background = new RGB(0x00, 0x00, 0x00)
    this.cursor = new RGB(0x32, 0xEC, 0xFF)
    this.meterLow = new RGB(0x00, 0xFF, 0x50)
    this.meterMid = new RGB(0xFF, 0xE0, 0x00)
    this.meterPeak = new RGB(0xFF, 0x30, 0x70)
    this.playMarker = new RGB(0x00, 0xFF, 0x70)
    this.scopeSlider = new RGB(0x32, 0xEC, 0xFF)
    this.selection = new RGB(0xFF, 0x00, 0xD2)
    this.textDefault = new RGB(0x8C, 0x8C, 0xBA)
    this.textEmpty = new RGB(0x1E, 0x1E, 0x28)
    this.textInfo = new RGB(0x60, 0x60, 0x8E)
    this.textTitle = new RGB(0x32, 0xEC, 0xFF)
    this.textValue = new RGB(0xFA, 0xFA, 0xFA)
  }

  /**
   * @inheritdoc
   */
  getBytes () {
    const bytes = this.getHeaderBytes()

    bytes.push(...this.background.getBytes())
    bytes.push(...this.textEmpty.getBytes())
    bytes.push(...this.textInfo.getBytes())
    bytes.push(...this.textDefault.getBytes())
    bytes.push(...this.textValue.getBytes())
    bytes.push(...this.textTitle.getBytes())
    bytes.push(...this.playMarker.getBytes())
    bytes.push(...this.cursor.getBytes())
    bytes.push(...this.selection.getBytes())
    bytes.push(...this.scopeSlider.getBytes())
    bytes.push(...this.meterLow.getBytes())
    bytes.push(...this.meterMid.getBytes())
    bytes.push(...this.meterPeak.getBytes())

    return bytes
  }

  /**
   * Returns a Theme based on the raw M8 file bytes.
   *
   * @param {Array<Number>} bytes - The Theme's raw bytes
   *
   * @returns {module:m8-js/lib/types.Theme}
   */
  static fromBytes (bytes) {
    const m8FileReader = new M8FileReader(bytes)
    const theme = new Theme(m8FileReader.m8Version)

    themeProperties.forEach((prop) => {
      theme[prop] = new RGB(...m8FileReader.read(3))
    })

    return theme
  }
}

// Exports
module.exports = {
  DefaultTheme: new Theme(),
  RGB,
  Theme
}
