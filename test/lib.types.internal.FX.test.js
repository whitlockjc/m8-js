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

const FMSynth = require('../lib/types/instruments/FMSynth')
const Macrosynth = require('../lib/types/instruments/Macrosynth')
const MIDIOut = require('../lib/types/instruments/MIDIOut')
const None = require('../lib/types/instruments/None')
const Sampler = require('../lib/types/instruments/Sampler')
const Wavsynth = require('../lib/types/instruments/Wavsynth')
const FX = require('../lib/types/internal/FX')

describe('FX tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const emptyFX = new FX()

      expect(emptyFX.command).toEqual(0xFF)
      expect(emptyFX.value).toEqual(0x00)
    })

    test('arguments', () => {
      const command = 0x01
      const value = 0x02
      const fx = new FX(command, value)

      expect(fx.command).toEqual(command)
      expect(fx.value).toEqual(value)
    })
  })

  test('#asObject', () => {
    const command = 0x01
    const value = 0x02

    expect(new FX(command, value).asObject()).toEqual({
      command,
      value
    })
  })

  test('#commandToStr', () => {
    const fmSynth = new FMSynth()
    const macroSynth = new Macrosynth()
    const midiOut = new MIDIOut()
    const none = new None()
    const sampler = new Sampler()
    const wavSynth = new Wavsynth()
    const emptyFX = new FX()

    // FMSynth Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr(fmSynth)).toEqual('VOL')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr(fmSynth)).toEqual('FMP')

    emptyFX.command = 0xA3

    expect(emptyFX.commandToStr(fmSynth)).toEqual('A3?')

    // FX and Mixer Commands
    emptyFX.command = 0x17

    expect(emptyFX.commandToStr(fmSynth)).toEqual('VMV')

    emptyFX.command = 0x3A

    expect(emptyFX.commandToStr(fmSynth)).toEqual('USB')

    emptyFX.command = 0x3B

    expect(emptyFX.commandToStr(fmSynth)).toEqual('3B?')

    // Sequencer Commands
    emptyFX.command = 0x00

    expect(emptyFX.commandToStr(fmSynth)).toEqual('ARP')

    emptyFX.command = 0x16

    expect(emptyFX.commandToStr(fmSynth)).toEqual('TSP')

    emptyFX.command = 0x3B

    expect(emptyFX.commandToStr(fmSynth)).toEqual('3B?')

    // Macrosyn Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr(macroSynth)).toEqual('VOL')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr(macroSynth)).toEqual('TRG')

    emptyFX.command = 0xA3

    expect(emptyFX.commandToStr(macroSynth)).toEqual('A3?')

    // MIDIOut Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr(midiOut)).toEqual('MPG')

    emptyFX.command = 0x8D

    expect(emptyFX.commandToStr(midiOut)).toEqual('CCJ')

    emptyFX.command = 0x8E

    expect(emptyFX.commandToStr(midiOut)).toEqual('8E?')

    // None Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr(none)).toEqual('80?')

    // Sampler Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr(sampler)).toEqual('VOL')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr(sampler)).toEqual('SLI')

    emptyFX.command = 0xA3

    expect(emptyFX.commandToStr(sampler)).toEqual('A3?')

    // Wavsynth Commands
    emptyFX.command = 0x80

    expect(emptyFX.commandToStr(wavSynth)).toEqual('VOL')

    emptyFX.command = 0xA1

    expect(emptyFX.commandToStr(wavSynth)).toEqual('LT2')

    emptyFX.command = 0xA2

    expect(emptyFX.commandToStr(wavSynth)).toEqual('A2?')
  })

  test('.fromObject', () => {
    const command = 0x01
    const value = 0x02
    const fx = new FX(command, value)

    expect(FX.fromObject(fx.asObject())).toEqual(fx)
  })

  test('.getObjectProperties', () => {
    expect(FX.getObjectProperties()).toEqual(Object.keys(new FX().asObject()))
  })
})
