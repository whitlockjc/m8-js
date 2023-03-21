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

const MIDISettings = require('../lib/types/internal/MIDISettings')

describe('MIDISettings tests', () => {
  describe('constructor', () => {
    test('empty', () => {
      const ms = new MIDISettings()

      expect(ms.controlMapChannel).toEqual(0x11)
      expect(ms.receiveSync).toEqual(false)
      expect(ms.receiveTransport).toEqual(0x00)
      expect(ms.recordNoteChannel).toEqual(0x00)
      expect(ms.recordNoteDelayKillCommands).toEqual(0x00)
      expect(ms.recordNoteVelocity).toEqual(true)
      expect(ms.sendSync).toEqual(false)
      expect(ms.sendTransport).toEqual(0x00)
      expect(ms.songRowCueChannel).toEqual(0x0B)
      expect(ms.trackInputChannel).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
      expect(ms.trackInputInstrument).toEqual(Array(8).fill(0x00))
      expect(ms.trackInputMode).toEqual(0x01)
      expect(ms.trackInputProgramChange).toEqual(true)
    })

    test('arguments', () => {
      const controlMapChannel = 0x01
      const receiveSync = true
      const receiveTransport = 0x02
      const recordNoteChannel = 0x04
      const recordNoteDelayKillCommands = 0x03
      const recordNoteVelocity = false
      const sendSync = true
      const sendTransport = 0x08
      const songRowCueChannel = 0x09
      const trackInputChannel = [8, 7, 6]
      const trackInputInstrument = [8, 7, 6]
      const trackInputMode = 0x00
      const trackInputProgramChange = false
      const ms = new MIDISettings(controlMapChannel, receiveSync, receiveTransport, recordNoteChannel,
                                  recordNoteDelayKillCommands, recordNoteVelocity, sendSync, sendTransport,
                                  songRowCueChannel, trackInputChannel, trackInputInstrument, trackInputMode,
                                  trackInputProgramChange)

      expect(ms.controlMapChannel).toEqual(controlMapChannel)
      expect(ms.receiveSync).toEqual(receiveSync)
      expect(ms.receiveTransport).toEqual(receiveTransport)
      expect(ms.recordNoteChannel).toEqual(recordNoteChannel)
      expect(ms.recordNoteDelayKillCommands).toEqual(recordNoteDelayKillCommands)
      expect(ms.recordNoteVelocity).toEqual(recordNoteVelocity)
      expect(ms.sendSync).toEqual(sendSync)
      expect(ms.sendTransport).toEqual(sendTransport)
      expect(ms.songRowCueChannel).toEqual(songRowCueChannel)
      expect(ms.trackInputChannel).toEqual([8, 7, 6, 4, 5, 6, 7, 8])
      expect(ms.trackInputInstrument).toEqual([8, 7, 6, 0, 0, 0, 0, 0])
      expect(ms.trackInputMode).toEqual(trackInputMode)
      expect(ms.trackInputProgramChange).toEqual(trackInputProgramChange)
    })
  })

  test('#asObject', () => {
    const controlMapChannel = 0x01
    const receiveSync = true
    const receiveTransport = 0x02
    const recordNoteChannel = 0x04
    const recordNoteDelayKillCommands = 0x03
    const recordNoteVelocity = false
    const sendSync = true
    const sendTransport = 0x02
    const songRowCueChannel = 0x09
    const trackInputChannel = [8, 7, 6]
    const trackInputInstrument = [8, 7, 6]
    const trackInputMode = 0x00
    const trackInputProgramChange = false
    const msObject = new MIDISettings(controlMapChannel, receiveSync, receiveTransport, recordNoteChannel,
                                      recordNoteDelayKillCommands, recordNoteVelocity, sendSync, sendTransport,
                                      songRowCueChannel, trackInputChannel, trackInputInstrument, trackInputMode,
                                      trackInputProgramChange).asObject()

    expect(msObject).toEqual({
      controlMapChannel,
      receiveSync,
      receiveTransport,
      receiveTransportStr: 'SONG',
      recordNoteChannel,
      recordNoteDelayKillCommands,
      recordNoteDelayKillCommandsStr: 'BOTH',
      recordNoteVelocity,
      sendSync,
      sendTransport,
      sendTransportStr: 'SONG',
      songRowCueChannel,
      trackInputChannel: [8, 7, 6, 4, 5, 6, 7, 8],
      trackInputInstrument: [8, 7, 6, 0, 0, 0, 0, 0],
      trackInputMode,
      trackInputModeStr: 'MONO',
      trackInputProgramChange
    })
  })

  test('#recordNoteDelayKillCommandsToStr', () => {
    const ms = new MIDISettings()

    ;['OFF', 'KILL', 'DELAY', 'BOTH', 'UNK (04)'].forEach((name, index) => {
      ms.recordNoteDelayKillCommands = index

      expect(ms.recordNoteDelayKillCommandsToStr()).toEqual(name)
    })
  })

  test('#trackInputModeToStr', () => {
    const ms = new MIDISettings()

    ;['MONO', 'LEGATO', 'POLY', 'UNK (03)'].forEach((name, index) => {
      ms.trackInputMode = index

      expect(ms.trackInputModeToStr()).toEqual(name)
    })
  })

  test('#transportToStr', () => {
    const ms = new MIDISettings()

    ;['OFF', 'PATTERN', 'SONG', 'UNK (03)'].forEach((name, index) => {
      ms.receiveTransport = index
      ms.sendTransport = index

      expect(ms.transportToStr(ms.receiveTransport)).toEqual(name)
      expect(ms.transportToStr(ms.sendTransport)).toEqual(name)
    })
  })

  test('.fromObject', () => {
    const ni = new MIDISettings(false, 0x01, 0x03)

    expect(MIDISettings.fromObject(ni.asObject())).toEqual(ni)
  })

  test('.getObjectProperties', () => {
    expect(MIDISettings.getObjectProperties()).toEqual(Object.keys(new MIDISettings().asObject()))
  })
})
