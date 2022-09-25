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
const Scale = require('./types/Scale')
const Theme = require('./types/Theme')

// TODO: Create constants for all M8 property sizes

const DefaultScales = new Array(16)

// CHROMATIC
DefaultScales[0] = new Scale()
DefaultScales[0].name = 'CHROMATIC'

// MAJOR
DefaultScales[1] = new Scale()
DefaultScales[1].name = 'MAJOR'
DefaultScales[1].intervals[1].enabled = false
DefaultScales[1].intervals[3].enabled = false
DefaultScales[1].intervals[6].enabled = false
DefaultScales[1].intervals[8].enabled = false
DefaultScales[1].intervals[10].enabled = false

// MINOR
DefaultScales[2] = new Scale()
DefaultScales[2].name = 'MINOR'
DefaultScales[2].intervals[1].enabled = false
DefaultScales[2].intervals[4].enabled = false
DefaultScales[2].intervals[6].enabled = false
DefaultScales[2].intervals[9].enabled = false
DefaultScales[2].intervals[11].enabled = false

// DORIAN
DefaultScales[3] = new Scale()
DefaultScales[3].name = 'DORIAN'
DefaultScales[3].intervals[1].enabled = false
DefaultScales[3].intervals[4].enabled = false
DefaultScales[3].intervals[6].enabled = false
DefaultScales[3].intervals[8].enabled = false
DefaultScales[3].intervals[11].enabled = false

// LYDIAN
DefaultScales[4] = new Scale()
DefaultScales[4].name = 'LYDIAN'
DefaultScales[4].intervals[1].enabled = false
DefaultScales[4].intervals[3].enabled = false
DefaultScales[4].intervals[5].enabled = false
DefaultScales[4].intervals[8].enabled = false
DefaultScales[4].intervals[10].enabled = false

// MIXOLYDIAN
DefaultScales[5] = new Scale()
DefaultScales[5].name = 'MIXOLYDIAN'
DefaultScales[5].intervals[1].enabled = false
DefaultScales[5].intervals[3].enabled = false
DefaultScales[5].intervals[6].enabled = false
DefaultScales[5].intervals[8].enabled = false
DefaultScales[5].intervals[10].enabled = false

// LOCRIAN
DefaultScales[6] = new Scale()
DefaultScales[6].name = 'LOCRIAN'
DefaultScales[6].intervals[2].enabled = false
DefaultScales[6].intervals[4].enabled = false
DefaultScales[6].intervals[7].enabled = false
DefaultScales[6].intervals[9].enabled = false
DefaultScales[6].intervals[11].enabled = false

// PENTATONIC
DefaultScales[7] = new Scale()
DefaultScales[7].name = 'PENTATONIC'
DefaultScales[7].intervals[1].enabled = false
DefaultScales[7].intervals[3].enabled = false
DefaultScales[7].intervals[5].enabled = false
DefaultScales[7].intervals[6].enabled = false
DefaultScales[7].intervals[8].enabled = false
DefaultScales[7].intervals[10].enabled = false
DefaultScales[7].intervals[11].enabled = false

// MINOR PENTATONIC
DefaultScales[8] = new Scale()
DefaultScales[8].name = 'MINOR PENTATONIC'
DefaultScales[8].intervals[1].enabled = false
DefaultScales[8].intervals[2].enabled = false
DefaultScales[8].intervals[4].enabled = false
DefaultScales[8].intervals[6].enabled = false
DefaultScales[8].intervals[8].enabled = false
DefaultScales[8].intervals[9].enabled = false
DefaultScales[8].intervals[11].enabled = false

// MAJOR BLUES
DefaultScales[9] = new Scale()
DefaultScales[9].name = 'MAJOR BLUES'
DefaultScales[9].intervals[1].enabled = false
DefaultScales[9].intervals[6].enabled = false
DefaultScales[9].intervals[7].enabled = false
DefaultScales[9].intervals[10].enabled = false
DefaultScales[9].intervals[11].enabled = false

// MINOR BLUES
DefaultScales[10] = new Scale()
DefaultScales[10].name = 'MINOR BLUES'
DefaultScales[10].intervals[1].enabled = false
DefaultScales[10].intervals[2].enabled = false
DefaultScales[10].intervals[4].enabled = false
DefaultScales[10].intervals[8].enabled = false
DefaultScales[10].intervals[9].enabled = false
DefaultScales[10].intervals[11].enabled = false

// ROMANIAN MINOR
DefaultScales[11] = new Scale()
DefaultScales[11].name = 'ROMANIAN MINOR'
DefaultScales[11].intervals[1].enabled = false
DefaultScales[11].intervals[4].enabled = false
DefaultScales[11].intervals[5].enabled = false
DefaultScales[11].intervals[8].enabled = false
DefaultScales[11].intervals[11].enabled = false

// HIRAJOSHI
DefaultScales[12] = new Scale()
DefaultScales[12].name = 'HIRAJOSHI'
DefaultScales[12].intervals[1].enabled = false
DefaultScales[12].intervals[4].enabled = false
DefaultScales[12].intervals[5].enabled = false
DefaultScales[12].intervals[6].enabled = false
DefaultScales[12].intervals[9].enabled = false
DefaultScales[12].intervals[10].enabled = false
DefaultScales[12].intervals[11].enabled = false

// KUMOIJOSHI
DefaultScales[13] = new Scale()
DefaultScales[13].name = 'KUMOIJOSHI'
DefaultScales[13].intervals[2].enabled = false
DefaultScales[13].intervals[3].enabled = false
DefaultScales[13].intervals[4].enabled = false
DefaultScales[13].intervals[6].enabled = false
DefaultScales[13].intervals[9].enabled = false
DefaultScales[13].intervals[10].enabled = false
DefaultScales[13].intervals[11].enabled = false

// IN-SEN
DefaultScales[14] = new Scale()
DefaultScales[14].name = 'IN-SEN'
DefaultScales[14].intervals[2].enabled = false
DefaultScales[14].intervals[3].enabled = false
DefaultScales[14].intervals[4].enabled = false
DefaultScales[14].intervals[6].enabled = false
DefaultScales[14].intervals[8].enabled = false
DefaultScales[14].intervals[9].enabled = false
DefaultScales[14].intervals[11].enabled = false

// IWATO
DefaultScales[14] = new Scale()
DefaultScales[14].name = 'IWATO'
DefaultScales[14].intervals[2].enabled = false
DefaultScales[14].intervals[3].enabled = false
DefaultScales[14].intervals[4].enabled = false
DefaultScales[14].intervals[7].enabled = false
DefaultScales[14].intervals[8].enabled = false
DefaultScales[14].intervals[9].enabled = false
DefaultScales[14].intervals[11].enabled = false

// Exports
module.exports = {
  DefaultScales,
  DefaultTheme: new Theme(),
  LATEST_M8_VERSION: new M8Version(2, 7, 8),
  VERSION_1_4_0: new M8Version(1, 4, 0),
  VERSION_2_5_0: new M8Version(2, 5, 0),
  VERSION_2_5_1: new M8Version(2, 5, 1),
  VERSION_2_6_0: new M8Version(2, 6, 0),
  VERSION_2_7_0: new M8Version(2, 7, 0)
}
