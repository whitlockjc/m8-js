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

const { loadM8FileAndVerify, loadTheme, printInstrument, printScale, printSong, printTheme } = require('./helpers')
const M8File = require('../types/internal/M8File')
const commander = require('commander')

/**
 * The action for the 'm8' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const projectView = (m8FilePath, options) => {
  const m8File = loadM8FileAndVerify(m8FilePath, ['Scale', 'Song', 'Instrument', 'Theme'])
  const fileType = M8File.typeToStr(m8File.m8FileType)

  // Load the theme
  loadTheme(options.theme)

  switch (fileType) {
    case 'Instrument':
      printInstrument(m8File)

      break

    case 'Scale':
      printScale(m8File)

      console.log("To view the Scale for a different key, use the 'scale view' command directly")

      break

    case 'Song':
      printSong(m8File)

      console.log("To view different Song rows, use the 'song view' command directly")

      break

    case 'Theme':
      printTheme(m8File)

      break

    default:
      throw new commander.InvalidArgumentError(`Unsupported file type: ${fileType}`)
  }
}

module.exports = projectView
