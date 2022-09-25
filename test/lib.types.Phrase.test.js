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

const Phrase = require('../lib/types/Phrase')

describe('Phrase tests', () => {
  test('constructor', () => {
    const emptyPhrase = new Phrase()

    expect(emptyPhrase.steps.length).toEqual(16)

    for (let i = 0; i < emptyPhrase.steps.length; i++) {
      const step = emptyPhrase.steps[i]

      expect(step.note).toEqual(0xFF)
      expect(step.volume).toEqual(0xFF)
      expect(step.instrument).toEqual(0xFF)

      for (let j = 0; j < 3; j++) {
        const fx = step['fx' + (j + 1)]

        expect(fx.command).toEqual(0xFF)
        expect(fx.value).toEqual(0x00)
      }
    }
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
})
