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

const { loadM8FileAndVerify, loadTheme, m8Text } = require('./helpers')
const { toM8Bool, toM8Num } = require('../helpers')

/**
 * The action for the 'project midi-settings' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const projectMIDISettings = (m8FilePath, options) => {
  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  let channelCols = ''
  let controlMapChan = ''
  let instrCols = ''

  for (let i = 0; i < song.midiSettings.trackInputChannel.length; i++) {
    channelCols += `${toM8Num(song.midiSettings.trackInputChannel[i])}`
    instrCols += `${toM8Num(song.midiSettings.trackInputInstrument[i])}`

    if (i < song.midiSettings.trackInputChannel.length - 1) {
      channelCols += ' '
      instrCols += ' '
    }
  }

  if (song.midiSettings.controlMapChannel < 17) {
    controlMapChan = toM8Num(song.midiSettings.controlMapChannel)
  } else {
    controlMapChan = 'ALL'
  }

  console.log(`${m8Text.title('MIDI SETTINGS')}

${m8Text.default('RECEIVE SYNC')}      ${m8Text.value(toM8Bool(song.midiSettings.receiveSync))}
${m8Text.default('RECEIVE TRANSPORT')} ${m8Text.value(song.midiSettings.transportToStr(song.midiSettings.receiveTransport))}
${m8Text.default('SEND SYNC')}         ${m8Text.value(toM8Bool(song.midiSettings.sendSync))}
${m8Text.default('SEND TRANSPORT')}    ${m8Text.value(song.midiSettings.transportToStr(song.midiSettings.sendTransport))}
${m8Text.default('REC. NOTE CHAN')}    ${m8Text.value(toM8Num(song.midiSettings.recordNoteChannel))}
${m8Text.default('REC. VELOCITY')}     ${m8Text.value(toM8Bool(song.midiSettings.recordNoteVelocity))}
${m8Text.default('REC. DELAY/KILL')}   ${m8Text.value(song.midiSettings.recordNoteDelayKillCommandsToStr())}
${m8Text.default('CONTROL MAP CHAN')}  ${m8Text.value(controlMapChan)}
${m8Text.default('SONG ROW CUE CHAN')} ${m8Text.value(toM8Num(song.midiSettings.songRowCueChannel))}

${m8Text.title('TRACK MIDI INPUT')}
${m8Text.empty('      1  2  3  4  5  6  7  8')}
${m8Text.default('CHAN.')} ${m8Text.value(channelCols)}
${m8Text.default('INST#')} ${m8Text.value(instrCols)}
${m8Text.default('PG CHANGE')} ${toM8Bool(song.trackMidiInputProgramChange)}   ${m8Text.default('MODE')} ${m8Text.value(song.midiSettings.trackInputModeToStr())}
`)
}

module.exports = projectMIDISettings
