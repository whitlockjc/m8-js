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

const { getStartingRow, loadM8FileAndVerify, loadTheme, m8Text, validateOptionLimits } = require('./helpers')
const { toM8HexStr, toM8Num } = require('../helpers')

/**
 * The action for the 'project midi-mapping' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const projectMIDIMapping = (m8FilePath, options) => {
  if (typeof options.startingRow === 'number') {
    validateOptionLimits(options.startingRow, '-s, --starting-row <number>', 0, 127)
  }

  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  const startingRow = getStartingRow(options.startingRow, 127)
  let mappings = ''

  for (let i = startingRow; i < startingRow + 16; i++) {
    const midiMapping = song.midiMappings[i]
    const instrIndex = midiMapping.instrIndex
    const paramIndex = midiMapping.paramIndex
    const type = midiMapping.typeToStr()
    let channel = midiMapping.channel
    let controlNum = midiMapping.controlNum
    let instrDisplay = instrIndex
    let paramDisplay = paramIndex

    mappings += `${m8Text.value(toM8HexStr(i))} `

    if (midiMapping.empty) {
      mappings += `${m8Text.empty('-- --- -- --')}${m8Text.default('\u25B8')}${m8Text.empty('--')}`
    } else {
      if (channel === 17) {
        channel = 'AL'
      } else {
        channel = toM8Num(channel)
      }

      if (controlNum === 129) {
        controlNum = 'T:Y'
      } else if (controlNum === 128) {
        controlNum = 'T:X'
      } else {
        controlNum = toM8Num(midiMapping.controlNum, 3)
      }

      switch (type) {
        case 'M':
          instrDisplay = paramIndex
          paramDisplay = song.mixerSettings.getMIDIDestLabels()[paramIndex]
          break

        case 'X':
          instrDisplay = paramIndex
          paramDisplay = song.effectsSettings.getMIDIDestLabels()[paramIndex]
          break

        case 'I':
          instrDisplay = instrIndex
          paramDisplay = song.instruments[instrIndex].getMIDIDestLabels()[paramIndex] || 'UNUSED'

          if (typeof paramDisplay === 'undefined' || paramDisplay === 'UNUSED') {
            paramDisplay = toM8HexStr(paramIndex)
          }
      }

      mappings += `${m8Text.value(channel)} `
      mappings += `${m8Text.value(controlNum)} `
      mappings += `${m8Text.empty('--')} `
      mappings += `${m8Text.value(toM8HexStr(midiMapping.minValue))}${m8Text.default('\u25B8')}`
      mappings += `${m8Text.value(toM8HexStr(midiMapping.maxValue))} `
      mappings += m8Text.title(type) + m8Text.value(`${toM8HexStr(instrDisplay)}:${paramDisplay}`)
    }

    if (i < startingRow + 15) {
      mappings += '\n'
    }
  }

  console.log(`${m8Text.title('MIDI MAPPING')}

${m8Text.default('   CH CTL V  RANGE DEST')}
${mappings}
`)
}

module.exports = projectMIDIMapping
