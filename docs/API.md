## Modules

<dl>
<dt><a href="#module_m8-js/lib/helpers">m8-js/lib/helpers</a></dt>
<dd><p>Various helper methods that don&#39;t belong within a specific type (just yet).</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#dumpInstrument">dumpInstrument(instrument, [skipHeader])</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>Dumps an M8 Instrument to its bytes representation.</p>
</dd>
<dt><a href="#dumpScale">dumpScale(scale, [skipHeader])</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>Dumps an M8 Scale to its bytes representation.</p>
</dd>
<dt><a href="#dumpSong">dumpSong(song)</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>Dumps an M8 Song to its bytes representation.</p>
</dd>
<dt><a href="#dumpTable">dumpTable(table)</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>Dumps an M8 Table to its bytes representation.</p>
</dd>
<dt><a href="#dumpTheme">dumpTheme(theme)</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>Dumps an M8 Theme to its bytes representation.</p>
</dd>
<dt><a href="#loadInstrument">loadInstrument(fileReader)</a> ⇒ <code>module:m8-js/lib/types/instruments.FMSYNTH</code> | <code>module:m8-js/lib/types/instruments.MACROSYNTH</code> | <code>module:m8-js/lib/types/instruments.MIDIOUT</code> | <code>module:m8-js/lib/types/instruments.NONE</code> | <code>module:m8-js/lib/types/instruments.SAMPLER</code> | <code>module:m8-js/lib/types/instruments.WAVSYNTH</code></dt>
<dd><p>Loads an M8 Instrument from its bytes.</p>
</dd>
<dt><a href="#loadScale">loadScale(fileReader)</a> ⇒ <code><a href="#module_m8-js/lib/types.Scale">Scale</a></code></dt>
<dd><p>Loads an M8 Scale from its bytes.</p>
</dd>
<dt><a href="#loadSong">loadSong(fileReader)</a> ⇒ <code><a href="#module_m8-js/lib/types.Song">Song</a></code></dt>
<dd><p>Loads an M8 Song from its bytes.</p>
</dd>
<dt><a href="#loadTable">loadTable(fileReader)</a> ⇒ <code>module:m8-js/lib/types.Table</code></dt>
<dd><p>Loads an M8 Table from its bytes.</p>
</dd>
<dt><a href="#loadTheme">loadTheme(fileReader)</a> ⇒ <code><a href="#module_m8-js/lib/types.Theme">Theme</a></code></dt>
<dd><p>Loads an M8 Theme from its bytes.</p>
</dd>
<dt><a href="#dumpM8File">dumpM8File(m8File)</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>Dumps an M8 file and returns its bytes.</p>
</dd>
<dt><a href="#loadM8File">loadM8File(bytes)</a> ⇒ <code><a href="#module_m8-js/lib/types.Scale">Scale</a></code> | <code><a href="#module_m8-js/lib/types.Song">Song</a></code> | <code><a href="#module_m8-js/lib/types.Theme">Theme</a></code> | <code>module:m8-js/lib/types/instruments.FMSYNTH</code> | <code>module:m8-js/lib/types/instruments.MACROSYNTH</code> | <code>module:m8-js/lib/types/instruments.MIDIOUT</code> | <code>module:m8-js/lib/types/instruments.NONE</code> | <code>module:m8-js/lib/types/instruments.SAMPLER</code> | <code>module:m8-js/lib/types/instruments.WAVSYNTH</code></dt>
<dd><p>Loads an M8 file and returns the appropriate corresdponding object.</p>
</dd>
</dl>

<a name="module_m8-js/lib/helpers"></a>

## m8-js/lib/helpers
Various helper methods that don't belong within a specific type (just yet).


* [m8-js/lib/helpers](#module_m8-js/lib/helpers)
    * [~bytesForSkippedData([fileReader], offset, length, defaultValue)](#module_m8-js/lib/helpers..bytesForSkippedData) ⇒ <code>Array.&lt;Number&gt;</code>
    * [~bytesFromBool(bool)](#module_m8-js/lib/helpers..bytesFromBool) ⇒ <code>Number</code>
    * [~bytesFromFloatLE(num)](#module_m8-js/lib/helpers..bytesFromFloatLE) ⇒ <code>Array.&lt;Number&gt;</code>
    * [~bytesFromString(theString, padTo, [padValue])](#module_m8-js/lib/helpers..bytesFromString) ⇒ <code>Array.&lt;Number&gt;</code>
    * [~getNote(val)](#module_m8-js/lib/helpers..getNote) ⇒ <code>Number</code>
    * [~readFloatLE(bytes)](#module_m8-js/lib/helpers..readFloatLE) ⇒ <code>Number</code>
    * [~readUInt16LE(bytes)](#module_m8-js/lib/helpers..readUInt16LE) ⇒ <code>Number</code>
    * [~toM8Bool(val)](#module_m8-js/lib/helpers..toM8Bool) ⇒ <code>String</code>
    * [~toM8Num(val, [len])](#module_m8-js/lib/helpers..toM8Num) ⇒ <code>String</code>
    * [~toM8HexStr(val, [len])](#module_m8-js/lib/helpers..toM8HexStr) ⇒ <code>String</code>

<a name="module_m8-js/lib/helpers..bytesForSkippedData"></a>

### m8-js/lib/helpers~bytesForSkippedData([fileReader], offset, length, defaultValue) ⇒ <code>Array.&lt;Number&gt;</code>
Returns the bytes of unknown/unused data from the original M8 File Reader when present, or a default value.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| [fileReader] | <code>module:m8-js/lib/types/internal.M8FileReader</code> | The M8 file reader |
| offset | <code>Number</code> | The offset |
| length | <code>Number</code> | The number of bytes to write |
| defaultValue | <code>Number</code> | The default value when the offest value wasn't skipped or there is no M8 file reader |

<a name="module_m8-js/lib/helpers..bytesFromBool"></a>

### m8-js/lib/helpers~bytesFromBool(bool) ⇒ <code>Number</code>
Returns the byte representation of the boolean.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| bool | <code>Boolean</code> | The boolean |

<a name="module_m8-js/lib/helpers..bytesFromFloatLE"></a>

### m8-js/lib/helpers~bytesFromFloatLE(num) ⇒ <code>Array.&lt;Number&gt;</code>
Returns a 4-byte array for the 32-bit, little-endian float.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | The 32-bit, little-endian float |

<a name="module_m8-js/lib/helpers..bytesFromString"></a>

### m8-js/lib/helpers~bytesFromString(theString, padTo, [padValue]) ⇒ <code>Array.&lt;Number&gt;</code>
Write the string to the file's content and pad the end with empty values when necessar.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| theString | <code>String</code> | The string value to write |
| padTo | <code>Number</code> | The number of bytes in storage to use regardless of string length |
| [padValue] | <code>Number</code> | The pad value to use |

<a name="module_m8-js/lib/helpers..getNote"></a>

### m8-js/lib/helpers~getNote(val) ⇒ <code>Number</code>
Returns a String representation of a Number note value.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | The raw note value |

<a name="module_m8-js/lib/helpers..readFloatLE"></a>

### m8-js/lib/helpers~readFloatLE(bytes) ⇒ <code>Number</code>
Reads a 32-bit, little-endian float from the 4 bytes.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Array.&lt;Number&gt;</code> | The bytes |

<a name="module_m8-js/lib/helpers..readUInt16LE"></a>

### m8-js/lib/helpers~readUInt16LE(bytes) ⇒ <code>Number</code>
Reads an unsigned, little-endian 16-bit integer from the two bytes.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Array.&lt;Number&gt;</code> | The bytes |

<a name="module_m8-js/lib/helpers..toM8Bool"></a>

### m8-js/lib/helpers~toM8Bool(val) ⇒ <code>String</code>
Turns the boolean to `ON` or `OFF`.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Boolean</code> | the boolean to pretty print |

<a name="module_m8-js/lib/helpers..toM8Num"></a>

### m8-js/lib/helpers~toM8Num(val, [len]) ⇒ <code>String</code>
Raw number with zero padding of configurable length

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| val | <code>Number</code> |  | the number to pretty print |
| [len] | <code>Number</code> | <code>2</code> | the optional length of the number |

<a name="module_m8-js/lib/helpers..toM8HexStr"></a>

### m8-js/lib/helpers~toM8HexStr(val, [len]) ⇒ <code>String</code>
Turns the number into a string representation with 2 digit padding, upper case.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| val | <code>Number</code> |  | the number to convert to pretty printed hex |
| [len] | <code>Number</code> | <code>2</code> | the optional length of the number |

<a name="dumpInstrument"></a>

## dumpInstrument(instrument, [skipHeader]) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 Instrument to its bytes representation.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| instrument | <code>module:m8-js/lib/types/instruments.FMSYNTH</code> \| <code>module:m8-js/lib/types/instruments.MACROSYNTH</code> \| <code>module:m8-js/lib/types/instruments.MIDIOUT</code> \| <code>module:m8-js/lib/types/instruments.NONE</code> \| <code>module:m8-js/lib/types/instruments.SAMPLER</code> \| <code>module:m8-js/lib/types/instruments.WAVSYNTH</code> |  | The M8 Instrument to dump |
| [skipHeader] | <code>Boolean</code> | <code>false</code> | Whether or not to include the M8 file header in the returned bytes |

<a name="dumpScale"></a>

## dumpScale(scale, [skipHeader]) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 Scale to its bytes representation.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| scale | [<code>Scale</code>](#module_m8-js/lib/types.Scale) |  | The M8 Scale to dump |
| [skipHeader] | <code>Boolean</code> | <code>false</code> | Whether or not to include the M8 file header in the returned bytes |

<a name="dumpSong"></a>

## dumpSong(song) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 Song to its bytes representation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| song | [<code>Song</code>](#module_m8-js/lib/types.Song) | The Song to dump |

<a name="dumpTable"></a>

## dumpTable(table) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 Table to its bytes representation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>module:m8-js/lib/types.Table</code> | The Table to dump |

<a name="dumpTheme"></a>

## dumpTheme(theme) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 Theme to its bytes representation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| theme | [<code>Theme</code>](#module_m8-js/lib/types.Theme) | The M8 Theme to dump |

<a name="loadInstrument"></a>

## loadInstrument(fileReader) ⇒ <code>module:m8-js/lib/types/instruments.FMSYNTH</code> \| <code>module:m8-js/lib/types/instruments.MACROSYNTH</code> \| <code>module:m8-js/lib/types/instruments.MIDIOUT</code> \| <code>module:m8-js/lib/types/instruments.NONE</code> \| <code>module:m8-js/lib/types/instruments.SAMPLER</code> \| <code>module:m8-js/lib/types/instruments.WAVSYNTH</code>
Loads an M8 Instrument from its bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | <code>module:m8-js/lib/types.M8FileReader</code> | The M8 file reader |

<a name="loadScale"></a>

## loadScale(fileReader) ⇒ [<code>Scale</code>](#module_m8-js/lib/types.Scale)
Loads an M8 Scale from its bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | <code>module:m8-js/lib/types.M8FileReader</code> | The M8 file reader |

<a name="loadSong"></a>

## loadSong(fileReader) ⇒ [<code>Song</code>](#module_m8-js/lib/types.Song)
Loads an M8 Song from its bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | <code>module:m8-js/lib/types.M8FileReader</code> | The M8 file reader |

<a name="loadTable"></a>

## loadTable(fileReader) ⇒ <code>module:m8-js/lib/types.Table</code>
Loads an M8 Table from its bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | <code>module:m8-js/lib/types.M8FileReader</code> | The M8 file reader |

<a name="loadTheme"></a>

## loadTheme(fileReader) ⇒ [<code>Theme</code>](#module_m8-js/lib/types.Theme)
Loads an M8 Theme from its bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | <code>module:m8-js/lib/types.M8FileReader</code> | The M8 file reader |

<a name="dumpM8File"></a>

## dumpM8File(m8File) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 file and returns its bytes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| m8File | <code>module:m8-js/lib/types.M8File</code> | The M8File instance to dump |

<a name="loadM8File"></a>

## loadM8File(bytes) ⇒ [<code>Scale</code>](#module_m8-js/lib/types.Scale) \| [<code>Song</code>](#module_m8-js/lib/types.Song) \| [<code>Theme</code>](#module_m8-js/lib/types.Theme) \| <code>module:m8-js/lib/types/instruments.FMSYNTH</code> \| <code>module:m8-js/lib/types/instruments.MACROSYNTH</code> \| <code>module:m8-js/lib/types/instruments.MIDIOUT</code> \| <code>module:m8-js/lib/types/instruments.NONE</code> \| <code>module:m8-js/lib/types/instruments.SAMPLER</code> \| <code>module:m8-js/lib/types/instruments.WAVSYNTH</code>
Loads an M8 file and returns the appropriate corresdponding object.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Array.&lt;Number&gt;</code> | The raw M8 file bytes |

