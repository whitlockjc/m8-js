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

const { loadM8FileAndVerify, loadTheme, m8Text, validateOptionLimits } = require('./helpers')
const { toM8HexStr } = require('../helpers')

/**
 * The action for the 'song groove' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const songGroove = (m8FilePath, options) => {
  validateOptionLimits(options.groove, '-g, --groove <number>', 0, 31)

  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  const groove = song.grooves[options.groove]
  let grooveData = ''

  for (let i = 0; i < 16; i++) {
    const step = groove.steps[i]

    grooveData += m8Text.default(toM8HexStr(i, 0))

    if (step === 0xFF) {
      grooveData += ` ${m8Text.empty('--')}`
    } else {
      grooveData += ` ${m8Text.value(toM8HexStr(step))}`
    }

    if (i < 15) {
      grooveData += '\n'
    }
  }

  console.log(`${m8Text.title('GROOVE ' + toM8HexStr(options.groove))}

${m8Text.default('  PH TSP')}
${grooveData}
`)
}

module.exports = songGroove
