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

const { readFileSync } = require('fs')
const path = require('path')

const { DefaultTheme, RGB, Theme } = require('../lib/types/Theme')
const { M8FileTypes } = require('../lib/constants')
const M8Version = require('../lib/types/M8Version')

describe('Theme tests', () => {
  test('constructor', () => {
    expect(new Theme()).toEqual(DefaultTheme)
  })

  test('#fromBytes and #getBytes', () => {
    const filePath = path.join(__dirname, 'files/Themes/DEFAULT.m8t')
    const bytesFromDisk = Array.from(readFileSync(filePath))
    const themeFromDisk = Theme.fromBytes(bytesFromDisk)
    const alteredSelection = new RGB(0x0F, 0x1F, 0x2F)

    // Ensure the raw bytes read from disk match the dumped bytes
    expect(bytesFromDisk).toEqual(themeFromDisk.getBytes())

    let alteredTheme = Theme.fromBytes(themeFromDisk.getBytes())

    // Change the theme
    alteredTheme.selection = alteredSelection

    // Dump altered theme (with latest version number due to not providing one)
    alteredTheme = Theme.fromBytes(alteredTheme.getBytes())

    // Ensure the files are the same
    expect(alteredTheme.background).toEqual(themeFromDisk.background)
    expect(alteredTheme.textEmpty).toEqual(themeFromDisk.textEmpty)
    expect(alteredTheme.textInfo).toEqual(themeFromDisk.textInfo)
    expect(alteredTheme.textDefault).toEqual(themeFromDisk.textDefault)
    expect(alteredTheme.textValue).toEqual(themeFromDisk.textValue)
    expect(alteredTheme.textTitle).toEqual(themeFromDisk.textTitle)
    expect(alteredTheme.playMarker).toEqual(themeFromDisk.playMarker)
    expect(alteredTheme.cursor).toEqual(themeFromDisk.cursor)
    expect(alteredTheme.selection).toEqual(alteredSelection)
    expect(alteredTheme.scopeSlider).toEqual(themeFromDisk.scopeSlider)
    expect(alteredTheme.meterLow).toEqual(themeFromDisk.meterLow)
    expect(alteredTheme.meterMid).toEqual(themeFromDisk.meterMid)
    expect(alteredTheme.meterPeak).toEqual(themeFromDisk.meterPeak)
    expect(alteredTheme.m8FileVersion).toEqual(new M8Version(1, 0, 2))
    expect(alteredTheme.m8FileType).toEqual(M8FileTypes.Theme)
  })
})
