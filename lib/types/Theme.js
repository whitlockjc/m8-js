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

const { LATEST_M8_VERSION } = require('../constants')
const M8File = require('./internal/M8File')
const M8Version = require('./internal/M8Version')
const RGB = require('./internal/RGB')

/**
 * Represents a Theme.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.M8File
 * @memberof module:m8-js/lib/types
 */
class Theme extends M8File {
  /** @member {module:m8-js/lib/types/internal.RGB} */
  background
  /** @member {module:m8-js/lib/types/internal.RGB} */
  textEmpty
  /** @member {module:m8-js/lib/types/internal.RGB} */
  textInfo
  /** @member {module:m8-js/lib/types/internal.RGB} */
  textDefault
  /** @member {module:m8-js/lib/types/internal.RGB} */
  textValue
  /** @member {module:m8-js/lib/types/internal.RGB} */
  textTitle
  /** @member {module:m8-js/lib/types/internal.RGB} */
  playMarker
  /** @member {module:m8-js/lib/types/internal.RGB} */
  cursor
  /** @member {module:m8-js/lib/types/internal.RGB} */
  selection
  /** @member {module:m8-js/lib/types/internal.RGB} */
  scopeSlider
  /** @member {module:m8-js/lib/types/internal.RGB} */
  meterLow
  /** @member {module:m8-js/lib/types/internal.RGB} */
  meterMid
  /** @member {module:m8-js/lib/types/internal.RGB} */
  meterPeak

  /**
   * Creates a Theme.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} [m8FileReaderOrVersion] - The M8
   * version of the Theme (or the M8FileReader used to read the M8 file)
   */
  constructor (m8FileReaderOrVersion) {
    if (typeof m8FileReaderOrVersion === 'undefined') {
      super(M8File.TYPES.Theme, LATEST_M8_VERSION)
    } else {
      if (m8FileReaderOrVersion.constructor.name === 'M8FileReader') {
        super(m8FileReaderOrVersion)
      } else {
        super(M8File.TYPES.Theme, m8FileReaderOrVersion)
      }
    }

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
  asObject () {
    return {
      ...this.headerAsObject(),
      background: this.background.asObject(),
      textEmpty: this.textEmpty.asObject(),
      textInfo: this.textInfo.asObject(),
      textDefault: this.textDefault.asObject(),
      textValue: this.textValue.asObject(),
      textTitle: this.textTitle.asObject(),
      playMarker: this.playMarker.asObject(),
      cursor: this.cursor.asObject(),
      selection: this.selection.asObject(),
      scopeSlider: this.scopeSlider.asObject(),
      meterLow: this.meterLow.asObject(),
      meterMid: this.meterMid.asObject(),
      meterPeak: this.meterPeak.asObject()
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    const m8Version = M8Version.fromObject(object?.fileMetadata?.version)
    const theme = new Theme(m8Version)

    Theme.getObjectProperties().forEach((prop) => {
      // Skip the file metadata as it's not required
      if (prop === 'fileMetadata') {
        return
      }

      theme[prop] = RGB.fromObject(object?.[prop])
    })

    return theme
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return [
      ...this.getHeaderObjectProperties(),
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
  }
}

// Exports
module.exports = {
  DefaultTheme: new Theme(),
  Theme
}
