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

const { getNote } = require('../../helpers')
const FX = require('./FX')
const Serializable = require('./Serializable')

/**
 * Represents a Step (within a Phrase).
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class PhraseStep extends Serializable {
  /** @member {Array<module:m8-js/lib/types.FX>} */
  fx
  /** @member {Number} */
  instrument
  /** @member {Number} */
  note
  /** @member {Number} */
  volume

  /**
   * Creates a Phrase.
   *
   * @param {Array<module:m8-js/lib/types.FX>} [fx]
   * @param {Number} [instrument=0xFF]
   * @param {Number} [note=0xFF]
   * @param {Number} [volume=0xFF]
   */
  constructor (fx, instrument = 0xFF, note = 0xFF, volume = 0xFF) {
    super()

    // eslint-disable-next-line no-unused-vars
    this.fx = Array.from({ length: 3 }, (e, i) => {
      let value = fx?.[i]

      if (typeof value === 'undefined' || value.constructor.name !== 'FX') {
        value = new FX()
      }

      return value
    })
    this.instrument = instrument
    this.note = note
    this.volume = volume
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      fx: this.fx.map((fx) => fx.asObject()),
      instrument: this.instrument,
      note: this.note,
      noteStr: this.noteToStr(),
      volume: this.volume
    }
  }

  /**
   * Returns the string representation of the phrase note.
   *
   * @returns {String}
   */
  noteToStr () {
    const oct = Math.trunc(this.note / 12) + 1
    const key = this.note % 12
    let noteStr = ''

    if (this.note === 0xFF) {
      noteStr = '---'
    } else {
      noteStr = getNote(key)

      if (noteStr.length === 1) {
        noteStr += '-'
      }

      if (oct > 9) {
        if (oct === 10) {
          noteStr += 'A'
        } else {
          noteStr += 'B'
        }
      } else {
        noteStr += oct
      }
    }

    return noteStr
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new PhraseStep(object?.fx?.map((fx) => FX.fromObject(fx)), object?.instrument, object?.note, object?.volume)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['fx', 'instrument', 'note', 'noteStr', 'volume']
  }
}

module.exports = PhraseStep
