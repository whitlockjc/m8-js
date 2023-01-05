# Release Notes

## TBD

* API
  * Converted the RGB values for each `Theme` color to be an actual type _(`RGB`)_
  * Refactored all `lib/types/*` that corresdpond to an M8 file to extend the new `lib/types/M8File` class
    * All classes now have their logic for importing/exporting to bytes within their class instead of in `index.js`
  * Removed dependence upon `Buffer` and all APIs taking/returning a `Buffer` now take/return an `Array<Number>`
  * Removed helper methods from `index.js` for reading M8 types/types
    * `loadInstrument`
    * `loadScale`
    * `loadSong`
    * `loadTable`
    * `loadTheme`
  * Removed helper methods from `index.js` for writing M8 files/types
    * `dumpInstrument`
    * `dumpScale`
    * `dumpSong`
    * `dumpTheme`
  * Removed `lib/types/M8FileWriter.js` _(no longer provided value)_

## v0.1.0 _(2022-10-04)_

* API
  * Added helper methods to `index.js` for reading M8 files/types
    * `loadInstrument`
    * `loadScale`
    * `loadSong`
    * `loadTable`
    * `loadTheme`
  * Added helper methods to `index.js` for writing M8 files/types
    * `dumpInstrument` _(Can be called with the `M8FileReader` used to read the `Instrument` to use the original values for skipped/unused bytes)_
    * `dumpScale`
    * `dumpSong` _(Can be called with the `M8FileReader` used to read the `Song` to use the original values for skipped/unused bytes)_
    * `dumpTheme`
  * Added support for reading table data from an `Instrument` file
  * Added `M8FileWriter` to `lib/types/`
  * Moved `M8FileReader` from `index.js` to `lib/types/`
  * Moved all classes from `lib/types.js` to `lib/types/` into their own files
    * `lib/types/Chain.js`
    * `lib/types/FX.js`
    * `lib/types/Groove.js`
    * `lib/types/Instrument.js`
    * `lib/types/M8FileReader.js`
    * `lib/types/M8Version.js`
    * `lib/types/Phrase.js`
    * `lib/types/Scale.js`
    * `lib/types/Song.js`
    * `lib/types/Table.js`
    * `lib/types/Theme.js`
  * Moved logic for sanitizing a `Sampler` instrument's path from `lib/cli.js` to `lib/types/Instrument.SamplerParameters#samplePathToStr`
  * Replaced `readUInt8` with `read` for `lib/types/M8FileReader.js`
  * Updated `lib/types/Instrument.js` to exports instrument-specific types
    * `FMSynth`
    * `Macrosynth`
    * `MIDIOut`
    * `None`
    * `Sampler`
    * `Wavsynth`
  * Updated `loadM8File` to use `M8FileReader` instead of a file path
  * Updated all class constructors to initialize themselves using the default values M8 would use
  * Updated `Song` to default to the appropriate `Scale` objects
  * Updated the `M8FileReader` constructor to use a `Buffer` instead of a file path
  * Various refactorings that are too numerous to mention
* CLI
  * Added `instrument table` command
  * Added `instrument version` command
  * Added `scale version` command
  * Added `song phrase-at` command _(same as `song phrase` but it finds the phrase based on track/chain location so that it can resolve the "previous instrument" for commands)_
  * Added `theme version` command
  * Fixed column alignment for `instrument view` and `song instrument` commands for empty `FMSYNTH` operators
  * Fixed column alignment for `project effects` command
  * Fixed column alignment for `song table` command
  * Fixed issue where booleans were being used for transports in `project midi-settings`
  * Fixed issue where columns were missing for `song groove`
  * Fixed issue where printing a `MIDI OUT` instrument would print `BANK:PG` empty values
  * Fixed issue where printing FX commands fails when relying on knowing the last instrument
  * Fixed issue where the `--starting-row` option was printed by mistake for `project midi-mapping`

## v0.0.3 _(2022-08-03)_

* API
  * Renamed `getWaveStr` in `FMSynthParameters` to `getOscShapeStr`
* CLI
  * Added preview support for `theme view`
  * Added support for M8 firmwares `2.7.0` through `2.7.6` _(`2.7.6` is the latest releast at this time, newer versions will work assuming no breaking changes)_

## v0.0.2 _(2022-29-07)_

* Added `scale view` to the CLI
* Added `song instrument` to the CLI
* Added `theme view` to the CLI
* Added `Theme` support to the API
* Added `Theme` support to the CLI
* Renamed `project details` to `project view` in the CLI
* Removed `instrument table` from the CLI
* Updated `instrument envelope` and `instrument view` to work with M8 Instrument files

## v0.0.1 _(2022-27-07)_

* Initial code drop that provides all known M8 views via the CLI and initial API representation
