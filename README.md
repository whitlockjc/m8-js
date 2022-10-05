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

### Development/Local

Or you can use a local development installation by cloning this repository and installing its dependencies via
`npm install`.

Once you do this, `./bin/m8` should be available.

## CLI Usage

`m8 --help` or `m8 help` should give you enough of a starting point for now.  Just know that all commands support the
`--help` flag for command-specific help.

## API Documentation

API documentation is generated from the code's [jsdoc](https://jsdoc.app/) and is located here:
[docs/API.md](https://github.com/whitlockjc/m8-js/blob/main/docs/API.md).

## Thanks

When I initially started this effort, the only resource I could find to start this journey was this:
<https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9>  Using this, a hex editor and some time on the
[Dirtywave M8 Discord](https://discord.gg/WEavjFNYHh), this project came to life.  Thanks @impbox!

[dirtywave]: https://dirtywave.com/
