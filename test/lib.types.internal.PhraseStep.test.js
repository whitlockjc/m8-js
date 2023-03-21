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

const { getNote } = require('../lib/helpers')
const FX = require('../lib/types/internal/FX')
const PhraseStep = require('../lib/types/internal/PhraseStep')

describe('PhraseStep tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const step = new PhraseStep()

      expect(step.fx).toEqual(Array.from({ length: 3 }, () => new FX()))
      expect(step.instrument).toEqual(0xFF)
      expect(step.note).toEqual(0xFF)
      expect(step.volume).toEqual(0xFF)
    })

    test('arguments', () => {
      // eslint-disable-next-line no-unused-vars
      const fx = Array.from({ length: 2 }, (e, i) => new FX(i + 1, i + 1))
      const instrument = 0x01
      const note = 0x02
      const volume = 0x03
      const step = new PhraseStep(fx, instrument, note, volume)

      expect(step.fx).toEqual([new FX(0x01, 0x01), new FX(0x02, 0x02), new FX()])
      expect(step.instrument).toEqual(instrument)
      expect(step.note).toEqual(note)
      expect(step.volume).toEqual(volume)
    })
  })

  test('#asObject', () => {
    // eslint-disable-next-line no-unused-vars
    const fx = Array.from({ length: 2 }, (e, i) => new FX(i + 1, i + 1))
    const instrument = 0x01
    const note = 0x02
    const volume = 0x03

    expect(new PhraseStep(fx, instrument, note, volume).asObject()).toEqual({
      fx: [new FX(0x01, 0x01), new FX(0x02, 0x02), new FX()].map((fx) => fx.asObject()),
      instrument,
      note,
      noteStr: 'D-1',
      volume
    })
  })

  test('#noteStr', () => {
    const step = new PhraseStep()

    expect(step.noteToStr()).toEqual('---')

    for (let i = 0; i < 128; i++) {
      step.note = i

      const noteStr = step.noteToStr()
      const oct = Math.trunc(i / 12) + 1
      const key = step.note % 12
      const note = getNote(key)

      expect(noteStr.startsWith(note)).toEqual(true)

      if (key.length === 1) {
        expect(noteStr.indexOf('-')).not.toEqual(-1)
      }

      let octStr

      switch (oct) {
        case 10:
          octStr = 'A'
          break

        case 11:
          octStr = 'B'
          break

        default:
          octStr = Number(oct).toString()
      }

      expect(noteStr.endsWith(octStr)).toEqual(true)
    }
  })

  test('.fromObject', () => {
    // eslint-disable-next-line no-unused-vars
    const fx = Array.from({ length: 2 }, (e, i) => new FX(i + 1, i + 1))
    const instrument = 0x01
    const note = 0x02
    const volume = 0x03
    const step = new PhraseStep(fx, instrument, note, volume)

    expect(PhraseStep.fromObject(step.asObject())).toEqual(step)
  })

  test('.getObjectProperties', () => {
    expect(PhraseStep.getObjectProperties()).toEqual(Object.keys(new PhraseStep().asObject()))
  })
})
