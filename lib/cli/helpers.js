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

const { DefaultTheme } = require('../types/Theme')
const { InstrumentKinds, VERSION_1_4_0 } = require('../constants')
const { loadM8File } = require('../..')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const { getNote, toM8Bool, toM8HexStr, toM8Num } = require('../helpers')
const clc = require('cli-color')
const commander = require('commander')
const M8File = require('../types/internal/M8File')
const x256 = require('x256')

const m8Text = {}

/**
 * Gets the starting row number based on what was requested.
 *
 * @param {Number} startingRow - The starting row
 * @param {Number} maxValue - The maximum value
 *
 * @returns {Number}
 */
const getStartingRow = (startingRow, maxValue) => {
  // Starting row must is 1-based but traversal is 0-based, and with the
  // number of rows being displayed will be 16, we offset the maximum by
  // 15.
  const maxStartingRow = maxValue - 15

  if (startingRow < 0 || startingRow > maxValue) {
    throw new commander.InvalidArgumentError("option '-s, --starting-row <number>' must be between " +
      `00 and ${toM8HexStr(maxValue)}`)
  }

  // If the user specifies a starting row within the last page, set the
  // starting row to the first item of the last page
  if (startingRow > maxStartingRow) {
    startingRow = maxStartingRow
  }

  return startingRow
}

/**
 * Loads the M8 file and verifies its type.
 *
 * @param {String} path - The M8 file path
 * @param {Array<String>|String} type - The type(s) allowed for the M8 file
 *
 * @returns {module:m8-js/lib/types.Scale|module:m8-js/lib/types.Song|module:m8-js/lib/types.Theme|module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH}
 */
const loadM8FileAndVerify = (path, type) => {
  const bytesFromDisk = Uint8Array.from(readFileSync(path))
  const m8File = loadM8File(bytesFromDisk)
  const m8FileType = M8File.typeToStr(m8File.m8FileType)

  if (typeof type === 'string') {
    if (m8FileType !== type) {
      throw new commander.InvalidArgumentError(`m8-file must be a ${type} file`)
    }
  } else {
    if (typeof type !== 'undefined' && type.indexOf(m8FileType) === -1) {
      throw new commander.InvalidArgumentError(`m8-file must be a ${type.join(' or ')} file`)
    }
  }

  return m8File
}

/**
 * Loads an M8 Theme.
 *
 * @param {module:m8-js/lib/types.Theme} themeOrPath - The M8 Theme to load
 */
const loadTheme = (themeOrPath) => {
  let theme

  if (typeof themeOrPath === 'undefined') {
    theme = DefaultTheme
  } else if (themeOrPath.constructor.name === 'Theme') {
    theme = themeOrPath
  } else {
    theme = loadM8FileAndVerify(themeOrPath)

    if (theme.constructor.name !== 'Theme') {
      throw new commander.InvalidOptionArgumentError("option '-T, --theme <path>' must be to an M8 Theme file")
    }
  }

  m8Text.default = clc.xterm(x256(theme.textDefault.r, theme.textDefault.g, theme.textDefault.b))
  m8Text.empty = clc.xterm(x256(theme.textEmpty.r, theme.textEmpty.g, theme.textEmpty.b))
  m8Text.info = clc.xterm(x256(theme.textInfo.r, theme.textInfo.g, theme.textInfo.b))
  m8Text.title = clc.xterm(x256(theme.textTitle.r, theme.textTitle.g, theme.textTitle.b))
  m8Text.value = clc.xterm(x256(theme.textValue.r, theme.textValue.g, theme.textValue.b))
}

/**
 * Parses the hex string into a number.
 *
 * @param {String} value - The value expected to represent a hex integer
 *
 * @returns {Number}
 */
const parseCLIHexInt = (value) => {
  const parsedValue = parseInt(value, 16)

  if (isNaN(parsedValue)) {
    throw new commander.InvalidOptionArgumentError('not a hex number')
  }

  return parsedValue
}

/**
 * Parses the decimal string into a number.
 *
 * @param {String} value - The value expected to represent a decimal integer
 *
 * @returns {Number}
 */
const parseCLIInt = (value) => {
  const parsedValue = parseInt(value, 10)

  if (isNaN(parsedValue)) {
    throw new commander.InvalidOptionArgumentError('not a number')
  }

  return parsedValue
}

/**
 * Prints an M8 Instrument.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instrument - The M8 Instrument to print
 * @param {Number} [instrIndex] - The instrument index
 */
const printInstrument = (instrument, instrIndex) => {
  const ampParams = instrument.ampParams
  const filterParams = instrument.filterParams
  const instrParams = instrument.instrParams
  const kind = instrument.kind()
  const mixerParams = instrument.mixerParams
  let instrumentData = ''

  if (kind === InstrumentKinds.MIDIOUT) {
    instrumentData = `
${m8Text.default('PORT')}        ${m8Text.value(toM8HexStr(instrParams.port))}${m8Text.title(instrParams.portToStr())}
${m8Text.default('CHANNEL')}     ${m8Text.value(toM8Num(instrParams.channel))}
${m8Text.default('BANK:PG')}     `

    if (instrParams.bankSelect === 0xFF) {
      instrumentData += m8Text.empty(toM8Num('---'))
    } else {
      instrumentData += m8Text.value(toM8Num(instrParams.bankSelect, 3))
    }

    instrumentData += m8Text.info(':')

    if (instrParams.programChange === 0xFF) {
      instrumentData += m8Text.empty(toM8Num('---'))
    } else {
      instrumentData += m8Text.value(toM8Num(instrParams.programChange, 3))
    }

    instrumentData += '\n'

    for (let i = 0; i < instrParams.customCC.length; i++) {
      const customCC = instrParams.customCC[i]

      // 97 is the char code for 'a'
      instrumentData += `${m8Text.default('CC' + String.fromCharCode(97 + i).toUpperCase() + ' CC:VAL')}  `

      if (customCC.number === 0xFF) {
        instrumentData += m8Text.empty(toM8Num('---'))
      } else {
        instrumentData += m8Text.value(toM8Num(customCC.number, 3))
      }

      instrumentData += m8Text.info(':')

      if (customCC.defaultValue === 0xFF) {
        instrumentData += m8Text.empty('--')
      } else {
        instrumentData += m8Text.value(toM8HexStr(customCC.defaultValue))
      }

      if (i < 10) {
        instrumentData += '\n'
      }
    }
  } else if (kind !== InstrumentKinds.NONE) {
    const leftColumn = []
    const rightColumn = []
    let levFbData = ''
    let modAData = ''
    let modBData = ''
    let ratioData = ''
    let sanitizedSamplePath

    switch (kind) {
      case InstrumentKinds.FMSYNTH:
        instrumentData = `
${m8Text.default('ALGO')}    ${m8Text.value(toM8HexStr(instrParams.algo))}${m8Text.title(instrParams.algoToStr())}
`

        if (instrument.m8FileVersion.compare(VERSION_1_4_0) >= 0) {
          instrumentData += '        '

          for (let i = 0; i < instrParams.operators.length; i++) {
            const operator = instrParams.operators[i]
            const charStr = String.fromCharCode(97 + i).toUpperCase()

            instrumentData += `${m8Text.default(charStr)} ${m8Text.value(operator.shapeToStr())}`

            if (i < instrParams.operators.length - 1) {
              instrumentData += ' '
            }
          }
        }

        for (let i = 0; i < instrParams.operators.length; i++) {
          const operator = instrParams.operators[i]

          ratioData += m8Text.value(toM8Num(operator.ratio) + '.' + toM8Num(operator.ratioFine))

          if (i < instrParams.operators.length - 1) {
            ratioData += ' '
          }
        }

        for (let i = 0; i < instrParams.operators.length; i++) {
          const operator = instrParams.operators[i]

          levFbData += m8Text.value(toM8HexStr(operator.level)) + m8Text.info('/') +
                         m8Text.value(toM8HexStr(operator.feedback))

          if (i < instrParams.operators.length - 1) {
            levFbData += ' '
          }
        }

        for (let i = 0; i < instrParams.operators.length; i++) {
          const operator = instrParams.operators[i]
          const modAStr = instrParams.modToStr(operator.modA)
          const modBStr = instrParams.modToStr(operator.modB)

          if (modAStr === '-----') {
            modAData += m8Text.empty(modAStr)
          } else {
            modAData += m8Text.value(modAStr.substring(0, 2)) + m8Text.title(modAStr.substring(2))
          }

          if (modBStr === '-----') {
            modBData += m8Text.empty(modBStr)
          } else {
            modBData += m8Text.value(modBStr.substring(0, 2)) + m8Text.title(modBStr.substring(2))
          }

          if (i < instrParams.operators.length - 1) {
            modAData += ' '
            modBData += ' '
          }
        }

        instrumentData += `
${m8Text.default('RATIO')}   ${ratioData}
${m8Text.default('LEV/FB')}  ${levFbData}
${m8Text.default('MOD')}     ${modAData}
        ${modBData}

`

        leftColumn.push(['MOD1', instrParams.mod1])
        leftColumn.push(['MOD2', instrParams.mod2])
        leftColumn.push(['MOD3', instrParams.mod3])
        leftColumn.push(['MOD4', instrParams.mod4])

        break

      case InstrumentKinds.WAVSYNTH:
        instrumentData = `
${m8Text.default('SHAPE')}   ${m8Text.value(toM8HexStr(instrParams.shape))}${m8Text.title(instrParams.shapeToStr())}

`

        leftColumn.push(['SIZE', instrParams.size])
        leftColumn.push(['MULT', instrParams.mult])
        leftColumn.push(['WARP', instrParams.warp])
        leftColumn.push(['MIRROR', instrParams.mirror])

        break

      case InstrumentKinds.MACROSYNTH:
        instrumentData = `
${m8Text.default('SHAPE')}   ${m8Text.value(toM8HexStr(instrParams.shape))}${m8Text.title(instrParams.shapeToStr())}

`

        leftColumn.push(['TIMBRE', instrParams.timbre])
        leftColumn.push(['COLOR', instrParams.color])
        leftColumn.push(['DEGRADE', instrParams.degrade])
        leftColumn.push(['REDUX', instrParams.redux])

        break

      case InstrumentKinds.SAMPLER:
        sanitizedSamplePath = instrParams.samplePathToStr()

        instrumentData = `
${m8Text.default('SAMPLE')}`

        if (sanitizedSamplePath.length > 0) {
          instrumentData += `  ${m8Text.title(sanitizedSamplePath)}`
        }

        instrumentData += '\n\n'

        leftColumn.push([
          'SLICE',
          instrParams.slice,
          instrParams.slice === 0x00 ? 'OFF' : toM8Num(instrParams.slice, 3)])
        leftColumn.push(['PLAY', instrParams.playMode, instrParams.playModeToStr()])
        leftColumn.push(['START', instrParams.start])
        leftColumn.push(['LOOP ST', instrParams.loopStart])
        leftColumn.push(['LENGTH', instrParams.length])
        leftColumn.push(['DETUNE', instrument.fineTune])
        leftColumn.push(['DEGRADE', instrParams.degrade])

        break
    }

    // Filter Parameters
    leftColumn.push(['FILTER', filterParams.type, instrument.filterParams.typeToStr(instrument.kind(),
                                                                                    instrument.m8FileVersion)])
    leftColumn.push(['CUTOFF', filterParams.cutoff])
    leftColumn.push(['RES', filterParams.res])

    // Amplifier Parameters
    rightColumn.push(['AMP', ampParams.amp])
    rightColumn.push(['LIM', ampParams.limit, ampParams.limitToStr()])

    // Mixer Parameters
    rightColumn.push(['PAN', mixerParams.pan])
    rightColumn.push(['DRY', mixerParams.dry])
    rightColumn.push(['CHO', mixerParams.cho])
    rightColumn.push(['DEL', mixerParams.del])
    rightColumn.push(['REV', mixerParams.rev])

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

      instrumentData += m8Text.default(leftLabel) + ' '.repeat(8 - leftLabel.length)
      instrumentData += m8Text.value(toM8HexStr(leftValue))

      if (typeof leftExtra !== 'undefined') {
        instrumentData += m8Text.title(leftExtra)
      }

      if (typeof rightLabel !== 'undefined') {
        instrumentData += ' '.repeat(8 - (typeof leftExtra === 'undefined' ? 0 : leftExtra.length))
        instrumentData += m8Text.default(rightLabel)
        instrumentData += ' '
        instrumentData += m8Text.value(toM8HexStr(rightValue))

        if (typeof rightExtra !== 'undefined') {
          instrumentData += m8Text.title(rightExtra)
        }
      }

      instrumentData += '\n'
    }
  }

  console.log(`${m8Text.title('INST.' + (typeof instrIndex === 'undefined' ? '' : ' ' + toM8HexStr(instrIndex)))}

${m8Text.default('TYPE')}    ${m8Text.value(instrument.kindToStr())}
${m8Text.default('NAME')}    ${m8Text.value(instrument.name)}${m8Text.empty('-'.repeat(12 - instrument.name.length))}
${m8Text.default('TRANSP.')} ${m8Text.value(toM8Bool(instrument.transpose))}       ${m8Text.default('TABLE TIC')} ${m8Text.value(toM8HexStr(instrument.tableTick))}
${instrumentData}`)
}

/**
 * Prints the M8 file version.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {Array<String>|String} type - THe allowed M8 file type
 * @param {String} themePath - The M8 Theme path
 */
const printM8FileVersion = (m8FilePath, type, themePath) => {
  const m8File = loadM8FileAndVerify(m8FilePath, type)

  // Load the theme
  loadTheme(themePath)

  console.log(`${m8Text.title('M8 VERSION')}

${m8Text.value(m8File.m8FileVersion)}
`)
}

/**
 * Prints a Phrase.
 *
 * @param {module:m8-js/lib/types.Song} song - The M8 Song
 * @param {Number} phraseNum - The Phrase number
 * @param {Number} [trackNum] - The track number
 * @param {Number} [songStepNum] - The SongStep number
 * @param {Number} [chainStepNum] - The ChainStep number
 */
const printPhrase = (song, phraseNum, trackNum, songStepNum, chainStepNum) => {
  let needsPhraseAt = false
  let phraseData = ''

  const phrase = song.phrases[phraseNum]
  let lastInstr

  for (let i = 0; i < 16; i++) {
    const step = phrase.steps[i]
    const noteStr = step.noteToStr(i)
    const instrNum = phrase.findPhraseStepInstrumentNum(i)
    let instrument

    // Try to find the last instrument for the phrase in isolation
    if (instrNum === 0xFF) {
      // If it can't be found and we already know the previous instrument, use it
      if (typeof lastInstr !== 'undefined') {
        instrument = lastInstr
      }
    } else {
      // If we found a new instrument, use it
      instrument = song.instruments[instrNum]
    }

    // If we still have no instrument and we're using 'phrase-at', attempt to find it
    if (typeof instrument === 'undefined' && typeof trackNum !== 'undefined') {
      instrument = song.findPhraseStepInstrument(trackNum, songStepNum, chainStepNum, i)
    }

    if (i % 4 === 0) {
      phraseData += m8Text.default(toM8HexStr(i, 0))
    } else {
      phraseData += m8Text.info(toM8HexStr(i, 0))
    }

    ;[step.note, step.volume, step.instrument].forEach((val, j) => {
      if (val === 0xFF) {
        phraseData += ` ${m8Text.empty(j === 0 ? noteStr : '--')}`
      } else {
        phraseData += ` ${m8Text.value(j === 0 ? noteStr : toM8HexStr(val))}`
      }
    })

    step.fx.forEach((fx) => {
      const fxVal = toM8HexStr(fx.value)
      let fxCmd = fx.commandToStr(instrument)

      if (fxCmd.endsWith('?')) {
        if (typeof trackNum === 'undefined') {
          needsPhraseAt = true
        }

        fxCmd = fxCmd.substring(0, fxCmd.length - 1) + (typeof trackNum === 'undefined' ? '*' : '?')
      }

      if (fxCmd === '---') {
        phraseData += ` ${m8Text.empty(fxCmd)}${m8Text.info(fxVal)}`
      } else {
        phraseData += ` ${m8Text.value(fxCmd)}${m8Text.value(fxVal)}`
      }
    })

    if (i < 15) {
      phraseData += '\n'
    }
  }

  if (needsPhraseAt) {
    phraseData += '\n\n'
    phraseData += '* The command affects an instrument outside of this phrase and cannot be\n'
    phraseData += "  identified. Please use the 'phrase-at' command for its full representation."
  }

  console.log(`${m8Text.title('PHRASE ' + toM8HexStr(phraseNum) + (song.isPhraseUsageUnique(phraseNum) ? '*' : ''))}

${m8Text.default('  N   V  I  FX1   FX2   FX3')}
${phraseData}
`)
}

/**
 * Prints a Scale.
 *
 * @param {module:m8-js/lib/types.Scale} scale - The Scale to print
 * @param {Number} key - The Song key
 * @param {Number} [index] - The Scale index
 */
const printScale = (scale, key, index) => {
  let scaleData = ''

  for (let i = 0; i < 12; i++) {
    const interval = scale.intervals[i]
    let noteIndex = key + i

    if (noteIndex > 11) {
      noteIndex = noteIndex - 12
    }

    const note = getNote(noteIndex)

    if (note.indexOf('#') === -1) {
      scaleData += `${m8Text.default(note)}  `
    } else {
      scaleData += `${m8Text.info(note)} `
    }

    if (interval.enabled) {
      const offsetStr = interval.offsetToStr()

      scaleData += `${m8Text.value('ON')}`

      if (offsetStr[0] !== '-') {
        scaleData += ' '
      }

      scaleData += m8Text.value(offsetStr)
    } else {
      scaleData += `${m8Text.empty('--')} ${m8Text.empty('--')} ${m8Text.empty('--')}`
    }

    if (i < 11) {
      scaleData += '\n'
    }
  }

  console.log(`${m8Text.title('SCALE' + (typeof index === 'undefined' ? '' : ' ' + toM8HexStr(index)))}

${m8Text.default('KEY')}   ${m8Text.value(getNote(key))}

${m8Text.default('I  EN OFFSET')}
${scaleData}

${m8Text.default('NAME')}  ${m8Text.value(scale.name)}${m8Text.empty('-'.repeat(16 - scale.name.length))}
`)
}

/**
 * Prints a Table.
 *
 * @param {module:m8-js/lib/types/internal.Table} table - The Table to print
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instrument - The Instrument the Table is associated with
 * @param {Number} index - The Table index
 */
const printTable = (table, instrument, index) => {
  let tableData = ''

  for (let i = 0; i < table.steps.length; i++) {
    const step = table.steps[i]

    if (i % 4 === 0) {
      tableData += m8Text.default(toM8HexStr(i, 0))
    } else {
      tableData += m8Text.info(toM8HexStr(i, 0))
    }

    tableData += ` ${m8Text.value(toM8HexStr(step.transpose))}`

    if (step.volume === 0xFF) {
      tableData += ` ${m8Text.empty('--')}`
    } else {
      tableData += ` ${m8Text.value(toM8HexStr(step.volume))}`
    }

    step.fx.forEach((fx) => {
      const fxCmd = fx.commandToStr(instrument)
      const fxVal = toM8HexStr(fx.value)

      if (fxCmd === '---') {
        tableData += ` ${m8Text.empty(fxCmd)}${m8Text.info(fxVal)}`
      } else {
        tableData += ` ${m8Text.value(fxCmd)}${m8Text.value(fxVal)}`
      }
    })

    if (i < 15) {
      tableData += '\n'
    }
  }

  console.log(`${m8Text.title('TABLE' + (typeof index === 'undefined' ? '' : ' ' + toM8HexStr(index)))}

${m8Text.default('  N  V  FX1   FX2   FX3')}
${tableData}
`)
}

/**
 * Validates the Instrument option.
 *
 * @param {module:m8-js/lib/types.Song|module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instrOrSong - The Song or Instrument
 * @param {Number} instrIndex - The Instrument index
 */
const validateInstrumentOption = (instrOrSong, instrIndex) => {
  if (instrOrSong.constructor.name === 'Song') {
    if (typeof instrIndex === 'undefined') {
      throw new commander.InvalidOptionArgumentError("error: required option (for Song files) '-i, --instrument " +
                                                     "<number>' not specified")
    }

    validateOptionLimits(instrIndex, '-i, --instrument <number>', 0, 127)
  } else {
    if (typeof instrIndex !== 'undefined') {
      throw new commander.InvalidOptionArgumentError("error: option '--instrument' cannot be used with Instrument " +
                                                     'files')
    }
  }
}

/**
 * Validate option limits.
 *
 * @param {Number} val - The value being validated
 * @param {String} option - The option name
 * @param {Number} min - The minimum value
 * @param {Number} max - The maximum value
 */
const validateOptionLimits = (val, option, min, max) => {
  if (typeof val === 'undefined' || val < 0 || val > max) {
    throw new commander.InvalidArgumentError(`option '${option}' must be between ${toM8HexStr(min)} and ` +
                                             `${toM8HexStr(max)}`)
  }
}

/**
 * Writes a file to disk.
 *
 * @param {String} m8FilePath - The path to the M8 file to write
 * @param {Array<Number>|String} data - The data to write
 */
const writeFileToDisk = (m8FilePath, data) => {
  // Do not overwrite file (We could revisit this at a later date but for safety, let's not for now.)
  if (existsSync(m8FilePath)) {
    throw new commander.CommanderError(1, 'm8.export.FileExists', `Cannot write to file at ${m8FilePath}: File exists`)
  }

  writeFileSync(m8FilePath, data)
}

module.exports = {
  getStartingRow,
  loadM8FileAndVerify,
  loadTheme,
  m8Text,
  parseCLIHexInt,
  parseCLIInt,
  printInstrument,
  printM8FileVersion,
  printPhrase,
  printScale,
  printTable,
  validateInstrumentOption,
  validateOptionLimits,
  writeFileToDisk
}
