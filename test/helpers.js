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

const { InstrumentKinds, LATEST_M8_VERSION } = require('../lib/constants')
const M8File = require('../lib/types/internal/M8File')

const alterScale = (scale) => {
  // Change the name
  scale.name = 'MY SCALE'

  for (let i = 0; i < scale.intervals.length; i++) {
    const interval = scale.intervals[i]

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

  return scale
}

const testEmptyInstrument = (instr, kind, kindStr, instrParamsStr) => {
  expect(instr.kind()).toEqual(kind)
  expect(instr.kindToStr()).toEqual(kindStr)

  if (typeof instrParamsStr === 'undefined') {
    expect(instr.instrParams).toBeUndefined()
  } else {
    expect(instr.instrParams.constructor.name).toEqual(instrParamsStr)
  }

  expect(instr.m8FileVersion).toEqual(LATEST_M8_VERSION)
  expect(instr.m8FileType).toEqual(M8File.TYPES.Instrument)
}

const testInstrumentOjbect = (instr) => {
  const expectedObject = {
    fileMetadata: {
      type: 'Instrument',
      version: instr.m8FileVersion.asObject()
    },
    ampParams: instr.ampParams.asObject(),
    envelopes: instr.envelopes.map((env) => env.asObject()),
    filterParams: instr.filterParams.asObject(),
    fineTune: instr.fineTune,
    kind: instr.kind(),
    kindStr: instr.kindToStr(),
    lfos: instr.lfos.map((lfo) => lfo.asObject()),
    mixerParams: instr.mixerParams.asObject(),
    name: instr.name,
    pitch: instr.pitch,
    table: instr.table.asObject(),
    tableTick: instr.tableTick,
    transpose: instr.transpose,
    volume: instr.volume
  }

  if (typeof instr.instrParams !== 'undefined') {
    expectedObject.instrParams = instr.instrParams.asObject()
  }

  if ([InstrumentKinds.MIDIOUT, InstrumentKinds.NONE].indexOf(instr.kind()) > -1) {
    delete expectedObject.ampParams
    delete expectedObject.envelopes
    delete expectedObject.filterParams
    delete expectedObject.lfos
    delete expectedObject.mixerParams
  }

  if (instr.kind() === InstrumentKinds.NONE) {
    delete expectedObject.instrParams
  }

  expect(instr.asObject()).toEqual(expectedObject)
}

module.exports = {
  alterScale,
  testEmptyInstrument,
  testInstrumentOjbect
}
