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

const { LATEST_M8_VERSION } = require('../../constants')
const AmplifierParameters = require('./AmplifierParameters')
const EnvelopeParameters = require('./EnvelopeParameters')
const FilterParameters = require('./FilterParameters')
const LFOParameters = require('./LFOParameters')
const M8Version = require('./M8Version')
const MixerParameters = require('./MixerParameters')
const Table = require('./Table')

/**
 * Empties the Amplifier Parameters.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The M8 Instrument
 */
const emptyAmplifierParameters = (instr) => {
  instr.ampParams.amp = 0xFF
  instr.ampParams.limit = 0xFF
}

/**
 * Empties the Envelope Parameters.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The M8 Instrument
 */
const emptyEnvelopeParameters = (instr) => {
  instr.envelopes.forEach((env) => {
    env.attack = 0xFF
    env.decay = 0xFF
    env.dest = 0xFF
    env.hold = 0xFF
    env.retrigger = 0xFF
  })
}

/**
 * Empties the Filter Parameters.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The M8 Instrument
 */
const emptyFilterParameters = (instr) => {
  instr.filterParams.res = 0xFF
  instr.filterParams.type = 0xFF
}

/**
 * Empties the LFO Parameters.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The M8 Instrument
 */
const emptyLFOParameters = (instr) => {
  instr.lfos.forEach((lfo) => {
    lfo.dest = 0xFF
    lfo.freq = 0xFF
    lfo.retrigger = 0xFF
    lfo.shape = 0xFF
    lfo.triggerMode = 0xFF
  })
}

/**
 * Empties the Mixer Parameters.
 *
 * @param {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH} instr - The M8 Instrument
 */
const emptyMixerParameters = (instr) => {
  instr.mixerParams.cho = 0xFF
  instr.mixerParams.del = 0xFF
  instr.mixerParams.dry = 0xFF
  instr.mixerParams.rev = 0xFF
  instr.mixerParams.pan = 0xFF
}

/**
 * Fills in the M8 Instrument properties based on the provided JSON Object.
 *
 * @param {Function} instrCtr - The constructor function for the M8 Instrument
 * @param {Function} instrParamsCtr - The constructor function for the M8 Instrument parameters
 * @param {Object} object - The JSON Representation of the M8 Instrument
 *
 * @returns {module:m8-js/lib/types/instruments.FMSYNTH|module:m8-js/lib/types/instruments.MACROSYNTH|module:m8-js/lib/types/instruments.MIDIOUT|module:m8-js/lib/types/instruments.NONE|module:m8-js/lib/types/instruments.SAMPLER|module:m8-js/lib/types/instruments.WAVSYNTH}
 */
const instrFromObject = (instrCtr, instrParamsCtr, object) => {
  let m8Version = LATEST_M8_VERSION
  let m8FileType = 'Instrument'

  if (typeof object?.fileMetadata !== 'undefined') {
    if (typeof object.fileMetadata.version !== 'undefined') {
      m8Version = M8Version.fromObject(object.fileMetadata.version)
    }

    if (typeof object.fileMetadata.type !== 'undefined') {
      m8FileType = object.fileMetadata.type
    }
  }

  // eslint-disable-next-line new-cap
  const instr = new instrCtr(m8Version)
  const skippedProps = ['fileMetadata', 'kind', 'kindStr']

  instrCtr.getObjectProperties().forEach((prop) => {
    // Skip the necessary properties
    if (skippedProps.indexOf(prop) > -1) {
      return
    }

    let value = object?.[prop]

    if (typeof value !== 'undefined') {
      switch (prop) {
        case 'ampParams':
          value = AmplifierParameters.fromObject(value)

          break

        case 'envelopes':
          value = value.map((env) => EnvelopeParameters.fromObject(env))

          break

        case 'filterParams':
          value = FilterParameters.fromObject(value)

          break

        case 'instrParams':
          if (typeof instrParamsCtr !== 'undefined') {
            value = instrParamsCtr.fromObject(value)
          } else {
            value = undefined
          }

          break

        case 'lfos':
          value = value.map((lfo) => LFOParameters.fromObject(lfo)).slice(0, instr.lfos.length)

          break

        case 'mixerParams':
          value = MixerParameters.fromObject(value)

          break

        case 'table':
          // Only read the Table when reading an Instrument file type
          if (m8FileType === 'Instrument') {
            value = Table.fromObject(value)
          }

          break

        default:
          // Do nothing
      }
    }

    // Do not overwrite the default value if there was no provided value
    if (typeof value !== 'undefined') {
      instr[prop] = value
    }
  })

  return instr
}

module.exports = {
  emptyAmplifierParameters,
  emptyEnvelopeParameters,
  emptyFilterParameters,
  emptyLFOParameters,
  emptyMixerParameters,
  instrFromObject
}
