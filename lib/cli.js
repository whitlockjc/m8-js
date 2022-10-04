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

const { readFileSync } = require('fs')

const clc = require('cli-color')
const commander = require('commander')
const x256 = require('x256')
const pkg = require('../package.json')
const { getNote, toM8HexStr, toM8Bool, toM8Num } = require('./helpers')
const { loadM8File } = require('..')
const { VERSION_1_4_0 } = require('./constants')
const { DefaultTheme } = require('./types/Theme')
const M8FileReader = require('./types/M8FileReader')

const m8Text = {}

function getM8FileReaderAndVerify (filePath, type) {
  const buffer = readFileSync(filePath)
  const fileReader = new M8FileReader(buffer)

  if (typeof type === 'string') {
    if (fileReader.fileTypeToStr() !== type) {
      throw new commander.InvalidArgumentError(`m8-file must be a ${type} file`)
    }
  } else {
    if (typeof type !== 'undefined' && type.indexOf(fileReader.fileTypeToStr()) === -1) {
      throw new commander.InvalidArgumentError(`m8-file must be a ${type.join(' or ')} file`)
    }
  }

  return fileReader
}

function getStartingRow (startingRow, maxValue) {
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

function loadM8FileAndVerify (path, type) {
  return loadM8File(getM8FileReaderAndVerify(path, type))
}

function loadTheme (theme) {
  m8Text.default = clc.xterm(x256(...theme.textDefault))
  m8Text.empty = clc.xterm(x256(...theme.textEmpty))
  m8Text.info = clc.xterm(x256(...theme.textInfo))
  m8Text.title = clc.xterm(x256(...theme.textTitle))
  m8Text.value = clc.xterm(x256(...theme.textValue))
}

function loadThemeFromFile (path) {
  let theme

  if (typeof path === 'undefined') {
    theme = DefaultTheme
  } else {
    theme = loadM8FileAndVerify(path)

    if (theme.constructor.name !== 'Theme') {
      throw new commander.InvalidOptionArgumentError("option '-T, --theme <path>' must be to an M8 Theme file")
    }
  }

  loadTheme(theme)
}

function parseCLIHexInt (value) {
  const parsedValue = parseInt(value, 16)

  if (isNaN(parsedValue)) {
    throw new commander.InvalidOptionArgumentError('not a hex number')
  }

  return parsedValue
}

function parseCLIInt (value) {
  const parsedValue = parseInt(value, 10)

  if (isNaN(parsedValue)) {
    throw new commander.InvalidOptionArgumentError('not a number')
  }

  return parsedValue
}

function printInstrument (instrument, index) {
  const ampParams = instrument.ampParams
  const filterParams = instrument.filterParams
  const instrParams = instrument.instrParams
  const kindStr = instrument.kindToStr()
  const mixerParams = instrument.mixerParams
  let instrumentData = ''

  if (kindStr === 'MIDI OUT') {
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
  } else if (kindStr !== 'NONE') {
    const leftColumn = []
    const rightColumn = []
    let levFbData = ''
    let modAData = ''
    let modBData = ''
    let ratioData = ''
    let sanitizedSamplePath

    switch (kindStr) {
      case 'FMSYNTH':
        instrumentData = `
${m8Text.default('ALGO')}    ${m8Text.value(toM8HexStr(instrParams.algo))}${m8Text.title(instrParams.algoToStr())}
`

        if (instrument.m8Version.compare(VERSION_1_4_0) >= 0) {
          instrumentData += '        '

          for (let i = 0; i < instrParams.operators.length; i++) {
            const operator = instrParams.operators[i]

            instrumentData += `${m8Text.default(String.fromCharCode(97 + i).toUpperCase())} ${m8Text.value(operator.shapeToStr())}`

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

          levFbData += m8Text.value(toM8HexStr(operator.level)) + m8Text.info('/') + m8Text.value(toM8HexStr(operator.feedback))

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

      case 'WAVSYNTH':
        instrumentData = `
${m8Text.default('SHAPE')}   ${m8Text.value(toM8HexStr(instrParams.shape))}${m8Text.title(instrParams.shapeToStr())}

`

        leftColumn.push(['SIZE', instrParams.size])
        leftColumn.push(['MULT', instrParams.mult])
        leftColumn.push(['WARP', instrParams.warp])
        leftColumn.push(['MIRROR', instrParams.mirror])

        break

      case 'MACROSYN':
        instrumentData = `
${m8Text.default('SHAPE')}   ${m8Text.value(toM8HexStr(instrParams.shape))}${m8Text.title(instrParams.shapeToStr())}

`

        leftColumn.push(['TIMBRE', instrParams.timbre])
        leftColumn.push(['COLOR', instrParams.color])
        leftColumn.push(['DEGRADE', instrParams.degrade])
        leftColumn.push(['REDUX', instrParams.redux])

        break

      case 'SAMPLER':
        sanitizedSamplePath = instrParams.samplePathToStr()

        instrumentData = `
${m8Text.default('SAMPLE')}`

        if (sanitizedSamplePath.length > 0) {
          instrumentData += `  ${m8Text.title(sanitizedSamplePath)}`
        }

        instrumentData += '\n\n'

        leftColumn.push(['SLICE', instrParams.slice, instrParams.slice === 0x00 ? 'OFF' : toM8Num(instrParams.slice, 3)])
        leftColumn.push(['PLAY', instrParams.playMode, instrParams.playModeToStr()])
        leftColumn.push(['START', instrParams.start])
        leftColumn.push(['LOOP ST', instrParams.loopStart])
        leftColumn.push(['LENGTH', instrParams.length])
        leftColumn.push(['DETUNE', instrument.fineTune])
        leftColumn.push(['DEGRADE', instrParams.degrade])

        break
    }

    // Filter Parameters
    leftColumn.push(['FILTER', filterParams.type, instrument.filterTypeToStr()])
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

  console.log(`${m8Text.title('INST.' + (typeof index === 'undefined' ? '' : ' ' + toM8HexStr(index)))}

${m8Text.default('TYPE')}    ${m8Text.value(instrument.kindToStr())}
${m8Text.default('NAME')}    ${m8Text.value(instrument.name)}${m8Text.empty('-'.repeat(12 - instrument.name.length))}
${m8Text.default('TRANSP.')} ${m8Text.value(toM8Bool(instrument.transpose))}       ${m8Text.default('TABLE TIC')} ${m8Text.value(toM8HexStr(instrument.tableTick))}
${instrumentData}`)
}

function printM8FileVersion (m8FilePath, type, theme) {
  const fileReader = getM8FileReaderAndVerify(m8FilePath, type)

  // Load the theme
  loadThemeFromFile(theme)

  console.log(`${m8Text.title('M8 VERSION')}

${m8Text.value(fileReader.m8Version)}
`)
}

function printPhrase (song, phraseName, trackNum, songStepNum, chainStepNum) {
  let needsPhraseAt = false
  let phraseData = ''
  let phraseUsageCount = 0

  // TODO: Move this to a Song method/structure

  // Documentation says that the displayed phrase name will have an '*'  when used elsewhere in the chain or song.
  for (let i = 0; i < song.chains.length; i++) {
    // If we know that a phrase isn't unique (used more than once), we don't need to keep looking
    if (phraseUsageCount > 1) {
      break
    }

    const chain = song.chains[i]

    for (let j = 0; j < chain.steps.length; j++) {
      if (chain.steps[j].phrase === phraseName) {
        phraseUsageCount += 1

        // If we know that a phrase isn't unique (used more than once), we don't need to keep looking
        if (phraseUsageCount > 1) {
          break
        }
      }
    }
  }

  const phrase = song.phrases[phraseName]
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

    ;[step.fx1, step.fx2, step.fx3].forEach((fx) => {
      const fxVal = toM8HexStr(fx.value)
      let fxCmd = fx.commandToStr(typeof instrument === 'undefined' ? 'NONE' : instrument.kindToStr())

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

  console.log(`${m8Text.title('PHRASE ' + toM8HexStr(phraseName) + (phraseUsageCount > 1 ? '*' : ''))}

${m8Text.default('  N   V  I  FX1   FX2   FX3')}
${phraseData}
`)
}

function printScale (scale, key, index) {
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

function printTable (table, instrument, name) {
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

    [step.fx1, step.fx2, step.fx3].forEach((fx) => {
      const fxCmd = fx.commandToStr(typeof instrument === 'undefined' ? 'NONE' : instrument.kindToStr())
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

  console.log(`${m8Text.title('TABLE' + (typeof name === 'undefined' ? '' : ' ' + toM8HexStr(name)))}

${m8Text.default('  N  V  FX1   FX2   FX3')}
${tableData}
`)
}

function validateInstrumentOption (instrOrSong, instrument) {
  if (instrOrSong.constructor.name === 'Song') {
    if (typeof instrument === 'undefined') {
      throw new commander.InvalidOptionArgumentError("error: required option (for Song files) '-i, --instrument <number>' not specified")
    }

    validateOptionLimits(instrument, '-i, --instrument <number>', 0, 127)
  } else {
    if (typeof instrument !== 'undefined') {
      throw new commander.InvalidOptionArgumentError("error: option '--instrument' cannot be used with Instrument files")
    }
  }
}

function validateOptionLimits (val, option, min, max) {
  if (typeof val === 'undefined' || val < 0 || val > max) {
    throw new commander.InvalidArgumentError(`option '${option}' must be between ${toM8HexStr(min)} and ${toM8HexStr(max)}`)
  }
}

const createProgram = (doNotExitProcess) => {
  const program = new commander.Command()

  // For CLI testing, we need to tell commander.js to not process.exit() upon error and to write all stuff to
  // `console.log` since it's mocked in CLI tests.
  if (doNotExitProcess) {
    program.exitOverride().configureOutput({
      writeErr (str) {
        console.log(str)
      },
      writeOut (str) {
        console.log(str)
      }
    })
  }

  program
    .name('m8')
    .description('Various utilities for interacting with M8 files')
    .version(pkg.version)

  // Create commands
  const instrumentCommand = program
    .command('instrument')
    .description('instrument specific commands')

  const projectCommand = program
    .command('project')
    .description('project specific commands')

  const scaleCommand = program
    .command('scale')
    .description('scale specific commands')

  const songCommand = program
    .command('song')
    .description('song specific commands')

  const themeCommand = program
    .command('theme')
    .description('theme specific commands')

  // Instrument commands

  instrumentCommand
    .command('envelope')
    .description('print the m8 instrument envelope')
    .argument('<m8-file>', 'the m8file')
    .option('-i, --instrument <number>', 'the instrument whose envelope to display (required for Song files)', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const instrOrSong = loadM8FileAndVerify(m8FilePath, ['Instrument', 'Song'])
      let instrument

      validateInstrumentOption(instrOrSong, options.instrument)

      // Load the theme
      loadThemeFromFile(options.theme)

      if (instrOrSong.constructor.name === 'Song') {
        instrument = instrOrSong.instruments[options.instrument]
      } else {
        instrument = instrOrSong
      }

      if (instrument.kindToStr() === 'MIDI OUT') {
        console.log('Instrument is a MIDI OUT instrument and has no envelope')
        return
      } else if (instrument.kindToStr() === 'NONE') {
        console.log('Instrument is a NONE instrument and has no envelope')
        return
      }

      let envelopeData = ''
      const leftColumn = []
      const rightColumn = []

      for (let i = 0; i < instrument.env.length; i++) {
        const env = instrument.env[i]
        const lfo = instrument.lfo[i]

        leftColumn.push(['ENV' + (i + 1) + ' TO', env.dest, instrument.destToStr(env.dest)])
        rightColumn.push(['LFO', lfo.dest, instrument.destToStr(lfo.dest)])

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
        if ((i + 1) % (leftColumn.length / instrument.env.length) === 0 && i !== leftColumn.length - 1) {
          envelopeData += '\n'
        }
      }

      console.log(`${m8Text.title(instrOrSong.constructor.name === 'Song' ? 'INST. ' + toM8HexStr(options.instrument) : instrument.name)}

${m8Text.default('TYPE')}    ${m8Text.value(instrument.kindToStr())}
${m8Text.default('NAME')}    ${m8Text.value(instrument.name)}${m8Text.empty('-'.repeat(12 - instrument.name.length))}
${m8Text.default('TRANSP.')} ${m8Text.value(toM8Bool(instrument.transpose))}       ${m8Text.default('TABLE TIC')} ${m8Text.value(toM8HexStr(instrument.tableTick))}

${envelopeData}
`)
    })

  instrumentCommand
    .command('table')
    .description('print the m8 instrument table')
    .argument('<m8-file>', 'the m8file')
    .option('-i, --instrument <number>', 'the instrument to display (required for Song files)', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const instrOrSong = loadM8FileAndVerify(m8FilePath, ['Instrument', 'Song'])
      let instrument

      validateInstrumentOption(instrOrSong, options.instrument)

      // Load the theme
      loadThemeFromFile(options.theme)

      if (instrOrSong.constructor.name === 'Song') {
        instrument = instrOrSong.instruments[options.instrument]
      } else {
        instrument = instrOrSong
      }

      printTable(instrument.tableData, instrument, options.instrument)
    })

  instrumentCommand
    .command('view')
    .description('print the m8 instrument view')
    .argument('<m8-file>', 'the m8file')
    .option('-i, --instrument <number>', 'the instrument to display (required for Song files)', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const instrOrSong = loadM8FileAndVerify(m8FilePath, ['Instrument', 'Song'])
      let instrument

      validateInstrumentOption(instrOrSong, options.instrument)

      // Load the theme
      loadThemeFromFile(options.theme)

      if (instrOrSong.constructor.name === 'Song') {
        instrument = instrOrSong.instruments[options.instrument]
      } else {
        instrument = instrOrSong
      }

      printInstrument(instrument, options.instrument)
    })

  instrumentCommand
    .command('version')
    .description('print the m8 instrument version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      printM8FileVersion(m8FilePath, ['Instrument', 'Song'], options.theme)
    })

  // Project commands
  projectCommand
    .command('effects')
    .description('print the m8 project effects')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      const effectsSettings = song.effectsSettings

      console.log(`${m8Text.title('CHORUS SETTINGS')}
${m8Text.default('MOD DEPTH')}     ${m8Text.value(toM8HexStr(effectsSettings.chorusModDepth))}
${m8Text.default('MOD FREQ.')}     ${m8Text.value(toM8HexStr(effectsSettings.chorusModFreq))}
${m8Text.default('WIDTH')}         ${m8Text.value(toM8HexStr(effectsSettings.chorusWidth))}
${m8Text.default('REVERB SEND')}   ${m8Text.value(toM8HexStr(effectsSettings.chorusReverbSend))}

${m8Text.title('DELAY SETTINGS')}
${m8Text.default('FILTER HP:LP')}  ${m8Text.value(toM8HexStr(effectsSettings.delayFilter[0]) + ':' + toM8HexStr(effectsSettings.delayFilter[1]))}
${m8Text.default('TIME L:R')}      ${m8Text.value(toM8HexStr(effectsSettings.delayTime[0]) + ':' + toM8HexStr(effectsSettings.delayTime[1]))}
${m8Text.default('FEEDBACK')}      ${m8Text.value(toM8HexStr(effectsSettings.delayFeedback))}
${m8Text.default('WIDTH')}         ${m8Text.value(toM8HexStr(effectsSettings.delayWidth))}
${m8Text.default('REVERB SEND')}   ${m8Text.value(toM8HexStr(effectsSettings.delayReverbSend))}

${m8Text.title('REVERB SETTINGS')}
${m8Text.default('FILTER HP:LP')}  ${m8Text.value(toM8HexStr(effectsSettings.reverbFilter[0]) + ':' + toM8HexStr(effectsSettings.reverbFilter[1]))}
${m8Text.default('SIZE')}          ${m8Text.value(toM8HexStr(effectsSettings.reverbSize))}
${m8Text.default('DAMPING')}       ${m8Text.value(toM8HexStr(effectsSettings.reverbDamping))}
${m8Text.default('MOD DEPTH')}     ${m8Text.value(toM8HexStr(effectsSettings.reverbModDepth))}
${m8Text.default('MOD FREQ.')}     ${m8Text.value(toM8HexStr(effectsSettings.reverbModFreq))}
${m8Text.default('WIDTH')}         ${m8Text.value(toM8HexStr(effectsSettings.reverbWidth))}
`)
    })

  projectCommand
    .command('midi-mapping')
    .description('print the m8 project MIDI mappings')
    .argument('<m8-file>', 'the m8file')
    .option('-s, --starting-row <number>', 'the starting row to display', parseCLIInt, 0)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      if (typeof options.startingRow === 'number') {
        validateOptionLimits(options.startingRow, '-s, --starting-row <number>', 0, 127)
      }

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      const startingRow = getStartingRow(options.startingRow, 127)
      let mappings = ''

      for (let i = startingRow; i < startingRow + 16; i++) {
        const midiMapping = song.midiMappings[i]

        mappings += `${m8Text.value(toM8HexStr(i))} `

        if (midiMapping.empty) {
          mappings += `${m8Text.empty('--- -- --')}${m8Text.default('\u25B8')}${m8Text.empty('--')}`
        } else {
          // TODO: Update to handle special output for touchscreen (T:X, T:Y)
          mappings += `${m8Text.value(toM8Num(midiMapping.controlNum, 3))} `
          mappings += `${m8Text.value(toM8HexStr(midiMapping.value))} `
          mappings += `${m8Text.value(toM8HexStr(midiMapping.minValue))}${m8Text.default('\u25B8')}`
          mappings += `${m8Text.value(toM8HexStr(midiMapping.maxValue))} `
          mappings += `${m8Text.title(midiMapping.typeToChar())}${m8Text.value(midiMapping.destToStr())}`
        }

        if (i < startingRow + 15) {
          mappings += '\n'
        }
      }

      console.log(`${m8Text.title('MIDI MAPPING')}

${m8Text.default('   CTL V  RANGE DEST')}
${mappings}
`)
    })

  projectCommand
    .command('midi-settings')
    .description('print the m8 project MIDI settings')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

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
    })

  projectCommand
    .command('mixer')
    .description('print the m8 project mixer settings')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      const mixerSettings = song.mixerSettings

      let chorusEffects = ''
      let delayEffects = ''
      let effectsVolumes = ''
      let inputVolumes = ''
      let reverbEffects = ''
      let trackVolumes = ''

      chorusEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputChorus[0]))} `
      chorusEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1] === 0xFF ? '  ' : mixerSettings.analogInputChorus[1]))} `
      chorusEffects += `${m8Text.value(toM8HexStr(mixerSettings.usbInputChorus))}`

      delayEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputDelay[0]))} `
      delayEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1] === 0xFF ? '  ' : mixerSettings.analogInputDelay[1]))} `
      delayEffects += `${m8Text.value(toM8HexStr(mixerSettings.usbInputDelay))}`

      effectsVolumes += `${m8Text.value(toM8HexStr(mixerSettings.chorusVolume))}  `
      effectsVolumes += `${m8Text.value(toM8HexStr(mixerSettings.delayVolume))}  `
      effectsVolumes += `${m8Text.value(toM8HexStr(mixerSettings.reverbVolume))}`

      inputVolumes += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[0]))} `

      if (mixerSettings.analogInputVolume[1] !== 0xFF) {
        inputVolumes += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1]))} `
      } else {
        inputVolumes += `${m8Text.empty('--')} `
      }

      inputVolumes += `${m8Text.value(toM8HexStr(mixerSettings.usbInputVolume))}`

      reverbEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputReverb[0]))} `
      reverbEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1] === 0xFF ? '  ' : mixerSettings.analogInputReverb[1]))} `
      reverbEffects += `${m8Text.value(toM8HexStr(mixerSettings.usbInputReverb))}`

      for (let i = 0; i < mixerSettings.trackVolume.length; i++) {
        trackVolumes += `${m8Text.value(toM8HexStr(mixerSettings.trackVolume[i]))}`

        if (i < mixerSettings.trackVolume.length - 1) {
          trackVolumes += ' '
        }
      }

      console.log(`${m8Text.title('MIXER')}

${m8Text.default('VOLUME:LIMIT')}  ${m8Text.value(toM8HexStr(mixerSettings.masterVolume))}:${m8Text.value(toM8HexStr(mixerSettings.masterLimit))}
${m8Text.default('DJFILT:PEAK')}   ${m8Text.value(toM8HexStr(mixerSettings.djFilter))}:${m8Text.value(toM8HexStr(mixerSettings.djFilterPeak))}


${m8Text.default('1  2  3  4  5  6  7  8')}
${m8Text.default(trackVolumes)}


${m8Text.default('CHO DEL REV    INPUT USB')}
${effectsVolumes}     ${inputVolumes}
${m8Text.default('           CHO')} ${chorusEffects}
${m8Text.default('           DEL')} ${delayEffects}
${m8Text.default('           REV')} ${reverbEffects}
`)
    })

  projectCommand
    .command('view')
    .description('print the m8 project view')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      let liveQuantize = m8Text.value(toM8HexStr(song.quantize))

      if (song.quantize === 0x00) {
        liveQuantize += m8Text.default(' CHAIN LEN')
      } else {
        liveQuantize += m8Text.default(' STEPS')
      }

      console.log(`${m8Text.title('PROJECT')}

${m8Text.default('TRANSPOSE')}     ${m8Text.value(toM8HexStr(song.transpose))}
${m8Text.default('TEMPO')}         ${m8Text.value(song.tempo.toFixed(2))}
${m8Text.default('LIVE QUANTIZE')} ${liveQuantize}

${m8Text.default('NAME')}          ${m8Text.value(song.name)}
`)
    })

  projectCommand
    .command('version')
    .description('print the m8 project version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      printM8FileVersion(m8FilePath, 'Song', options.theme)
    })

  // Scale commands
  scaleCommand
    .command('view')
    .description('print the m8 scale')
    .argument('<m8-file>', 'the m8file')
    .option('-k, --key <number>', 'the root key to use for the scale', parseCLIHexInt, 0x00)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      if (typeof options.key === 'number') {
        validateOptionLimits(options.key, '-k, --key <number>', 0, 11)
      }

      const scale = loadM8FileAndVerify(m8FilePath, 'Scale')

      // Load the theme
      loadThemeFromFile(options.theme)

      printScale(scale, options.key)
    })

  scaleCommand
    .command('version')
    .description('print the m8 scale version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      printM8FileVersion(m8FilePath, 'Scale', options.theme)
    })

  // Song commands

  songCommand
    .command('chain')
    .description('print the m8 song chain')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-c, --chain <number>', 'the chain to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      validateOptionLimits(options.chain, '-c, --chain <number>', 0, 255)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      const chain = song.chains[options.chain]
      let chainData = ''

      for (let i = 0; i < 16; i++) {
        const step = chain.steps[i]

        chainData += m8Text.default(toM8HexStr(i, 0))

        if (step.phrase === 0xFF) {
          chainData += ` ${m8Text.empty('--')} ${m8Text.default(toM8HexStr(step.transpose))}`
        } else {
          chainData += ` ${m8Text.value(toM8HexStr(step.phrase))} ${m8Text.value(toM8HexStr(step.transpose))}`
        }

        if (i < 15) {
          chainData += '\n'
        }
      }

      console.log(`${m8Text.title('CHAIN ' + toM8HexStr(options.chain))}

${m8Text.default('  PH TSP')}
${chainData}
`)
    })

  songCommand
    .command('groove')
    .description('print the m8 song groove')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-g, --groove <number>', 'the groove to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      validateOptionLimits(options.groove, '-g, --groove <number>', 0, 31)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      const groove = song.grooves[options.groove]
      let grooveData = ''

      for (let i = 0; i < 16; i++) {
        const step = groove.steps[i]

        grooveData += m8Text.default(toM8HexStr(i, 0))

        if (step === 0xFF) {
          grooveData += ` ${m8Text.empty('--')}`
        } else {
          grooveData += ` ${m8Text.value(toM8HexStr(step))}`
        }

        if (i < 15) {
          grooveData += '\n'
        }
      }

      console.log(`${m8Text.title('GROOVE ' + toM8HexStr(options.groove))}

${m8Text.default('  PH TSP')}
${grooveData}
`)
    })

  songCommand
    .command('instrument')
    .description('print the m8 song instrument view')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-i, --instrument <number>', 'the instrument to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      validateOptionLimits(options.instrument, '-i, --instrument <number>', 0, 127)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      printInstrument(song.instruments[options.instrument], options.instrument)
    })

  songCommand
    .command('phrase')
    .description('print the m8 song phrase (in isolation)')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-p, --phrase <number>', 'the phrase to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      validateOptionLimits(options.phrase, '-p, --phrase <number>', 0, 255)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      printPhrase(song, options.phrase)
    })

  songCommand
    .command('phrase-at')
    .description('print the m8 song phrase (at track location)')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-n, --track-num <number>', 'the track number', parseCLIInt)
    .requiredOption('-s, --track-step <number>', 'the track step', parseCLIHexInt)
    .requiredOption('-c, --chain-step <number>', 'the chain step for the phrase', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const trackNum = options.trackNum
      const trackStepNum = options.trackStep
      const chainStepNum = options.chainStep

      validateOptionLimits(trackNum, '-n, --track-num <number>', 1, 8)
      validateOptionLimits(trackStepNum, '-s, --track-step <number>', 0, 255)
      validateOptionLimits(options.chainStep, '-c, --chain-step <number>', 0, 15)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      // This logic is duplicated in Song#findPhraseStepInstrument but is necessary here to find the phrase step
      const songStep = song.steps[trackStepNum]
      const chainName = songStep['track' + trackNum]

      if (chainName === 0xFF) {
        console.log(`Chain at ${toM8HexStr(trackStepNum)} for track ${toM8HexStr(trackNum)} is empty`)
        return
      }

      const chain = song.chains[chainName]
      const chainStep = chain.steps[chainStepNum]

      if (chainStep.phrase === 0xFF) {
        console.log(`Phrase at ${toM8HexStr(chainStepNum)} in chain ${toM8HexStr(chainName)} for track ${toM8HexStr(trackNum)} is empty`)
        return
      }

      printPhrase(song, chainStep.phrase, trackNum, trackStepNum, chainStepNum)
    })

  songCommand
    .command('scale')
    .description('print the m8 song scale')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-s, --scale <number>', 'the scale to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      validateOptionLimits(options.scale, '-s, --scale <number>', 0, 15)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      printScale(song.scales[options.scale], song.key, options.scale)
    })

  songCommand
    .command('table')
    .description('print the m8 song table')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-t, --table <number>', 'the table to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      validateOptionLimits(options.table, '-t, --table <number>', 0, 255)

      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      printTable(song.tables[options.table], options.table <= 128 ? song.instruments[options.table] : undefined, options.table)
    })

  songCommand
    .command('view')
    .description('print the m8 song view')
    .argument('<m8-file>', 'the m8file')
    .option('-s, --starting-row <number>', 'the starting row to display', parseCLIHexInt, 0)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      const song = loadM8FileAndVerify(m8FilePath, 'Song')

      // Load the theme
      loadThemeFromFile(options.theme)

      const startingRow = getStartingRow(options.startingRow, 255)
      let songData = ''

      for (let i = startingRow; i < startingRow + 16; i++) {
        const step = song.steps[i]

        songData += m8Text.default(toM8HexStr(i))

        for (let j = 0; j < 8; j++) {
          const chain = step['track' + (j + 1)]

          if (chain === 0xFF) {
            songData += ` ${m8Text.empty('--')}`
          } else {
            if (song.isChainEmpty(chain)) {
              songData += ` ${m8Text.default(toM8HexStr(chain))}`
            } else {
              songData += ` ${m8Text.value(toM8HexStr(chain))}`
            }
          }
        }

        if (i < startingRow + 15) {
          songData += '\n'
        }
      }

      console.log(`${m8Text.title('SONG')}

${m8Text.default('   1  2  3  4  5  6  7  8')}
${songData}
`)
    })

  // Theme commands
  themeCommand
    .command('view')
    .description('print the m8 theme view')
    .argument('<m8-file>', 'the m8file')
    .action((m8FilePath) => {
      const theme = loadM8FileAndVerify(m8FilePath, 'Theme')

      loadTheme(theme)

      console.log(`${m8Text.title('THEME SETTINGS')}

${m8Text.default('BACKGROUND')}   ${m8Text.value(toM8HexStr(theme.background[0]))} ${m8Text.value(toM8HexStr(theme.background[1]))} ${m8Text.value(toM8HexStr(theme.background[2]))} ${clc.xterm(x256(...theme.background))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:EMPTY')}   ${m8Text.value(toM8HexStr(theme.textEmpty[0]))} ${m8Text.value(toM8HexStr(theme.textEmpty[1]))} ${m8Text.value(toM8HexStr(theme.textEmpty[2]))} ${clc.xterm(x256(...theme.textEmpty))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:INFO')}    ${m8Text.value(toM8HexStr(theme.textInfo[0]))} ${m8Text.value(toM8HexStr(theme.textInfo[1]))} ${m8Text.value(toM8HexStr(theme.textInfo[2]))} ${clc.xterm(x256(...theme.textInfo))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:DEFAULT')} ${m8Text.value(toM8HexStr(theme.textDefault[0]))} ${m8Text.value(toM8HexStr(theme.textDefault[1]))} ${m8Text.value(toM8HexStr(theme.textDefault[2]))} ${clc.xterm(x256(...theme.textDefault))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:VALUE')}   ${m8Text.value(toM8HexStr(theme.textValue[0]))} ${m8Text.value(toM8HexStr(theme.textValue[1]))} ${m8Text.value(toM8HexStr(theme.textValue[2]))} ${clc.xterm(x256(...theme.textValue))('\u25A0\u25A0\u25A0')}
${m8Text.default('TEXT:TITLES')}  ${m8Text.value(toM8HexStr(theme.textTitle[0]))} ${m8Text.value(toM8HexStr(theme.textTitle[1]))} ${m8Text.value(toM8HexStr(theme.textTitle[2]))} ${clc.xterm(x256(...theme.textTitle))('\u25A0\u25A0\u25A0')}
${m8Text.default('PLAY MARKERS')} ${m8Text.value(toM8HexStr(theme.playMarker[0]))} ${m8Text.value(toM8HexStr(theme.playMarker[1]))} ${m8Text.value(toM8HexStr(theme.playMarker[2]))} ${clc.xterm(x256(...theme.playMarker))('\u25A0\u25A0\u25A0')}
${m8Text.default('CURSOR')}       ${m8Text.value(toM8HexStr(theme.cursor[0]))} ${m8Text.value(toM8HexStr(theme.cursor[1]))} ${m8Text.value(toM8HexStr(theme.cursor[2]))} ${clc.xterm(x256(...theme.cursor))('\u25A0\u25A0\u25A0')}
${m8Text.default('SELECTION')}    ${m8Text.value(toM8HexStr(theme.selection[0]))} ${m8Text.value(toM8HexStr(theme.selection[1]))} ${m8Text.value(toM8HexStr(theme.selection[2]))} ${clc.xterm(x256(...theme.selection))('\u25A0\u25A0\u25A0')}
${m8Text.default('SCOPE/SLIDER')} ${m8Text.value(toM8HexStr(theme.scopeSlider[0]))} ${m8Text.value(toM8HexStr(theme.scopeSlider[1]))} ${m8Text.value(toM8HexStr(theme.scopeSlider[2]))} ${clc.xterm(x256(...theme.scopeSlider))('\u25A0\u25A0\u25A0')}
${m8Text.default('METER LOW')}    ${m8Text.value(toM8HexStr(theme.meterLow[0]))} ${m8Text.value(toM8HexStr(theme.meterLow[1]))} ${m8Text.value(toM8HexStr(theme.meterLow[2]))} ${clc.xterm(x256(...theme.meterLow))('\u25A0\u25A0\u25A0')}
${m8Text.default('METER MID')}    ${m8Text.value(toM8HexStr(theme.meterMid[0]))} ${m8Text.value(toM8HexStr(theme.meterMid[1]))} ${m8Text.value(toM8HexStr(theme.meterMid[2]))} ${clc.xterm(x256(...theme.meterMid))('\u25A0\u25A0\u25A0')}
${m8Text.default('METER PEAK')}   ${m8Text.value(toM8HexStr(theme.meterPeak[0]))} ${m8Text.value(toM8HexStr(theme.meterPeak[1]))} ${m8Text.value(toM8HexStr(theme.meterPeak[2]))} ${clc.xterm(x256(...theme.meterPeak))('\u25A0\u25A0\u25A0')}
`)
    })

  themeCommand
    .command('version')
    .description('print the m8 theme version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action((m8FilePath, options) => {
      printM8FileVersion(m8FilePath, 'Theme', options.theme)
    })

  return program
}

// Exports
module.exports = {
  createProgram
}
