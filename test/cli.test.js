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

const { createProgram } = require('../lib/cli')
const { DefaultTheme } = require('../lib/types/Theme')
const { toM8HexStr } = require('../lib/helpers')
const FMSynth = require('../lib/types/instruments/FMSynth')
const fs = require('fs')
const M8 = require('..')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const MIDIOut = require('../lib/types/instruments/MIDIOut')
const os = require('os')
const path = require('path')
const Sampler = require('../lib/types/instruments/Sampler')
const Song = require('../lib/types/Song')
const Wavsynth = require('../lib/types/instruments/Wavsynth')

// File paths
const defaultFMSynthPath = path.join(__dirname, 'files/Instruments/DEF_FM.m8i')
const defaultSongPath = path.join(__dirname, 'files/Songs/DEFAULT.m8s')
const defaultThemePath = path.join(__dirname, 'files/Themes/DEFAULT.m8t')

// Help outputs
const exportHelp = `Usage: m8 export [options] <m8-file>

exports an M8 file to JSON

Arguments:
  m8-file              the m8file

Options:
  -o, --output <path>  the path to save the M8 file
  -h, --help           display help for command
`
const globalHelp = `Usage: m8 [options] [command]

Various utilities for interacting with M8 files

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  export [options] <m8-file>  exports an M8 file to JSON
  import [options] <m8-file>  imports an M8 file from JSON
  instrument                  instrument specific commands
  project                     project specific commands
  scale                       scale specific commands
  song                        song specific commands
  theme                       theme specific commands
  help [command]              display help for command
`
const importHelp = `Usage: m8 import [options] <m8-file>

imports an M8 file from JSON

Arguments:
  m8-file              the m8file

Options:
  -o, --output <path>  the path to save the M8 file
  -h, --help           display help for command
`
const instrumentHelp = `Usage: m8 instrument [options] [command]

instrument specific commands

Options:
  -h, --help                    display help for command

Commands:
  envelope [options] <m8-file>  print the m8 instrument envelope
  table [options] <m8-file>     print the m8 instrument table
  view [options] <m8-file>      print the m8 instrument view
  version [options] <m8-file>   print the m8 instrument version
  help [command]                display help for command
`
const projectHelp = `Usage: m8 project [options] [command]

project specific commands

Options:
  -h, --help                         display help for command

Commands:
  effects [options] <m8-file>        print the m8 project effects
  midi-mapping [options] <m8-file>   print the m8 project MIDI mappings
  midi-settings [options] <m8-file>  print the m8 project MIDI settings
  mixer [options] <m8-file>          print the m8 project mixer settings
  view [options] <m8-file>           print the m8 project view
  version [options] <m8-file>        print the m8 project version
  help [command]                     display help for command
`
const scaleHelp = `Usage: m8 scale [options] [command]

scale specific commands

Options:
  -h, --help                   display help for command

Commands:
  view [options] <m8-file>     print the m8 scale
  version [options] <m8-file>  print the m8 scale version
  help [command]               display help for command
`
const songHelp = `Usage: m8 song [options] [command]

song specific commands

Options:
  -h, --help                      display help for command

Commands:
  chain [options] <m8-file>       print the m8 song chain
  groove [options] <m8-file>      print the m8 song groove
  instrument [options] <m8-file>  print the m8 song instrument view
  phrase [options] <m8-file>      print the m8 song phrase (in isolation)
  phrase-at [options] <m8-file>   print the m8 song phrase (at track location)
  scale [options] <m8-file>       print the m8 song scale
  table [options] <m8-file>       print the m8 song table
  view [options] <m8-file>        print the m8 song view
  help [command]                  display help for command
`
const testingScalePath = path.join(__dirname, 'files/Scales/TESTING.m8n')
const testingSongPath = path.join(__dirname, 'files/Songs/TESTING.m8s')
const themeHelp = `Usage: m8 theme [options] [command]

theme specific commands

Options:
  -h, --help                   display help for command

Commands:
  view <m8-file>               print the m8 theme view
  version [options] <m8-file>  print the m8 theme version
  help [command]               display help for command
`

// Instrument envelops
const defaultInstrumentOutputs = {
  DEF_FM: {
    instrumentIndex: 0x01,
    envelope: `

TYPE    FMSYNTH
NAME    DEF_FM------
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10

ENV2 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10
`,
    view: `

TYPE    FMSYNTH
NAME    DEF_FM------
TRANSP. ON       TABLE TIC 01

ALGO    00A>B>C>D
        A SIN B SIN C SIN D SIN
RATIO   01.00 01.00 01.00 01.00
LEV/FB  80/00 80/00 80/00 80/00
MOD     ----- ----- ----- -----
        ----- ----- ----- -----

MOD1    00        AMP 00
MOD2    00        LIM 00CLIP
MOD3    00        PAN 80
MOD4    00        DRY C0
FILTER  00OFF     CHO 00
CUTOFF  FF        DEL 00
RES     00        REV 00
`
  },
  DEF_MAC: {
    instrumentIndex: 0x02,
    envelope: `

TYPE    MACROSYN
NAME    DEF_MAC-----
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10

ENV2 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10
`,
    view: `

TYPE    MACROSYN
NAME    DEF_MAC-----
TRANSP. ON       TABLE TIC 01

SHAPE   00CSAW

TIMBRE  80        AMP 00
COLOR   80        LIM 00CLIP
DEGRADE 00        PAN 80
REDUX   00        DRY C0
FILTER  00OFF     CHO 00
CUTOFF  FF        DEL 00
RES     00        REV 00
`
  },
  DEF_MID: {
    instrumentIndex: 0x03,
    envelope: 'Instrument is a MIDI OUT instrument and has no envelope',
    view: `

TYPE    MIDI OUT
NAME    DEF_MID-----
TRANSP. ON       TABLE TIC 01

PORT        00MIDI+USB
CHANNEL     01
BANK:PG     ---:---
CCA CC:VAL  ---:--
CCB CC:VAL  ---:--
CCC CC:VAL  ---:--
CCD CC:VAL  ---:--
CCE CC:VAL  ---:--
CCF CC:VAL  ---:--
CCG CC:VAL  ---:--
CCH CC:VAL  ---:--
CCI CC:VAL  ---:--
CCJ CC:VAL  ---:--
`
  },
  DEF_SAM: {
    instrumentIndex: 0x04,
    envelope: `

TYPE    SAMPLER
NAME    DEF_SAM-----
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10

ENV2 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10
`,
    view: `

TYPE    SAMPLER
NAME    DEF_SAM-----
TRANSP. ON       TABLE TIC 01

SAMPLE

SLICE   00OFF     AMP 00
PLAY    00FWD     LIM 00CLIP
START   00        PAN 80
LOOP ST 00        DRY C0
LENGTH  FF        CHO 00
DETUNE  80        DEL 00
DEGRADE 00        REV 00
FILTER  00OFF
CUTOFF  FF
RES     00
`
  },
  DEF_WAV: {
    instrumentIndex: 0x05,
    envelope: `

TYPE    WAVSYNTH
NAME    DEF_WAV-----
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10

ENV2 TO 00OFF     LFO 00OFF
AMOUNT  FF        AMT FF
ATTACK  00        OSC 00TRI
HOLD    00        TRG 00FREE
DECAY   80        AMT 10
`,
    view: `

TYPE    WAVSYNTH
NAME    DEF_WAV-----
TRANSP. ON       TABLE TIC 01

SHAPE   00PULSE 12%

SIZE    20        AMP 00
MULT    00        LIM 00CLIP
WARP    00        PAN 80
MIRROR  00        DRY C0
FILTER  00OFF     CHO 00
CUTOFF  FF        DEL 00
RES     00        REV 00
`
  }
}
const testingInstrumentOutputs = {
  FMSYNTH: {
    instrumentIndex: 0x07,
    envelope: `

TYPE    FMSYNTH
NAME    FMSYNTH-----
TRANSP. OFF       TABLE TIC FF

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  01        AMT 01
ATTACK  02        OSC 00TRI
HOLD    03        TRG 00FREE
DECAY   04        AMT 02

ENV2 TO 0APAN     LFO 0APAN
AMOUNT  09        AMT 09
ATTACK  08        OSC 13DRNK T
HOLD    07        TRG 03ONCE
DECAY   06        AMT 08
`,
    view: `

TYPE    FMSYNTH
NAME    FMSYNTH-----
TRANSP. OFF       TABLE TIC FF

ALGO    0BA+B+C+D
        A CLK B NOI C SW5 D SIN
RATIO   01.02 03.04 05.06 07.08
LEV/FB  08/07 06/05 04/03 02/01
MOD     1>LEV 2>RAT 3>PIT 4>FBK
        4>LEV 3>RAT 2>PIT 1>FBK

MOD1    01        AMP 06
MOD2    02        LIM 05POST: AD
MOD3    03        PAN 04
MOD4    04        DRY 03
FILTER  05LP>HP   CHO 02
CUTOFF  06        DEL 01
RES     07        REV 00
`
  },
  MACROSYN: {
    instrumentIndex: 0x08,
    envelope: `

TYPE    MACROSYN
NAME    MACROSYN----
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  01        AMT 01
ATTACK  02        OSC 00TRI
HOLD    03        TRG 00FREE
DECAY   04        AMT 02

ENV2 TO 0APAN     LFO 0APAN
AMOUNT  09        AMT 09
ATTACK  08        OSC 13DRNK T
HOLD    07        TRG 03ONCE
DECAY   06        AMT 08
`,
    view: `

TYPE    MACROSYN
NAME    MACROSYN----
TRANSP. ON       TABLE TIC 01

SHAPE   2FMORSE NOISE

TIMBRE  01        AMP 06
COLOR   02        LIM 05POST: AD
DEGRADE 03        PAN 04
REDUX   04        DRY 03
FILTER  05LP>HP   CHO 02
CUTOFF  06        DEL 01
RES     07        REV 00
`
  },
  'MIDI OUT': {
    instrumentIndex: 0x09,
    envelope: 'Instrument is a MIDI OUT instrument and has no envelope',
    view: `

TYPE    MIDI OUT
NAME    MIDI OUT----
TRANSP. ON       TABLE TIC 01

PORT        03INTERNAL
CHANNEL     16
BANK:PG     000:001
CCA CC:VAL  002:03
CCB CC:VAL  004:05
CCC CC:VAL  006:07
CCD CC:VAL  008:09
CCE CC:VAL  122:7A
CCF CC:VAL  123:7B
CCG CC:VAL  124:7C
CCH CC:VAL  125:7D
CCI CC:VAL  126:7E
CCJ CC:VAL  127:7F
`
  },
  SAMPLER: {
    instrumentIndex: 0x0A,
    envelope: `

TYPE    SAMPLER
NAME    SAMPLER-----
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  01        AMT 01
ATTACK  02        OSC 00TRI
HOLD    03        TRG 00FREE
DECAY   04        AMT 02

ENV2 TO 09PAN     LFO 09PAN
AMOUNT  08        AMT 08
ATTACK  07        OSC 13DRNK T
HOLD    06        TRG 03ONCE
DECAY   05        AMT 07
`,
    view: `

TYPE    SAMPLER
NAME    SAMPLER-----
TRANSP. ON       TABLE TIC 01

SAMPLE  BD1000

SLICE   80128     AMP 06
PLAY    08OSC PP  LIM 05POST: AD
START   07        PAN 04
LOOP ST 06        DRY 03
LENGTH  05        CHO 02
DETUNE  04        DEL 01
DEGRADE 03        REV 00
FILTER  05LP>HP
CUTOFF  02
RES     01
`
  },
  DEF_WAV: {
    instrumentIndex: 0x0B,
    envelope: `

TYPE    WAVSYNTH
NAME    WAVSYNTH----
TRANSP. ON       TABLE TIC 01

ENV1 TO 00OFF     LFO 00OFF
AMOUNT  01        AMT 01
ATTACK  02        OSC 00TRI
HOLD    03        TRG 00FREE
DECAY   04        AMT 02

ENV2 TO 0APAN     LFO 0APAN
AMOUNT  09        AMT 09
ATTACK  08        OSC 13DRNK T
HOLD    07        TRG 03ONCE
DECAY   06        AMT 08
`,
    view: `

TYPE    WAVSYNTH
NAME    WAVSYNTH----
TRANSP. ON       TABLE TIC 01

SHAPE   08NOISE

SIZE    FF        AMP 06
MULT    FE        LIM 05POST: AD
WARP    FD        PAN 04
MIRROR  FC        DRY 03
FILTER  09WAV BS  CHO 02
CUTOFF  FB        DEL 01
RES     FA        REV 00
`
  }
}

const runM8 = (args, expectedOutput) => {
  console.log.mockReset()

  const program = createProgram(true)
  let thrownErr

  // Add Node args
  args.unshift('node', 'm8')

  try {
    program.parse(args)
  } catch (err) {
    thrownErr = err
  }

  if (typeof expectedOutput !== 'undefined') {
    if (typeof thrownErr === 'undefined') {
      expect(console.log).toBeCalledWith(expectedOutput)
    } else {
      expect(thrownErr.message).toEqual(expectedOutput)
    }
  } else {
    if (thrownErr) {
      throw thrownErr
    }
  }
}
const testHelp = (args, expectedOutput) => {
  console.log.mockReset()

  const program = createProgram(true)

  // Add Node args
  args.unshift('node', 'm8')

  expect(() => {
    program.parse(args)
  }).toThrow('(outputHelp)')

  expect(console.log).toBeCalledWith(expectedOutput)
}

describe('m8 tests', () => {
  const log = console.log // save original console.log function

  beforeAll(() => {
    process.env.NO_COLOR = 'true'
  })

  beforeEach(() => {
    console.log = jest.fn() // create a new mock function for each test
  })

  afterAll(() => {
    console.log = log // restore original console.log after all tests
  })

  test('empty args prints help', () => {
    testHelp([], globalHelp)
  })

  test('--help', () => {
    testHelp(['--help'], globalHelp)
  })

  describe('instrument', () => {
    test('empty args prints help', () => {
      testHelp(['instrument'], instrumentHelp)
    })

    test('help', () => {
      testHelp(['instrument', 'help'], instrumentHelp)
    })

    test('--help', () => {
      testHelp(['instrument', '--help'], instrumentHelp)
    })

    describe('envelope', () => {
      test('missing m8-file', () => {
        runM8(['instrument', 'envelope'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['instrument', 'envelope', defaultThemePath], 'm8-file must be a Instrument or Song file')
      })

      describe('--instrument', () => {
        test('missing', () => {
          runM8(['instrument', 'envelope', testingSongPath], "error: required option (for Song files) '-i, --instrument <number>' not specified")
        })

        test('< 00', () => {
          runM8(['instrument', 'envelope', testingSongPath, '--instrument', '-1'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('> FF', () => {
          runM8(['instrument', 'envelope', testingSongPath, '--instrument', '101'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('provided with Instrument file', () => {
          runM8(['instrument', 'envelope', defaultFMSynthPath, '--instrument', '00'], "error: option '--instrument' cannot be used with Instrument files")
        })
      })

      test('with m8-file', () => {
        // Default envelopes
        Object.keys(defaultInstrumentOutputs).forEach((name) => {
          const meta = defaultInstrumentOutputs[name]
          const instrPath = path.join(__dirname, `files/Instruments/${name}.m8i`)
          let instrOutput = name + meta.envelope
          let songOutput = `INST. ${toM8HexStr(meta.instrumentIndex)}` + meta.envelope

          if (name === 'DEF_MID' || name === 'MIDI OUT') {
            instrOutput = meta.envelope
            songOutput = meta.envelope
          }

          // Instrument file
          runM8(['instrument', 'envelope', instrPath], instrOutput)

          // Song file
          runM8(['instrument', 'envelope', testingSongPath, '--instrument', toM8HexStr(meta.instrumentIndex)],
                songOutput)
        })

        // Empty instruments
        runM8(['instrument', 'envelope', testingSongPath, '--instrument', toM8HexStr(0)],
              'Instrument is a NONE instrument and has no envelope')

        // Testing instruments
        Object.keys(testingInstrumentOutputs).forEach((name) => {
          const meta = testingInstrumentOutputs[name]
          let songOutput = `INST. ${toM8HexStr(meta.instrumentIndex)}` + meta.envelope

          if (name === 'DEF_MID' || name === 'MIDI OUT') {
            songOutput = meta.envelope
          }

          // Song file
          runM8(['instrument', 'envelope', testingSongPath, '--instrument', toM8HexStr(meta.instrumentIndex)],
                songOutput)
        })
      })
    })

    describe('table', () => {
      test('missing m8-file', () => {
        runM8(['instrument', 'table'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['instrument', 'table', defaultThemePath], 'm8-file must be a Instrument or Song file')
      })

      describe('--instrument', () => {
        test('missing', () => {
          runM8(['instrument', 'table', testingSongPath], "error: required option (for Song files) '-i, --instrument <number>' not specified")
        })

        test('< 00', () => {
          runM8(['instrument', 'table', testingSongPath, '--instrument', '-1'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('> FF', () => {
          runM8(['instrument', 'table', testingSongPath, '--instrument', '101'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('provided with Instrument file', () => {
          runM8(['instrument', 'table', defaultFMSynthPath, '--instrument', '00'], "error: option '--instrument' cannot be used with Instrument files")
        })
      })

      test('with m8-file', () => {
        const emptyInstrPath = path.join(__dirname, 'files/Instruments/DEF_FM.m8i')
        const emptyTableBody = `

  N  V  FX1   FX2   FX3
0 00 -- ---00 ---00 ---00
1 00 -- ---00 ---00 ---00
2 00 -- ---00 ---00 ---00
3 00 -- ---00 ---00 ---00
4 00 -- ---00 ---00 ---00
5 00 -- ---00 ---00 ---00
6 00 -- ---00 ---00 ---00
7 00 -- ---00 ---00 ---00
8 00 -- ---00 ---00 ---00
9 00 -- ---00 ---00 ---00
A 00 -- ---00 ---00 ---00
B 00 -- ---00 ---00 ---00
C 00 -- ---00 ---00 ---00
D 00 -- ---00 ---00 ---00
E 00 -- ---00 ---00 ---00
F 00 -- ---00 ---00 ---00
`
        const customInstrPath = path.join(__dirname, 'files/Instruments/FM_W_TABLE.m8i')
        const customTableBody = `

  N  V  FX1   FX2   FX3
0 F8 -- ---00 ---00 ---00
1 F8 -- ---00 ---00 ---00
2 F8 -- ---00 ---00 ---00
3 F8 -- ---00 ---00 ---00
4 F8 -- ---00 ---00 ---00
5 F8 -- ---00 ---00 ---00
6 F8 -- ---00 ---00 ---00
7 F8 -- ---00 ---00 ---00
8 F8 -- ---00 ---00 ---00
9 F8 -- ---00 ---00 ---00
A F8 -- ---00 ---00 ---00
B F8 -- ---00 ---00 ---00
C F8 -- ---00 ---00 ---00
D F8 -- ---00 ---00 ---00
E F8 -- ---00 ---00 ---00
F F8 -- ---00 ---00 ---00
`

        // Instrument file with default table
        runM8(['instrument', 'table', emptyInstrPath], `TABLE${emptyTableBody}`)

        // Song file with default table
        runM8(['instrument', 'table', testingSongPath, '--instrument', '00'], `TABLE 00${emptyTableBody}`)

        // Instrument file with custom table
        runM8(['instrument', 'table', customInstrPath], `TABLE${customTableBody}`)

        // Song file with custom table
        runM8(['instrument', 'table', testingSongPath, '--instrument', '0D'], `TABLE 0D${customTableBody}`)
      })
    })

    describe('view', () => {
      test('missing m8-file', () => {
        runM8(['instrument', 'view'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['instrument', 'view', defaultThemePath], 'm8-file must be a Instrument or Song file')
      })

      describe('--instrument', () => {
        test('missing', () => {
          runM8(['instrument', 'view', testingSongPath], "error: required option (for Song files) '-i, --instrument <number>' not specified")
        })

        test('< 00', () => {
          runM8(['instrument', 'view', testingSongPath, '--instrument', '-1'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('> FF', () => {
          runM8(['instrument', 'view', testingSongPath, '--instrument', '101'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('provided with Instrument file', () => {
          runM8(['instrument', 'view', defaultFMSynthPath, '--instrument', '00'], "error: option '--instrument' cannot be used with Instrument files")
        })
      })

      test('with m8-file', () => {
        // None instrument
        runM8(['instrument', 'view', testingSongPath, '--instrument', '00'], `INST. 00

TYPE    NONE
NAME    ------------
TRANSP. ON       TABLE TIC 01
`)

        // Default instruments
        Object.keys(defaultInstrumentOutputs).forEach((name) => {
          const meta = defaultInstrumentOutputs[name]
          const instrPath = path.join(__dirname, `files/Instruments/${name}.m8i`)

          // Instrument file
          runM8(['instrument', 'view', instrPath], 'INST.' + meta.view)
        })

        // Testing instruments
        Object.keys(testingInstrumentOutputs).forEach((name) => {
          const meta = testingInstrumentOutputs[name]

          runM8(['instrument', 'view', testingSongPath, '--instrument', toM8HexStr(meta.instrumentIndex)],
                `INST. ${toM8HexStr(meta.instrumentIndex)}${meta.view}`)
        })
      })
    })

    describe('version', () => {
      test('missing m8-file', () => {
        runM8(['instrument', 'version'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['instrument', 'version', defaultThemePath], 'm8-file must be a Instrument or Song file')
      })

      test('with m8-file', () => {
        runM8(['instrument', 'version', path.join(__dirname, 'files/Instruments/DEF_FM.m8i')],
              `M8 VERSION

2.7.0
`)
      })
    })
  })

  describe('project', () => {
    test('empty args prints help', () => {
      testHelp(['project'], projectHelp)
    })

    test('help', () => {
      testHelp(['project', 'help'], projectHelp)
    })

    test('--help', () => {
      testHelp(['project', '--help'], projectHelp)
    })

    describe('effects', () => {
      test('missing m8-file', () => {
        runM8(['project', 'effects'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['project', 'effects', defaultThemePath], 'm8-file must be a Song file')
      })

      test('with m8-file', () => {
        runM8(['project', 'effects', testingSongPath], `CHORUS SETTINGS
MOD DEPTH     01
MOD FREQ.     02
WIDTH         03
REVERB SEND   04

DELAY SETTINGS
FILTER HP:LP  05:06
TIME L:R      07:08
FEEDBACK      09
WIDTH         0A
REVERB SEND   0B

REVERB SETTINGS
FILTER HP:LP  0C:0D
SIZE          0E
DAMPING       0F
MOD DEPTH     10
MOD FREQ.     11
WIDTH         12
`)
      })
    })

    describe('midi-mapping', () => {
      test('missing m8-file', () => {
        runM8(['project', 'midi-mapping'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['project', 'midi-mapping', defaultThemePath], 'm8-file must be a Song file')
      })

      describe('with m8-file', () => {
        let tmpFilePath

        function createInstrMIDIMappingsAndSaveM8File (song, instrIndex) {
          const midiLabels = song.instruments[instrIndex].getMIDIDestLabels()
          let midiMappingCount = 0

          // eslint-disable-next-line no-unused-vars
          midiLabels.forEach((label, i) => {
            if (midiLabels[i] === 'UNUSED') {
              return
            }

            const midiMappingIndex = midiMappingCount++

            song.midiMappings[midiMappingIndex].channel = 0x11 - (i % 0x11)

            song.midiMappings[midiMappingIndex].controlNum = i
            song.midiMappings[midiMappingIndex].type = 0x05
            song.midiMappings[midiMappingIndex].instrIndex = instrIndex
            song.midiMappings[midiMappingIndex].paramIndex = i
            song.midiMappings[midiMappingIndex].minValue = 0x00
            song.midiMappings[midiMappingIndex].maxValue = 0xFF
          })

          fs.writeFileSync(tmpFilePath, Uint8Array.from(M8.dumpM8File(song)))
        }

        beforeEach(() => {
          tmpFilePath = path.join(os.tmpdir(), 'TESTING.m8s')
        })

        afterEach(() => {
          fs.unlinkSync(tmpFilePath)
        })

        test('effects mappings', () => {
          const emptySong = new Song()
          const midiLabels = emptySong.effectsSettings.getMIDIDestLabels()

          // eslint-disable-next-line no-unused-vars
          midiLabels.forEach((label, i) => {
            emptySong.midiMappings[i].channel = 0x11 - (i % 0x11)
            emptySong.midiMappings[i].controlNum = 0x80
            emptySong.midiMappings[i].type = 0x0B
            emptySong.midiMappings[i].instrIndex = 0x00
            emptySong.midiMappings[i].paramIndex = i
            emptySong.midiMappings[i].minValue = 0x00
            emptySong.midiMappings[i].maxValue = 0xFF
          })

          fs.writeFileSync(tmpFilePath, Uint8Array.from(M8.dumpM8File(emptySong)))

          runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 AL T:X -- 00▸FF X00:CH M.DEP
01 16 T:X -- 00▸FF X01:CH M.FRQ
02 15 T:X -- 00▸FF X02:CH WIDTH
03 14 T:X -- 00▸FF X03:CH REVERB
04 13 T:X -- 00▸FF X04:DEL F.HP
05 12 T:X -- 00▸FF X05:DEL F.LP
06 11 T:X -- 00▸FF X06:DEL TIMEL
07 10 T:X -- 00▸FF X07:DEL TIMER
08 09 T:X -- 00▸FF X08:DEL FBK
09 08 T:X -- 00▸FF X09:DEL WIDTH
0A 07 T:X -- 00▸FF X0A:DEL REVB
0B 06 T:X -- 00▸FF X0B:REV F.HP
0C 05 T:X -- 00▸FF X0C:REV L.HP
0D 04 T:X -- 00▸FF X0D:REV SIZE
0E 03 T:X -- 00▸FF X0E:REV DECAY
0F 02 T:X -- 00▸FF X0F:REV M.DEP
`)

          runM8(['project', 'midi-mapping', tmpFilePath, '-s', '16'], `MIDI MAPPING

   CH CTL V  RANGE DEST
10 01 T:X -- 00▸FF X10:REV M.FRQ
11 AL T:X -- 00▸FF X11:REV WIDTH
12 -- --- -- --▸--
13 -- --- -- --▸--
14 -- --- -- --▸--
15 -- --- -- --▸--
16 -- --- -- --▸--
17 -- --- -- --▸--
18 -- --- -- --▸--
19 -- --- -- --▸--
1A -- --- -- --▸--
1B -- --- -- --▸--
1C -- --- -- --▸--
1D -- --- -- --▸--
1E -- --- -- --▸--
1F -- --- -- --▸--
`)
        })

        test('mixer mappings', () => {
          const emptySong = new Song()
          const midiLabels = emptySong.mixerSettings.getMIDIDestLabels()

          // eslint-disable-next-line no-unused-vars
          midiLabels.forEach((label, i) => {
            emptySong.midiMappings[i].channel = 0x11 - (i % 0x11)
            emptySong.midiMappings[i].controlNum = 0x80
            emptySong.midiMappings[i].type = 0x0D
            emptySong.midiMappings[i].instrIndex = 0x00
            emptySong.midiMappings[i].paramIndex = i
            emptySong.midiMappings[i].minValue = 0x00
            emptySong.midiMappings[i].maxValue = 0xFF
          })

          fs.writeFileSync(tmpFilePath, Uint8Array.from(M8.dumpM8File(emptySong)))

          runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 AL T:X -- 00▸FF M00:MIX VOL
01 16 T:X -- 00▸FF M01:LIMIT
02 15 T:X -- 00▸FF M02:DJ F.CUT
03 14 T:X -- 00▸FF M03:DJ F.RES
04 13 T:X -- 00▸FF M04:TRACK 1
05 12 T:X -- 00▸FF M05:TRACK 2
06 11 T:X -- 00▸FF M06:TRACK 3
07 10 T:X -- 00▸FF M07:TRACK 4
08 09 T:X -- 00▸FF M08:TRACK 5
09 08 T:X -- 00▸FF M09:TRACK 6
0A 07 T:X -- 00▸FF M0A:TRACK 7
0B 06 T:X -- 00▸FF M0B:TRACK 8
0C 05 T:X -- 00▸FF M0C:CHORUS
0D 04 T:X -- 00▸FF M0D:DELAY
0E 03 T:X -- 00▸FF M0E:REVERB
0F 02 T:X -- 00▸FF M0F:INPUT
`)

          runM8(['project', 'midi-mapping', tmpFilePath, '-s', '16'], `MIDI MAPPING

   CH CTL V  RANGE DEST
10 01 T:X -- 00▸FF M10:INPUT R
11 AL T:X -- 00▸FF M11:USB
12 16 T:X -- 00▸FF M12:IN CHO
13 15 T:X -- 00▸FF M13:IN R CHO
14 14 T:X -- 00▸FF M14:USB CHO
15 13 T:X -- 00▸FF M15:IN DEL
16 12 T:X -- 00▸FF M16:IN R DEL
17 11 T:X -- 00▸FF M17:USB DEL
18 10 T:X -- 00▸FF M18:IN REV
19 09 T:X -- 00▸FF M19:IN R REV
1A 08 T:X -- 00▸FF M1A:USB REV
1B -- --- -- --▸--
1C -- --- -- --▸--
1D -- --- -- --▸--
1E -- --- -- --▸--
1F -- --- -- --▸--
`)
        })

        describe('instrument mappings', () => {
          test('WAVSYNTH', () => {
            const emptySong = new Song()

            emptySong.instruments[0x00] = new Wavsynth()

            createInstrMIDIMappingsAndSaveM8File(emptySong, 0x00)

            runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 13 004 -- 00▸FF I00:SIZE
01 12 005 -- 00▸FF I00:MULT
02 11 006 -- 00▸FF I00:WARP
03 10 007 -- 00▸FF I00:MIRROR
04 08 009 -- 00▸FF I00:CUTOFF
05 07 010 -- 00▸FF I00:RES
06 06 011 -- 00▸FF I00:AMP
07 04 013 -- 00▸FF I00:PAN
08 03 014 -- 00▸FF I00:DRY
09 02 015 -- 00▸FF I00:CHO
0A 01 016 -- 00▸FF I00:DEL
0B AL 017 -- 00▸FF I00:REV
0C 15 019 -- 00▸FF I00:AMOUNT
0D 14 020 -- 00▸FF I00:ATTACK
0E 13 021 -- 00▸FF I00:HOLD
0F 12 022 -- 00▸FF I00:DECAY
`)

            runM8(['project', 'midi-mapping', tmpFilePath, '-s', '16'], `MIDI MAPPING

   CH CTL V  RANGE DEST
10 09 025 -- 00▸FF I00:AMOUNT
11 08 026 -- 00▸FF I00:ATTACK
12 07 027 -- 00▸FF I00:HOLD
13 06 028 -- 00▸FF I00:DECAY
14 01 033 -- 00▸FF I00:FRQ
15 AL 034 -- 00▸FF I00:AMT
16 12 039 -- 00▸FF I00:FRQ
17 11 040 -- 00▸FF I00:AMT
18 -- --- -- --▸--
19 -- --- -- --▸--
1A -- --- -- --▸--
1B -- --- -- --▸--
1C -- --- -- --▸--
1D -- --- -- --▸--
1E -- --- -- --▸--
1F -- --- -- --▸--
`)
          })
        })

        test('MACROSYNTH', () => {
          const emptySong = new Song()

          emptySong.instruments[0x01] = new Macrosynth()

          createInstrMIDIMappingsAndSaveM8File(emptySong, 0x01)

          runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 13 004 -- 00▸FF I01:TIMBRE
01 12 005 -- 00▸FF I01:COLOR
02 11 006 -- 00▸FF I01:DEGRADE
03 10 007 -- 00▸FF I01:REDUX
04 08 009 -- 00▸FF I01:CUTOFF
05 07 010 -- 00▸FF I01:RES
06 06 011 -- 00▸FF I01:AMP
07 04 013 -- 00▸FF I01:PAN
08 03 014 -- 00▸FF I01:DRY
09 02 015 -- 00▸FF I01:CHO
0A 01 016 -- 00▸FF I01:DEL
0B AL 017 -- 00▸FF I01:REV
0C 15 019 -- 00▸FF I01:AMOUNT
0D 14 020 -- 00▸FF I01:ATTACK
0E 13 021 -- 00▸FF I01:HOLD
0F 12 022 -- 00▸FF I01:DECAY
`)

          runM8(['project', 'midi-mapping', tmpFilePath, '-s', '16'], `MIDI MAPPING

   CH CTL V  RANGE DEST
10 09 025 -- 00▸FF I01:AMOUNT
11 08 026 -- 00▸FF I01:ATTACK
12 07 027 -- 00▸FF I01:HOLD
13 06 028 -- 00▸FF I01:DECAY
14 01 033 -- 00▸FF I01:FRQ
15 AL 034 -- 00▸FF I01:AMT
16 12 039 -- 00▸FF I01:FRQ
17 11 040 -- 00▸FF I01:AMT
18 -- --- -- --▸--
19 -- --- -- --▸--
1A -- --- -- --▸--
1B -- --- -- --▸--
1C -- --- -- --▸--
1D -- --- -- --▸--
1E -- --- -- --▸--
1F -- --- -- --▸--
`)
        })

        test('SAMPLER', () => {
          const emptySong = new Song()

          emptySong.instruments[0x02] = new Sampler()

          createInstrMIDIMappingsAndSaveM8File(emptySong, 0x02)

          runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 15 002 -- 00▸FF I02:DETUNE
01 12 005 -- 00▸FF I02:START
02 11 006 -- 00▸FF I02:LOOP ST
03 10 007 -- 00▸FF I02:LENGTH
04 09 008 -- 00▸FF I02:DEGRADE
05 07 010 -- 00▸FF I02:CUTOFF
06 06 011 -- 00▸FF I02:RES
07 05 012 -- 00▸FF I02:AMP
08 03 014 -- 00▸FF I02:PAN
09 02 015 -- 00▸FF I02:DRY
0A 01 016 -- 00▸FF I02:CHO
0B AL 017 -- 00▸FF I02:DEL
0C 16 018 -- 00▸FF I02:REV
0D 14 020 -- 00▸FF I02:AMOUNT
0E 13 021 -- 00▸FF I02:ATTACK
0F 12 022 -- 00▸FF I02:HOLD
`)

          runM8(['project', 'midi-mapping', tmpFilePath, '-s', '16'], `MIDI MAPPING

   CH CTL V  RANGE DEST
10 11 023 -- 00▸FF I02:DECAY
11 08 026 -- 00▸FF I02:AMOUNT
12 07 027 -- 00▸FF I02:ATTACK
13 06 028 -- 00▸FF I02:HOLD
14 05 029 -- 00▸FF I02:DECAY
15 AL 034 -- 00▸FF I02:FRQ
16 16 035 -- 00▸FF I02:AMT
17 11 040 -- 00▸FF I02:FRQ
18 10 041 -- 00▸FF I02:AMT
19 -- --- -- --▸--
1A -- --- -- --▸--
1B -- --- -- --▸--
1C -- --- -- --▸--
1D -- --- -- --▸--
1E -- --- -- --▸--
1F -- --- -- --▸--
`)
        })

        test('MIDI OUT', () => {
          const emptySong = new Song()

          emptySong.instruments[0x03] = new MIDIOut()

          createInstrMIDIMappingsAndSaveM8File(emptySong, 0x03)

          runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 09 008 -- 00▸FF I03:CCA VAL
01 07 010 -- 00▸FF I03:CCB VAL
02 05 012 -- 00▸FF I03:CCC VAL
03 03 014 -- 00▸FF I03:CCD VAL
04 01 016 -- 00▸FF I03:CCE VAL
05 16 018 -- 00▸FF I03:CCF VAL
06 14 020 -- 00▸FF I03:CCG VAL
07 12 022 -- 00▸FF I03:CCH VAL
08 10 024 -- 00▸FF I03:CCI VAL
09 08 026 -- 00▸FF I03:CCJ VAL
0A -- --- -- --▸--
0B -- --- -- --▸--
0C -- --- -- --▸--
0D -- --- -- --▸--
0E -- --- -- --▸--
0F -- --- -- --▸--
`)
        })

        test('FMSYNTH', () => {
          const emptySong = new Song()

          emptySong.instruments[0x04] = new FMSynth()

          createInstrMIDIMappingsAndSaveM8File(emptySong, 0x04)

          runM8(['project', 'midi-mapping', tmpFilePath], `MIDI MAPPING

   CH CTL V  RANGE DEST
00 02 032 -- 00▸FF I04:MOD1
01 01 033 -- 00▸FF I04:MOD2
02 AL 034 -- 00▸FF I04:MOD3
03 16 035 -- 00▸FF I04:MOD4
04 14 037 -- 00▸FF I04:CUTOFF
05 13 038 -- 00▸FF I04:RES
06 12 039 -- 00▸FF I04:AMP
07 10 041 -- 00▸FF I04:PAN
08 09 042 -- 00▸FF I04:DRY
09 08 043 -- 00▸FF I04:CHO
0A 07 044 -- 00▸FF I04:DEL
0B 06 045 -- 00▸FF I04:REV
0C 04 047 -- 00▸FF I04:AMOUNT
0D 03 048 -- 00▸FF I04:ATTACK
0E 02 049 -- 00▸FF I04:HOLD
0F 01 050 -- 00▸FF I04:DECAY
`)

          runM8(['project', 'midi-mapping', tmpFilePath, '-s', '16'], `MIDI MAPPING

   CH CTL V  RANGE DEST
10 15 053 -- 00▸FF I04:AMOUNT
11 14 054 -- 00▸FF I04:ATTACK
12 13 055 -- 00▸FF I04:HOLD
13 12 056 -- 00▸FF I04:DECAY
14 07 061 -- 00▸FF I04:FRQ
15 06 062 -- 00▸FF I04:AMT
16 01 067 -- 00▸FF I04:FRQ
17 AL 068 -- 00▸FF I04:AMT
18 -- --- -- --▸--
19 -- --- -- --▸--
1A -- --- -- --▸--
1B -- --- -- --▸--
1C -- --- -- --▸--
1D -- --- -- --▸--
1E -- --- -- --▸--
1F -- --- -- --▸--
`)
        })
      })
    })

    describe('midi-settings', () => {
      test('missing m8-file', () => {
        runM8(['project', 'midi-settings'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['project', 'midi-settings', defaultThemePath], 'm8-file must be a Song file')
      })

      test('with m8-file', () => {
        runM8(['project', 'midi-settings', testingSongPath], `MIDI SETTINGS

RECEIVE SYNC      ON
RECEIVE TRANSPORT PATTERN
SEND SYNC         OFF
SEND TRANSPORT    SONG
REC. NOTE CHAN    05
REC. VELOCITY     ON
REC. DELAY/KILL   BOTH
CONTROL MAP CHAN  ALL
SONG ROW CUE CHAN 05

TRACK MIDI INPUT
      1  2  3  4  5  6  7  8
CHAN. 01 02 03 04 05 06 07 08
INST# 08 07 06 05 04 03 02 01
PG CHANGE OFF   MODE POLY
`)
      })
    })

    describe('mixer', () => {
      test('missing m8-file', () => {
        runM8(['project', 'mixer'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['project', 'mixer', defaultThemePath], 'm8-file must be a Song file')
      })

      test('with m8-file', () => {
        runM8(['project', 'mixer', testingSongPath], `MIXER

VOLUME:LIMIT  01:02
DJFILT:PEAK   03:04


1  2  3  4  5  6  7  8
08 07 06 05 04 03 02 01


CHO DEL REV INPUT USB
01  02  03  04 05 06

        CHO 07 08 09
        DEL 0A 0B 0C
        REV 0D 0E 0F
`)
      })
    })

    describe('view', () => {
      test('missing m8-file', () => {
        runM8(['project', 'view'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['project', 'view', defaultThemePath], 'm8-file must be a Song file')
      })

      test('with m8-file', () => {
        runM8(['project', 'view', testingSongPath], `PROJECT

TRANSPOSE     01
TEMPO         128.00
LIVE QUANTIZE 01 STEPS

NAME          TESTING
`)
        runM8(['project', 'view', defaultSongPath], `PROJECT

TRANSPOSE     00
TEMPO         120.00
LIVE QUANTIZE 00 CHAIN LEN

NAME          DEFAULT
`)
      })
    })

    describe('version', () => {
      test('missing m8-file', () => {
        runM8(['project', 'version'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['project', 'version', defaultThemePath], 'm8-file must be a Song file')
      })

      test('with m8-file', () => {
        runM8(['project', 'version', testingSongPath], `M8 VERSION

2.7.0
`)
      })
    })
  })

  describe('scale', () => {
    test('empty args prints help', () => {
      testHelp(['scale'], scaleHelp)
    })

    test('help', () => {
      testHelp(['scale', 'help'], scaleHelp)
    })

    test('--help', () => {
      testHelp(['scale', '--help'], scaleHelp)
    })

    describe('view', () => {
      test('missing m8-file', () => {
        runM8(['scale', 'view'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['scale', 'view', defaultThemePath], 'm8-file must be a Scale file')
      })

      test('with m8-file', () => {
        runM8(['scale', 'view', testingScalePath], `SCALE

KEY   C

I  EN OFFSET
C  ON-24.00
C# -- -- --
D  ON 01.02
D# -- -- --
E  ON 03.04
F  -- -- --
F# ON 05.06
G  ON-04.03
G# -- -- --
A  ON-02.01
A# -- -- --
B  ON 24.00

NAME  TESTING---------
`)
      })
    })

    describe('version', () => {
      test('missing m8-file', () => {
        runM8(['scale', 'view'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['scale', 'version', defaultThemePath], 'm8-file must be a Scale file')
      })

      test('with m8-file', () => {
        runM8(['scale', 'version', testingScalePath], `M8 VERSION

2.5.0
`)
      })
    })
  })

  describe('song', () => {
    test('empty args prints help', () => {
      testHelp(['song'], songHelp)
    })

    test('help', () => {
      testHelp(['song', 'help'], songHelp)
    })

    test('--help', () => {
      testHelp(['song', '--help'], songHelp)
    })

    describe('chain', () => {
      test('missing m8-file', () => {
        runM8(['song', 'chain', '--chain', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'chain', defaultThemePath, '--chain', '00'], 'm8-file must be a Song file')
      })

      test('missing --chain', () => {
        runM8(['song', 'chain', testingSongPath], "error: required option '-c, --chain <number>' not specified")
      })

      test('with m8-file', () => {
        runM8(['song', 'chain', testingSongPath, '--chain', '00'],
              `CHAIN 00

  PH TSP
0 00 01
1 01 02
2 02 03
3 03 04
4 04 05
5 05 06
6 06 07
7 07 08
8 -- 00
9 00 00
A -- 00
B 08 00
C -- 00
D -- 00
E -- 00
F -- 00
`)

        runM8(['song', 'chain', testingSongPath, '--chain', '01'],
              `CHAIN 01

  PH TSP
0 -- 00
1 -- 00
2 -- 00
3 -- 00
4 -- 00
5 -- 00
6 -- 00
7 -- 00
8 -- 00
9 -- 00
A -- 00
B -- 00
C -- 00
D -- 00
E -- 00
F -- 00
`)
      })
    })

    describe('groove', () => {
      test('missing m8-file', () => {
        runM8(['song', 'groove', '--groove', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'groove', defaultThemePath, '--groove', '00'], 'm8-file must be a Song file')
      })

      test('missing --groove', () => {
        runM8(['song', 'groove', testingSongPath], "error: required option '-g, --groove <number>' not specified")
      })

      test('with m8-file', () => {
        runM8(['song', 'groove', testingSongPath, '--groove', '00'],
              `GROOVE 00

  PH TSP
0 06
1 06
2 --
3 --
4 --
5 --
6 --
7 --
8 --
9 --
A --
B --
C --
D --
E --
F --
`)

        runM8(['song', 'groove', testingSongPath, '--groove', '01'],
              `GROOVE 01

  PH TSP
0 0F
1 0E
2 0D
3 0C
4 0B
5 0A
6 09
7 08
8 07
9 06
A 05
B 04
C 03
D 02
E 01
F 00
`)
      })
    })

    describe('export', () => {
      test('missing m8-file', () => {
        runM8(['export'], "error: missing required argument 'm8-file'")
      })

      test('--help', () => {
        testHelp(['export', '--help'], exportHelp)
      })

      describe('with m8-file', () => {
        test('Instrument', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(defaultFMSynthPath))
          const instr = M8.loadM8File(bytesFromDisk)

          runM8(['export', defaultFMSynthPath], JSON.stringify(instr.asObject(), null, 2))
        })

        test('Scale', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(testingScalePath))
          const scale = M8.loadM8File(bytesFromDisk)

          runM8(['export', testingScalePath], JSON.stringify(scale.asObject(), null, 2))
        })

        test('Song', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(defaultSongPath))
          const song = M8.loadM8File(bytesFromDisk)

          runM8(['export', defaultSongPath], JSON.stringify(song.asObject(), null, 2))
        })

        test('Theme', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(defaultThemePath))
          const theme = M8.loadM8File(bytesFromDisk)

          runM8(['export', defaultThemePath], JSON.stringify(theme.asObject(), null, 2))
        })

        describe('--output', () => {
          test('exists', () => {
            const outputPath = path.join(os.tmpdir(), 'm8-export.m8t')

            fs.writeFileSync(outputPath, 'TESTING')

            runM8(['export', defaultThemePath, '-o', outputPath], `Cannot write to file at ${outputPath}: File exists`)

            fs.unlinkSync(outputPath)
          })

          test('can export', () => {
            const bytesFromDisk = Array.from(fs.readFileSync(defaultThemePath))
            const theme = M8.loadM8File(bytesFromDisk)
            const outputPath = path.join(os.tmpdir(), 'm8-export.m8t')

            runM8(['export', defaultThemePath, '-o', outputPath],
                  `M8 Theme file (${defaultThemePath}) exported to ${outputPath}`)

            expect(fs.readFileSync(outputPath, 'utf8')).toEqual(JSON.stringify(theme.asObject(), null, 2))

            fs.unlinkSync(outputPath)
          })
        })
      })
    })

    describe('import', () => {
      test('missing m8-file', () => {
        const outputPath = path.join(os.tmpdir(), 'm8-export.m8t')

        runM8(['import', '-o', outputPath], "error: missing required argument 'm8-file'")
      })

      test('--help', () => {
        testHelp(['import', '--help'], importHelp)
      })

      describe('--output', () => {
        test('missing', () => {
          runM8(['import', testingSongPath], "error: required option '-o, --output <path>' not specified")
        })

        test('points to existing file', () => {
          const importPath = path.join(os.tmpdir(), 'm8-export.json')

          fs.writeFileSync(importPath, JSON.stringify(DefaultTheme.asObject()))

          runM8(['import', importPath, '-o', importPath], `Cannot write to file at ${importPath}: File exists`)

          fs.unlinkSync(importPath)
        })
      })

      describe('with m8-file', () => {
        const importPath = path.join(os.tmpdir(), 'm8-import.json')
        const outputPath = path.join(os.tmpdir(), 'm8-import.m8_')

        afterEach(() => {
          fs.unlinkSync(importPath)
          fs.unlinkSync(outputPath)
        })

        test('Instrument', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(defaultFMSynthPath))
          const instr = M8.loadM8File(bytesFromDisk)

          fs.writeFileSync(importPath, JSON.stringify(instr.asObject()))

          runM8(['import', importPath, '-o', outputPath],
                `M8 Instrument file (${outputPath}) imported from ${importPath}`)

          const importedBytes = Array.from(fs.readFileSync(outputPath))

          expect(M8.loadM8File(importedBytes)).toEqual(instr)
        })

        test('Scale', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(testingScalePath))
          const scale = M8.loadM8File(bytesFromDisk)

          fs.writeFileSync(importPath, JSON.stringify(scale.asObject()))

          runM8(['import', importPath, '-o', outputPath],
                `M8 Scale file (${outputPath}) imported from ${importPath}`)

          const importedBytes = Array.from(fs.readFileSync(outputPath))

          expect(M8.loadM8File(importedBytes)).toEqual(scale)
        })

        test('Song', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(testingSongPath))
          const song = M8.loadM8File(bytesFromDisk)

          fs.writeFileSync(importPath, JSON.stringify(song.asObject()))

          runM8(['import', importPath, '-o', outputPath],
                `M8 Song file (${outputPath}) imported from ${importPath}`)

          const importedBytes = Array.from(fs.readFileSync(outputPath))

          expect(M8.loadM8File(importedBytes)).toEqual(song)
        })

        test('Theme', () => {
          const bytesFromDisk = Array.from(fs.readFileSync(defaultThemePath))
          const theme = M8.loadM8File(bytesFromDisk)

          fs.writeFileSync(importPath, JSON.stringify(theme.asObject()))

          runM8(['import', importPath, '-o', outputPath],
                `M8 Theme file (${outputPath}) imported from ${importPath}`)

          const importedBytes = Array.from(fs.readFileSync(outputPath))

          expect(M8.loadM8File(importedBytes)).toEqual(theme)
        })
      })
    })

    describe('instrument', () => {
      test('missing m8-file', () => {
        runM8(['song', 'instrument', '--instrument', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'instrument', defaultThemePath, '--instrument', '00'], 'm8-file must be a Song file')
      })

      describe('--instrument', () => {
        test('missing', () => {
          runM8(['song', 'instrument', testingSongPath], "error: required option '-i, --instrument <number>' not specified")
        })

        test('< 00', () => {
          runM8(['song', 'instrument', testingSongPath, '--instrument', '-1'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })

        test('> FF', () => {
          runM8(['song', 'instrument', testingSongPath, '--instrument', '101'], "option '-i, --instrument <number>' must be between 00 and 7F")
        })
      })

      test('with m8-file', () => {
        // None instrument
        runM8(['song', 'instrument', testingSongPath, '--instrument', '00'], `INST. 00

TYPE    NONE
NAME    ------------
TRANSP. ON       TABLE TIC 01
`)

        // Testing instruments
        Object.keys(testingInstrumentOutputs).forEach((name) => {
          const meta = testingInstrumentOutputs[name]

          runM8(['song', 'instrument', testingSongPath, '--instrument', toM8HexStr(meta.instrumentIndex)],
                `INST. ${toM8HexStr(meta.instrumentIndex)}` + meta.view)
        })
      })
    })

    describe('phrase', () => {
      test('missing m8-file', () => {
        runM8(['song', 'phrase', '--phrase', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'phrase', defaultThemePath, '--phrase', '00'], 'm8-file must be a Song file')
      })

      describe('--phrase', () => {
        test('missing', () => {
          runM8(['song', 'phrase', testingSongPath], "error: required option '-p, --phrase <number>' not specified")
        })

        test('< 00', () => {
          runM8(['song', 'phrase', testingSongPath, '--phrase', '-1'], "option '-p, --phrase <number>' must be between 00 and FF")
        })

        test('> FF', () => {
          runM8(['song', 'phrase', testingSongPath, '--phrase', '100'], "option '-p, --phrase <number>' must be between 00 and FF")
        })
      })

      test('with m8-file', () => {
        // 00: Sequencer commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '00'],
              `PHRASE 00*

  N   V  I  FX1   FX2   FX3
0 C-4 01 00 ARP01 CHA02 DEL03
1 C#4 02 01 GRV04 HOP05 KIL06
2 D-4 03 02 RAN07 RET08 REP09
3 D#4 04 03 NTH0A PSL0B PSN0C
4 E-4 05 04 PVB0D PVX0E SCA0F
5 F-4 06 05 SCG10 SED11 SNG12
6 F#4 07 06 TBL13 THO14 TIC15
7 G-4 08 07 TPO16 TSP17 ---00
8 --- -- -- ---00 ---00 ---00
9 --- -- -- ARP01 TSP02 ---00
A --- -- -- ---00 ---00 ---00
B --- -- -- ---00 ---00 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- ---00 ---00 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 01: Mixer/FX commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '01'],
              `PHRASE 01

  N   V  I  FX1   FX2   FX3
0 C-4 01 00 VMV01 XCM02 XCF03
1 C#4 02 01 XCW04 XCR05 XDT06
2 D-4 03 02 XDF07 XDW08 XDR09
3 D#4 04 03 XRS0A XRD0B XRM0C
4 E-4 05 04 XRF0D XRW0E XRZ0F
5 F-4 06 05 VCH10 VCD11 VRE12
6 F#4 07 06 VT113 VT214 VT315
7 G-4 08 07 VT416 VT517 VT618
8 G#4 09 08 VT719 VT81A DJF1B
9 A-4 0A 09 IVO1C ICH1D IDE1E
A A#4 0B 0A IRE1F IV220 IC221
B B-4 0C 0B ID222 IR223 USB24
C --- -- -- ---00 ---00 ---00
D --- -- -- VMV01 USB02 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)
        // 02: FMSynth commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '02'],
              `PHRASE 02*

  N   V  I  FX1   FX2   FX3
0 C-4 01 01 VOL01 PIT02 FIN03
1 C#4 02 01 ALG04 FM105 FM206
2 D-4 03 01 FM307 FM408 FIL09
3 D#4 04 01 CUT0A RES0B AMP0C
4 E-4 05 01 LIM0D PAN0E DRY0F
5 F-4 06 01 SCH10 SDL11 SRV12
6 F#4 07 01 EA113 AT114 HO115
7 G-4 08 01 DE116 ET117 EA218
8 G#4 09 01 AT219 HO21A DE21B
9 A-4 0A 01 ET21C LA11D LF11E
A A#4 0B 01 LT11F LA220 LF221
B B-4 0C 01 LT222 FMP23 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- VOL01 FMP02 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 03: Macrosynth commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '03'],
              `PHRASE 03

  N   V  I  FX1   FX2   FX3
0 C-4 01 02 VOL01 PIT02 FIN03
1 C#4 02 02 OSC04 TBR05 COL06
2 D-4 03 02 DEG07 RED08 FIL09
3 D#4 04 02 CUT0A RES0B AMP0C
4 E-4 05 02 LIM0D PAN0E DRY0F
5 F-4 06 02 SCH10 SDL11 SRV12
6 F#4 07 02 EA113 AT114 HO115
7 G-4 08 02 DE116 ET117 EA218
8 G#4 09 02 AT219 HO21A DE21B
9 A-4 0A 02 ET21C LA11D LF11E
A A#4 0B 02 LT11F LA220 LF221
B B-4 0C 02 LT222 TRG23 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- VOL01 TRG02 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 04: MIDIOut commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '04'],
              `PHRASE 04*

  N   V  I  FX1   FX2   FX3
0 C-4 01 03 MPG01 MPB02 ADD03
1 C#4 02 03 CHD04 CCA05 CCB06
2 D-4 03 03 CCC07 CCD08 CCE09
3 D#4 04 03 CCF0A CCG0B CCH0C
4 E-4 05 03 CCI0D CCJ0E ---00
5 --- -- -- ---00 ---00 ---00
6 --- -- -- MPG01 CCJ02 ---00
7 --- -- -- ---00 ---00 ---00
8 --- -- -- ---00 ---00 ---00
9 --- -- -- ---00 ---00 ---00
A --- -- -- ---00 ---00 ---00
B --- -- -- ---00 ---00 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- ---00 ---00 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 05: Sampler commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '05'],
              `PHRASE 05

  N   V  I  FX1   FX2   FX3
0 C-4 01 04 VOL01 PIT02 FIN03
1 C#4 02 04 PLY04 STA05 LOP06
2 D-4 03 04 LEN07 DEG08 FLT09
3 D#4 04 04 CUT0A RES0B AMP0C
4 E-4 05 04 LIM0D PAN0E DRY0F
5 F-4 06 04 SCH10 SDL11 SRV12
6 F#4 07 04 EA113 AT114 HO115
7 G-4 08 04 DE116 ET117 EA218
8 G#4 09 04 AT219 HO21A DE21B
9 A-4 0A 04 ET21C LA11D LF11E
A A#4 0B 04 LT11F LA220 LF221
B B-4 0C 04 LT222 SLI23 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- VOL01 SLI02 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 06: Wavsynth commands
        runM8(['song', 'phrase', testingSongPath, '--phrase', '06'],
              `PHRASE 06*

  N   V  I  FX1   FX2   FX3
0 C-4 01 05 VOL01 PIT02 FIN03
1 C#4 02 05 OSC04 SIZ05 MUL06
2 D-4 03 05 WRP07 MIR08 FIL09
3 D#4 04 05 CUT0A RES0B AMP0C
4 E-4 05 05 LIM0D PAN0E DRY0F
5 F-4 06 05 SCH10 SDL11 SRV13
6 F#4 07 05 EA114 AT115 HO116
7 G-4 08 05 DE117 ET118 EA219
8 G#4 09 05 AT21A HO21B DE21C
9 A-4 0A 05 ET21D LA11E LF120
A A#4 0B 05 LT121 LA222 LF223
B B-4 0C 05 LT224 ---00 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- VOL01 LT202 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 07: Empty phrase with KIL command
        runM8(['song', 'phrase', testingSongPath, '--phrase', '07'],
              `PHRASE 07

  N   V  I  FX1   FX2   FX3
0 --- -- -- KIL01 ---00 ---00
1 --- -- -- ---00 ---00 ---00
2 --- -- -- ---00 ---00 ---00
3 --- -- -- ---00 ---00 ---00
4 --- -- -- ---00 ---00 ---00
5 --- -- -- ---00 ---00 ---00
6 --- -- -- ---00 ---00 ---00
7 --- -- -- ---00 ---00 ---00
8 --- -- -- ---00 ---00 ---00
9 --- -- -- ---00 ---00 ---00
A --- -- -- ---00 ---00 ---00
B --- -- -- ---00 ---00 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- ---00 ---00 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)

        // 08: Empty phrase with commands from previous instrument in FX3 (FMSYNTH instrument 07)
        runM8(['song', 'phrase', testingSongPath, '--phrase', '08'],
              `PHRASE 08

  N   V  I  FX1   FX2   FX3
0 --- -- -- ARP01 VMV02 A2*03
1 --- -- -- ---00 ---00 ---00
2 --- -- -- ---00 ---00 ---00
3 --- -- -- ---00 ---00 ---00
4 --- -- -- ---00 ---00 ---00
5 --- -- -- ---00 ---00 ---00
6 --- -- -- ---00 ---00 ---00
7 --- -- -- ---00 ---00 ---00
8 --- -- -- ---00 ---00 ---00
9 --- -- -- ---00 ---00 ---00
A --- -- -- ---00 ---00 ---00
B --- -- -- ---00 ---00 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- ---00 ---00 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00

* The command affects an instrument outside of this phrase and cannot be
  identified. Please use the 'phrase-at' command for its full representation.
`)
      })

      // TODO: Write test that shows full phrase render
    })

    describe('phrase-at', () => {
      test('missing m8-file', () => {
        runM8(['song', 'phrase-at', '--track-num', '01', '--track-step', '00', '--chain-step', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'phrase-at', defaultThemePath, '--track-num', '01', '--track-step', '00', '--chain-step', '00'], 'm8-file must be a Song file')
      })

      describe('--track-num', () => {
        test('missing', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-step', '00', '--chain-step', '00'], "error: required option '-n, --track-num <number>' not specified")
        })

        test('wrong format', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', 'num', '--track-step', '00', '--chain-step', '00'], "error: option '-n, --track-num <number>' argument 'num' is invalid. not a number")
        })

        test('< 01', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '-1', '--track-step', '00', '--chain-step', '00'], "option '-n, --track-num <number>' must be between 01 and 08")
        })

        test('> 09', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '09', '--track-step', '00', '--chain-step', '00'], "option '-n, --track-num <number>' must be between 01 and 08")
        })
      })

      describe('--track-step', () => {
        test('missing', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--chain-step', '00'], "error: required option '-s, --track-step <number>' not specified")
        })

        test('wrong format', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', 'num', '--chain-step', '00'], "error: option '-s, --track-step <number>' argument 'num' is invalid. not a hex number")
        })

        test('< 01', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '-1', '--chain-step', '00'], "option '-s, --track-step <number>' must be between 00 and FF")
        })

        test('> FF', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '100', '--chain-step', '00'], "option '-s, --track-step <number>' must be between 00 and FF")
        })

        test('empty chain', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '0E', '--chain-step', '00'], 'Chain at 0E for track 01 is empty')
        })
      })

      describe('--chain-step', () => {
        test('missing', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '00'], "error: required option '-c, --chain-step <number>' not specified")
        })

        test('wrong format', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '00', '--chain-step', 'num'], "error: option '-c, --chain-step <number>' argument 'num' is invalid. not a hex number")
        })

        test('< 01', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '00', '--chain-step', '-1'], "option '-c, --chain-step <number>' must be between 00 and 0F")
        })

        test('> FF', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '00', '--chain-step', '10'], "option '-c, --chain-step <number>' must be between 00 and 0F")
        })

        test('empty phrase', () => {
          runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '00', '--chain-step', '0E'], 'Phrase at 0E in chain 00 for track 01 is empty')
        })
      })

      test('with m8-file', () => {
        runM8(['song', 'phrase-at', testingSongPath, '--track-num', '01', '--track-step', '00', '--chain-step', '0B'], `PHRASE 08

  N   V  I  FX1   FX2   FX3
0 --- -- -- ARP01 VMV02 FMP03
1 --- -- -- ---00 ---00 ---00
2 --- -- -- ---00 ---00 ---00
3 --- -- -- ---00 ---00 ---00
4 --- -- -- ---00 ---00 ---00
5 --- -- -- ---00 ---00 ---00
6 --- -- -- ---00 ---00 ---00
7 --- -- -- ---00 ---00 ---00
8 --- -- -- ---00 ---00 ---00
9 --- -- -- ---00 ---00 ---00
A --- -- -- ---00 ---00 ---00
B --- -- -- ---00 ---00 ---00
C --- -- -- ---00 ---00 ---00
D --- -- -- ---00 ---00 ---00
E --- -- -- ---00 ---00 ---00
F --- -- -- ---00 ---00 ---00
`)
      })
    })

    describe('table', () => {
      test('missing m8-file', () => {
        runM8(['song', 'table', '--table', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'table', defaultThemePath, '--table', '00'], 'm8-file must be a Song file')
      })

      test('missing --table', () => {
        runM8(['song', 'table', testingSongPath], "error: required option '-t, --table <number>' not specified")
      })

      test('with m8-file', () => {
        runM8(['song', 'table', testingSongPath, '--table', '00'], `TABLE 00

  N  V  FX1   FX2   FX3
0 00 -- ---00 ---00 ---00
1 00 -- ---00 ---00 ---00
2 00 -- ---00 ---00 ---00
3 00 -- ---00 ---00 ---00
4 00 -- ---00 ---00 ---00
5 00 -- ---00 ---00 ---00
6 00 -- ---00 ---00 ---00
7 00 -- ---00 ---00 ---00
8 00 -- ---00 ---00 ---00
9 00 -- ---00 ---00 ---00
A 00 -- ---00 ---00 ---00
B 00 -- ---00 ---00 ---00
C 00 -- ---00 ---00 ---00
D 00 -- ---00 ---00 ---00
E 00 -- ---00 ---00 ---00
F 00 -- ---00 ---00 ---00
`)

        runM8(['song', 'table', testingSongPath, '--table', '0D'], `TABLE 0D

  N  V  FX1   FX2   FX3
0 F8 -- ---00 ---00 ---00
1 F8 -- ---00 ---00 ---00
2 F8 -- ---00 ---00 ---00
3 F8 -- ---00 ---00 ---00
4 F8 -- ---00 ---00 ---00
5 F8 -- ---00 ---00 ---00
6 F8 -- ---00 ---00 ---00
7 F8 -- ---00 ---00 ---00
8 F8 -- ---00 ---00 ---00
9 F8 -- ---00 ---00 ---00
A F8 -- ---00 ---00 ---00
B F8 -- ---00 ---00 ---00
C F8 -- ---00 ---00 ---00
D F8 -- ---00 ---00 ---00
E F8 -- ---00 ---00 ---00
F F8 -- ---00 ---00 ---00
`)
      })
    })

    describe('scale', () => {
      test('missing m8-file', () => {
        runM8(['song', 'scale', '--scale', '00'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'scale', defaultThemePath, '--scale', '00'], 'm8-file must be a Song file')
      })

      describe('--scale', () => {
        test('missing', () => {
          runM8(['song', 'scale', testingSongPath], "error: required option '-s, --scale <number>' not specified")
        })

        test('< 00', () => {
          runM8(['song', 'scale', testingSongPath, '--scale', '-1'], "option '-s, --scale <number>' must be between 00 and 0F")
        })

        test('> 0F', () => {
          runM8(['song', 'scale', testingSongPath, '--scale', '20'], "option '-s, --scale <number>' must be between 00 and 0F")
        })
      })

      test('with m8-file', () => {
        runM8(['song', 'scale', testingSongPath, '--scale', '00'], `SCALE 00

KEY   C

I  EN OFFSET
C  ON 00.00
C# ON 00.00
D  ON 00.00
D# ON 00.00
E  ON 00.00
F  ON 00.00
F# ON 00.00
G  ON 00.00
G# ON 00.00
A  ON 00.00
A# ON 00.00
B  ON 00.00

NAME  CHROMATIC-------
`)

        runM8(['song', 'scale', testingSongPath, '--scale', '0F'], `SCALE 0F

KEY   C

I  EN OFFSET
C  ON 00.00
C# ON 00.00
D  -- -- --
D# -- -- --
E  -- -- --
F  ON 00.00
F# ON 00.00
G  -- -- --
G# -- -- --
A  -- -- --
A# ON 00.00
B  -- -- --

NAME  IWATO-----------
`)
      })
    })

    describe('view', () => {
      test('missing m8-file', () => {
        runM8(['song', 'view'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['song', 'view', defaultThemePath], 'm8-file must be a Song file')
      })

      describe('with m8-file', () => {
        describe('with --starting-row', () => {
          test('with', () => {
            runM8(['song', 'view', testingSongPath, '--starting-row', '01'], `SONG

   1  2  3  4  5  6  7  8
01 -- -- -- -- -- -- -- --
02 -- -- -- -- -- -- -- --
03 -- -- -- -- -- -- -- --
04 -- -- -- -- -- -- -- --
05 -- -- -- -- -- -- -- --
06 -- -- -- -- -- -- -- --
07 -- -- -- -- -- -- -- --
08 -- -- -- -- -- -- -- --
09 -- -- -- -- -- -- -- --
0A -- -- -- -- -- -- -- --
0B -- -- -- -- -- -- -- --
0C -- -- -- -- -- -- -- --
0D -- -- -- -- -- -- -- --
0E -- -- -- -- -- -- -- --
0F -- -- -- -- -- -- -- --
10 -- -- -- -- -- -- -- --
`)
          })

          test('with but within last page', () => {
            runM8(['song', 'view', testingSongPath, '--starting-row', 'FF'], `SONG

   1  2  3  4  5  6  7  8
F0 -- -- -- -- -- -- -- --
F1 -- -- -- -- -- -- -- --
F2 -- -- -- -- -- -- -- --
F3 -- -- -- -- -- -- -- --
F4 -- -- -- -- -- -- -- --
F5 -- -- -- -- -- -- -- --
F6 -- -- -- -- -- -- -- --
F7 -- -- -- -- -- -- -- --
F8 -- -- -- -- -- -- -- --
F9 -- -- -- -- -- -- -- --
FA -- -- -- -- -- -- -- --
FB -- -- -- -- -- -- -- --
FC -- -- -- -- -- -- -- --
FD -- -- -- -- -- -- -- --
FE -- -- -- -- -- -- -- --
FF -- -- -- -- -- -- -- --
`)
          })
        })

        test('without --starting-row', () => {
          runM8(['song', 'view', testingSongPath], `SONG

   1  2  3  4  5  6  7  8
00 00 01 02 03 04 05 06 07
01 -- -- -- -- -- -- -- --
02 -- -- -- -- -- -- -- --
03 -- -- -- -- -- -- -- --
04 -- -- -- -- -- -- -- --
05 -- -- -- -- -- -- -- --
06 -- -- -- -- -- -- -- --
07 -- -- -- -- -- -- -- --
08 -- -- -- -- -- -- -- --
09 -- -- -- -- -- -- -- --
0A -- -- -- -- -- -- -- --
0B -- -- -- -- -- -- -- --
0C -- -- -- -- -- -- -- --
0D -- -- -- -- -- -- -- --
0E -- -- -- -- -- -- -- --
0F -- -- -- -- -- -- -- --
`)
        })
      })
    })
  })

  describe('theme', () => {
    test('empty args prints help', () => {
      testHelp(['theme'], themeHelp)
    })

    test('help', () => {
      testHelp(['theme', 'help'], themeHelp)
    })

    test('--help', () => {
      testHelp(['theme', '--help'], themeHelp)
    })

    describe('view', () => {
      test('missing m8-file', () => {
        runM8(['theme', 'view'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['theme', 'view', defaultFMSynthPath], 'm8-file must be a Theme file')
      })

      test('with m8-file', () => {
        runM8(['theme', 'view', defaultThemePath], `THEME SETTINGS

BACKGROUND   00 00 00 ■■■
TEXT:EMPTY   1E 1E 28 ■■■
TEXT:INFO    60 60 8E ■■■
TEXT:DEFAULT 8C 8C BA ■■■
TEXT:VALUE   FA FA FA ■■■
TEXT:TITLES  32 EC FF ■■■
PLAY MARKERS 00 FF 70 ■■■
CURSOR       32 EC FF ■■■
SELECTION    FF 00 D2 ■■■
SCOPE/SLIDER 32 EC FF ■■■
METER LOW    00 FF 50 ■■■
METER MID    FF E0 00 ■■■
METER PEAK   FF 30 70 ■■■
`)
      })
    })

    describe('version', () => {
      test('missing m8-file', () => {
        runM8(['theme', 'version'], "error: missing required argument 'm8-file'")
      })

      test('wrong m8-file', () => {
        runM8(['theme', 'version', defaultFMSynthPath], 'm8-file must be a Theme file')
      })

      test('with m8-file', () => {
        runM8(['theme', 'version', defaultThemePath], `M8 VERSION

1.0.2
`)
      })
    })
  })

  describe('shared options/validation', () => {
    describe('--starting-row', () => {
      test('< 00', () => {
        runM8(['song', 'view', testingSongPath, '--starting-row', '-1'], "option '-s, --starting-row <number>' must be between 00 and FF")
      })

      test('> FF', () => {
        runM8(['song', 'view', testingSongPath, '--starting-row', '100'], "option '-s, --starting-row <number>' must be between 00 and FF")
      })
    })

    describe('--theme', () => {
      test('wrong m8-file', () => {
        runM8(['song', 'view', defaultSongPath, '--theme', defaultSongPath], "option '-T, --theme <path>' must be to an M8 Theme file")
      })
    })
  })
})
