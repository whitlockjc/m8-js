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

const { emptyAmplifierParameters, emptyEnvelopeParameters, emptyFilterParameters, emptyLFOParameters, emptyMixerParameters, instrFromObject } = require('../internal/helpers')
const BaseInstrument = require('../internal/BaseInstrument')

// These are JSON Object properties that should be removed (empty)
const EMPTYProperties = ['ampParams', 'envelopes', 'filterParams', 'instrParams', 'lfos', 'mixerParams']

/**
 * Represents a None (empty) Instrument.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/instruments/internal.BaseInstrument
 * @memberof module:m8-js/lib/types/instruments
 */
class None extends BaseInstrument {
  /**
   * Create an Instrument.
   *
   * @param {module:m8-js/lib/types/internal.M8FileReader|module:m8-js/lib/types/internal.M8Version} m8ReaderOrVersion - The M8 file
   * reader or the M8 version of the Instrument
   */
  constructor (m8ReaderOrVersion) {
    super(m8ReaderOrVersion)

    // Empty out the necessary values
    this.fineTune = 0xFF
    this.pitch = 0xFF
    this.volume = 0xFF

    emptyAmplifierParameters(this)
    emptyEnvelopeParameters(this)
    emptyFilterParameters(this)
    emptyLFOParameters(this)
    emptyMixerParameters(this)
  }

  /**
   * @inheritdoc
   */
  asObject () {
    const object = super.asObject()

    // Delete the empty properties
    EMPTYProperties.forEach((prop) => {
      delete object[prop]
    })

    return object
  }

  /**
   * @inheritdoc
   */
  getCommands () {
    return []
  }

  /**
   * @inheritdoc
   */
  getEnvLfoDests () {
    return []
  }

  /**
   * @inheritdoc
   */
  kind () {
    return 0xFF
  }

  /**
   * @inheritdoc
   */
  kindToStr () {
    return 'NONE'
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return instrFromObject(None, undefined, object)
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    const props = BaseInstrument.getObjectProperties()
    // Items to delete by indexe in reverse order so we can delete them incrementally
    const indicesToDelete = EMPTYProperties.map((prop) => props.indexOf(prop)).sort((a, b) => b - a)

    indicesToDelete.forEach((index) => {
      props.splice(index, 1)
    })

    return props
  }
}

module.exports = None
