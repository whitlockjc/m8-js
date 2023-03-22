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
 * The action for the 'project view' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const projectView = (m8FilePath, options) => {
  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  let liveQuantize = m8Text.value(toM8HexStr(song.quantize))

  if (song.quantize === 0x00) {
    liveQuantize += m8Text.default(' CHAIN LEN')
  } else {
    liveQuantize += m8Text.default(' STEPS')
  }

  console.log(`${m8Text.title('PROJECT')}

${m8Text.default('TRANSPOSE')}     ${m8Text.value(toM8HexStr(song.transpose))}
${m8Text.default('TEMPO')}         ${m8Text.value(song.tempo.toFixed(2))}
${m8Text.default('LIVE QUANTIZE')} ${liveQuantize}

${m8Text.default('NAME')}          ${m8Text.value(song.name)}
`)
}

module.exports = projectView
