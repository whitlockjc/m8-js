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
 * The action for the 'song chain' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const songChain = (m8FilePath, options) => {
  validateOptionLimits(options.chain, '-c, --chain <number>', 0, 255)

  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  const chain = song.chains[options.chain]
  let chainData = ''

  for (let i = 0; i < 16; i++) {
    const step = chain.steps[i]

    chainData += m8Text.default(toM8HexStr(i, 0))

    if (step.phrase === 0xFF) {
      chainData += ` ${m8Text.empty('--')} ${m8Text.default(toM8HexStr(step.transpose))}`
    } else {
      chainData += ` ${m8Text.value(toM8HexStr(step.phrase))} ${m8Text.value(toM8HexStr(step.transpose))}`
    }

    if (i < 15) {
      chainData += '\n'
    }
  }

  console.log(`${m8Text.title('CHAIN ' + toM8HexStr(options.chain))}

${m8Text.default('  PH TSP')}
${chainData}
`)
}

module.exports = songChain
