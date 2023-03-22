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
const { loadM8FileAndVerify, loadTheme, m8Text, validateInstrumentOption } = require('./helpers')
const { toM8Bool, toM8HexStr } = require('../helpers')

/**
 * The action for the 'instrument envelope' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const instrumentEnvelope = (m8FilePath, options) => {
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

  if (instrument.kind() === InstrumentKinds.MIDIOUT) {
    console.log('Instrument is a MIDI OUT instrument and has no envelope')
    return
  } else if (instrument.kind() === InstrumentKinds.NONE) {
    console.log('Instrument is a NONE instrument and has no envelope')
    return
  }

  let envelopeData = ''
  const leftColumn = []
  const rightColumn = []

  for (let i = 0; i < instrument.envelopes.length; i++) {
    const env = instrument.envelopes[i]
    const lfo = instrument.lfos[i]

    leftColumn.push(['ENV' + (i + 1) + ' TO', env.dest, env.destToStr(instrument)])
    rightColumn.push(['LFO', lfo.dest, lfo.destToStr(instrument)])

    leftColumn.push(['AMOUNT', env.amount])
    rightColumn.push(['AMT', lfo.amount])

    leftColumn.push(['ATTACK', env.attack])
    rightColumn.push(['OSC', lfo.shape, lfo.shapeToStr()])

    leftColumn.push(['HOLD', env.hold])
    rightColumn.push(['TRG', lfo.triggerMode, lfo.triggerModeToStr()])

    leftColumn.push(['DECAY', env.decay])
    rightColumn.push(['AMT', lfo.freq])
  }

  // As of right now, left column will ALWAYS have more items than right
  for (let i = 0; i < leftColumn.length; i++) {
    const leftCol = leftColumn[i]
    const leftLabel = leftCol[0]
    const leftValue = leftCol[1]
    const leftExtra = leftCol[2]
    const rightCol = rightColumn[i] || []
    const rightLabel = rightCol[0]
    const rightValue = rightCol[1]
    const rightExtra = rightCol[2]

    envelopeData += m8Text.default(leftLabel) + ' '.repeat(8 - leftLabel.length)
    envelopeData += m8Text.value(toM8HexStr(leftValue))

    if (typeof leftExtra !== 'undefined') {
      envelopeData += m8Text.title(leftExtra)
    }

    envelopeData += ' '.repeat(8 - (typeof leftExtra === 'undefined' ? 0 : leftExtra.length))

    if (typeof rightLabel !== 'undefined') {
      envelopeData += m8Text.default(rightLabel)
      envelopeData += ' '
      envelopeData += m8Text.value(toM8HexStr(rightValue))

      if (typeof rightExtra !== 'undefined') {
        envelopeData += m8Text.title(rightExtra)
      }
    }

    // Add the end of line character for each row
    if (i < leftColumn.length - 1) {
      envelopeData += '\n'
    }

    // Add extra new line in between each envelope
    if ((i + 1) % (leftColumn.length / instrument.envelopes.length) === 0 && i !== leftColumn.length - 1) {
      envelopeData += '\n'
    }
  }

  console.log(`${m8Text.title(instrOrSong.constructor.name === 'Song' ? 'INST. ' + toM8HexStr(options.instrument) : instrument.name)}

${m8Text.default('TYPE')}    ${m8Text.value(instrument.kindToStr())}
${m8Text.default('NAME')}    ${m8Text.value(instrument.name)}${m8Text.empty('-'.repeat(12 - instrument.name.length))}
${m8Text.default('TRANSP.')} ${m8Text.value(toM8Bool(instrument.transpose))}       ${m8Text.default('TABLE TIC')} ${m8Text.value(toM8HexStr(instrument.tableTick))}

${envelopeData}
`)
}

module.exports = instrumentEnvelope
