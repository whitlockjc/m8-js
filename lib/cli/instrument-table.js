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

const { loadM8FileAndVerify, loadTheme, printTable, validateInstrumentOption } = require('./helpers')

/**
 * The action for the 'instrument table' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const instrumentTable = (m8FilePath, options) => {
  const instrOrSong = loadM8FileAndVerify(m8FilePath, ['Instrument', 'Song'])
  let instrument

  validateInstrumentOption(instrOrSong, options.instrument)

  // Load the theme
  loadTheme(options.theme)

  if (instrOrSong.constructor.name === 'Song') {
    instrument = instrOrSong.instruments[options.instrument]
  } else {
    instrument = instrOrSong
  }

  printTable(instrument.table, instrument, options.instrument)
}

module.exports = instrumentTable
