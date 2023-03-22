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

const { loadM8FileAndVerify, loadTheme, m8Text } = require('./helpers')
const { toM8HexStr } = require('../helpers')

/**
 * The action for the 'project mixer' command.
 *
 * @param {String} m8FilePath - The M8 file path
 * @param {module:commander.Option} options - The CLI options
 */
const projectMixer = (m8FilePath, options) => {
  const song = loadM8FileAndVerify(m8FilePath, 'Song')

  // Load the theme
  loadTheme(options.theme)

  const mixerSettings = song.mixerSettings

  let chorusEffects = ''
  let delayEffects = ''
  let effectsVolumes = ''
  let inputVolumes = ''
  let reverbEffects = ''
  let trackVolumes = ''

  chorusEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputChorus[0]))} `
  chorusEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1] === 0xFF ? '  ' : mixerSettings.analogInputChorus[1]))} `
  chorusEffects += `${m8Text.value(toM8HexStr(mixerSettings.usbInputChorus))}`

  delayEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputDelay[0]))} `
  delayEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1] === 0xFF ? '  ' : mixerSettings.analogInputDelay[1]))} `
  delayEffects += `${m8Text.value(toM8HexStr(mixerSettings.usbInputDelay))}`

  effectsVolumes += `${m8Text.value(toM8HexStr(mixerSettings.chorusVolume))}  `
  effectsVolumes += `${m8Text.value(toM8HexStr(mixerSettings.delayVolume))}  `
  effectsVolumes += `${m8Text.value(toM8HexStr(mixerSettings.reverbVolume))}`

  inputVolumes += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[0]))} `

  if (mixerSettings.analogInputVolume[1] !== 0xFF) {
    inputVolumes += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1]))} `
  } else {
    inputVolumes += `${m8Text.empty('--')} `
  }

  inputVolumes += `${m8Text.value(toM8HexStr(mixerSettings.usbInputVolume))}`

  reverbEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputReverb[0]))} `
  reverbEffects += `${m8Text.value(toM8HexStr(mixerSettings.analogInputVolume[1] === 0xFF ? '  ' : mixerSettings.analogInputReverb[1]))} `
  reverbEffects += `${m8Text.value(toM8HexStr(mixerSettings.usbInputReverb))}`

  for (let i = 0; i < mixerSettings.trackVolume.length; i++) {
    trackVolumes += `${m8Text.value(toM8HexStr(mixerSettings.trackVolume[i]))}`

    if (i < mixerSettings.trackVolume.length - 1) {
      trackVolumes += ' '
    }
  }

  console.log(`${m8Text.title('MIXER')}

${m8Text.default('VOLUME:LIMIT')}  ${m8Text.value(toM8HexStr(mixerSettings.masterVolume))}:${m8Text.value(toM8HexStr(mixerSettings.masterLimit))}
${m8Text.default('DJFILT:PEAK')}   ${m8Text.value(toM8HexStr(mixerSettings.djFilter))}:${m8Text.value(toM8HexStr(mixerSettings.djFilterPeak))}


${m8Text.default('1  2  3  4  5  6  7  8')}
${m8Text.default(trackVolumes)}


${m8Text.default('CHO DEL REV INPUT USB')}
${effectsVolumes}  ${inputVolumes}

${m8Text.default('        CHO')} ${chorusEffects}
${m8Text.default('        DEL')} ${delayEffects}
${m8Text.default('        REV')} ${reverbEffects}
`)
}

module.exports = projectMixer
