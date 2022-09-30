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
const { VERSION_2_7_0, LATEST_M8_VERSION } = require('../lib/constants')
const { FMSynth, Macrosynth, MIDIOut, Sampler, Wavsynth } = require('../lib/types/Instrument')

const M8 = require('..')
const M8FileReader = require('../lib/types/M8FileReader')
const Scale = require('../lib/types/Scale')
const Song = require('../lib/types/Song')
const Theme = require('../lib/types/Theme')
const M8Version = require('../lib/types/M8Version')

const m8Files = {
  '1.0.x': {
    themes: {
      'DEFAULT.m8t': undefined
    }
  },
  '2.5.x': {
    scales: {
      'TESTING.m8n': undefined
    }
  },
  '2.7.x': {
    instruments: {
      'DEF_FM.m8i': undefined,
      'DEF_MAC.m8i': undefined,
      'DEF_MID.m8i': undefined,
      'DEF_SAM.m8i': undefined,
      'DEF_WAV.m8i': undefined,
      'FM_W_TABLE.m8i': undefined
    },
    songs: {
      'DEFAULT.m8s': undefined
    }
  }
}

beforeAll(() => {
  Object.keys(m8Files).forEach((version) => {
    Object.keys(m8Files[version]).forEach((key) => {
      const m8FileType = key[0].toUpperCase() + key.substring(1)

      Object.keys(m8Files[version][key]).forEach((fileName) => {
        const filePath = path.join(__dirname, `files/${version}/${m8FileType}/${fileName}`)
        const buffer = readFileSync(filePath)
        const fileReader = new M8FileReader(buffer)

        m8Files[version][key][fileName] = M8.loadM8File(fileReader)
      })
    })
  })
})

describe('index tests', () => {
  test('#dumpScale', () => {
    const filePath = path.join(__dirname, 'files/2.5.x/Scales/TESTING.m8n')
    const bufferFromDisk = readFileSync(filePath)
    const diskFileReader = new M8FileReader(bufferFromDisk)
    const scaleFromDisk = M8.loadScale(diskFileReader)

    // Ensure the raw bytes read from disk match the dumped bytes
    expect(bufferFromDisk).toEqual(M8.dumpScale(scaleFromDisk, diskFileReader.m8Version))

    let bytesFileReader = new M8FileReader(Buffer.from(M8.dumpScale(scaleFromDisk)))
    let alteredScale = M8.loadScale(bytesFileReader)

    // Change the theme
    alteredScale.name = 'MY SCALE'

    for (let i = 0; i < alteredScale.intervals.length; i++) {
      const interval = alteredScale.intervals[i]

      if (i % 2 === 0) {
        interval.enabled = false
        interval.offsetA = 0x00
        interval.offsetB = 0x00
      } else {
        interval.enabled = true
        interval.offsetA = 0x01
        interval.offsetB = 0x01
      }
    }

    // Dump altered theme (with latest version number due to not providing one)
    bytesFileReader = new M8FileReader(M8.dumpScale(alteredScale))
    alteredScale = M8.loadScale(bytesFileReader)

    // Ensure the files are the same
    expect(alteredScale.name).toEqual('MY SCALE')

    for (let i = 0; i < alteredScale.intervals.length; i++) {
      const interval = alteredScale.intervals[i]

      if (i % 2 === 0) {
        expect(interval.enabled).toEqual(false)
        expect(interval.offsetA).toEqual(0x00)
        expect(interval.offsetB).toEqual(0x00)
      } else {
        expect(interval.enabled).toEqual(true)
        expect(interval.offsetA).toEqual(0x01)
        expect(interval.offsetB).toEqual(0x01)
      }
    }
  })

  test('#dumpTheme', () => {
    const filePath = path.join(__dirname, 'files/1.0.x/Themes/DEFAULT.m8t')
    const bufferFromDisk = readFileSync(filePath)
    const diskFileReader = new M8FileReader(bufferFromDisk)
    const themeFromDisk = M8.loadTheme(diskFileReader)

    // Ensure the raw bytes read from disk match the dumped bytes
    expect(bufferFromDisk).toEqual(M8.dumpTheme(themeFromDisk, diskFileReader.m8Version))

    let bytesFileReader = new M8FileReader(Buffer.from(M8.dumpTheme(themeFromDisk)))
    let alteredTheme = M8.loadTheme(bytesFileReader)

    // Change the theme
    alteredTheme.selection = [0x0F, 0x1F, 0x2F]

    // Dump altered theme (with latest version number due to not providing one)
    bytesFileReader = new M8FileReader(M8.dumpTheme(alteredTheme))
    alteredTheme = M8.loadTheme(bytesFileReader)

    // Ensure the files are the same
    expect(alteredTheme.background).toEqual(themeFromDisk.background)
    expect(alteredTheme.textEmpty).toEqual(themeFromDisk.textEmpty)
    expect(alteredTheme.textInfo).toEqual(themeFromDisk.textInfo)
    expect(alteredTheme.textDefault).toEqual(themeFromDisk.textDefault)
    expect(alteredTheme.textValue).toEqual(themeFromDisk.textValue)
    expect(alteredTheme.textTitle).toEqual(themeFromDisk.textTitle)
    expect(alteredTheme.playMarker).toEqual(themeFromDisk.playMarker)
    expect(alteredTheme.cursor).toEqual(themeFromDisk.cursor)
    expect(alteredTheme.selection).toEqual([0x0F, 0x1F, 0x2F])
    expect(alteredTheme.scopeSlider).toEqual(themeFromDisk.scopeSlider)
    expect(alteredTheme.meterLow).toEqual(themeFromDisk.meterLow)
    expect(alteredTheme.meterMid).toEqual(themeFromDisk.meterMid)
    expect(alteredTheme.meterPeak).toEqual(themeFromDisk.meterPeak)
    expect(bytesFileReader.m8Version).toEqual(LATEST_M8_VERSION)
  })

  describe('#loadInstrument', () => {
    describe('2.7.x', () => {
      test('DEF_FM.m8i', () => {
        const expectedInstr = new FMSynth(VERSION_2_7_0)

        expectedInstr.name = 'DEF_FM'

        expect(m8Files['2.7.x'].instruments['DEF_FM.m8i']).toEqual(expectedInstr)
      })

      test('DEF_MAC.m8i', () => {
        const expectedInstr = new Macrosynth(VERSION_2_7_0)

        expectedInstr.name = 'DEF_MAC'

        expect(m8Files['2.7.x'].instruments['DEF_MAC.m8i']).toEqual(expectedInstr)
      })

      test('DEF_MID.m8i', () => {
        const expectedInstr = new MIDIOut(VERSION_2_7_0)

        expectedInstr.name = 'DEF_MID'

        expect(m8Files['2.7.x'].instruments['DEF_MID.m8i']).toEqual(expectedInstr)
      })

      test('DEF_SAM.m8i', () => {
        const expectedInstr = new Sampler(VERSION_2_7_0)

        expectedInstr.name = 'DEF_SAM'

        expect(m8Files['2.7.x'].instruments['DEF_SAM.m8i']).toEqual(expectedInstr)
      })

      test('DEF_WAV.m8i', () => {
        const expectedInstr = new Wavsynth(VERSION_2_7_0)

        expectedInstr.name = 'DEF_WAV'

        expect(m8Files['2.7.x'].instruments['DEF_WAV.m8i']).toEqual(expectedInstr)
      })

      test('FM_W_TABLE.m8i', () => {
        // All we really care about validating here is that the table data is loaded

        m8Files['2.7.x'].instruments['FM_W_TABLE.m8i'].tableData.steps.forEach((step) => {
          expect(step.transpose).toEqual(0xF8)
        })
      })

      test('invalid instrument type', () => {
        const filePath = path.join(__dirname, 'files/2.7.x/Instruments/DEF_FM.m8i')
        const buffer = readFileSync(filePath)
        const fileReader = new M8FileReader(buffer)

        fileReader.buffer[fileReader.cursor] = 0xFE

        expect(() => {
          M8.loadInstrument(fileReader)
        }).toThrow('Unsupported Instrument type: FE')
      })
    })

    describe('< 1.4.0', () => {
      test('FMSynth operator shapes should be default', () => {
        const filePath = path.join(__dirname, 'files/2.7.x/Instruments/FM_W_TABLE.m8i')
        const buffer = readFileSync(filePath)
        const fileReader = new M8FileReader(buffer)

        fileReader.m8Version = new M8Version(1, 3, 9)

        const instr = M8.loadInstrument(fileReader)

        instr.instrParams.operators.forEach((operator) => {
          expect(operator.shape).toEqual(0x00)
        })
      })
    })
  })

  describe('#loadM8File', () => {
    test('invalid file type', () => {
      const filePath = path.join(__dirname, 'files/2.7.x/Songs/Default.m8s')
      const buffer = readFileSync(filePath)

      buffer[13] = -1

      const fileReader = new M8FileReader(buffer)

      expect(() => {
        M8.loadM8File(fileReader)
      }).toThrow('Unsupported file type: Unknown (FF)')
    })
  })

  describe('#loadScale', () => {
    describe('2.5.x', () => {
      test('TESTING.m8n', () => {
        const expectedScale = new Scale()
        const expectedOffsetStrs = [
          '-24.00',
          '00.00',
          '01.02',
          '00.00',
          '03.04',
          '00.00',
          '05.06',
          '-04.03',
          '00.00',
          '-02.01',
          '00.00',
          '24.00'
        ]

        expectedScale.name = 'TESTING'

        expectedScale.intervals[0].enabled = true
        expectedScale.intervals[0].offsetA = 0xA0
        expectedScale.intervals[0].offsetB = 0xF6

        expectedScale.intervals[1].enabled = false
        expectedScale.intervals[1].offsetA = 0x00
        expectedScale.intervals[1].offsetB = 0x00

        expectedScale.intervals[2].enabled = true
        expectedScale.intervals[2].offsetA = 0x66
        expectedScale.intervals[2].offsetB = 0x00

        expectedScale.intervals[3].enabled = false
        expectedScale.intervals[3].offsetA = 0x00
        expectedScale.intervals[3].offsetB = 0x00

        expectedScale.intervals[4].enabled = true
        expectedScale.intervals[4].offsetA = 0x30
        expectedScale.intervals[4].offsetB = 0x01

        expectedScale.intervals[5].enabled = false
        expectedScale.intervals[5].offsetA = 0x00
        expectedScale.intervals[5].offsetB = 0x00

        expectedScale.intervals[6].enabled = true
        expectedScale.intervals[6].offsetA = 0xFA
        expectedScale.intervals[6].offsetB = 0x01

        expectedScale.intervals[7].enabled = true
        expectedScale.intervals[7].offsetA = 0x6D
        expectedScale.intervals[7].offsetB = 0xFE

        expectedScale.intervals[8].enabled = false
        expectedScale.intervals[8].offsetA = 0x00
        expectedScale.intervals[8].offsetB = 0x00

        expectedScale.intervals[9].enabled = true
        expectedScale.intervals[9].offsetA = 0x37
        expectedScale.intervals[9].offsetB = 0xFF

        expectedScale.intervals[10].enabled = false
        expectedScale.intervals[10].offsetA = 0x00
        expectedScale.intervals[10].offsetB = 0x00

        expectedScale.intervals[11].enabled = true
        expectedScale.intervals[11].offsetA = 0x60
        expectedScale.intervals[11].offsetB = 0x09

        expect(m8Files['2.5.x'].scales['TESTING.m8n']).toEqual(expectedScale)
        expect(m8Files['2.5.x'].scales['TESTING.m8n'].intervals.reduce((actualOffsetStrs, interval) => {
          return actualOffsetStrs.concat(interval.offsetToStr())
        }, [])).toEqual(expectedOffsetStrs)
      })
    })
  })

  describe('#loadSong', () => {
    describe('2.7.x', () => {
      test('DEFAULT.m8s', () => {
        const expectedSong = new Song(VERSION_2_7_0)

        expectedSong.directory = '/Songs/'
        expectedSong.name = 'DEFAULT'

        expect(m8Files['2.7.x'].songs['DEFAULT.m8s']).toEqual(expectedSong)
      })
    })
  })

  describe('#loadTheme', () => {
    describe('1.0.x', () => {
      test('DEFAULT.m8t', () => {
        const defaultTheme = new Theme()

        expect(m8Files['1.0.x'].themes['DEFAULT.m8t']).toEqual(defaultTheme)
      })
    })
  })
})
