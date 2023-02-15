/* Copyright 2022 Jeremy Whitlock
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

const { Instrument } = require('./lib/types/Instrument')
const { Scale } = require('./lib/types/Scale')
const { Theme } = require('./lib/types/Theme')
const { Song } = require('./lib/types/Song')

// TODO: Add debug support
// TODO: Add error handling

/**
 * Reads an M8 file of unknown type.
 *
 * @param {module:m8-js/lib/types.M8FileReader} fileReader - The M8 file reader
 *
 * @returns {module:m8-js/lib/types.Instrument|module:m8-js/lib/types.Scale|module:m8-js/lib/types.Song|module:m8-js/lib/types.Theme}}
 */
const loadM8File = (fileReader) => {
  switch (fileReader.fileTypeToStr()) {
    case 'Song':
      return Song.fromBytes(fileReader.bytes)
    case 'Instrument':
      return Instrument.fromBytes(fileReader.bytes)
    case 'Scale':
      return Scale.fromBytes(fileReader.bytes)
    case 'Theme':
      return Theme.fromBytes(fileReader.bytes)
    default:
      throw new TypeError(`Unsupported file type: ${fileReader.fileTypeToStr()}`)
  }
}

// Exports
module.exports = {
  loadM8File
}
