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

const { loadM8FileAndVerify, loadTheme, printPhrase, validateOptionLimits } = require('./helpers')
const { toM8HexStr } = require('../helpers')

/**
 * The action for the 'song phrase-at' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const songPhraseAt = (m8FilePath, options) => {
  const trackNum = options.trackNum
  const trackStepNum = options.trackStep
  const chainStepNum = options.chainStep

  validateOptionLimits(trackNum, '-n, --track-num <number>', 1, 8)
  validateOptionLimits(trackStepNum, '-s, --track-step <number>', 0, 255)
  validateOptionLimits(options.chainStep, '-c, --chain-step <number>', 0, 15)

  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  // This logic is duplicated in Song#findPhraseStepInstrument but is necessary here to find the phrase step
  const songStep = song.steps[trackStepNum]
  const chainName = songStep.tracks[trackNum - 1]

  if (chainName === 0xFF) {
    console.log(`Chain at ${toM8HexStr(trackStepNum)} for track ${toM8HexStr(trackNum)} is empty`)
    return
  }

  const chain = song.chains[chainName]
  const chainStep = chain.steps[chainStepNum]

  if (chainStep.phrase === 0xFF) {
    console.log(`Phrase at ${toM8HexStr(chainStepNum)} in chain ${toM8HexStr(chainName)} for track ${toM8HexStr(trackNum)} is empty`)
    return
  }

  printPhrase(song, chainStep.phrase, trackNum - 1, trackStepNum, chainStepNum)
}

module.exports = songPhraseAt
