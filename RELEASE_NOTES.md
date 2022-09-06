# Release Notes

## TBD

* API
  * Moved `M8FileReader` from `index.js` to `lib/types.js`
  * Updated `loadM8File` to use `Buffer` instead of a file path
  * Updated the `M8FileReader` constructor to use a `Buffer` instead of a file path

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
