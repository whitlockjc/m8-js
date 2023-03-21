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

const FX = require('../lib/types/internal/FX')
const Phrase = require('../lib/types/internal/Phrase')
const PhraseStep = require('../lib/types/internal/PhraseStep')

describe('Phrase tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const emptyPhrase = new Phrase()

      expect(emptyPhrase.steps.length).toEqual(16)

      for (let i = 0; i < emptyPhrase.steps.length; i++) {
        const step = emptyPhrase.steps[i]

        expect(step.fx).toEqual(Array.from({ length: 3 }, () => new FX()))
        expect(step.note).toEqual(0xFF)
        expect(step.volume).toEqual(0xFF)
        expect(step.instrument).toEqual(0xFF)
      }
    })

    test('arguments', () => {
      // eslint-disable-next-line no-unused-vars
      const steps = Array.from({ length: 8 }, (e, i) => {
        // eslint-disable-next-line no-unused-vars
        const fx = Array.from({ length: 2 }, (e2, j) => new FX(j + 1, j + 1))
        const instrument = 0x01 + i
        const note = 0x02 + i
        const volume = 0x03 + i

        return new PhraseStep(fx, instrument, note, volume)
      })
      const phrase = new Phrase(steps)

      expect(phrase.steps).toEqual([...steps, ...Array.from({ length: 8 }, () => new PhraseStep())])
    })
  })

  test('#asObject', () => {
    expect(new Phrase().asObject()).toEqual({
      steps: Array.from({ length: 16 }, () => new PhraseStep().asObject())
    })
  })

  test('#findPhraseStepInstrumentNum', () => {
    const emptyPhrase = new Phrase()

    // Unresolvable
    expect(emptyPhrase.findPhraseStepInstrumentNum()).toEqual(0xFF)
    expect(emptyPhrase.findPhraseStepInstrumentNum(0x0E)).toEqual(0xFF)

    // Same step
    emptyPhrase.steps[7].instrument = 0x01

    expect(emptyPhrase.findPhraseStepInstrumentNum(0x07)).toEqual(0x01)

    // Previous step
    expect(emptyPhrase.findPhraseStepInstrumentNum()).toEqual(0x01)
    expect(emptyPhrase.findPhraseStepInstrumentNum(0x0E)).toEqual(0x01)
  })

  test('#noteToStr', () => {
    const emptyPhrase = new Phrase()

    // Empty note
    expect(emptyPhrase.steps[0].noteToStr()).toEqual('---')

    // Non-sharp note
    emptyPhrase.steps[0].note = 0x00

    expect(emptyPhrase.steps[0].noteToStr()).toEqual('C-1')

    // Sharp note
    emptyPhrase.steps[0].note = 0x01

    expect(emptyPhrase.steps[0].noteToStr()).toEqual('C#1')

    // Note with octave of 10
    emptyPhrase.steps[0].note = 0x6C

    expect(emptyPhrase.steps[0].noteToStr()).toEqual('C-A')

    // Note with octave of 11
    emptyPhrase.steps[0].note = 0x78

    expect(emptyPhrase.steps[0].noteToStr()).toEqual('C-B')
  })

  test('.fromObject', () => {
    const phrase = new Phrase()

    for (let i = 0; i < phrase.steps.length; i++) {
      const step = phrase.steps[i]

      if (i === 5) {
        continue
      }

      step.instrument = i
      step.note = i
      step.volume = i
    }

    const phraseObject = phrase.asObject()

    phraseObject.steps[5] = undefined

    expect(Phrase.fromObject(phraseObject)).toEqual(phrase)
  })

  test('.getObjectProperties', () => {
    expect(Phrase.getObjectProperties()).toEqual(Object.keys(new Phrase().asObject()))
  })
})
