/* Copyright 2023 Jeremy Whitlock
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

const { loadM8FileAndVerify, loadTheme, m8Text } = require('./helpers')
const { toM8HexStr } = require('../helpers')
const clc = require('cli-color')
const x256 = require('x256')

/**
 * The action for the 'theme view' command.
 *
 * @param {String} m8FilePath - The M8 file path
 */
const themeView = (m8FilePath) => {
  const theme = loadM8FileAndVerify(m8FilePath, 'Theme')

  loadTheme(theme)

  console.log(`${m8Text.title('THEME SETTINGS')}

${m8Text.default('BACKGROUND')}   ${m8Text.value(toM8HexStr(theme.background.r))} ${m8Text.value(toM8HexStr(theme.background.g))} ${m8Text.value(toM8HexStr(theme.background.b))} ${clc.xterm(x256(theme.background.r, theme.background.g, theme.background.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:EMPTY')}   ${m8Text.value(toM8HexStr(theme.textEmpty.r))} ${m8Text.value(toM8HexStr(theme.textEmpty.g))} ${m8Text.value(toM8HexStr(theme.textEmpty.b))} ${clc.xterm(x256(theme.textEmpty.r, theme.textEmpty.g, theme.textEmpty.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:INFO')}    ${m8Text.value(toM8HexStr(theme.textInfo.r))} ${m8Text.value(toM8HexStr(theme.textInfo.g))} ${m8Text.value(toM8HexStr(theme.textInfo.b))} ${clc.xterm(x256(theme.textInfo.r, theme.textInfo.g, theme.textInfo.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:DEFAULT')} ${m8Text.value(toM8HexStr(theme.textDefault.r))} ${m8Text.value(toM8HexStr(theme.textDefault.g))} ${m8Text.value(toM8HexStr(theme.textDefault.b))} ${clc.xterm(x256(theme.textDefault.r, theme.textDefault.g, theme.textDefault.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:VALUE')}   ${m8Text.value(toM8HexStr(theme.textValue.r))} ${m8Text.value(toM8HexStr(theme.textValue.g))} ${m8Text.value(toM8HexStr(theme.textValue.b))} ${clc.xterm(x256(theme.textValue.r, theme.textValue.g, theme.textValue.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:TITLES')}  ${m8Text.value(toM8HexStr(theme.textTitle.r))} ${m8Text.value(toM8HexStr(theme.textTitle.g))} ${m8Text.value(toM8HexStr(theme.textTitle.b))} ${clc.xterm(x256(theme.textTitle.r, theme.textTitle.g, theme.textTitle.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('PLAY MARKERS')} ${m8Text.value(toM8HexStr(theme.playMarker.r))} ${m8Text.value(toM8HexStr(theme.playMarker.g))} ${m8Text.value(toM8HexStr(theme.playMarker.b))} ${clc.xterm(x256(theme.playMarker.r, theme.playMarker.g, theme.playMarker.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('CURSOR')}       ${m8Text.value(toM8HexStr(theme.cursor.r))} ${m8Text.value(toM8HexStr(theme.cursor.g))} ${m8Text.value(toM8HexStr(theme.cursor.b))} ${clc.xterm(x256(theme.cursor.r, theme.cursor.g, theme.cursor.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('SELECTION')}    ${m8Text.value(toM8HexStr(theme.selection.r))} ${m8Text.value(toM8HexStr(theme.selection.g))} ${m8Text.value(toM8HexStr(theme.selection.b))} ${clc.xterm(x256(theme.selection.r, theme.selection.g, theme.selection.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('SCOPE/SLIDER')} ${m8Text.value(toM8HexStr(theme.scopeSlider.r))} ${m8Text.value(toM8HexStr(theme.scopeSlider.g))} ${m8Text.value(toM8HexStr(theme.scopeSlider.b))} ${clc.xterm(x256(theme.scopeSlider.r, theme.scopeSlider.g, theme.scopeSlider.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('METER LOW')}    ${m8Text.value(toM8HexStr(theme.meterLow.r))} ${m8Text.value(toM8HexStr(theme.meterLow.g))} ${m8Text.value(toM8HexStr(theme.meterLow.b))} ${clc.xterm(x256(theme.meterLow.r, theme.meterLow.g, theme.meterLow.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('METER MID')}    ${m8Text.value(toM8HexStr(theme.meterMid.r))} ${m8Text.value(toM8HexStr(theme.meterMid.g))} ${m8Text.value(toM8HexStr(theme.meterMid.b))} ${clc.xterm(x256(theme.meterMid.r, theme.meterMid.g, theme.meterMid.b))('\u25A0\u25A0\u25A0')}
${m8Text.default('METER PEAK')}   ${m8Text.value(toM8HexStr(theme.meterPeak.r))} ${m8Text.value(toM8HexStr(theme.meterPeak.g))} ${m8Text.value(toM8HexStr(theme.meterPeak.b))} ${clc.xterm(x256(theme.meterPeak.r, theme.meterPeak.g, theme.meterPeak.b))('\u25A0\u25A0\u25A0')}
`)
}

module.exports = themeView
