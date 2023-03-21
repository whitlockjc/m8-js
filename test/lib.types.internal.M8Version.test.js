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

const M8Version = require('../lib/types/internal/M8Version')
const m8v = new M8Version(1, 2, 3)

describe('M8Version tests', () => {
  test('constructor', () => {
    expect(m8v.majorVersion).toEqual(1)
    expect(m8v.minorVersion).toEqual(2)
    expect(m8v.patchVersion).toEqual(3)
  })

  test('constructor with invalid arguments', () => {
    expect(() => new M8Version()).toThrowError(/^majorVersion must be provided$/)
    expect(() => new M8Version(new Date())).toThrowError(/^majorVersion must be a Number$/)
    expect(() => new M8Version(1)).toThrowError(/^minorVersion must be provided$/)
    expect(() => new M8Version(1, 'test')).toThrowError(/^minorVersion must be a Number$/)
    expect(() => new M8Version(1, 2)).toThrowError(/^patchVersion must be provided$/)
    expect(() => new M8Version(1, 2, true)).toThrowError(/^patchVersion must be a Number$/)
  })

  test('#compare()', () => {
    // Less than
    expect(m8v.compare(new M8Version(2, 2, 3))).toEqual(-1)
    expect(m8v.compare(new M8Version(1, 3, 3))).toEqual(-1)
    expect(m8v.compare(new M8Version(1, 2, 4))).toEqual(-1)
    // Equals
    expect(m8v.compare(new M8Version(1, 2, 3))).toEqual(0)
    // Greater than
    // Less than
    expect(m8v.compare(new M8Version(0, 2, 3))).toEqual(1)
    expect(m8v.compare(new M8Version(1, 1, 3))).toEqual(1)
    expect(m8v.compare(new M8Version(1, 2, 2))).toEqual(1)
  })

  test('#fromObject and #asObject', () => {
    const origObject = m8v.asObject()
    const origVersion = M8Version.fromObject(origObject)

    expect(origVersion).toEqual(m8v)

    const alteredVersion = M8Version.fromObject(origVersion.asObject())

    alteredVersion.minorVersion = 5

    expect(M8Version.fromObject(alteredVersion.asObject())).toEqual(alteredVersion)
  })

  // All other RGB features are inherently tested by Theme tests
  test('#getObjectProperties', () => {
    expect(M8Version.getObjectProperties()).toEqual(Object.keys(m8v.asObject()))
  })

  test('#toString()', () => {
    expect(m8v.toString()).toEqual('1.2.3')
  })
})
