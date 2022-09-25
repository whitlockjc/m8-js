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

const FX = require('../lib/types/FX')

describe('FX tests', () => {
  test('constructor', () => {
    const emptyFX = new FX()

    expect(emptyFX.command).toEqual(0xFF)
    expect(emptyFX.value).toEqual(0x00)
  })

  test('#commandToStr', () => {
    const emptyFX = new FX()

    // FMSynth Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('VOL')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('FMP')

    emptyFX.command = 0xA3

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('A3?')

    // FX and Mixer Commands
    emptyFX.command = 0x17

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('VMV')

    emptyFX.command = 0x3A

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('USB')

    emptyFX.command = 0x3B

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('3B?')

    // Sequencer Commands
    emptyFX.command = 0x00

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('ARP')

    emptyFX.command = 0x16

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('TSP')

    emptyFX.command = 0x3B

    expect(emptyFX.commandToStr('FMSYNTH')).toEqual('3B?')

    // Macrosyn Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr('MACROSYN')).toEqual('VOL')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr('MACROSYN')).toEqual('TRG')

    emptyFX.command = 0xA3

    expect(emptyFX.commandToStr('MACROSYN')).toEqual('A3?')

    // MIDIOut Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr('MIDI OUT')).toEqual('MPG')

    emptyFX.command = 0x8D

    expect(emptyFX.commandToStr('MIDI OUT')).toEqual('CCJ')

    emptyFX.command = 0x8E

    expect(emptyFX.commandToStr('MIDI OUT')).toEqual('8E?')

    // None Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr('NONE')).toEqual('80?')

    // Sampler Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr('SAMPLER')).toEqual('VOL')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr('SAMPLER')).toEqual('SLI')

    emptyFX.command = 0xA3

    expect(emptyFX.commandToStr('SAMPLER')).toEqual('A3?')

    // Wavsynth Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr('WAVSYNTH')).toEqual('VOL')

    emptyFX.command = 0xA1

    expect(emptyFX.commandToStr('WAVSYNTH')).toEqual('LT2')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr('WAVSYNTH')).toEqual('A2?')
  })
})
