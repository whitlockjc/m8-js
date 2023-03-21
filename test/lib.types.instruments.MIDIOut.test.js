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

const { LATEST_M8_VERSION } = require('../lib/constants')
const { readFileSync } = require('fs')
const { testEmptyInstrument, testInstrumentOjbect } = require('./helpers')
const M8 = require('..')
const MIDIOut = require('../lib/types/instruments/MIDIOut')
const path = require('path')

const EMPTYProperties = ['ampParams', 'envelopes', 'filterParams', 'lfos', 'mixerParams']

describe('MIDIOut tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      testEmptyInstrument(new MIDIOut(), 0x03, 'MIDI OUT', 'MIDIOutParameters')
    })

    describe('arguments', () => {
      // M8FileReader is tested by the index.js tests

      test('M8Version', () => {
        testEmptyInstrument(new MIDIOut(LATEST_M8_VERSION), 0x03, 'MIDI OUT', 'MIDIOutParameters')
      })
    })
  })

  test('defaults', () => {
    const midiOut = new MIDIOut()

    midiOut.name = 'DEF_MID'

    M8.loadM8File(Array.from(readFileSync(path.join(__dirname, 'files/Instruments/DEF_MID.m8i'))))
  })

  test('#asObject', () => {
    const midiOut = new MIDIOut()
    const midiOutObject = midiOut.asObject()

    testInstrumentOjbect(midiOut)

    EMPTYProperties.forEach((prop) => {
      expect(midiOutObject[prop]).toBeUndefined()
    })
  })

  test('.fromObject', () => {
    const midiOut = new MIDIOut()

    expect(MIDIOut.fromObject(midiOut.asObject())).toEqual(midiOut)
  })

  test('.getObjectProperties', () => {
    expect(MIDIOut.getObjectProperties().sort()).toEqual(Object.keys(new MIDIOut().asObject()).sort())
  })
})
