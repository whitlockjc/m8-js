# m8-js

This repository contains a JavaScript library for parsing [Dirtywave][dirtywave] M8 files, as well as a CLI for
interacting with M8 files.  The hopes are not to provide yet another UI for M8 files, or to create any sort of
competing product, but to provide programmatic access to the M8 resources stored in the M8 files for things like
third-party features _(things that maybe M8 doesn't support itself, but you find useful)_ and utilities.

## Current Status

As of version `v0.1.0`, `m8-js` has the ability to read and write all known M8 file types. The API and its object model
are pretty solid, complete with unit test over 99% code coverage. The CLI is equally solid, also unit tested with over
99% code coverage.

## Installation

### Global

Installation is performed by issuing the following command:

```
npm install m8-js --global
```

Once you do this, `m8` should be available.

## CLI Usage

`m8 --help` or `m8 help` should give you enough of a starting point for now.  Just know that all commands support the
`--help` flag for command-specific help.

In `0.2.1`, the `m8` command itself is now equivalent to the newly added `view` command which will let you print an M8
file without specifying the M8 file type. _(For example, if you have an M8 song file, you can run `m8 PATH` instead of
`m8 song view PATH`.)_

## API

`m8-js` provides an API for both reading/writing M8 files, but it also provides an object model for programmatically
creating and updating M8 files. Below are some examples to help expedite your `m8-js` usage.

**Note:** For an API Reference, please refer to [docs/API.md](https://github.com/whitlockjc/m8-js/blob/main/docs/API.md).

### API Basics

The objects in `m8-js` were modeled based on my own interpretation of the raw M8 file data as represented in the M8 UI.
**EVERY** object in `m8-js` will mirror M8's unaltered equivalent when created. For example, if you create a new `Song`
object, its representation is identical to a newly created `Song` in M8. The same goes for `Instrument` types, all
settings, etc. If you programmatically create anything, just know that if its constructor takes values, the default
values mirror the M8 default values.

### Object/JSON Representation

Every type in `lib/types` has an `asObject` instance method that will return a JavaScript `Object` representation of
itself. Also, every type in `lib/types` has a static `fromObject` that will allow you to create an instance of itself
based on the JavaScript `Object` provided.

### Reading an M8 file

M8 files are binary files are binary in format, and `m8-js` provides an API for reading all supported M8 files
_(Instruments, Scales, Songs and Themes)_. Here is an exmaple that hows how to read a file from disk:

```js
const fs = require('fs')
const M8 = require('..')

const m8File = M8.loadM8File(Uint8Array.from(fs.readFileSync(m8FilePath))
```

At this point, `m8File` will either be a `lib/types/Scale`, `lib/types/Song`, `lib/types/Theme` or one of the instrument
types in `lib/types/instruments/`.

### Writing an M8 file

Here is an exmaple that hows how to write an M8 type to disk:

```js
const fs = require('fs')
const M8 = require('..')

fs.writeFileSync(M8.dumpM8File(m8File))
```

So long as `m8File` is either a `lib/types/Scale`, `lib/types/Song`, `lib/types/Theme` or one of the instrument
types in `lib/types/instruments/`, `M8.dumpM8File` will return a `Uint8Array` corresponding to the raw bytes for the M8
file.

### Caveats

While the `m8-js` API allows for programmatically creating M8 types, and writing them to files, there is data in the M8
files that are unknown. While creating M8 file types complete via the API should work without issue, the safest way to
ensure complete binary accuracy, use `M8.loadM8File` to load the type you want and after you've manipulated it
programmatically, use `M8.writeM8File` to write it back. If you do not use `M8.loadM8File`, the unknown bytes are
written using known default values for the regions in question instead of the original values loaded from disk.

### Development/Local

Or you can use a local development installation by cloning this repository and installing its dependencies via
`npm install`.

Once you do this, `./bin/m8` should be available.

## Thanks

When I initially started this effort, the only resource I could find to start this journey was this:
<https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9>  Using this, a hex editor and some time on the
[Dirtywave M8 Discord](https://discord.gg/WEavjFNYHh), this project came to life.  Thanks @impbox!

[dirtywave]: https://dirtywave.com/
