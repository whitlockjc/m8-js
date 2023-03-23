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
const { alterScale } = require('./helpers')
const path = require('path')

const { LATEST_M8_VERSION } = require('../lib/constants')
const { Scale } = require('../lib/types/Scale')
const { Theme } = require('../lib/types/Theme')
const Chain = require('../lib/types/internal/Chain')
const ChainStep = require('../lib/types/internal/ChainStep')
const FMSynth = require('../lib/types/instruments/FMSynth')
const FX = require('../lib/types/internal/FX')
const Groove = require('../lib/types/internal/Groove')
const M8 = require('..')
const M8File = require('../lib/types/internal/M8File')
const M8Version = require('../lib/types/internal/M8Version')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const MIDIMapping = require('../lib/types/internal/MIDIMapping')
const MIDIOut = require('../lib/types/instruments/MIDIOut')
const MIDISettings = require('../lib/types/internal/MIDISettings')
const MixerSettings = require('../lib/types/internal/MixerSettings')
const None = require('../lib/types/instruments/None')
const Phrase = require('../lib/types/internal/Phrase')
const PhraseStep = require('../lib/types/internal/PhraseStep')
const RGB = require('../lib/types/internal/RGB')
const Sampler = require('../lib/types/instruments/Sampler')
const SongStep = require('../lib/types/internal/SongStep')
const Table = require('../lib/types/internal/Table')
const TableStep = require('../lib/types/internal/TableStep')
const Wavsynth = require('../lib/types/instruments/Wavsynth')

describe('index tests', () => {
  describe('#dumpM8File', () => {
    test('invalid file type', () => {
      expect(() => {
        M8.dumpM8File(new M8File(0xFF, LATEST_M8_VERSION))
      }).toThrow('Unsupported file type: Unknown (FF)')
    })
  })

  describe('#loadM8File', () => {
    test('invalid file type', () => {
      const filePath = path.join(__dirname, 'files/Songs/Default.m8s')
      const bytes = Uint8Array.from(readFileSync(filePath))

      bytes[13] = 0xFF

      expect(() => {
        M8.loadM8File(bytes)
      }).toThrow('Unsupported file type: Unknown (FF)')
    })
  })

  describe('#loadM8File and #dumpM8File', () => {
    describe('Instrument', () => {
      test('defaults', () => {
        ;[
          FMSynth,
          Macrosynth,
          MIDIOut,
          None,
          Sampler,
          Wavsynth
        ].forEach((ctor) => {
          // eslint-disable-next-line new-cap
          const instr = new ctor()

          instr.name = instr.constructor.name.toUpperCase()

          expect(M8.loadM8File(M8.dumpM8File(instr))).toEqual(instr)
        })
      })

      test('tables', () => {
        const instrPath = path.join(__dirname, 'files/Instruments/FM_W_TABLE.m8i')
        const bytesFromDisk = Uint8Array.from(readFileSync(instrPath))
        const instrWithTable = M8.loadM8File(bytesFromDisk)

        instrWithTable.table.steps.forEach((step) => {
          expect(step.transpose).toEqual(0xF8)
        })

        // Modify the table
        instrWithTable.table.steps.forEach((step, i) => {
          step.transpose = i
          step.volume = i

          step.fx.forEach((fx, j) => {
            fx.command = j
            fx.value = j
          })
        })

        expect(M8.loadM8File(M8.dumpM8File(instrWithTable))).toEqual(instrWithTable)
      })
    })

    test('Scale', () => {
      const filePath = path.join(__dirname, 'files/Scales/TESTING.m8n')
      const bytesFromDisk = Uint8Array.from(readFileSync(filePath))
      const scaleFromDisk = M8.loadM8File(bytesFromDisk)

      // Ensure the raw bytes read from disk match the dumped bytes
      expect(bytesFromDisk).toEqual(M8.dumpM8File(scaleFromDisk))

      // Validate the content of TESTING.m8n
      const expectedScale = new Scale(new M8Version(2, 5, 0))
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

      expect(scaleFromDisk).toEqual(expectedScale)
      expect(scaleFromDisk.intervals.reduce((actualOffsetStrs, interval) => {
        return actualOffsetStrs.concat(interval.offsetToStr())
      }, [])).toEqual(expectedOffsetStrs)

      // Change the theme
      const alteredScale = M8.loadM8File(bytesFromDisk)

      alterScale(alteredScale)

      // Dump altered theme (with latest version number due to not providing one)
      expect(alteredScale).toEqual(M8.loadM8File(M8.dumpM8File(alteredScale)))
    })

    test('Song', () => {
      const filePath = path.join(__dirname, 'files/Songs/DEFAULT.m8s')
      const bytesFromDisk = Uint8Array.from(readFileSync(filePath))
      const songFromDisk = M8.loadM8File(bytesFromDisk)

      // Ensure the raw bytes read from disk match the dumped bytes
      expect(bytesFromDisk).toEqual(M8.dumpM8File(songFromDisk))

      const alteredSong = M8.loadM8File(bytesFromDisk)
      const chainStep = new ChainStep(0x01, 0x02)
      const scale = new Scale()
      const wavSynth = new Wavsynth()

      scale.name = 'TESTING'
      wavSynth.table = new Table([new TableStep([new FX(0x01, 0x02)], 0x02, 0x03)])

      alteredSong.chains[0] = new Chain([chainStep])
      alteredSong.directory = '/Songs/Testing/'
      alteredSong.grooves[0] = new Groove([0x01, 0x02, 0x03])
      alteredSong.instruments[0] = new FMSynth()
      alteredSong.instruments[1] = new Macrosynth()
      alteredSong.instruments[2] = new MIDIOut()
      alteredSong.instruments[3] = new Sampler()
      alteredSong.instruments[4] = wavSynth
      alteredSong.key = 0x02
      alteredSong.midiMappings[0] = new MIDIMapping(0x01)
      alteredSong.midiSettings = new MIDISettings(0x01)
      alteredSong.mixerSettings = new MixerSettings(0x01)
      alteredSong.name = 'TESTING'
      alteredSong.phrases[0] = new Phrase([new PhraseStep(new FX(0x01, 0x02, 0x03), 0x02, 0x03, 0x04)])
      alteredSong.scales[0] = scale
      alteredSong.steps[0] = new SongStep([0x01])
      alteredSong.tables[4] = wavSynth.table
      alteredSong.tempo = 0x03
      alteredSong.transpose = 0x04

      expect(M8.loadM8File(M8.dumpM8File(alteredSong))).toEqual(alteredSong)
    })

    test('Theme', () => {
      const filePath = path.join(__dirname, 'files/Themes/DEFAULT.m8t')
      const bytesFromDisk = Uint8Array.from(readFileSync(filePath))
      const themeFromDisk = M8.loadM8File(bytesFromDisk)
      const alteredSelection = new RGB(0x0F, 0x1F, 0x2F)

      // Ensure the raw bytes read from disk match the dumped bytes
      expect(bytesFromDisk).toEqual(M8.dumpM8File(themeFromDisk))

      let alteredTheme = M8.loadM8File(bytesFromDisk)

      // Change the theme
      alteredTheme.selection = alteredSelection

      // Dump altered theme (with latest version number due to not providing one)
      alteredTheme = M8.loadM8File(M8.dumpM8File(alteredTheme))

      // Ensure the files are the same
      Theme.getObjectProperties().forEach((prop) => {
        const expectedVal = alteredTheme[prop]
        let actualVal = themeFromDisk[prop]

        if (prop === 'selection') {
          actualVal = alteredSelection
        }

        expect(expectedVal).toEqual(actualVal)
      })

      expect(alteredTheme.m8FileVersion).toEqual(new M8Version(1, 0, 2))
      expect(alteredTheme.m8FileType).toEqual(M8File.TYPES.Theme)
    })
  })
})
