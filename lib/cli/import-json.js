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

const { InstrumentKinds } = require('../constants')
const { readFileSync } = require('fs')
const { Scale } = require('../types/Scale')
const { Theme } = require('../types/Theme')
const { writeFileToDisk } = require('./helpers')
const commander = require('commander')
const M8 = require('../..')
const Song = require('../types/Song')
const FMSynth = require('../types/instruments/FMSynth')
const Macrosynth = require('../types/instruments/Macrosynth')
const MIDIOut = require('../types/instruments/MIDIOut')
const None = require('../types/instruments/None')
const Sampler = require('../types/instruments/Sampler')
const Wavsynth = require('../types/instruments/Wavsynth')

/**
 * The action for the 'import' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const importJSON = (m8FilePath, options) => {
  const bytesFromDisk = readFileSync(m8FilePath)
  const m8FileObject = JSON.parse(bytesFromDisk)
  const m8FileType = m8FileObject.fileMetadata?.type || 'Unknown'
  let instrType
  let m8File

  switch (m8FileType) {
    case 'Instrument':
      instrType = m8FileObject.kind

      switch (instrType) {
        case InstrumentKinds.FMSYNTH:
          m8File = FMSynth.fromObject(m8FileObject)

          break

        case InstrumentKinds.MACROSYNTH:
          m8File = Macrosynth.fromObject(m8FileObject)

          break

        case InstrumentKinds.MIDIOUT:
          m8File = MIDIOut.fromObject(m8FileObject)

          break

        case InstrumentKinds.NONE:
          m8File = None.fromObject(m8FileObject)

          break

        case InstrumentKinds.SAMPLER:
          m8File = Sampler.fromObject(m8FileObject)

          break

        case InstrumentKinds.WAVSYNTH:
          m8File = Wavsynth.fromObject(m8FileObject)

          break

        default:
          throw new commander.InvalidArgumentError(`m8-file Instrument type is unrecognized: ${instrType}`)
      }

      break

    case 'Scale':
      m8File = Scale.fromObject(m8FileObject)

      break

    case 'Song':
      m8File = Song.fromObject(m8FileObject)

      break

    case 'Theme':
      m8File = Theme.fromObject(m8FileObject)

      break

    default:
      throw new commander.InvalidArgumentError(`m8-file type is unrecognized: ${m8FileType}`)
  }

  writeFileToDisk(options.output, M8.dumpM8File(m8File))

  console.log(`M8 ${m8FileType} file (${options.output}) imported from ${m8FilePath}`)
}

module.exports = importJSON
