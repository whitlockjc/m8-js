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

const { DefaultTheme, Theme } = require('../lib/types/Theme')
const { LATEST_M8_VERSION } = require('../lib/constants')
const RGB = require('../lib/types/internal/RGB')

describe('Theme tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      expect(new Theme()).toEqual(DefaultTheme)
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        expect(new Theme(LATEST_M8_VERSION)).toEqual(DefaultTheme)
      })
    })
  })

  test('#asObject', () => {
    expect(new Theme().asObject()).toEqual({
      fileMetadata: {
        type: 'Theme',
        version: LATEST_M8_VERSION.asObject()
      },
      background: new RGB(0x00, 0x00, 0x00).asObject(),
      cursor: new RGB(0x32, 0xEC, 0xFF).asObject(),
      meterLow: new RGB(0x00, 0xFF, 0x50).asObject(),
      meterMid: new RGB(0xFF, 0xE0, 0x00).asObject(),
      meterPeak: new RGB(0xFF, 0x30, 0x70).asObject(),
      playMarker: new RGB(0x00, 0xFF, 0x70).asObject(),
      scopeSlider: new RGB(0x32, 0xEC, 0xFF).asObject(),
      selection: new RGB(0xFF, 0x00, 0xD2).asObject(),
      textDefault: new RGB(0x8C, 0x8C, 0xBA).asObject(),
      textEmpty: new RGB(0x1E, 0x1E, 0x28).asObject(),
      textInfo: new RGB(0x60, 0x60, 0x8E).asObject(),
      textTitle: new RGB(0x32, 0xEC, 0xFF).asObject(),
      textValue: new RGB(0xFA, 0xFA, 0xFA).asObject()
    })
  })

  test('.fromObject', () => {
    const theme = new Theme()

    Theme.getObjectProperties().forEach((prop, i) => {
      // Skip the file metadata as it's not required
      if (prop === 'fileMetadata') {
        return
      }

      theme[prop] = new RGB(i, i, i)
    })

    expect(Theme.fromObject(theme.asObject())).toEqual(theme)
  })

  test('.getObjectProperties', () => {
    expect(Theme.getObjectProperties()).toEqual(Object.keys(new Theme().asObject()))
  })
})
