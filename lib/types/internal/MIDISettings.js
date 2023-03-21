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

const { toM8HexStr } = require('../../helpers')
const Serializable = require('./Serializable')

/**
 * Represents the MIDI Settings.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class MIDISettings extends Serializable {
  /** @member {Number} */
  controlMapChannel
  /** @member {Boolean} */
  receiveSync
  /** @member {Number} */
  receiveTransport
  /** @member {Number} */
  recordNoteChannel
  /** @member {Boolean} */
  recordNoteDelayKillCommands
  /** @member {Boolean} */
  recordNoteVelocity
  /** @member {Boolean} */
  sendSync
  /** @member {Number} */
  sendTransport
  /** @member {Number} */
  songRowCueChannel
  /** @member {Array<Number>} */
  trackInputChannel
  /** @member {Array<Number>} */
  trackInputInstrument
  /** @member {Number} */
  trackInputMode
  /** @member {Boolean} */
  trackInputProgramChange

  /**
   * Create a MIDI Settings.
   *
   * @param {Number} [controlMapChannel=0x11]
   * @param {Boolean} [receiveSync=false]
   * @param {Number} [receiveTransport=0x00]
   * @param {Number} [recordNoteChannel=0x00]
   * @param {Number} [recordNoteDelayKillCommands=0x00]
   * @param {Boolean} [recordNoteVelocity=true]
   * @param {Boolean} [sendSync=false]
   * @param {Number} [sendTransport=0x00]
   * @param {Number} [songRowCueChannel=0x0B]
   * @param {Array<Number>} [trackInputChannel]
   * @param {Array<Number>} [trackInputInstrument]
   * @param {Number} [trackInputMode=0x01]
   * @param {Boolean} [trackInputProgramChange=true]
   */
  constructor (controlMapChannel = 0x11, receiveSync = false, receiveTransport = 0x00, recordNoteChannel = 0x00,
               recordNoteDelayKillCommands = 0x00, recordNoteVelocity = true, sendSync = false, sendTransport = 0x00,
               songRowCueChannel = 0x0B, trackInputChannel, trackInputInstrument, trackInputMode = 0x01,
               trackInputProgramChange = true) {
    super()

    this.controlMapChannel = controlMapChannel // ALL
    this.receiveSync = receiveSync
    this.receiveTransport = receiveTransport
    this.recordNoteChannel = recordNoteChannel
    this.recordNoteDelayKillCommands = recordNoteDelayKillCommands
    this.recordNoteVelocity = recordNoteVelocity
    this.sendSync = sendSync
    this.sendTransport = sendTransport
    this.songRowCueChannel = songRowCueChannel
    // eslint-disable-next-line no-unused-vars
    this.trackInputChannel = Array.from({ length: 8 }, (e, i) => {
      let value = trackInputChannel?.[i]

      if (typeof value !== 'number') {
        value = i + 1
      }

      return value
    })
    // eslint-disable-next-line no-unused-vars
    this.trackInputInstrument = Array.from({ length: 8 }, (e, i) => {
      let value = trackInputInstrument?.[i]

      if (typeof value !== 'number') {
        value = 0x00
      }

      return value
    })
    this.trackInputMode = trackInputMode // LEGATO
    this.trackInputProgramChange = trackInputProgramChange
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      controlMapChannel: this.controlMapChannel,
      receiveSync: this.receiveSync,
      receiveTransport: this.receiveTransport,
      receiveTransportStr: this.transportToStr(this.receiveTransport),
      recordNoteChannel: this.recordNoteChannel,
      recordNoteDelayKillCommands: this.recordNoteDelayKillCommands,
      recordNoteDelayKillCommandsStr: this.recordNoteDelayKillCommandsToStr(),
      recordNoteVelocity: this.recordNoteVelocity,
      sendSync: this.sendSync,
      sendTransport: this.sendTransport,
      sendTransportStr: this.transportToStr(this.sendTransport),
      songRowCueChannel: this.songRowCueChannel,
      trackInputChannel: this.trackInputChannel,
      trackInputInstrument: this.trackInputInstrument,
      trackInputMode: this.trackInputMode,
      trackInputModeStr: this.trackInputModeToStr(),
      trackInputProgramChange: this.trackInputProgramChange
    }
  }

  /**
   * Returns a string representation of the record delay/kill commands.
   *
   * @returns {String}
   */
  recordNoteDelayKillCommandsToStr () {
    switch (this.recordNoteDelayKillCommands) {
      case 0x00:
        return 'OFF'
      case 0x01:
        return 'KILL'
      case 0x02:
        return 'DELAY'
      case 0x03:
        return 'BOTH'
      default:
        return `UNK (${toM8HexStr(this.recordNoteDelayKillCommands)})`
    }
  }

  /**
   * Returns a string representation of the track input mode.
   *
   * @returns {String}
   */
  trackInputModeToStr () {
    switch (this.trackInputMode) {
      case 0:
        return 'MONO'
      case 1:
        return 'LEGATO'
      case 2:
        return 'POLY'
      default:
        return `UNK (${toM8HexStr(this.trackInputMode)})`
    }
  }

  /**
   * Returns a string representation of the transport mode.
   *
   * @param {String} transport - The raw transport value
   *
   * @returns {String}
   */
  transportToStr (transport) {
    switch (transport) {
      case 0x00:
        return 'OFF'
      case 0x01:
        return 'PATTERN'
      case 0x02:
        return 'SONG'
      default:
        return `UNK (${toM8HexStr(transport)})`
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new MIDISettings(object?.controlMapChannel, object?.receiveSync, object?.receiveTransport,
                            object?.recordNoteChannel, object?.recordNoteDelayKillCommands, object?.recordNoteVelocity,
                            object?.sendSync, object?.sendTransport, object?.songRowCueChannel,
                            object?.trackInputChannel, object?.trackInputInstrument, object?.trackInputMode,
                            object?.trackInputProgramChange)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return [
      'controlMapChannel',
      'receiveSync',
      'receiveTransport',
      'receiveTransportStr',
      'recordNoteChannel',
      'recordNoteDelayKillCommands',
      'recordNoteDelayKillCommandsStr',
      'recordNoteVelocity',
      'sendSync',
      'sendTransport',
      'sendTransportStr',
      'songRowCueChannel',
      'trackInputChannel',
      'trackInputInstrument',
      'trackInputMode',
      'trackInputModeStr',
      'trackInputProgramChange'
    ]
  }
}

module.exports = MIDISettings
