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

/**
 * The action for the 'project effects' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const projectEffects = (m8FilePath, options) => {
  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  const effectsSettings = song.effectsSettings

  console.log(`${m8Text.title('CHORUS SETTINGS')}
${m8Text.default('MOD DEPTH')}     ${m8Text.value(toM8HexStr(effectsSettings.chorusSettings.modDepth))}
${m8Text.default('MOD FREQ.')}     ${m8Text.value(toM8HexStr(effectsSettings.chorusSettings.modFreq))}
${m8Text.default('WIDTH')}         ${m8Text.value(toM8HexStr(effectsSettings.chorusSettings.width))}
${m8Text.default('REVERB SEND')}   ${m8Text.value(toM8HexStr(effectsSettings.chorusSettings.reverbSend))}

${m8Text.title('DELAY SETTINGS')}
${m8Text.default('FILTER HP:LP')}  ${m8Text.value(toM8HexStr(effectsSettings.delaySettings.filterHP) + ':' + toM8HexStr(effectsSettings.delaySettings.filterLP))}
${m8Text.default('TIME L:R')}      ${m8Text.value(toM8HexStr(effectsSettings.delaySettings.timeL) + ':' + toM8HexStr(effectsSettings.delaySettings.timeR))}
${m8Text.default('FEEDBACK')}      ${m8Text.value(toM8HexStr(effectsSettings.delaySettings.feedback))}
${m8Text.default('WIDTH')}         ${m8Text.value(toM8HexStr(effectsSettings.delaySettings.width))}
${m8Text.default('REVERB SEND')}   ${m8Text.value(toM8HexStr(effectsSettings.delaySettings.reverbSend))}

${m8Text.title('REVERB SETTINGS')}
${m8Text.default('FILTER HP:LP')}  ${m8Text.value(toM8HexStr(effectsSettings.reverbSettings.filterHP) + ':' + toM8HexStr(effectsSettings.reverbSettings.filterLP))}
${m8Text.default('SIZE')}          ${m8Text.value(toM8HexStr(effectsSettings.reverbSettings.size))}
${m8Text.default('DAMPING')}       ${m8Text.value(toM8HexStr(effectsSettings.reverbSettings.damping))}
${m8Text.default('MOD DEPTH')}     ${m8Text.value(toM8HexStr(effectsSettings.reverbSettings.modDepth))}
${m8Text.default('MOD FREQ.')}     ${m8Text.value(toM8HexStr(effectsSettings.reverbSettings.modFreq))}
${m8Text.default('WIDTH')}         ${m8Text.value(toM8HexStr(effectsSettings.reverbSettings.width))}
`)
}

module.exports = projectEffects
