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
 * Represents the Envelope Parameters of an Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class EnvelopeParameters extends Serializable {
  /** @member {Number} */
  amount
  /** @member {Number} */
  attack
  /** @member {Number} */
  decay
  /** @member {Number} */
  dest
  /** @member {Number} */
  hold
  /** @member {Number} */
  retrigger

  /**
   * Create an Instrument's Envelope Parameters.
   *
   * @param {Number} [amount=0xFF]
   * @param {Number} [attack=0x00]
   * @param {Number} [decay=0x80]
   * @param {Number} [dest=0x00]
   * @param {Number} [hold=0x00]
   * @param {Number} [retrigger=0x00]
   */
  constructor (amount = 0xFF, attack = 0x00, decay = 0x80, dest = 0x00, hold = 0x00, retrigger = 0x00) {
    super()

    this.amount = amount
    this.attack = attack
    this.decay = decay
    this.dest = dest
    this.hold = hold
    this.retrigger = retrigger
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      amount: this.amount,
      attack: this.attack,
      decay: this.decay,
      dest: this.dest,
      // destStr CANNOT be set here
      hold: this.hold,
      retrigger: this.retrigger
    }
  }

  /**
   * Returns a string representation of the destination.
   *
   * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The instrument
   */
  destToStr (instr) {
    const envLFODests = instr.getEnvLfoDests()

    return envLFODests[this.dest] || `UNK (${toM8HexStr(this.dest)})`
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new EnvelopeParameters(object?.amount, object?.attack, object?.decay, object?.dest, object?.hold,
                                  object?.retrigger)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['amount', 'attack', 'decay', 'dest', 'destStr', 'hold', 'retrigger']
  }
}

module.exports = EnvelopeParameters
