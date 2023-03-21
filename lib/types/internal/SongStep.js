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
 * Represents a Song step.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class SongStep extends Serializable {
  /** @member {Array<Number>} */
  tracks

  /**
   * Create a Song Step.
   *
   * @param {Array<Number>} [tracks]
   */
  constructor (tracks) {
    super()

    this.tracks = Array(8).fill(0xFF)

    for (let i = 0; i < this.tracks.length; i++) {
      const value = tracks?.[i]

      if (typeof value === 'number') {
        this.tracks[i] = value
      }
    }
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      tracks: this.tracks
    }
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new SongStep(object?.tracks)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['tracks']
  }
}

module.exports = SongStep
