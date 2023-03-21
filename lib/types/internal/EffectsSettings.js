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

const ChorusSettings = require('./ChorusSettings')
const DelaySettings = require('./DelaySettings')
const ReverbSettings = require('./ReverbSettings')
const Serializable = require('./Serializable')

/**
 * Represents the Effects Settings.
 *
 * @class
 *
 * @augments module:m8-js/lib/types/internal.Serializable
 * @memberof module:m8-js/lib/types/internal
 */
class EffectsSettings extends Serializable {
  /** @member {module:m8-js/lib/types/internal.ChorusSettings} */
  chorusSettings
  /** @member {module:m8-js/lib/types/internal.DelaySettings} */
  delaySettings
  /** @member {module:m8-js/lib/types/internal.ReverbSettings} */
  reverbSettings

  /**
   * Create an Effects Settings.
   *
   * @param {module:m8-js/lib/types/internal.ChorusSettings} [chorusSettings]
   */
  constructor (chorusSettings, delaySettings, reverbSettings) {
    super()

    this.chorusSettings = chorusSettings || new ChorusSettings()
    this.delaySettings = delaySettings || new DelaySettings()
    this.reverbSettings = reverbSettings || new ReverbSettings()
  }

  /**
   * @inheritdoc
   */
  asObject () {
    return {
      chorusSettings: this.chorusSettings.asObject(),
      delaySettings: this.delaySettings.asObject(),
      reverbSettings: this.reverbSettings.asObject()
    }
  }

  /**
   * Returns an array of MIDI Mapping labels.
   *
   * @static
   *
   * @returns {Array<String>}
   */
  getMIDIDestLabels () {
    return [
      'CH M.DEP',
      'CH M.FRQ',
      'CH WIDTH',
      'CH REVERB',
      'DEL F.HP',
      'DEL F.LP',
      'DEL TIMEL',
      'DEL TIMER',
      'DEL FBK',
      'DEL WIDTH',
      'DEL REVB',
      'REV F.HP',
      'REV L.HP',
      'REV SIZE',
      'REV DECAY',
      'REV M.DEP',
      'REV M.FRQ',
      'REV WIDTH'
    ]
  }

  /**
   * @inheritdoc
   */
  static fromObject (object) {
    return new EffectsSettings(ChorusSettings.fromObject(object?.chorusSettings),
                               DelaySettings.fromObject(object?.delaySettings),
                               ReverbSettings.fromObject(object?.reverbSettings))
  }

  /**
   * @inheritdoc
   */
  static getObjectProperties () {
    return ['chorusSettings', 'delaySettings', 'reverbSettings']
  }
}

module.exports = EffectsSettings
