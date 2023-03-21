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

const Serializable = require('./Serializable')

/**
 * Represents the Mixer Settings.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class MixerSettings extends Serializable {
  /** @member {Array<Number>} */
  analogInputChorus
  /** @member {Array<Number>} */
  analogInputDelay
  /** @member {Array<Number>} */
  analogInputReverb
  /** @member {Array<Number>} */
  analogInputVolume
  /** @member {Number} */
  chorusVolume
  /** @member {Number} */
  delayVolume
  /** @member {Number} */
  djFilter
  /** @member {Number} */
  djFilterPeak
  /** @member {Number} */
  masterLimit
  /** @member {Number} */
  masterVolume
  /** @member {Number} */
  reverbVolume
  /** @member {Array<Number>} */
  trackVolume
  /** @member {Number} */
  usbInputChorus
  /** @member {Number} */
  usbInputDelay
  /** @member {Number} */
  usbInputReverb
  /** @member {Number} */
  usbInputVolume

  /**
   * Create a MIDI Settings.
   *
   * @param {Array<Number>} [analogInputChorus]
   * @param {Array<Number>} [analogInputDelay]
   * @param {Array<Number>} [analogInputReverb]
   * @param {Array<Number>} [analogInputVolume]
   * @param {Number} [chorusVolume = 0xE0]
   * @param {Number} [delayVolume = 0xE0]
   * @param {Number} [djFilter = 0x80]
   * @param {Number} [djFilterPeak = 0x80]
   * @param {Number} [masterLimit = 0x00]
   * @param {Number} [masterVolume = 0xE0]
   * @param {Number} [reverbVolume = 0xE0]
   * @param {Array<Number>} [trackVolume]
   * @param {Number} [usbInputChorus = 0x00]
   * @param {Number} [usbInputDelay = 0x00]
   * @param {Number} [usbInputReverb = 0x00]
   * @param {Number} [usbInputVolume = 0x00]
   */
  constructor (analogInputChorus, analogInputDelay, analogInputReverb, analogInputVolume, chorusVolume = 0xE0,
               delayVolume = 0xE0, djFilter = 0x80, djFilterPeak = 0x80, masterLimit = 0x00, masterVolume = 0xE0,
               reverbVolume = 0xE0, trackVolume, usbInputChorus = 0x00, usbInputDelay = 0x00, usbInputReverb = 0x00,
               usbInputVolume = 0x00) {
    super()

    this.analogInputChorus = Array(2).fill(0x00)
    this.analogInputDelay = Array(2).fill(0x00)
    this.analogInputReverb = Array(2).fill(0x00)
    this.analogInputVolume = [0x00, 0xFF]
    this.chorusVolume = chorusVolume
    this.delayVolume = delayVolume
    this.djFilter = djFilter
    this.djFilterPeak = djFilterPeak
    this.masterLimit = masterLimit
    this.masterVolume = masterVolume
    this.reverbVolume = reverbVolume
    this.trackVolume = Array(8).fill(0xE0)
    this.usbInputChorus = usbInputChorus
    this.usbInputDelay = usbInputDelay
    this.usbInputReverb = usbInputReverb
    this.usbInputVolume = usbInputVolume

    for (let i = 0; i < this.analogInputChorus.length; i++) {
      const value = analogInputChorus?.[i]

      if (typeof value === 'number') {
        this.analogInputChorus[i] = value
      }
    }

    for (let i = 0; i < this.analogInputDelay.length; i++) {
      const value = analogInputDelay?.[i]

      if (typeof value === 'number') {
        this.analogInputDelay[i] = value
      }
    }

    for (let i = 0; i < this.analogInputReverb.length; i++) {
      const value = analogInputReverb?.[i]

      if (typeof value === 'number') {
        this.analogInputReverb[i] = value
      }
    }

    for (let i = 0; i < this.analogInputVolume.length; i++) {
      const value = analogInputVolume?.[i]

      if (typeof value === 'number') {
        this.analogInputVolume[i] = value
      }
    }

    for (let i = 0; i < this.trackVolume.length; i++) {
      const value = trackVolume?.[i]

      if (typeof value === 'number') {
        this.trackVolume[i] = value
      }
    }
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      analogInputChorus: this.analogInputChorus,
      analogInputDelay: this.analogInputDelay,
      analogInputReverb: this.analogInputReverb,
      analogInputVolume: this.analogInputVolume,
      chorusVolume: this.chorusVolume,
      delayVolume: this.delayVolume,
      djFilter: this.djFilter,
      djFilterPeak: this.djFilterPeak,
      masterLimit: this.masterLimit,
      masterVolume: this.masterVolume,
      reverbVolume: this.reverbVolume,
      trackVolume: this.trackVolume,
      usbInputChorus: this.usbInputChorus,
      usbInputDelay: this.usbInputDelay,
      usbInputReverb: this.usbInputReverb,
      usbInputVolume: this.usbInputVolume
    }
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @static
   *
   * @returns {Array<Number>}
   */
  getMIDIDestLabels () {
    return [
      'MIX VOL',
      'LIMIT',
      'DJ F.CUT',
      'DJ F.RES',
      'TRACK 1',
      'TRACK 2',
      'TRACK 3',
      'TRACK 4',
      'TRACK 5',
      'TRACK 6',
      'TRACK 7',
      'TRACK 8',
      'CHORUS',
      'DELAY',
      'REVERB',
      'INPUT',
      'INPUT R',
      'USB',
      'IN CHO',
      'IN R CHO',
      'USB CHO',
      'IN DEL',
      'IN R DEL',
      'USB DEL',
      'IN REV',
      'IN R REV',
      'USB REV'
    ]
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new MixerSettings(object?.analogInputChorus, object?.analogInputDelay, object?.analogInputReverb,
                             object?.analogInputVolume, object?.chorusVolume, object?.delayVolume, object?.djFilter,
                             object?.djFilterPeak, object?.masterLimit, object?.masterVolume, object?.reverbVolume,
                             object?.trackVolume, object?.usbInputChorus, object?.usbInputDelay, object?.usbInputReverb,
                             object?.usbInputVolume)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return [
      'analogInputChorus',
      'analogInputDelay',
      'analogInputReverb',
      'analogInputVolume',
      'chorusVolume',
      'delayVolume',
      'djFilter',
      'djFilterPeak',
      'masterLimit',
      'masterVolume',
      'reverbVolume',
      'trackVolume',
      'usbInputChorus',
      'usbInputDelay',
      'usbInputReverb',
      'usbInputVolume'
    ]
  }
}

module.exports = MixerSettings
