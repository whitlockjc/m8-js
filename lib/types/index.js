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

const Chain = require('./Chain')
const FX = require('./FX')
const Groove = require('./Groove')
const { FMSynth, Macrosynth, MIDIOut, None, Sampler, Wavsynth } = require('./Instrument')
const M8FileReader = require('./M8FileReader')
const M8Version = require('./M8Version')
const Phrase = require('./Phrase')
const { Scale } = require('./Scale')
const Table = require('./Table')
const Theme = require('./Theme')

/**
 * Module for `m8-js` types.
 *
 * @module m8-js/lib/types
 */

module.exports = {
  Chain,
  FX,
  Groove,
  Instrument: {
    FMSynth,
    Macrosynth,
    MIDIOut,
    None,
    Sampler,
    Wavsynth
  },
  M8FileReader,
  M8Version,
  Phrase,
  Scale,
  Table,
  Theme
}
