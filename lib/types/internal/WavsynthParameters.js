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

const WAVSYNTHShapes = [
  'PULSE 12%', // 0x00
  'PULSE 25%', // 0x01
  'PULSE 50%', // 0x02
  'PULSE 75%', // 0x03
  'SAW', // 0x04
  'TRIANGLE', // 0x05
  'SINE', // 0x06
  'NOISE PITCHED', // 0x07
  'NOISE' // 0x08
]

/**
 * Represents the WAVSYNTH Instrument Parameters.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class WavsynthParameters extends Serializable {
  /** @member {Number} */
  mirror
  /** @member {Number} */
  mult
  /** @member {Number} */
  shape
  /** @member {Number} */
  size
  /** @member {Number} */
  warp

  /**
   * Create the WAVSYNTH Instrument Parameters.
   *
   * @param {Number} [mirror=0x00]
   * @param {Number} [mult=0x00]
   * @param {Number} [shape=0x00]
   * @param {Number} [size=0x20]
   * @param {Number} [warp=0x00]
   */
  constructor (mirror = 0x00, mult = 0x00, shape = 0x00, size = 0x20, warp = 0x00) {
    super()

    this.mirror = mirror
    this.mult = mult
    this.shape = shape
    this.size = size
    this.warp = warp
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      mirror: this.mirror,
      mult: this.mult,
      shape: this.shape,
      shapeStr: this.shapeToStr(),
      size: this.size,
      warp: this.warp
    }
  }

  /**
   * Returns a string representation of the wave shape.
   *
   * @returns {String}
   */
  shapeToStr () {
    const shapeStr = WAVSYNTHShapes[this.shape]

    return typeof shapeStr === 'undefined' ? 'OVERFLOW' : shapeStr
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new WavsynthParameters(object?.mirror, object?.mult, object?.shape, object?.size, object?.warp)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['mirror', 'mult', 'shape', 'shapeStr', 'size', 'warp']
  }
}

module.exports = WavsynthParameters
