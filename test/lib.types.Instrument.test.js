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
const path = require('path')

const { FMSynth, Instrument, Macrosynth, MIDIOut, None, Sampler, Wavsynth } = require('../lib/types/Instrument')
const { VERSION_2_5_0, VERSION_2_6_0, VERSION_2_7_0, LATEST_M8_VERSION } = require('../lib/constants')
const Table = require('../lib/types/Table')
const M8FileReader = require('../lib/types/M8FileReader')
const M8Version = require('../lib/types/M8Version')

const instrFiles = {
  'DEF_FM.m8i': undefined,
  'DEF_MAC.m8i': undefined,
  'DEF_MID.m8i': undefined,
  'DEF_SAM.m8i': undefined,
  'DEF_WAV.m8i': undefined,
  'FM_W_TABLE.m8i': undefined
}

beforeEach(() => {
  Object.keys(instrFiles).forEach((name) => {
    const filePath = path.join(__dirname, `files/Instruments/${name}`)

    instrFiles[name] = Instrument.fromBytes(Array.from(readFileSync(filePath)))
  })
})

describe('Instrument tests', () => {
  describe('AmplifierParameters', () => {
    test('#limitToStr', () => {
      const emptyInstr = new None()

      ;['CLIP', 'SIN', 'FOLD', 'WRAP', 'POST', 'POST: AD'].forEach((str, i) => {
        emptyInstr.ampParams.limit = i

        expect(emptyInstr.ampParams.limitToStr()).toEqual(str)
      })
    })
  })

  describe('FMSynth', () => {
    test('constructor', () => {
      const emptyInstr = new FMSynth()
      const instrParams = emptyInstr.instrParams

      expect(emptyInstr.kind).toEqual(0x04)
      expect(emptyInstr.kindToStr()).toEqual('FMSYNTH')

      expect(instrParams.algo).toEqual(0x00)
      expect(instrParams.mod1).toEqual(0x00)
      expect(instrParams.mod2).toEqual(0x00)
      expect(instrParams.mod3).toEqual(0x00)
      expect(instrParams.mod4).toEqual(0x00)
      expect(instrParams.operators.length).toEqual(4)

      instrParams.operators.forEach((operator) => {
        expect(operator.feedback).toEqual(0x00)
        expect(operator.level).toEqual(0x80)
        expect(operator.modA).toEqual(0x00)
        expect(operator.modB).toEqual(0x00)
        expect(operator.ratio).toEqual(0x01)
        expect(operator.ratioFine).toEqual(0x00)
        expect(operator.shape).toEqual(0x00)
        expect(operator.shapeToStr()).toEqual('SIN')
      })
    })

    test('#destToStr', () => {
      const emptyInstr = new FMSynth()

      ;[
        'OFF',
        'VOLUME',
        'PITCH',
        'MOD 1',
        'MOD 2',
        'MOD 3',
        'MOD 4',
        'CUTOFF',
        'RES',
        'AMP',
        'PAN',
        'UNKNOWN (0B)'
      ].forEach((str, i) => {
        expect(emptyInstr.destToStr(i)).toEqual(str)
      })
    })
  })

  describe('FMSynthParameters', () => {
    test('#algoToStr', () => {
      const emptyInstr = new FMSynth()

      ;[
        'A>B>C>D',
        '[A+B]>C>D',
        '[A>B+C]>D',
        '[A>B+A>C]>D',
        '[A+B+C]>D',
        '[A>B>C]+D',
        '[A>B>C]+[A>B>D]',
        '[A>B]+[C>D]',
        '[A>B]+[A>C]+[A>D]',
        '[A>B]+[A>C]+D',
        '[A>B]+C+D',
        'A+B+C+D',
        'UNKNOWN (0C)'
      ].forEach((str, i) => {
        emptyInstr.instrParams.algo = i

        expect(emptyInstr.instrParams.algoToStr()).toEqual(str)
      })
    })

    test('#modToStr', () => {
      const emptyInstr = new FMSynth()

      ;[
        '-----',
        '1>LEV',
        '2>LEV',
        '3>LEV',
        '4>LEV',
        '1>RAT',
        '2>RAT',
        '3>RAT',
        '4>RAT',
        '1>PIT',
        '2>PIT',
        '3>PIT',
        '4>PIT',
        '1>FBK',
        '2>FBK',
        '3>FBK',
        '4>FBK'
      ].forEach((str, i) => {
        emptyInstr.instrParams.operators[0].modA = i

        expect(emptyInstr.instrParams.modToStr(emptyInstr.instrParams.operators[0].modA)).toEqual(str)
      })
    })

    describe('2.7.x', () => {
      test('#shapeToStr', () => {
        const emptyInstr = new FMSynth()
        const expectedShapeStrs = ['NLP', 'NHP', 'NBP', 'CLK']

        expect([0x0C, 0x0D, 0x0E, 0x0F].reduce((actualShapeStrs, index) => {
          const operator = emptyInstr.instrParams.operators[0]

          operator.shape = index

          return actualShapeStrs.concat(operator.shapeToStr())
        }, [])).toEqual(expectedShapeStrs)
      })
    })

    describe('< 2.7.0', () => {
      test("#shapeToStr (should return 'UNK')", () => {
        const emptyInstr = new FMSynth()

        ;[0x0C, 0x0D, 0x0E, 0x0F].forEach((index) => {
          const operator = emptyInstr.instrParams.operators[0]

          operator.shape = index

          expect(operator.shapeToStr(VERSION_2_6_0)).toEqual('UNK')
        })
      })
    })
  })

  describe('LFOParameters', () => {
    test('#shapeToStr', () => {
      const emptyInstr = new None()

      ;[
        'TRI',
        'SIN',
        'RAMP DN',
        'RAMP UP',
        'EXP DN',
        'EXP UP',
        'SQU DN',
        'SQU UP',
        'RANDOM',
        'DRUNK',
        'TRI T',
        'SIN T',
        'RAMPD T',
        'RAMPU T',
        'EXPD T',
        'EXPU T',
        'SQ. D T',
        'SQ. U T',
        'RAND T',
        'DRNK T',
        'UNKNOWN (14)'
      ].forEach((str, i) => {
        emptyInstr.lfo[0].shape = i

        expect(emptyInstr.lfo[0].shapeToStr()).toEqual(str)
      })
    })

    test('#triggerModeToStr', () => {
      const emptyInstr = new None()

      ;[
        'FREE',
        'RETRIG',
        'HOLD',
        'ONCE',
        'UNKNOWN (04)'
      ].forEach((str, i) => {
        emptyInstr.lfo[0].triggerMode = i

        expect(emptyInstr.lfo[0].triggerModeToStr()).toEqual(str)
      })
    })
  })

  describe('Macrosynth', () => {
    test('constructor', () => {
      const emptyInstr = new Macrosynth()
      const instrParams = emptyInstr.instrParams

      expect(emptyInstr.kind).toEqual(0x01)
      expect(emptyInstr.kindToStr()).toEqual('MACROSYN')

      expect(instrParams.color).toEqual(0x80)
      expect(instrParams.degrade).toEqual(0x00)
      expect(instrParams.redux).toEqual(0x00)
      expect(instrParams.shape).toEqual(0x00)
      expect(instrParams.timbre).toEqual(0x80)
    })

    test('#destToStr', () => {
      const emptyInstr = new Macrosynth()

      ;[
        'OFF',
        'VOLUME',
        'PITCH',
        'TIMBRE',
        'COLOR',
        'DEGRADE',
        'REDUX',
        'CUTOFF',
        'RES',
        'AMP',
        'PAN',
        'UNKNOWN (0B)'
      ].forEach((str, i) => {
        expect(emptyInstr.destToStr(i)).toEqual(str)
      })
    })

    describe('2.7.x', () => {
      test('#shapeToStr', () => {
        const emptyInstr = new Macrosynth()
        const instrParams = emptyInstr.instrParams
        const expectedShapeStrs = ['FLUTED', 'DIGITAL MOD', 'MORSE NOISE']

        expect([0x1F, 0x2E, 0x2F].reduce((actualShapeStrs, index) => {
          instrParams.shape = index

          return actualShapeStrs.concat(instrParams.shapeToStr())
        }, [])).toEqual(expectedShapeStrs)
      })
    })

    describe('< 2.6.0', () => {
      test("#shapeToStr (should return 'UNKNOWN (hex)'", () => {
        const emptyInstr = new Macrosynth()
        const instrParams = emptyInstr.instrParams
        const expectedShapeStrs = ['STRUCK BELL', 'UNKNOWN (2E)', 'UNKNOWN (2F)']

        expect([0x1F, 0x2E, 0x2F].reduce((actualShapeStrs, index) => {
          instrParams.shape = index

          return actualShapeStrs.concat(instrParams.shapeToStr(VERSION_2_5_0))
        }, [])).toEqual(expectedShapeStrs)
      })
    })
  })

  describe('MIDIOut', () => {
    test('constructor', () => {
      const emptyInstr = new MIDIOut()
      const instrParams = emptyInstr.instrParams

      expect(emptyInstr.kind).toEqual(0x03)
      expect(emptyInstr.kindToStr()).toEqual('MIDI OUT')

      expect(instrParams.bankSelect).toEqual(0xFF)
      expect(instrParams.channel).toEqual(0x01)
      expect(instrParams.port).toEqual(0x00)
      expect(instrParams.programChange).toEqual(0xFF)
      expect(instrParams.portToStr()).toEqual('MIDI+USB')

      expect(instrParams.customCC.length).toEqual(10)

      instrParams.customCC.forEach((cc) => {
        expect(cc.defaultValue).toEqual(0xFF)
        expect(cc.number).toEqual(0xFF)
      })
    })

    test('#destToStr', () => {
      const emptyInstr = new MIDIOut()

      ;[
        'UNKNOWN (00)'
      ].forEach((str, i) => {
        expect(emptyInstr.destToStr(i)).toEqual(str)
      })
    })

    describe('2.7.x', () => {
      test('#portToStr', () => {
        const emptyInstr = new MIDIOut()
        const instrParams = emptyInstr.instrParams

        instrParams.port = 0x03

        expect(instrParams.portToStr()).toEqual('INTERNAL')
      })
    })

    describe('< 2.7.0', () => {
      test("#portToStr (should return 'UNKNOWN (hex)'", () => {
        const emptyInstr = new MIDIOut()
        const instrParams = emptyInstr.instrParams

        instrParams.port = 0x03

        expect(instrParams.portToStr(VERSION_2_6_0)).toEqual('UNKNOWN (03)')
      })
    })
  })

  describe('None', () => {
    test('constructor', () => {
      const emptyInstr = new None()

      expect(emptyInstr.kind).toEqual(0xFF)
      expect(emptyInstr.kindToStr()).toEqual('NONE')
      expect(emptyInstr.instrParams).toEqual(undefined)

      expect(emptyInstr.ampParams.amp).toEqual(0xFF)
      expect(emptyInstr.ampParams.limit).toEqual(0xFF)
      expect(emptyInstr.ampParams.limitToStr()).toEqual('UNKNOWN (FF)')

      expect(emptyInstr.env.length).toEqual(2)

      emptyInstr.env.forEach((env) => {
        expect(env.amount).toEqual(0xFF)
        expect(env.attack).toEqual(0xFF)
        expect(env.decay).toEqual(0xFF)
        expect(env.dest).toEqual(0xFF)
        expect(env.hold).toEqual(0xFF)
        expect(env.retrigger).toEqual(0xFF)
      })

      expect(emptyInstr.filterParams.cutoff).toEqual(0xFF)
      expect(emptyInstr.filterParams.res).toEqual(0xFF)
      expect(emptyInstr.filterParams.type).toEqual(0xFF)
      expect(emptyInstr.filterTypeToStr()).toEqual('UNKNOWN (FF)')

      expect(emptyInstr.fineTune).toEqual(0xFF)

      expect(emptyInstr.mixerParams.cho).toEqual(0xFF)
      expect(emptyInstr.mixerParams.del).toEqual(0xFF)
      expect(emptyInstr.mixerParams.dry).toEqual(0xFF)
      expect(emptyInstr.mixerParams.pan).toEqual(0xFF)
      expect(emptyInstr.mixerParams.rev).toEqual(0xFF)

      expect(emptyInstr.name).toEqual('')
      expect(emptyInstr.pitch).toEqual(0xFF)
      expect(emptyInstr.tableData).toEqual(new Table())
      expect(emptyInstr.tableTick).toEqual(0x01)
      expect(emptyInstr.m8FileVersion).toEqual(LATEST_M8_VERSION)
      expect(emptyInstr.volume).toEqual(0xFF)

      expect(emptyInstr.lfo.length).toEqual(2)

      emptyInstr.lfo.forEach((lfo) => {
        expect(lfo.amount).toEqual(0xFF)
        expect(lfo.dest).toEqual(0xFF)
        expect(lfo.freq).toEqual(0xFF)
        expect(lfo.retrigger).toEqual(0xFF)
        expect(lfo.shape).toEqual(0xFF)
        expect(lfo.triggerMode).toEqual(0xFF)
        expect(lfo.shapeToStr()).toEqual('UNKNOWN (FF)')
        expect(lfo.triggerModeToStr()).toEqual('UNKNOWN (FF)')
      })
    })

    test('#destToStr', () => {
      const emptyInstr = new MIDIOut()

      ;[
        'UNKNOWN (00)'
      ].forEach((str, i) => {
        expect(emptyInstr.destToStr(i)).toEqual(str)
      })
    })

    test("#filterTypeToStr (should return 'UNKNOWN (hex)'", () => {
      const emptyInstr = new None()

      emptyInstr.filterParams.type = 0x06

      expect(emptyInstr.filterTypeToStr()).toEqual('UNKNOWN (06)')
    })

    describe('< 1.4.0', () => {
      test('constructor (should have only 1 LFO)', () => {
        const emptyInstr = new None(new M8Version(1, 3, 9))

        expect(emptyInstr.lfo.length).toEqual(1)
      })
    })
  })

  describe('Sampler', () => {
    test('constructor', () => {
      const emptyInstr = new Sampler()
      const instrParams = emptyInstr.instrParams

      expect(emptyInstr.kind).toEqual(0x02)
      expect(emptyInstr.kindToStr()).toEqual('SAMPLER')

      expect(instrParams.degrade).toEqual(0x00)
      expect(instrParams.length).toEqual(0xFF)
      expect(instrParams.loopStart).toEqual(0x00)
      expect(instrParams.playMode).toEqual(0x00)
      expect(instrParams.samplePath).toEqual('')
      expect(instrParams.slice).toEqual(0x00)
      expect(instrParams.start).toEqual(0x00)
      expect(instrParams.playModeToStr()).toEqual('FWD')
    })
  })

  describe('SamplerParameters', () => {
    test('#playModeToStr', () => {
      const emptyInstr = new Sampler()

      ;[
        'FWD',
        'REV',
        'FWDLOOP',
        'REVLOOP',
        'FWD PP',
        'REV PP',
        'OSC',
        'OSC REV',
        'OSC PP',
        'UNKNOWN (09)'
      ].forEach((str, i) => {
        emptyInstr.instrParams.playMode = i

        expect(emptyInstr.instrParams.playModeToStr()).toEqual(str)
      })
    })

    test('#samplePathToStr', () => {
      const emptyInstr = new Sampler()

      emptyInstr.instrParams.samplePath = __filename

      expect(emptyInstr.instrParams.samplePathToStr()).toEqual('LIB.TYPE_NT.TEST')
    })
  })

  describe('Wavsynth', () => {
    test('constructor', () => {
      const emptyInstr = new Wavsynth()
      const instrParams = emptyInstr.instrParams

      expect(emptyInstr.kind).toEqual(0x00)
      expect(emptyInstr.kindToStr()).toEqual('WAVSYNTH')

      expect(instrParams.mirror).toEqual(0x00)
      expect(instrParams.mult).toEqual(0x00)
      expect(instrParams.shape).toEqual(0x00)
      expect(instrParams.size).toEqual(0x20)
      expect(instrParams.warp).toEqual(0x00)
      expect(instrParams.shapeToStr()).toEqual('PULSE 12%')
    })

    test('#destToStr', () => {
      const emptyInstr = new Wavsynth()

      ;[
        'OFF',
        'VOLUME',
        'PITCH',
        'SIZE',
        'MULT',
        'WARP',
        'MIRROR',
        'CUTOFF',
        'RES',
        'AMP',
        'PAN',
        'UNKNOWN (0B)'
      ].forEach((str, i) => {
        expect(emptyInstr.destToStr(i)).toEqual(str)
      })
    })

    describe('2.7.x', () => {
      test('#filterTypeToStr', () => {
        const emptyInstr = new Wavsynth()

        emptyInstr.filterParams.type = 0x05

        expect(emptyInstr.filterTypeToStr()).toEqual('LP>HP')

        emptyInstr.filterParams.type = 0x09

        expect(emptyInstr.filterTypeToStr()).toEqual('WAV BS')
      })
    })

    describe('< 2.5.1', () => {
      test('#filterTypeToStr', () => {
        const emptyInstr = new Wavsynth(VERSION_2_5_0)

        emptyInstr.filterParams.type = 0x05

        expect(emptyInstr.filterTypeToStr()).toEqual('WAV LP')

        emptyInstr.filterParams.type = 0x09

        expect(emptyInstr.filterTypeToStr()).toEqual('UNKNOWN (09)')
      })
    })
  })

  describe('WavsynthParameters', () => {
    test('#shapeToStr', () => {
      const emptyInstr = new Wavsynth()

      ;[
        'PULSE 12%',
        'PULSE 25%',
        'PULSE 50%',
        'PULSE 75%',
        'SAW',
        'TRIANGLE',
        'SINE',
        'NOISE PITCHED',
        'NOISE',
        'OVERFLOW'
      ].forEach((str, i) => {
        emptyInstr.instrParams.shape = i

        expect(emptyInstr.instrParams.shapeToStr()).toEqual(str)
      })
    })
  })

  test('#destToStr', () => {
    const emptyInstr = new Sampler()

    ;[
      'OFF',
      'VOLUME',
      'PITCH',
      'LOOP ST',
      'LENGTH',
      'DEGRADE',
      'CUTOFF',
      'RES',
      'AMP',
      'PAN',
      'UNKNOWN (0A)'
    ].forEach((str, i) => {
      expect(emptyInstr.destToStr(i)).toEqual(str)
    })
  })

  describe('#fromBytes', () => {
    describe('< 1.4.0', () => {
      test('DEF_FM.m8i', () => {
        const expectedInstr = new FMSynth(VERSION_2_7_0)

        expectedInstr.name = 'DEF_FM'

        expect(instrFiles['DEF_FM.m8i']).toEqual(expectedInstr)
      })

      test('DEF_MAC.m8i', () => {
        const expectedInstr = new Macrosynth(VERSION_2_7_0)

        expectedInstr.name = 'DEF_MAC'

        expect(instrFiles['DEF_MAC.m8i']).toEqual(expectedInstr)
      })

      test('DEF_MID.m8i', () => {
        const expectedInstr = new MIDIOut(VERSION_2_7_0)

        expectedInstr.name = 'DEF_MID'

        expect(instrFiles['DEF_MID.m8i']).toEqual(expectedInstr)
      })

      test('DEF_SAM.m8i', () => {
        const expectedInstr = new Sampler(VERSION_2_7_0)

        expectedInstr.name = 'DEF_SAM'

        expect(instrFiles['DEF_SAM.m8i']).toEqual(expectedInstr)
      })

      test('DEF_WAV.m8i', () => {
        const expectedInstr = new Wavsynth(VERSION_2_7_0)

        expectedInstr.name = 'DEF_WAV'

        expect(instrFiles['DEF_WAV.m8i']).toEqual(expectedInstr)
      })

      test('FM_W_TABLE.m8i', () => {
        // All we really care about validating here is that the table data is loaded

        instrFiles['FM_W_TABLE.m8i'].tableData.steps.forEach((step) => {
          expect(step.transpose).toEqual(0xF8)
        })
      })

      test('invalid instrument type', () => {
        const filePath = path.join(__dirname, 'files/Instruments/DEF_FM.m8i')
        const instrBytes = Array.from(readFileSync(filePath))

        // The first byte after the M8 header is the instrument type
        instrBytes[14] = 0xFE

        expect(() => {
          Instrument.fromBytes(instrBytes)
        }).toThrow('Unsupported Instrument type: FE')
      })
    })

    test('#getBytes', () => {
      Object.keys(instrFiles).forEach((fileName) => {
        const filePath = path.join(__dirname, `files/Instruments/${fileName}`)
        const bytesFromDisk = Array.from(readFileSync(filePath))
        const instrFromDisk = Instrument.fromBytes(bytesFromDisk)

        // Since this instrument was read from disk, we should be able to ensure the generated bytes are identical
        expect(bytesFromDisk).toEqual(instrFromDisk.getBytes())

        let alteredInstr = Instrument.fromBytes(instrFromDisk.getBytes())

        expect(alteredInstr).toEqual(instrFiles[fileName])

        alteredInstr.name = 'TESTING'

        switch (fileName) {
          case 'DEF_FM.m8i':
            alteredInstr.instrParams.algo = 0x05
            break

          case 'DEF_MAC.m8i':
            alteredInstr.instrParams.shape = 0x05
            break

          case 'DEF_MID.m8i':
            alteredInstr.instrParams.port = 0x05
            break

          case 'DEF_SAM.m8i':
            alteredInstr.instrParams.playMode = 0x05
            break

          case 'DEF_WAV.m8i':
            alteredInstr.instrParams.shape = 0x05
            break

          case 'FM_W_TABLE.m8i':
            alteredInstr.tableData.steps[5].transpose = 0x05
            break
        }

        // Dump altered instrument (with latest version number due to not providing one)
        alteredInstr = Instrument.fromBytes(alteredInstr.getBytes())

        expect(alteredInstr.name).toEqual('TESTING')

        switch (fileName) {
          case 'DEF_FM.m8i':
            expect(alteredInstr.instrParams.algo).toEqual(0x05)
            break

          case 'DEF_MAC.m8i':
            expect(alteredInstr.instrParams.shape).toEqual(0x05)
            break

          case 'DEF_MID.m8i':
            expect(alteredInstr.instrParams.port).toEqual(0x05)
            break

          case 'DEF_SAM.m8i':
            expect(alteredInstr.instrParams.playMode).toEqual(0x05)
            break

          case 'DEF_WAV.m8i':
            expect(alteredInstr.instrParams.shape).toEqual(0x05)
            break

          case 'FM_W_TABLE.m8i':
            expect(alteredInstr.tableData.steps[5].transpose).toEqual(0x05)
            break
        }
      })
    })

    describe('< 1.4.0', () => {
      test('FMSynth operator shapes should be default', () => {
        const filePath = path.join(__dirname, 'files/Instruments/FM_W_TABLE.m8i')
        const fileReader = new M8FileReader(Array.from(readFileSync(filePath)))

        fileReader.m8Version = new M8Version(1, 3, 9)

        const instr = Instrument.fromFileReader(fileReader)

        instr.instrParams.operators.forEach((operator) => {
          expect(operator.shape).toEqual(0x00)
        })
      })
    })
  })
})
