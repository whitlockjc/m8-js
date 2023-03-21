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

const M8Version = require('./types/internal/M8Version')

// InstrumentKinds is here to help avoid circular dependencies that would happen if we attempted to create a mapping
// using the instrument classes themselves (static properties or methods).

// Known Instrument Kinds
const InstrumentKinds = {
  FMSYNTH: 0x04,
  MACROSYNTH: 0x01,
  MIDIOUT: 0x03,
  NONE: 0xFF,
  SAMPLER: 0x02,
  WAVSYNTH: 0x00
}

// Exports
module.exports = {
  InstrumentKinds,
  LATEST_M8_VERSION: new M8Version(2, 7, 8),
  VERSION_1_4_0: new M8Version(1, 4, 0),
  VERSION_2_5_0: new M8Version(2, 5, 0),
  VERSION_2_5_1: new M8Version(2, 5, 1),
  VERSION_2_6_0: new M8Version(2, 6, 0),
  VERSION_2_7_0: new M8Version(2, 7, 0)
}
