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

const { Instrument, M8FileReader, Scale, Song, Theme } = require('./lib/types')

/**
 * Module for loading/interacting with {@link https://dirtywave.com/|Dirtywave} M8 instrument/song files.
 *
 * @see {@link https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9} for original Nim sources.
 *
 * @module m8-js
 */

/**
 * Reads an M8 file from disk.
 *
 * @param {Buffer} buffer - The M8 file content as a Buffer.
 *
 * @returns {Instrument|Scale|Song|Theme} the M8 file
 */
const loadM8File = (buffer) => {
  const fileReader = new M8FileReader(buffer)

  switch (fileReader.fileType) {
    case 'Song':
      return new Song(fileReader)
    case 'Instrument':
      return new Instrument(fileReader)
    case 'Theme':
      return new Theme(fileReader)
    case 'Scale':
      return new Scale(fileReader)
    default:
      throw new TypeError(`Unsupported file type: ${fileReader.fileType}`)
  }
}

// Exports
module.exports = {
  loadM8File
}
