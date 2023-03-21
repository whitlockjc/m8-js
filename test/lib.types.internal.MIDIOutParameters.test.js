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

const { VERSION_2_6_0 } = require('../lib/constants')
const MIDICC = require('../lib/types/internal/MIDICC')
const MIDIOutParameters = require('../lib/types/internal/MIDIOutParameters')

describe('MIDIOutParameters tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const midiOutParams = new MIDIOutParameters()

      expect(midiOutParams.bankSelect).toEqual(0xFF)
      expect(midiOutParams.channel).toEqual(0x01)
      expect(midiOutParams.port).toEqual(0x00)
      expect(midiOutParams.programChange).toEqual(0xFF)
      expect(midiOutParams.customCC).toEqual(Array.from({
        length: midiOutParams.customCC.length
      }, () => new MIDICC().asObject()))
    })

    test('arguments', () => {
      const bankSelect = 0x01
      const channel = 0x02
      const port = 0x03
      const programChange = 0x04
      const cc = new MIDICC(0x01, 0x02)
      const customCCs = [cc]
      const midiOutParams = new MIDIOutParameters(bankSelect, channel, customCCs, port, programChange)
      const expectedCCs = customCCs

      for (let i = 1; i < midiOutParams.customCC.length; i++) {
        expectedCCs[i] = new MIDICC()
      }

      expect(midiOutParams.bankSelect).toEqual(bankSelect)
      expect(midiOutParams.channel).toEqual(channel)
      expect(midiOutParams.port).toEqual(port)
      expect(midiOutParams.programChange).toEqual(programChange)
      expect(midiOutParams.customCC).toEqual(expectedCCs)
    })
  })

  test('#asObject', () => {
    const midiOutParams = new MIDIOutParameters()

    expect(midiOutParams.asObject()).toEqual({
      bankSelect: 0xFF,
      channel: 0x01,
      port: 0x00,
      programChange: 0xFF,
      customCC: Array.from({ length: midiOutParams.customCC.length }, () => new MIDICC().asObject())
    })
  })

  describe('#portToStr', () => {
    test('M8 version < 2.7.0', () => {
      ;[
        'MIDI+USB', // 0x00
        'MIDI', // 0x01
        'USB', // 0x02
        'UNK (03)'
      ].forEach((name, port) => {
        expect(new MIDIOutParameters(0x01, 0x02, [], port).portToStr(VERSION_2_6_0)).toEqual(name)
      })
    })

    test('M8 version < 2.7.0', () => {
      ;[
        'MIDI+USB', // 0x00
        'MIDI', // 0x01
        'USB', // 0x02
        'INTERNAL', // 0x03 (Not available prior to 2.7.0)
        'UNK (04)'
      ].forEach((name, port) => {
        expect(new MIDIOutParameters(0x01, 0x02, [], port).portToStr()).toEqual(name)
      })
    })
  })

  test('.fromObject', () => {
    const cc = new MIDICC(0x01, 0x02)
    const customCCs = [cc]
    const midiOutParams = new MIDIOutParameters(0x01, 0x02, customCCs, 0x04, 0x05)

    expect(MIDIOutParameters.fromObject(midiOutParams.asObject())).toEqual(midiOutParams)
  })

  test('.getObjectProperties', () => {
    const expectedKeys = Object.keys(new MIDIOutParameters().asObject()).concat('portStr').sort()

    expect(MIDIOutParameters.getObjectProperties()).toEqual(expectedKeys)
  })
})
