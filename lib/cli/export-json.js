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

const { readFileSync } = require('fs')
const { writeFileToDisk } = require('./helpers')
const M8 = require('../..')
const M8File = require('../types/internal/M8File')

/**
 * The action for the 'export' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const exportJSON = (m8FilePath, options) => {
  const bytesFromDisk = Uint8Array.from(readFileSync(m8FilePath))
  const m8File = M8.loadM8File(bytesFromDisk)
  const json = JSON.stringify(m8File.asObject(), null, 2)

  if (typeof options.output === 'string') {
    writeFileToDisk(options.output, json)

    console.log(`M8 ${M8File.typeToStr(m8File.m8FileType)} file (${m8FilePath}) exported to ${options.output}`)
  } else {
    console.log(json)
  }
}

module.exports = exportJSON
