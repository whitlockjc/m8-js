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

const MIDIMapping = require('../lib/types/internal/MIDIMapping')

describe('MIDIMapping tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const mm = new MIDIMapping()

      expect(mm.channel).toEqual(0x00)
      expect(mm.controlNum).toEqual(0x00)
      expect(mm.instrIndex).toEqual(0x00)
      expect(mm.maxValue).toEqual(0x00)
      expect(mm.minValue).toEqual(0x00)
      expect(mm.paramIndex).toEqual(0x00)
      expect(mm.type).toEqual(0x00)
    })

    test('arguments', () => {
      const channel = 0x01
      const controlNum = 0x02
      const instrIndex = 0x03
      const maxValue = 0x04
      const minValue = 0x05
      const paramIndex = 0x06
      const type = 0x07
      const mm = new MIDIMapping(channel, controlNum, instrIndex, maxValue, minValue, paramIndex, type)

      expect(mm.channel).toEqual(channel)
      expect(mm.controlNum).toEqual(controlNum)
      expect(mm.instrIndex).toEqual(instrIndex)
      expect(mm.maxValue).toEqual(maxValue)
      expect(mm.minValue).toEqual(minValue)
      expect(mm.paramIndex).toEqual(paramIndex)
      expect(mm.type).toEqual(type)
    })
  })

  test('#asObject', () => {
    const channel = 0x01
    const controlNum = 0x02
    const instrIndex = 0x03
    const maxValue = 0x04
    const minValue = 0x05
    const paramIndex = 0x06
    const type = 0x07
    expect(new MIDIMapping(channel, controlNum, instrIndex, maxValue, minValue, paramIndex, type).asObject()).toEqual({
      channel,
      controlNum,
      instrIndex,
      maxValue,
      minValue,
      paramIndex,
      type,
      typeStr: 'I'
    })
  })

  test('get empty', () => {
    const mm = new MIDIMapping()

    expect(mm.empty).toEqual(true)

    mm.channel = 0x01

    expect(mm.empty).toEqual(false)
  })

  test('#typeToStr', () => {
    const mm = new MIDIMapping()

    expect(mm.typeToStr()).toEqual('U (00)')

    mm.type = 0x0B

    expect(mm.typeToStr()).toEqual('X')

    mm.type = 0x0D

    expect(mm.typeToStr()).toEqual('M')

    mm.type = 0x05

    expect(mm.typeToStr()).toEqual('I')
  })

  test('.fromObject', () => {
    const mm = new MIDIMapping(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07)

    expect(MIDIMapping.fromObject(mm.asObject())).toEqual(mm)
  })

  test('.getObjectProperties', () => {
    expect(MIDIMapping.getObjectProperties()).toEqual(Object.keys(new MIDIMapping().asObject()))
  })
})
