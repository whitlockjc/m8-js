# m8-js

This repository contains a JavaScript library for parsing [Dirtywave][dirtywave] M8 files, as well as a CLI for
interacting with M8 files.  The hopes are not to provide yet another UI for M8 files, or to create any sort of
competing product, but to provide programmatic access to the M8 resources stored in the M8 files for things like
third-party features _(things that maybe M8 doesn't support itself, but you find useful)_ and utilities.

## Current Status

As of the time of writing this, parsing M8 project/song files is supported programmatically and via the CLI.  The CLI
has a command that should allow rendering ever M8 screen which is really for easily inspecting your files, and to
validate the API since there are no formal tests _(yet)_.  Also, this is being written as the initial code dump is
being created so the code needs some cleanup, and there are a plethora of `TODO` items.

The plan is to update the API and CLI to work with all M8 Files _(instrument files, scale files, theme files, etc.)_ and
to create M8 resources for writing tests.  I could also see there being some useful features around finding/listing
M8 objects using filters of sorts.  Lastly, this work started with the `2.5.1` firmware and was tested using `2.6.0`.
Immediate work will begin on adding support for all changes since `2.6.0`.

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

### CLI Usage

`m8 --help` or `m8 help` should give you enough of a starting point for now.  Just know that all commands support the
`--help` flag for command-specific help.

### Thanks

When I initially started this effort, the only resource I could find to start this journey was this:
<https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9>  Using this, a hex editor and some time on the
[Dirtywave M8 Discord](https://discord.gg/WEavjFNYHh), this project came to life.  Thanks @impbox!

[dirtywave]: https://dirtywave.com/
