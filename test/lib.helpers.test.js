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

const { getNote, toM8Bool, toM8Num, toM8HexStr } = require('../lib/helpers')

describe('helpers tests', () => {
  test('#getNote', () => {
    ;[
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
      '?'
    ].forEach((str, i) => {
      expect(getNote(i)).toEqual(str)
    })
  })

  test('#toM8Bool', () => {
    expect(toM8Bool(false)).toEqual('OFF')
    expect(toM8Bool(true)).toEqual('ON')
  })

  test('#toM8Num', () => {
    expect(toM8Num(0x01)).toEqual('01')
    expect(toM8Num(0xFF)).toEqual('255')
    expect(toM8Num(0x01, 3)).toEqual('001')
  })

  test('#toM8HexStr', () => {
    expect(toM8HexStr(0x00)).toEqual('00')
    expect(toM8HexStr(0x00, 0)).toEqual('0')
  })
})
