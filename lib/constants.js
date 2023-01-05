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

const M8Version = require('./types/M8Version')

// TODO: Create constants for all M8 property sizes

// Exports
module.exports = {
  M8FileHeader: [0x4D, 0x38, 0x56, 0x45, 0x52, 0x53, 0x49, 0x4F, 0x4E],
  M8FileTypes: {
    Instrument: 0x01 << 4,
    Scale: 0x03 << 4,
    Song: 0x00 << 4,
    Theme: 0x02 << 4
  },
  LATEST_M8_VERSION: new M8Version(2, 7, 8),
  VERSION_1_4_0: new M8Version(1, 4, 0),
  VERSION_2_5_0: new M8Version(2, 5, 0),
  VERSION_2_5_1: new M8Version(2, 5, 1),
  VERSION_2_6_0: new M8Version(2, 6, 0),
  VERSION_2_7_0: new M8Version(2, 7, 0)
}
