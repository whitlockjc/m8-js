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

const { parseCLIHexInt, parseCLIInt } = require('./helpers')
const commander = require('commander')
const exportJSON = require('./export-json')
const importJSON = require('./import-json')
const instrumentEnvelope = require('./instrument-envelope')
const instrumentTable = require('./instrument-table')
const instrumentVersion = require('./instrument-version')
const instrumentView = require('./instrument-view')
const pkg = require('../../package.json')
const projectEffects = require('./project-effects')
const projectMIDIMapping = require('./project-midi-mapping')
const projectMIDISettings = require('./project-midi-settings')
const projectMixer = require('./project-mixer')
const projectVersion = require('./project-version')
const projectView = require('./project-view')
const scaleVersion = require('./scale-version')
const scaleView = require('./scale-view')
const songChain = require('./song-chain')
const songGroove = require('./song-groove')
const songInstrument = require('./song-instrument')
const songPhrase = require('./song-phrase')
const songPhraseAt = require('./song-phrase-at')
const songScale = require('./song-scale')
const songTable = require('./song-table')
const songView = require('./song-view')
const themeVersion = require('./theme-version')
const themeView = require('./theme-view')

/**
 * Creates the CLI program.
 *
 * @param {Boolean} doNotExitProcess - Whether or not to exit when an error occurs
 */
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
  program
    .command('export')
    .description('exports an M8 file to JSON')
    .argument('<m8-file>', 'the m8file')
    .option('-o, --output <path>', 'the path to save the M8 file')
    .action(exportJSON)

  program
    .command('import')
    .description('imports an M8 file from JSON')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-o, --output <path>', 'the path to save the M8 file')
    .action(importJSON)

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

  // Create instrument sub-commands
  instrumentCommand
    .command('envelope')
    .description('print the m8 instrument envelope')
    .argument('<m8-file>', 'the m8file')
    .option('-i, --instrument <number>', 'the instrument whose envelope to display (required for Song files)',
            parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(instrumentEnvelope)

  instrumentCommand
    .command('table')
    .description('print the m8 instrument table')
    .argument('<m8-file>', 'the m8file')
    .option('-i, --instrument <number>', 'the instrument to display (required for Song files)', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(instrumentTable)

  instrumentCommand
    .command('view')
    .description('print the m8 instrument view')
    .argument('<m8-file>', 'the m8file')
    .option('-i, --instrument <number>', 'the instrument to display (required for Song files)', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(instrumentView)

  instrumentCommand
    .command('version')
    .description('print the m8 instrument version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(instrumentVersion)

  // Create project sub-commands
  projectCommand
    .command('effects')
    .description('print the m8 project effects')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(projectEffects)

  projectCommand
    .command('midi-mapping')
    .description('print the m8 project MIDI mappings')
    .argument('<m8-file>', 'the m8file')
    .option('-s, --starting-row <number>', 'the starting row to display', parseCLIInt, 0)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(projectMIDIMapping)

  projectCommand
    .command('midi-settings')
    .description('print the m8 project MIDI settings')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(projectMIDISettings)

  projectCommand
    .command('mixer')
    .description('print the m8 project mixer settings')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(projectMixer)

  projectCommand
    .command('view')
    .description('print the m8 project view')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(projectView)

  projectCommand
    .command('version')
    .description('print the m8 project version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(projectVersion)

  // Create scale sub-commands
  scaleCommand
    .command('view')
    .description('print the m8 scale')
    .argument('<m8-file>', 'the m8file')
    .option('-k, --key <number>', 'the root key to use for the scale', parseCLIHexInt, 0x00)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(scaleView)

  scaleCommand
    .command('version')
    .description('print the m8 scale version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(scaleVersion)

  // Create song sub-commands
  songCommand
    .command('chain')
    .description('print the m8 song chain')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-c, --chain <number>', 'the chain to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songChain)

  songCommand
    .command('groove')
    .description('print the m8 song groove')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-g, --groove <number>', 'the groove to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songGroove)

  songCommand
    .command('instrument')
    .description('print the m8 song instrument view')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-i, --instrument <number>', 'the instrument to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songInstrument)

  songCommand
    .command('phrase')
    .description('print the m8 song phrase (in isolation)')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-p, --phrase <number>', 'the phrase to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songPhrase)

  songCommand
    .command('phrase-at')
    .description('print the m8 song phrase (at track location)')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-n, --track-num <number>', 'the track number', parseCLIInt)
    .requiredOption('-s, --track-step <number>', 'the track step', parseCLIHexInt)
    .requiredOption('-c, --chain-step <number>', 'the chain step for the phrase', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songPhraseAt)

  songCommand
    .command('scale')
    .description('print the m8 song scale')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-s, --scale <number>', 'the scale to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songScale)

  songCommand
    .command('table')
    .description('print the m8 song table')
    .argument('<m8-file>', 'the m8file')
    .requiredOption('-t, --table <number>', 'the table to display', parseCLIHexInt)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songTable)

  songCommand
    .command('view')
    .description('print the m8 song view')
    .argument('<m8-file>', 'the m8file')
    .option('-s, --starting-row <number>', 'the starting row to display', parseCLIHexInt, 0)
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(songView)

  // Create theme sub-commands
  themeCommand
    .command('view')
    .description('print the m8 theme view')
    .argument('<m8-file>', 'the m8file')
    .action(themeView)

  themeCommand
    .command('version')
    .description('print the m8 theme version')
    .argument('<m8-file>', 'the m8file')
    .option('-T, --theme <path>', 'the path to an M8 theme file to use')
    .action(themeVersion)

  return program
}

module.exports = {
  createProgram
}
