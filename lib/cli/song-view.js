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

const { getStartingRow, loadM8FileAndVerify, loadTheme, m8Text } = require('./helpers')
const { toM8HexStr } = require('../helpers')

/**
 * The action for the 'song view' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const songView = (m8FilePath, options) => {
  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  const startingRow = getStartingRow(options.startingRow, 255)
  let songData = ''

  for (let i = startingRow; i < startingRow + 16; i++) {
    const step = song.steps[i]

    songData += m8Text.default(toM8HexStr(i))

    for (let j = 0; j < 8; j++) {
      const chain = step.tracks[j]

      if (chain === 0xFF) {
        songData += ` ${m8Text.empty('--')}`
      } else {
        if (song.isChainEmpty(chain)) {
          songData += ` ${m8Text.default(toM8HexStr(chain))}`
        } else {
          songData += ` ${m8Text.value(toM8HexStr(chain))}`
        }
      }
    }

    if (i < startingRow + 15) {
      songData += '\n'
    }
  }

  console.log(`${m8Text.title('SONG')}

${m8Text.default('   1  2  3  4  5  6  7  8')}
${songData}
`)
}

module.exports = songView
