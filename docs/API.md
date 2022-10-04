## Modules

<dl>
<dt><a href="#module_m8-js">m8-js</a></dt>
<dd><p>Module for loading/interacting with <a href="https://dirtywave.com/">Dirtywave</a> M8 instrument/song files.</p>
</dd>
<dt><a href="#module_m8-js/lib/helpers">m8-js/lib/helpers</a></dt>
<dd><p>Various helper methods that don&#39;t belong within a specific type (just yet).</p>
</dd>
<dt><a href="#module_m8-js/lib/types">m8-js/lib/types</a></dt>
<dd><p>Module for <code>m8-js</code> types.</p>
</dd>
</dl>

<a name="module_m8-js"></a>

## m8-js
Module for loading/interacting with [Dirtywave](https://dirtywave.com/) M8 instrument/song files.

**See**: [https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9](https://gist.github.com/ftsf/223b0fc761339b3c23dda7dd891514d9) for original Nim sources.  

* [m8-js](#module_m8-js)
    * [~dumpInstrument(instrument)](#module_m8-js..dumpInstrument) ⇒ <code>module:m8-js.Buffer</code>
    * [~dumpScale(scale)](#module_m8-js..dumpScale) ⇒ <code>module:m8-js.Buffer</code>
    * [~dumpTable(table)](#module_m8-js..dumpTable) ⇒ <code>Array.&lt;Number&gt;</code>
    * [~dumpTheme(theme)](#module_m8-js..dumpTheme) ⇒ <code>module:m8-js.Buffer</code>
    * [~loadInstrument(fileReader)](#module_m8-js..loadInstrument) ⇒ [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)
    * [~loadScale(fileReader)](#module_m8-js..loadScale) ⇒ [<code>Scale</code>](#module_m8-js/lib/types.Scale)
    * [~loadSong(fileReader)](#module_m8-js..loadSong) ⇒ [<code>Song</code>](#module_m8-js/lib/types.Song)
    * [~loadTable(fileReader)](#module_m8-js..loadTable) ⇒ [<code>Table</code>](#module_m8-js/lib/types.Table)
    * [~loadTheme(fileReader)](#module_m8-js..loadTheme) ⇒ [<code>Theme</code>](#module_m8-js/lib/types.Theme)
    * [~loadM8File(fileReader)](#module_m8-js..loadM8File) ⇒ [<code>Instrument</code>](#module_m8-js/lib/types.Instrument) \| [<code>Scale</code>](#module_m8-js/lib/types.Scale) \| [<code>Song</code>](#module_m8-js/lib/types.Song) \| [<code>Theme</code>](#module_m8-js/lib/types.Theme)
    * [~Buffer](#external_Buffer)

<a name="module_m8-js..dumpInstrument"></a>

### m8-js~dumpInstrument(instrument) ⇒ <code>module:m8-js.Buffer</code>
Dumps an M8 Instrument file to bytes.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| instrument | [<code>Instrument</code>](#module_m8-js/lib/types.Instrument) | The M8 Instrument |

<a name="module_m8-js..dumpScale"></a>

### m8-js~dumpScale(scale) ⇒ <code>module:m8-js.Buffer</code>
Dumps an M8 Scale file to bytes.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| scale | [<code>Scale</code>](#module_m8-js/lib/types.Scale) | The M8 Scale to generate bytes for |

<a name="module_m8-js..dumpTable"></a>

### m8-js~dumpTable(table) ⇒ <code>Array.&lt;Number&gt;</code>
Dumps an M8 Table to bytes.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| table | [<code>Table</code>](#module_m8-js/lib/types.Table) | The M8 Table to generate bytes for |

<a name="module_m8-js..dumpTheme"></a>

### m8-js~dumpTheme(theme) ⇒ <code>module:m8-js.Buffer</code>
Dumps an M8 Theme file to bytes.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| theme | [<code>Theme</code>](#module_m8-js/lib/types.Theme) | The M8 Theme to generate bytes for |

<a name="module_m8-js..loadInstrument"></a>

### m8-js~loadInstrument(fileReader) ⇒ [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)
Reads an M8 Instrument file.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader) | The M8 file reader |

<a name="module_m8-js..loadScale"></a>

### m8-js~loadScale(fileReader) ⇒ [<code>Scale</code>](#module_m8-js/lib/types.Scale)
Reads an M8 Scale file.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader) | The M8 file reader |

<a name="module_m8-js..loadSong"></a>

### m8-js~loadSong(fileReader) ⇒ [<code>Song</code>](#module_m8-js/lib/types.Song)
Reads an M8 Song file.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader) | The M8 file reader |

<a name="module_m8-js..loadTable"></a>

### m8-js~loadTable(fileReader) ⇒ [<code>Table</code>](#module_m8-js/lib/types.Table)
Reads an M8 Table (from an Instrument or Song file).

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader) | The M8 file reader |

<a name="module_m8-js..loadTheme"></a>

### m8-js~loadTheme(fileReader) ⇒ [<code>Theme</code>](#module_m8-js/lib/types.Theme)
Reads an M8 Theme file.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader) | The M8 file reader |

<a name="module_m8-js..loadM8File"></a>

### m8-js~loadM8File(fileReader) ⇒ [<code>Instrument</code>](#module_m8-js/lib/types.Instrument) \| [<code>Scale</code>](#module_m8-js/lib/types.Scale) \| [<code>Song</code>](#module_m8-js/lib/types.Song) \| [<code>Theme</code>](#module_m8-js/lib/types.Theme)
Reads an M8 file of unknown type.

**Kind**: inner method of [<code>m8-js</code>](#module_m8-js)  
**Returns**: [<code>Instrument</code>](#module_m8-js/lib/types.Instrument) \| [<code>Scale</code>](#module_m8-js/lib/types.Scale) \| [<code>Song</code>](#module_m8-js/lib/types.Song) \| [<code>Theme</code>](#module_m8-js/lib/types.Theme) - }  

| Param | Type | Description |
| --- | --- | --- |
| fileReader | [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader) | The M8 file reader |

<a name="external_Buffer"></a>

### m8-js~Buffer
A Buffer.

**Kind**: inner external of [<code>m8-js</code>](#module_m8-js)  
**See**

- [Node.js](https://nodejs.org/api/buffer.html)
- [Non-Node.js](https://github.com/feross/buffer)

<a name="module_m8-js/lib/helpers"></a>

## m8-js/lib/helpers
Various helper methods that don't belong within a specific type (just yet).


* [m8-js/lib/helpers](#module_m8-js/lib/helpers)
    * [~getNote(val)](#module_m8-js/lib/helpers..getNote) ⇒ <code>Number</code>
    * [~toM8Bool(val)](#module_m8-js/lib/helpers..toM8Bool) ⇒ <code>String</code>
    * [~toM8Num(val, [len])](#module_m8-js/lib/helpers..toM8Num) ⇒ <code>String</code>
    * [~toM8HexStr(val, [len])](#module_m8-js/lib/helpers..toM8HexStr) ⇒ <code>String</code>

<a name="module_m8-js/lib/helpers..getNote"></a>

### m8-js/lib/helpers~getNote(val) ⇒ <code>Number</code>
Returns a String representation of a Number note value.

**Kind**: inner method of [<code>m8-js/lib/helpers</code>](#module_m8-js/lib/helpers)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | The raw note value |

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

<a name="module_m8-js/lib/types"></a>

## m8-js/lib/types
Module for `m8-js` types.


* [m8-js/lib/types](#module_m8-js/lib/types)
    * [.ChainStep](#module_m8-js/lib/types.ChainStep)
        * [new ChainStep()](#new_module_m8-js/lib/types.ChainStep_new)
        * [.phrase](#module_m8-js/lib/types.ChainStep+phrase) : <code>Number</code>
        * [.transpose](#module_m8-js/lib/types.ChainStep+transpose) : <code>Number</code>
    * [.Chain](#module_m8-js/lib/types.Chain)
        * [new Chain()](#new_module_m8-js/lib/types.Chain_new)
        * [.steps](#module_m8-js/lib/types.Chain+steps) : [<code>Array.&lt;ChainStep&gt;</code>](#module_m8-js/lib/types.ChainStep)
    * [.FX](#module_m8-js/lib/types.FX)
        * [new FX()](#new_module_m8-js/lib/types.FX_new)
        * [.command](#module_m8-js/lib/types.FX+command) : <code>Number</code>
        * [.value](#module_m8-js/lib/types.FX+value) : <code>Number</code>
        * [.commandToStr([instrKind])](#module_m8-js/lib/types.FX+commandToStr) ⇒ <code>String</code>
    * [.Groove](#module_m8-js/lib/types.Groove)
        * [new Groove()](#new_module_m8-js/lib/types.Groove_new)
        * [.steps](#module_m8-js/lib/types.Groove+steps) : <code>Array.&lt;Number&gt;</code>
    * [.AmplifierParameters](#module_m8-js/lib/types.AmplifierParameters)
        * [new AmplifierParameters()](#new_module_m8-js/lib/types.AmplifierParameters_new)
        * [.amp](#module_m8-js/lib/types.AmplifierParameters+amp) : <code>Number</code>
        * [.limit](#module_m8-js/lib/types.AmplifierParameters+limit) : <code>Number</code>
        * [.limitToStr()](#module_m8-js/lib/types.AmplifierParameters+limitToStr) ⇒ <code>String</code>
    * [.EnvelopeParameters](#module_m8-js/lib/types.EnvelopeParameters)
        * [new EnvelopeParameters()](#new_module_m8-js/lib/types.EnvelopeParameters_new)
        * [.amount](#module_m8-js/lib/types.EnvelopeParameters+amount) : <code>Number</code>
        * [.attack](#module_m8-js/lib/types.EnvelopeParameters+attack) : <code>Number</code>
        * [.decay](#module_m8-js/lib/types.EnvelopeParameters+decay) : <code>Number</code>
        * [.dest](#module_m8-js/lib/types.EnvelopeParameters+dest) : <code>Number</code>
        * [.hold](#module_m8-js/lib/types.EnvelopeParameters+hold) : <code>Number</code>
        * [.retrigger](#module_m8-js/lib/types.EnvelopeParameters+retrigger) : <code>Number</code>
    * [.FilterParameters](#module_m8-js/lib/types.FilterParameters)
        * [new FilterParameters()](#new_module_m8-js/lib/types.FilterParameters_new)
        * [.cutoff](#module_m8-js/lib/types.FilterParameters+cutoff) : <code>Number</code>
        * [.res](#module_m8-js/lib/types.FilterParameters+res) : <code>Number</code>
        * [.type](#module_m8-js/lib/types.FilterParameters+type) : <code>Number</code>
    * [.FMSynthOperator](#module_m8-js/lib/types.FMSynthOperator)
        * [new FMSynthOperator(m8Version)](#new_module_m8-js/lib/types.FMSynthOperator_new)
        * [.feedback](#module_m8-js/lib/types.FMSynthOperator+feedback) : <code>Number</code>
        * [.level](#module_m8-js/lib/types.FMSynthOperator+level) : <code>Number</code>
        * [.modA](#module_m8-js/lib/types.FMSynthOperator+modA) : <code>Number</code>
        * [.modB](#module_m8-js/lib/types.FMSynthOperator+modB) : <code>Number</code>
        * [.ratio](#module_m8-js/lib/types.FMSynthOperator+ratio) : <code>Number</code>
        * [.ratioFine](#module_m8-js/lib/types.FMSynthOperator+ratioFine) : <code>Number</code>
        * [.shape](#module_m8-js/lib/types.FMSynthOperator+shape) : <code>Number</code>
        * [.shapeToStr()](#module_m8-js/lib/types.FMSynthOperator+shapeToStr) ⇒ <code>String</code>
    * [.FMSynthParameters](#module_m8-js/lib/types.FMSynthParameters)
        * [new FMSynthParameters(m8Version)](#new_module_m8-js/lib/types.FMSynthParameters_new)
        * [.algo](#module_m8-js/lib/types.FMSynthParameters+algo) : <code>Number</code>
        * [.mod1](#module_m8-js/lib/types.FMSynthParameters+mod1) : <code>Number</code>
        * [.mod2](#module_m8-js/lib/types.FMSynthParameters+mod2) : <code>Number</code>
        * [.mod3](#module_m8-js/lib/types.FMSynthParameters+mod3) : <code>Number</code>
        * [.mod4](#module_m8-js/lib/types.FMSynthParameters+mod4) : <code>Number</code>
        * [.operators](#module_m8-js/lib/types.FMSynthParameters+operators) : [<code>Array.&lt;FMSynthOperator&gt;</code>](#module_m8-js/lib/types.FMSynthOperator)
        * [.algoToStr()](#module_m8-js/lib/types.FMSynthParameters+algoToStr) ⇒ <code>String</code>
        * [.modToStr(mod)](#module_m8-js/lib/types.FMSynthParameters+modToStr) ⇒ <code>String</code>
    * [.LFOParameters](#module_m8-js/lib/types.LFOParameters)
        * [new LFOParameters()](#new_module_m8-js/lib/types.LFOParameters_new)
        * [.amount](#module_m8-js/lib/types.LFOParameters+amount) : <code>Number</code>
        * [.dest](#module_m8-js/lib/types.LFOParameters+dest) : <code>Number</code>
        * [.freq](#module_m8-js/lib/types.LFOParameters+freq) : <code>Number</code>
        * [.retrigger](#module_m8-js/lib/types.LFOParameters+retrigger) : <code>Number</code>
        * [.shape](#module_m8-js/lib/types.LFOParameters+shape) : <code>Number</code>
        * [.triggerMode](#module_m8-js/lib/types.LFOParameters+triggerMode) : <code>Number</code>
        * [.shapeToStr()](#module_m8-js/lib/types.LFOParameters+shapeToStr) ⇒ <code>String</code>
    * [.MacrosynthParameters](#module_m8-js/lib/types.MacrosynthParameters)
        * [new MacrosynthParameters(m8Version)](#new_module_m8-js/lib/types.MacrosynthParameters_new)
        * [.color](#module_m8-js/lib/types.MacrosynthParameters+color) : <code>Number</code>
        * [.degrade](#module_m8-js/lib/types.MacrosynthParameters+degrade) : <code>Number</code>
        * [.redux](#module_m8-js/lib/types.MacrosynthParameters+redux) : <code>Number</code>
        * [.shape](#module_m8-js/lib/types.MacrosynthParameters+shape) : <code>Number</code>
        * [.timbre](#module_m8-js/lib/types.MacrosynthParameters+timbre) : <code>Number</code>
        * [.shapeToStr()](#module_m8-js/lib/types.MacrosynthParameters+shapeToStr) ⇒ <code>String</code>
    * [.MIDICC](#module_m8-js/lib/types.MIDICC)
        * [new MIDICC()](#new_module_m8-js/lib/types.MIDICC_new)
        * [.number](#module_m8-js/lib/types.MIDICC+number) : <code>Number</code>
        * [.defaultValue](#module_m8-js/lib/types.MIDICC+defaultValue) : <code>Number</code>
    * [.MIDIOutParameters](#module_m8-js/lib/types.MIDIOutParameters)
        * [new MIDIOutParameters(m8Version)](#new_module_m8-js/lib/types.MIDIOutParameters_new)
        * [.bankSelect](#module_m8-js/lib/types.MIDIOutParameters+bankSelect) : <code>Number</code>
        * [.channel](#module_m8-js/lib/types.MIDIOutParameters+channel) : <code>Number</code>
        * [.customCC](#module_m8-js/lib/types.MIDIOutParameters+customCC) : [<code>Array.&lt;MIDICC&gt;</code>](#module_m8-js/lib/types.MIDICC)
        * [.port](#module_m8-js/lib/types.MIDIOutParameters+port) : <code>Number</code>
        * [.programChange](#module_m8-js/lib/types.MIDIOutParameters+programChange) : <code>Number</code>
        * [.portToStr()](#module_m8-js/lib/types.MIDIOutParameters+portToStr) ⇒ <code>String</code>
    * [.MixerParameters](#module_m8-js/lib/types.MixerParameters)
        * [new MixerParameters()](#new_module_m8-js/lib/types.MixerParameters_new)
        * [.cho](#module_m8-js/lib/types.MixerParameters+cho) : <code>Number</code>
        * [.del](#module_m8-js/lib/types.MixerParameters+del) : <code>Number</code>
        * [.dry](#module_m8-js/lib/types.MixerParameters+dry) : <code>Number</code>
        * [.pan](#module_m8-js/lib/types.MixerParameters+pan) : <code>Number</code>
        * [.rev](#module_m8-js/lib/types.MixerParameters+rev) : <code>Number</code>
    * [.SamplerParameters](#module_m8-js/lib/types.SamplerParameters)
        * [new SamplerParameters()](#new_module_m8-js/lib/types.SamplerParameters_new)
        * [.degrade](#module_m8-js/lib/types.SamplerParameters+degrade) : <code>Number</code>
        * [.length](#module_m8-js/lib/types.SamplerParameters+length) : <code>Number</code>
        * [.loopStart](#module_m8-js/lib/types.SamplerParameters+loopStart) : <code>Number</code>
        * [.playMode](#module_m8-js/lib/types.SamplerParameters+playMode) : <code>Number</code>
        * [.samplePath](#module_m8-js/lib/types.SamplerParameters+samplePath) : <code>String</code>
        * [.slice](#module_m8-js/lib/types.SamplerParameters+slice) : <code>Number</code>
        * [.start](#module_m8-js/lib/types.SamplerParameters+start) : <code>Number</code>
        * [.playModeToStr()](#module_m8-js/lib/types.SamplerParameters+playModeToStr) ⇒ <code>String</code>
        * [.samplePathToStr()](#module_m8-js/lib/types.SamplerParameters+samplePathToStr) ⇒ <code>String</code>
    * [.WavsynthParameters](#module_m8-js/lib/types.WavsynthParameters)
        * [new WavsynthParameters()](#new_module_m8-js/lib/types.WavsynthParameters_new)
        * [.mirror](#module_m8-js/lib/types.WavsynthParameters+mirror) : <code>Number</code>
        * [.mult](#module_m8-js/lib/types.WavsynthParameters+mult) : <code>Number</code>
        * [.shape](#module_m8-js/lib/types.WavsynthParameters+shape) : <code>Number</code>
        * [.size](#module_m8-js/lib/types.WavsynthParameters+size) : <code>Number</code>
        * [.warp](#module_m8-js/lib/types.WavsynthParameters+warp) : <code>Number</code>
        * [.shapeToStr()](#module_m8-js/lib/types.WavsynthParameters+shapeToStr) ⇒ <code>String</code>
    * [.Instrument](#module_m8-js/lib/types.Instrument)
        * [new Instrument(m8Version, kind, kindStr, [instrParams])](#new_module_m8-js/lib/types.Instrument_new)
        * [.ampParams](#module_m8-js/lib/types.Instrument+ampParams) : [<code>AmplifierParameters</code>](#module_m8-js/lib/types.AmplifierParameters)
        * [.author](#module_m8-js/lib/types.Instrument+author) : <code>String</code>
        * [.env](#module_m8-js/lib/types.Instrument+env) : [<code>Array.&lt;EnvelopeParameters&gt;</code>](#module_m8-js/lib/types.EnvelopeParameters)
        * [.filterParams](#module_m8-js/lib/types.Instrument+filterParams) : [<code>FilterParameters</code>](#module_m8-js/lib/types.FilterParameters)
        * [.fineTune](#module_m8-js/lib/types.Instrument+fineTune) : <code>Number</code>
        * [.instrParams](#module_m8-js/lib/types.Instrument+instrParams) : [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters) \| [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters) \| [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters) \| [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters) \| [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)
        * [.kind](#module_m8-js/lib/types.Instrument+kind) : <code>Number</code>
        * [.lfo](#module_m8-js/lib/types.Instrument+lfo) : [<code>Array.&lt;LFOParameters&gt;</code>](#module_m8-js/lib/types.LFOParameters)
        * [.mixerParams](#module_m8-js/lib/types.Instrument+mixerParams) : [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)
        * [.m8Version](#module_m8-js/lib/types.Instrument+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
        * [.name](#module_m8-js/lib/types.Instrument+name) : <code>String</code>
        * [.pitch](#module_m8-js/lib/types.Instrument+pitch) : <code>Number</code>
        * [.tableData](#module_m8-js/lib/types.Instrument+tableData) : [<code>Table</code>](#module_m8-js/lib/types.Table)
        * [.tableTick](#module_m8-js/lib/types.Instrument+tableTick) : <code>Number</code>
        * [.transpose](#module_m8-js/lib/types.Instrument+transpose) : <code>Boolean</code>
        * [.volume](#module_m8-js/lib/types.Instrument+volume) : <code>Number</code>
        * [.destToStr(dest)](#module_m8-js/lib/types.Instrument+destToStr)
        * [.filterTypeToStr()](#module_m8-js/lib/types.Instrument+filterTypeToStr) ⇒ <code>String</code>
        * [.kindToStr()](#module_m8-js/lib/types.Instrument+kindToStr) ⇒ <code>String</code>
        * [.getUnusedBytes()](#module_m8-js/lib/types.Instrument+getUnusedBytes) ⇒ <code>Object</code>
        * [.updateUnusedBytes(unusedBytes)](#module_m8-js/lib/types.Instrument+updateUnusedBytes)
    * [.FMSynth](#module_m8-js/lib/types.FMSynth)
        * [new FMSynth(m8Version)](#new_module_m8-js/lib/types.FMSynth_new)
    * [.Macrosynth](#module_m8-js/lib/types.Macrosynth)
        * [new Macrosynth(m8Version)](#new_module_m8-js/lib/types.Macrosynth_new)
    * [.MIDIOut](#module_m8-js/lib/types.MIDIOut)
        * [new MIDIOut(m8Version)](#new_module_m8-js/lib/types.MIDIOut_new)
    * [.None](#module_m8-js/lib/types.None)
        * [new None(m8Version)](#new_module_m8-js/lib/types.None_new)
    * [.Sampler](#module_m8-js/lib/types.Sampler)
        * [new Sampler(m8Version)](#new_module_m8-js/lib/types.Sampler_new)
    * [.Wavsynth](#module_m8-js/lib/types.Wavsynth)
        * [new Wavsynth(m8Version)](#new_module_m8-js/lib/types.Wavsynth_new)
    * [.M8FileReader](#module_m8-js/lib/types.M8FileReader)
        * [new M8FileReader(buffer)](#new_module_m8-js/lib/types.M8FileReader_new)
        * [.buffer](#module_m8-js/lib/types.M8FileReader+buffer) : <code>module:m8-js.Buffer</code>
        * [.cursor](#module_m8-js/lib/types.M8FileReader+cursor) : <code>Number</code>
        * [.fileType](#module_m8-js/lib/types.M8FileReader+fileType) : <code>Number</code>
        * [.m8Version](#module_m8-js/lib/types.M8FileReader+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
        * [.fileTypeToStr()](#module_m8-js/lib/types.M8FileReader+fileTypeToStr) ⇒ <code>String</code>
        * [.read([len])](#module_m8-js/lib/types.M8FileReader+read) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.readStr(len)](#module_m8-js/lib/types.M8FileReader+readStr) ⇒ <code>String</code>
        * [.skip(len)](#module_m8-js/lib/types.M8FileReader+skip) ⇒ <code>Object</code>
        * [.skipTo(offset)](#module_m8-js/lib/types.M8FileReader+skipTo) ⇒ <code>Object</code>
    * [.M8FileWriter](#module_m8-js/lib/types.M8FileWriter)
        * [new M8FileWriter(fileType, [m8Version])](#new_module_m8-js/lib/types.M8FileWriter_new)
        * [.bytes](#module_m8-js/lib/types.M8FileWriter+bytes) : <code>Array.&lt;Number&gt;</code>
        * [.fileType](#module_m8-js/lib/types.M8FileWriter+fileType) : <code>Number</code>
        * [.m8Version](#module_m8-js/lib/types.M8FileWriter+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
        * [.fileTypeToStr()](#module_m8-js/lib/types.M8FileWriter+fileTypeToStr) ⇒ <code>String</code>
        * [.write(byteOrBytes)](#module_m8-js/lib/types.M8FileWriter+write)
        * [.writeBool(bool)](#module_m8-js/lib/types.M8FileWriter+writeBool)
        * [.writeStr(theString, padTo)](#module_m8-js/lib/types.M8FileWriter+writeStr)
    * [.M8Version](#module_m8-js/lib/types.M8Version)
        * [new M8Version(majorVersion, minorVersion, patchVersion)](#new_module_m8-js/lib/types.M8Version_new)
        * [.majorVersion](#module_m8-js/lib/types.M8Version+majorVersion) : <code>Number</code>
        * [.minorVersion](#module_m8-js/lib/types.M8Version+minorVersion) : <code>Number</code>
        * [.patchVersion](#module_m8-js/lib/types.M8Version+patchVersion) : <code>Number</code>
        * [.compare(other)](#module_m8-js/lib/types.M8Version+compare) ⇒ <code>Number</code>
    * [.PhraseStep](#module_m8-js/lib/types.PhraseStep)
        * [new PhraseStep()](#new_module_m8-js/lib/types.PhraseStep_new)
        * [.fx1](#module_m8-js/lib/types.PhraseStep+fx1) : [<code>FX</code>](#module_m8-js/lib/types.FX)
        * [.fx2](#module_m8-js/lib/types.PhraseStep+fx2) : [<code>FX</code>](#module_m8-js/lib/types.FX)
        * [.fx3](#module_m8-js/lib/types.PhraseStep+fx3) : [<code>FX</code>](#module_m8-js/lib/types.FX)
        * [.instrument](#module_m8-js/lib/types.PhraseStep+instrument) : <code>Number</code>
        * [.note](#module_m8-js/lib/types.PhraseStep+note) : <code>Number</code>
        * [.volume](#module_m8-js/lib/types.PhraseStep+volume) : <code>Number</code>
        * [.noteToStr()](#module_m8-js/lib/types.PhraseStep+noteToStr) ⇒ <code>String</code>
    * [.Phrase](#module_m8-js/lib/types.Phrase)
        * [new Phrase()](#new_module_m8-js/lib/types.Phrase_new)
        * [.steps](#module_m8-js/lib/types.Phrase+steps) : [<code>Array.&lt;PhraseStep&gt;</code>](#module_m8-js/lib/types.PhraseStep)
        * [.findPhraseStepInstrumentNum([phraseStep])](#module_m8-js/lib/types.Phrase+findPhraseStepInstrumentNum) ⇒ <code>Number</code>
    * [.NoteInterval](#module_m8-js/lib/types.NoteInterval)
        * [new NoteInterval()](#new_module_m8-js/lib/types.NoteInterval_new)
        * [.enabled](#module_m8-js/lib/types.NoteInterval+enabled) : <code>Boolean</code>
        * [.offsetA](#module_m8-js/lib/types.NoteInterval+offsetA) : <code>Number</code>
        * [.offsetB](#module_m8-js/lib/types.NoteInterval+offsetB) : <code>Number</code>
        * [.offsetToStr()](#module_m8-js/lib/types.NoteInterval+offsetToStr) ⇒ <code>String</code>
    * [.Scale](#module_m8-js/lib/types.Scale)
        * [new Scale([m8Version])](#new_module_m8-js/lib/types.Scale_new)
        * [.m8Version](#module_m8-js/lib/types.Scale+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
        * [.name](#module_m8-js/lib/types.Scale+name) : <code>String</code>
        * [.intervals](#module_m8-js/lib/types.Scale+intervals) : [<code>Array.&lt;NoteInterval&gt;</code>](#module_m8-js/lib/types.NoteInterval)
    * [.EffectsSettings](#module_m8-js/lib/types.EffectsSettings)
        * [new EffectsSettings()](#new_module_m8-js/lib/types.EffectsSettings_new)
        * [.chorusModDepth](#module_m8-js/lib/types.EffectsSettings+chorusModDepth) : <code>Number</code>
        * [.chorusModFreq](#module_m8-js/lib/types.EffectsSettings+chorusModFreq) : <code>Number</code>
        * [.chorusReverbSend](#module_m8-js/lib/types.EffectsSettings+chorusReverbSend) : <code>Number</code>
        * [.chorusWidth](#module_m8-js/lib/types.EffectsSettings+chorusWidth) : <code>Number</code>
        * [.delayFeedback](#module_m8-js/lib/types.EffectsSettings+delayFeedback) : <code>Number</code>
        * [.delayFilter](#module_m8-js/lib/types.EffectsSettings+delayFilter) : <code>Array.&lt;Number&gt;</code>
        * [.delayReverbSend](#module_m8-js/lib/types.EffectsSettings+delayReverbSend) : <code>Number</code>
        * [.delayTime](#module_m8-js/lib/types.EffectsSettings+delayTime) : <code>Array.&lt;Number&gt;</code>
        * [.delayWidth](#module_m8-js/lib/types.EffectsSettings+delayWidth) : <code>Number</code>
        * [.reverbDamping](#module_m8-js/lib/types.EffectsSettings+reverbDamping) : <code>Number</code>
        * [.reverbFilter](#module_m8-js/lib/types.EffectsSettings+reverbFilter) : <code>Array.&lt;Number&gt;</code>
        * [.reverbModDepth](#module_m8-js/lib/types.EffectsSettings+reverbModDepth) : <code>Number</code>
        * [.reverbModFreq](#module_m8-js/lib/types.EffectsSettings+reverbModFreq) : <code>Number</code>
        * [.reverbSize](#module_m8-js/lib/types.EffectsSettings+reverbSize) : <code>Number</code>
        * [.reverbWidth](#module_m8-js/lib/types.EffectsSettings+reverbWidth) : <code>Number</code>
    * [.MIDIMapping](#module_m8-js/lib/types.MIDIMapping)
        * [new MIDIMapping()](#new_module_m8-js/lib/types.MIDIMapping_new)
        * [.channel](#module_m8-js/lib/types.MIDIMapping+channel) : <code>Number</code>
        * [.controlNum](#module_m8-js/lib/types.MIDIMapping+controlNum) : <code>Number</code>
        * [.empty](#module_m8-js/lib/types.MIDIMapping+empty) : <code>Boolean</code>
        * [.maxValue](#module_m8-js/lib/types.MIDIMapping+maxValue) : <code>Number</code>
        * [.minValue](#module_m8-js/lib/types.MIDIMapping+minValue) : <code>Number</code>
        * [.paramIndex](#module_m8-js/lib/types.MIDIMapping+paramIndex) : <code>Number</code>
        * [.type](#module_m8-js/lib/types.MIDIMapping+type) : <code>Number</code>
        * [.value](#module_m8-js/lib/types.MIDIMapping+value) : <code>Number</code>
        * [.destToStr()](#module_m8-js/lib/types.MIDIMapping+destToStr) ⇒ <code>String</code>
        * [.typeToChar()](#module_m8-js/lib/types.MIDIMapping+typeToChar) ⇒ <code>String</code>
    * [.MIDISettings](#module_m8-js/lib/types.MIDISettings)
        * [new MIDISettings()](#new_module_m8-js/lib/types.MIDISettings_new)
        * [.controlMapChannel](#module_m8-js/lib/types.MIDISettings+controlMapChannel) : <code>Number</code>
        * [.receiveSync](#module_m8-js/lib/types.MIDISettings+receiveSync) : <code>Boolean</code>
        * [.receiveTransport](#module_m8-js/lib/types.MIDISettings+receiveTransport) : <code>Number</code>
        * [.recordNoteChannel](#module_m8-js/lib/types.MIDISettings+recordNoteChannel) : <code>Number</code>
        * [.recordNoteDelayKillCommands](#module_m8-js/lib/types.MIDISettings+recordNoteDelayKillCommands) : <code>Boolean</code>
        * [.recordNoteVelocity](#module_m8-js/lib/types.MIDISettings+recordNoteVelocity) : <code>Boolean</code>
        * [.sendSync](#module_m8-js/lib/types.MIDISettings+sendSync) : <code>Boolean</code>
        * [.sendTransport](#module_m8-js/lib/types.MIDISettings+sendTransport) : <code>Number</code>
        * [.songRowCueChannel](#module_m8-js/lib/types.MIDISettings+songRowCueChannel) : <code>Number</code>
        * [.trackInputChannel](#module_m8-js/lib/types.MIDISettings+trackInputChannel) : <code>Array.&lt;Number&gt;</code>
        * [.trackInputInstrument](#module_m8-js/lib/types.MIDISettings+trackInputInstrument) : <code>Array.&lt;Number&gt;</code>
        * [.trackInputMode](#module_m8-js/lib/types.MIDISettings+trackInputMode) : <code>Number</code>
        * [.trackInputProgramChange](#module_m8-js/lib/types.MIDISettings+trackInputProgramChange) : <code>Boolean</code>
        * [.recordNoteDelayKillCommandsToStr()](#module_m8-js/lib/types.MIDISettings+recordNoteDelayKillCommandsToStr) ⇒ <code>String</code>
        * [.trackInputModeToStr()](#module_m8-js/lib/types.MIDISettings+trackInputModeToStr) ⇒ <code>String</code>
        * [.transportToStr(transport)](#module_m8-js/lib/types.MIDISettings+transportToStr) ⇒ <code>String</code>
    * [.SongStep](#module_m8-js/lib/types.SongStep)
        * [new SongStep()](#new_module_m8-js/lib/types.SongStep_new)
        * [.track1](#module_m8-js/lib/types.SongStep+track1) : <code>Number</code>
        * [.track2](#module_m8-js/lib/types.SongStep+track2) : <code>Number</code>
        * [.track3](#module_m8-js/lib/types.SongStep+track3) : <code>Number</code>
        * [.track4](#module_m8-js/lib/types.SongStep+track4) : <code>Number</code>
        * [.track5](#module_m8-js/lib/types.SongStep+track5) : <code>Number</code>
        * [.track6](#module_m8-js/lib/types.SongStep+track6) : <code>Number</code>
        * [.track7](#module_m8-js/lib/types.SongStep+track7) : <code>Number</code>
        * [.track8](#module_m8-js/lib/types.SongStep+track8) : <code>Number</code>
    * [.MixerSettings](#module_m8-js/lib/types.MixerSettings)
        * [new MixerSettings()](#new_module_m8-js/lib/types.MixerSettings_new)
        * [.analogInputChorus](#module_m8-js/lib/types.MixerSettings+analogInputChorus) : <code>Array.&lt;Number&gt;</code>
        * [.analogInputDelay](#module_m8-js/lib/types.MixerSettings+analogInputDelay) : <code>Array.&lt;Number&gt;</code>
        * [.analogInputReverb](#module_m8-js/lib/types.MixerSettings+analogInputReverb) : <code>Array.&lt;Number&gt;</code>
        * [.analogInputVolume](#module_m8-js/lib/types.MixerSettings+analogInputVolume) : <code>Array.&lt;Number&gt;</code>
        * [.chorusVolume](#module_m8-js/lib/types.MixerSettings+chorusVolume) : <code>Number</code>
        * [.delayVolume](#module_m8-js/lib/types.MixerSettings+delayVolume) : <code>Number</code>
        * [.djFilter](#module_m8-js/lib/types.MixerSettings+djFilter) : <code>Number</code>
        * [.djFilterPeak](#module_m8-js/lib/types.MixerSettings+djFilterPeak) : <code>Number</code>
        * [.masterLimit](#module_m8-js/lib/types.MixerSettings+masterLimit) : <code>Number</code>
        * [.masterVolume](#module_m8-js/lib/types.MixerSettings+masterVolume) : <code>Number</code>
        * [.reverbVolume](#module_m8-js/lib/types.MixerSettings+reverbVolume) : <code>Number</code>
        * [.trackVolume](#module_m8-js/lib/types.MixerSettings+trackVolume) : <code>Array.&lt;Number&gt;</code>
        * [.usbInputChorus](#module_m8-js/lib/types.MixerSettings+usbInputChorus) : <code>Number</code>
        * [.usbInputDelay](#module_m8-js/lib/types.MixerSettings+usbInputDelay) : <code>Number</code>
        * [.usbInputReverb](#module_m8-js/lib/types.MixerSettings+usbInputReverb) : <code>Number</code>
        * [.usbInputVolume](#module_m8-js/lib/types.MixerSettings+usbInputVolume) : <code>Number</code>
    * [.Song](#module_m8-js/lib/types.Song)
        * [new Song(m8Version)](#new_module_m8-js/lib/types.Song_new)
        * [.chains](#module_m8-js/lib/types.Song+chains) : [<code>Array.&lt;Chain&gt;</code>](#module_m8-js/lib/types.Chain)
        * [.directory](#module_m8-js/lib/types.Song+directory) : <code>String</code>
        * [.effectsSettings](#module_m8-js/lib/types.Song+effectsSettings) : [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)
        * [.grooves](#module_m8-js/lib/types.Song+grooves) : [<code>Array.&lt;Groove&gt;</code>](#module_m8-js/lib/types.Groove)
        * [.instruments](#module_m8-js/lib/types.Song+instruments) : [<code>Array.&lt;Instrument&gt;</code>](#module_m8-js/lib/types.Instrument)
        * [.key](#module_m8-js/lib/types.Song+key) : <code>Number</code>
        * [.midiSettings](#module_m8-js/lib/types.Song+midiSettings) : [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)
        * [.mixerSettings](#module_m8-js/lib/types.Song+mixerSettings) : [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)
        * [.name](#module_m8-js/lib/types.Song+name) : <code>String</code>
        * [.phrases](#module_m8-js/lib/types.Song+phrases) : [<code>Array.&lt;Phrase&gt;</code>](#module_m8-js/lib/types.Phrase)
        * [.quantize](#module_m8-js/lib/types.Song+quantize) : <code>Number</code>
        * [.scales](#module_m8-js/lib/types.Song+scales) : [<code>Array.&lt;Scale&gt;</code>](#module_m8-js/lib/types.Scale)
        * [.steps](#module_m8-js/lib/types.Song+steps) : [<code>Array.&lt;SongStep&gt;</code>](#module_m8-js/lib/types.SongStep)
        * [.tables](#module_m8-js/lib/types.Song+tables) : [<code>Array.&lt;Table&gt;</code>](#module_m8-js/lib/types.Table)
        * [.tempo](#module_m8-js/lib/types.Song+tempo) : <code>Number</code>
        * [.transpose](#module_m8-js/lib/types.Song+transpose) : <code>Number</code>
        * [.version](#module_m8-js/lib/types.Song+version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
    * [.TableStep](#module_m8-js/lib/types.TableStep)
        * [new TableStep()](#new_module_m8-js/lib/types.TableStep_new)
        * [.fx1](#module_m8-js/lib/types.TableStep+fx1) : [<code>FX</code>](#module_m8-js/lib/types.FX)
        * [.fx2](#module_m8-js/lib/types.TableStep+fx2) : [<code>FX</code>](#module_m8-js/lib/types.FX)
        * [.fx3](#module_m8-js/lib/types.TableStep+fx3) : [<code>FX</code>](#module_m8-js/lib/types.FX)
        * [.transpose](#module_m8-js/lib/types.TableStep+transpose) : <code>Number</code>
        * [.volume](#module_m8-js/lib/types.TableStep+volume) : <code>Number</code>
    * [.Table](#module_m8-js/lib/types.Table)
        * [new Table()](#new_module_m8-js/lib/types.Table_new)
        * [.steps](#module_m8-js/lib/types.Table+steps) : [<code>Array.&lt;TableStep&gt;</code>](#module_m8-js/lib/types.TableStep)
    * [.Theme](#module_m8-js/lib/types.Theme)
        * [new Theme(m8Version)](#new_module_m8-js/lib/types.Theme_new)
        * [.background](#module_m8-js/lib/types.Theme+background) : <code>Array.&lt;Number&gt;</code>
        * [.textEmpty](#module_m8-js/lib/types.Theme+textEmpty) : <code>Array.&lt;Number&gt;</code>
        * [.textInfo](#module_m8-js/lib/types.Theme+textInfo) : <code>Array.&lt;Number&gt;</code>
        * [.textDefault](#module_m8-js/lib/types.Theme+textDefault) : <code>Array.&lt;Number&gt;</code>
        * [.textValue](#module_m8-js/lib/types.Theme+textValue) : <code>Array.&lt;Number&gt;</code>
        * [.textTitle](#module_m8-js/lib/types.Theme+textTitle) : <code>Array.&lt;Number&gt;</code>
        * [.playMarker](#module_m8-js/lib/types.Theme+playMarker) : <code>Array.&lt;Number&gt;</code>
        * [.cursor](#module_m8-js/lib/types.Theme+cursor) : <code>Array.&lt;Number&gt;</code>
        * [.selection](#module_m8-js/lib/types.Theme+selection) : <code>Array.&lt;Number&gt;</code>
        * [.scopeSlider](#module_m8-js/lib/types.Theme+scopeSlider) : <code>Array.&lt;Number&gt;</code>
        * [.meterLow](#module_m8-js/lib/types.Theme+meterLow) : <code>Array.&lt;Number&gt;</code>
        * [.meterMid](#module_m8-js/lib/types.Theme+meterMid) : <code>Array.&lt;Number&gt;</code>
        * [.meterPeak](#module_m8-js/lib/types.Theme+meterPeak) : <code>Array.&lt;Number&gt;</code>
        * [.m8Version](#module_m8-js/lib/types.Theme+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)

<a name="module_m8-js/lib/types.ChainStep"></a>

### m8-js/lib/types.ChainStep
Represents a Chain Row.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.ChainStep](#module_m8-js/lib/types.ChainStep)
    * [new ChainStep()](#new_module_m8-js/lib/types.ChainStep_new)
    * [.phrase](#module_m8-js/lib/types.ChainStep+phrase) : <code>Number</code>
    * [.transpose](#module_m8-js/lib/types.ChainStep+transpose) : <code>Number</code>

<a name="new_module_m8-js/lib/types.ChainStep_new"></a>

#### new ChainStep()
Creates a Chain.

<a name="module_m8-js/lib/types.ChainStep+phrase"></a>

#### chainStep.phrase : <code>Number</code>
**Kind**: instance property of [<code>ChainStep</code>](#module_m8-js/lib/types.ChainStep)  
<a name="module_m8-js/lib/types.ChainStep+transpose"></a>

#### chainStep.transpose : <code>Number</code>
**Kind**: instance property of [<code>ChainStep</code>](#module_m8-js/lib/types.ChainStep)  
<a name="module_m8-js/lib/types.Chain"></a>

### m8-js/lib/types.Chain
Represents a Chain.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Chain](#module_m8-js/lib/types.Chain)
    * [new Chain()](#new_module_m8-js/lib/types.Chain_new)
    * [.steps](#module_m8-js/lib/types.Chain+steps) : [<code>Array.&lt;ChainStep&gt;</code>](#module_m8-js/lib/types.ChainStep)

<a name="new_module_m8-js/lib/types.Chain_new"></a>

#### new Chain()
Creates a Chain.

<a name="module_m8-js/lib/types.Chain+steps"></a>

#### chain.steps : [<code>Array.&lt;ChainStep&gt;</code>](#module_m8-js/lib/types.ChainStep)
**Kind**: instance property of [<code>Chain</code>](#module_m8-js/lib/types.Chain)  
<a name="module_m8-js/lib/types.FX"></a>

### m8-js/lib/types.FX
Represents an FX configuration.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.FX](#module_m8-js/lib/types.FX)
    * [new FX()](#new_module_m8-js/lib/types.FX_new)
    * [.command](#module_m8-js/lib/types.FX+command) : <code>Number</code>
    * [.value](#module_m8-js/lib/types.FX+value) : <code>Number</code>
    * [.commandToStr([instrKind])](#module_m8-js/lib/types.FX+commandToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.FX_new"></a>

#### new FX()
Creates an FX configuration.

<a name="module_m8-js/lib/types.FX+command"></a>

#### fX.command : <code>Number</code>
**Kind**: instance property of [<code>FX</code>](#module_m8-js/lib/types.FX)  
<a name="module_m8-js/lib/types.FX+value"></a>

#### fX.value : <code>Number</code>
**Kind**: instance property of [<code>FX</code>](#module_m8-js/lib/types.FX)  
<a name="module_m8-js/lib/types.FX+commandToStr"></a>

#### fX.commandToStr([instrKind]) ⇒ <code>String</code>
Get the command name for the FX and optional instrument type.

**Kind**: instance method of [<code>FX</code>](#module_m8-js/lib/types.FX)  

| Param | Type | Description |
| --- | --- | --- |
| [instrKind] | <code>String</code> | The Instrument kind the command will affect |

<a name="module_m8-js/lib/types.Groove"></a>

### m8-js/lib/types.Groove
Represents a Groove.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Groove](#module_m8-js/lib/types.Groove)
    * [new Groove()](#new_module_m8-js/lib/types.Groove_new)
    * [.steps](#module_m8-js/lib/types.Groove+steps) : <code>Array.&lt;Number&gt;</code>

<a name="new_module_m8-js/lib/types.Groove_new"></a>

#### new Groove()
Create a Groove.

<a name="module_m8-js/lib/types.Groove+steps"></a>

#### groove.steps : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Groove</code>](#module_m8-js/lib/types.Groove)  
<a name="module_m8-js/lib/types.AmplifierParameters"></a>

### m8-js/lib/types.AmplifierParameters
Represents the Amplifier Parameters of an Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.AmplifierParameters](#module_m8-js/lib/types.AmplifierParameters)
    * [new AmplifierParameters()](#new_module_m8-js/lib/types.AmplifierParameters_new)
    * [.amp](#module_m8-js/lib/types.AmplifierParameters+amp) : <code>Number</code>
    * [.limit](#module_m8-js/lib/types.AmplifierParameters+limit) : <code>Number</code>
    * [.limitToStr()](#module_m8-js/lib/types.AmplifierParameters+limitToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.AmplifierParameters_new"></a>

#### new AmplifierParameters()
Create an Instrument's Filter Parameters.

<a name="module_m8-js/lib/types.AmplifierParameters+amp"></a>

#### amplifierParameters.amp : <code>Number</code>
**Kind**: instance property of [<code>AmplifierParameters</code>](#module_m8-js/lib/types.AmplifierParameters)  
<a name="module_m8-js/lib/types.AmplifierParameters+limit"></a>

#### amplifierParameters.limit : <code>Number</code>
**Kind**: instance property of [<code>AmplifierParameters</code>](#module_m8-js/lib/types.AmplifierParameters)  
<a name="module_m8-js/lib/types.AmplifierParameters+limitToStr"></a>

#### amplifierParameters.limitToStr() ⇒ <code>String</code>
Returns a string representation of the limit type.

**Kind**: instance method of [<code>AmplifierParameters</code>](#module_m8-js/lib/types.AmplifierParameters)  
<a name="module_m8-js/lib/types.EnvelopeParameters"></a>

### m8-js/lib/types.EnvelopeParameters
Represents the Envelope Parameters of an Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.EnvelopeParameters](#module_m8-js/lib/types.EnvelopeParameters)
    * [new EnvelopeParameters()](#new_module_m8-js/lib/types.EnvelopeParameters_new)
    * [.amount](#module_m8-js/lib/types.EnvelopeParameters+amount) : <code>Number</code>
    * [.attack](#module_m8-js/lib/types.EnvelopeParameters+attack) : <code>Number</code>
    * [.decay](#module_m8-js/lib/types.EnvelopeParameters+decay) : <code>Number</code>
    * [.dest](#module_m8-js/lib/types.EnvelopeParameters+dest) : <code>Number</code>
    * [.hold](#module_m8-js/lib/types.EnvelopeParameters+hold) : <code>Number</code>
    * [.retrigger](#module_m8-js/lib/types.EnvelopeParameters+retrigger) : <code>Number</code>

<a name="new_module_m8-js/lib/types.EnvelopeParameters_new"></a>

#### new EnvelopeParameters()
Create an Instrument's Envelope Parameters.

<a name="module_m8-js/lib/types.EnvelopeParameters+amount"></a>

#### envelopeParameters.amount : <code>Number</code>
**Kind**: instance property of [<code>EnvelopeParameters</code>](#module_m8-js/lib/types.EnvelopeParameters)  
<a name="module_m8-js/lib/types.EnvelopeParameters+attack"></a>

#### envelopeParameters.attack : <code>Number</code>
**Kind**: instance property of [<code>EnvelopeParameters</code>](#module_m8-js/lib/types.EnvelopeParameters)  
<a name="module_m8-js/lib/types.EnvelopeParameters+decay"></a>

#### envelopeParameters.decay : <code>Number</code>
**Kind**: instance property of [<code>EnvelopeParameters</code>](#module_m8-js/lib/types.EnvelopeParameters)  
<a name="module_m8-js/lib/types.EnvelopeParameters+dest"></a>

#### envelopeParameters.dest : <code>Number</code>
**Kind**: instance property of [<code>EnvelopeParameters</code>](#module_m8-js/lib/types.EnvelopeParameters)  
<a name="module_m8-js/lib/types.EnvelopeParameters+hold"></a>

#### envelopeParameters.hold : <code>Number</code>
**Kind**: instance property of [<code>EnvelopeParameters</code>](#module_m8-js/lib/types.EnvelopeParameters)  
<a name="module_m8-js/lib/types.EnvelopeParameters+retrigger"></a>

#### envelopeParameters.retrigger : <code>Number</code>
**Kind**: instance property of [<code>EnvelopeParameters</code>](#module_m8-js/lib/types.EnvelopeParameters)  
<a name="module_m8-js/lib/types.FilterParameters"></a>

### m8-js/lib/types.FilterParameters
Represents the Filter Parameters of an Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.FilterParameters](#module_m8-js/lib/types.FilterParameters)
    * [new FilterParameters()](#new_module_m8-js/lib/types.FilterParameters_new)
    * [.cutoff](#module_m8-js/lib/types.FilterParameters+cutoff) : <code>Number</code>
    * [.res](#module_m8-js/lib/types.FilterParameters+res) : <code>Number</code>
    * [.type](#module_m8-js/lib/types.FilterParameters+type) : <code>Number</code>

<a name="new_module_m8-js/lib/types.FilterParameters_new"></a>

#### new FilterParameters()
Create an Instrument's Filter Parameters.

<a name="module_m8-js/lib/types.FilterParameters+cutoff"></a>

#### filterParameters.cutoff : <code>Number</code>
**Kind**: instance property of [<code>FilterParameters</code>](#module_m8-js/lib/types.FilterParameters)  
<a name="module_m8-js/lib/types.FilterParameters+res"></a>

#### filterParameters.res : <code>Number</code>
**Kind**: instance property of [<code>FilterParameters</code>](#module_m8-js/lib/types.FilterParameters)  
<a name="module_m8-js/lib/types.FilterParameters+type"></a>

#### filterParameters.type : <code>Number</code>
**Kind**: instance property of [<code>FilterParameters</code>](#module_m8-js/lib/types.FilterParameters)  
<a name="module_m8-js/lib/types.FMSynthOperator"></a>

### m8-js/lib/types.FMSynthOperator
Represents the FMSYNTH Operator.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.FMSynthOperator](#module_m8-js/lib/types.FMSynthOperator)
    * [new FMSynthOperator(m8Version)](#new_module_m8-js/lib/types.FMSynthOperator_new)
    * [.feedback](#module_m8-js/lib/types.FMSynthOperator+feedback) : <code>Number</code>
    * [.level](#module_m8-js/lib/types.FMSynthOperator+level) : <code>Number</code>
    * [.modA](#module_m8-js/lib/types.FMSynthOperator+modA) : <code>Number</code>
    * [.modB](#module_m8-js/lib/types.FMSynthOperator+modB) : <code>Number</code>
    * [.ratio](#module_m8-js/lib/types.FMSynthOperator+ratio) : <code>Number</code>
    * [.ratioFine](#module_m8-js/lib/types.FMSynthOperator+ratioFine) : <code>Number</code>
    * [.shape](#module_m8-js/lib/types.FMSynthOperator+shape) : <code>Number</code>
    * [.shapeToStr()](#module_m8-js/lib/types.FMSynthOperator+shapeToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.FMSynthOperator_new"></a>

#### new FMSynthOperator(m8Version)
Create the FMSYNTH Operator.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | <code>M8Version</code> | The M8 version (different versions of M8 use different FMSYNTH oscillator shapes) |

<a name="module_m8-js/lib/types.FMSynthOperator+feedback"></a>

#### fmSynthOperator.feedback : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+level"></a>

#### fmSynthOperator.level : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+modA"></a>

#### fmSynthOperator.modA : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+modB"></a>

#### fmSynthOperator.modB : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+ratio"></a>

#### fmSynthOperator.ratio : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+ratioFine"></a>

#### fmSynthOperator.ratioFine : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+shape"></a>

#### fmSynthOperator.shape : <code>Number</code>
**Kind**: instance property of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthOperator+shapeToStr"></a>

#### fmSynthOperator.shapeToStr() ⇒ <code>String</code>
Returns a string representation of the oscillator shape.

**Kind**: instance method of [<code>FMSynthOperator</code>](#module_m8-js/lib/types.FMSynthOperator)  
<a name="module_m8-js/lib/types.FMSynthParameters"></a>

### m8-js/lib/types.FMSynthParameters
Represents the FMSYNTH Instrument Parameters

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.FMSynthParameters](#module_m8-js/lib/types.FMSynthParameters)
    * [new FMSynthParameters(m8Version)](#new_module_m8-js/lib/types.FMSynthParameters_new)
    * [.algo](#module_m8-js/lib/types.FMSynthParameters+algo) : <code>Number</code>
    * [.mod1](#module_m8-js/lib/types.FMSynthParameters+mod1) : <code>Number</code>
    * [.mod2](#module_m8-js/lib/types.FMSynthParameters+mod2) : <code>Number</code>
    * [.mod3](#module_m8-js/lib/types.FMSynthParameters+mod3) : <code>Number</code>
    * [.mod4](#module_m8-js/lib/types.FMSynthParameters+mod4) : <code>Number</code>
    * [.operators](#module_m8-js/lib/types.FMSynthParameters+operators) : [<code>Array.&lt;FMSynthOperator&gt;</code>](#module_m8-js/lib/types.FMSynthOperator)
    * [.algoToStr()](#module_m8-js/lib/types.FMSynthParameters+algoToStr) ⇒ <code>String</code>
    * [.modToStr(mod)](#module_m8-js/lib/types.FMSynthParameters+modToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.FMSynthParameters_new"></a>

#### new FMSynthParameters(m8Version)
Create the FMSYNTH Instrument Parameters.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version (different versions of M8 use different FMSYNTH oscillator shapes) |

<a name="module_m8-js/lib/types.FMSynthParameters+algo"></a>

#### fmSynthParameters.algo : <code>Number</code>
**Kind**: instance property of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+mod1"></a>

#### fmSynthParameters.mod1 : <code>Number</code>
**Kind**: instance property of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+mod2"></a>

#### fmSynthParameters.mod2 : <code>Number</code>
**Kind**: instance property of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+mod3"></a>

#### fmSynthParameters.mod3 : <code>Number</code>
**Kind**: instance property of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+mod4"></a>

#### fmSynthParameters.mod4 : <code>Number</code>
**Kind**: instance property of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+operators"></a>

#### fmSynthParameters.operators : [<code>Array.&lt;FMSynthOperator&gt;</code>](#module_m8-js/lib/types.FMSynthOperator)
**Kind**: instance property of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+algoToStr"></a>

#### fmSynthParameters.algoToStr() ⇒ <code>String</code>
Returns a string representation of the algo

**Kind**: instance method of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  
<a name="module_m8-js/lib/types.FMSynthParameters+modToStr"></a>

#### fmSynthParameters.modToStr(mod) ⇒ <code>String</code>
Returns a string representation of a modulator.

**Kind**: instance method of [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters)  

| Param | Type | Description |
| --- | --- | --- |
| mod | <code>String</code> | The modulator |

<a name="module_m8-js/lib/types.LFOParameters"></a>

### m8-js/lib/types.LFOParameters
Represents the LFO Parameters of an Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.LFOParameters](#module_m8-js/lib/types.LFOParameters)
    * [new LFOParameters()](#new_module_m8-js/lib/types.LFOParameters_new)
    * [.amount](#module_m8-js/lib/types.LFOParameters+amount) : <code>Number</code>
    * [.dest](#module_m8-js/lib/types.LFOParameters+dest) : <code>Number</code>
    * [.freq](#module_m8-js/lib/types.LFOParameters+freq) : <code>Number</code>
    * [.retrigger](#module_m8-js/lib/types.LFOParameters+retrigger) : <code>Number</code>
    * [.shape](#module_m8-js/lib/types.LFOParameters+shape) : <code>Number</code>
    * [.triggerMode](#module_m8-js/lib/types.LFOParameters+triggerMode) : <code>Number</code>
    * [.shapeToStr()](#module_m8-js/lib/types.LFOParameters+shapeToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.LFOParameters_new"></a>

#### new LFOParameters()
Create an Instrument's LFO Parameters.

<a name="module_m8-js/lib/types.LFOParameters+amount"></a>

#### lfoParameters.amount : <code>Number</code>
**Kind**: instance property of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.LFOParameters+dest"></a>

#### lfoParameters.dest : <code>Number</code>
**Kind**: instance property of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.LFOParameters+freq"></a>

#### lfoParameters.freq : <code>Number</code>
**Kind**: instance property of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.LFOParameters+retrigger"></a>

#### lfoParameters.retrigger : <code>Number</code>
**Kind**: instance property of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.LFOParameters+shape"></a>

#### lfoParameters.shape : <code>Number</code>
**Kind**: instance property of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.LFOParameters+triggerMode"></a>

#### lfoParameters.triggerMode : <code>Number</code>
**Kind**: instance property of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.LFOParameters+shapeToStr"></a>

#### lfoParameters.shapeToStr() ⇒ <code>String</code>
Returns a string representation of the LFO shape.

**Kind**: instance method of [<code>LFOParameters</code>](#module_m8-js/lib/types.LFOParameters)  
<a name="module_m8-js/lib/types.MacrosynthParameters"></a>

### m8-js/lib/types.MacrosynthParameters
Represents the MACROSYNGTH Instrument Parameters.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MacrosynthParameters](#module_m8-js/lib/types.MacrosynthParameters)
    * [new MacrosynthParameters(m8Version)](#new_module_m8-js/lib/types.MacrosynthParameters_new)
    * [.color](#module_m8-js/lib/types.MacrosynthParameters+color) : <code>Number</code>
    * [.degrade](#module_m8-js/lib/types.MacrosynthParameters+degrade) : <code>Number</code>
    * [.redux](#module_m8-js/lib/types.MacrosynthParameters+redux) : <code>Number</code>
    * [.shape](#module_m8-js/lib/types.MacrosynthParameters+shape) : <code>Number</code>
    * [.timbre](#module_m8-js/lib/types.MacrosynthParameters+timbre) : <code>Number</code>
    * [.shapeToStr()](#module_m8-js/lib/types.MacrosynthParameters+shapeToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.MacrosynthParameters_new"></a>

#### new MacrosynthParameters(m8Version)
Create the MACROSYNTH Instrument Parameters.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version (different versions of M8 use different MACROSYNTH shapes) |

<a name="module_m8-js/lib/types.MacrosynthParameters+color"></a>

#### macrosynthParameters.color : <code>Number</code>
**Kind**: instance property of [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters)  
<a name="module_m8-js/lib/types.MacrosynthParameters+degrade"></a>

#### macrosynthParameters.degrade : <code>Number</code>
**Kind**: instance property of [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters)  
<a name="module_m8-js/lib/types.MacrosynthParameters+redux"></a>

#### macrosynthParameters.redux : <code>Number</code>
**Kind**: instance property of [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters)  
<a name="module_m8-js/lib/types.MacrosynthParameters+shape"></a>

#### macrosynthParameters.shape : <code>Number</code>
**Kind**: instance property of [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters)  
<a name="module_m8-js/lib/types.MacrosynthParameters+timbre"></a>

#### macrosynthParameters.timbre : <code>Number</code>
**Kind**: instance property of [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters)  
<a name="module_m8-js/lib/types.MacrosynthParameters+shapeToStr"></a>

#### macrosynthParameters.shapeToStr() ⇒ <code>String</code>
Returns a string representation of the wave shape.

**Kind**: instance method of [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters)  
<a name="module_m8-js/lib/types.MIDICC"></a>

### m8-js/lib/types.MIDICC
Represents a MIDI CC.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MIDICC](#module_m8-js/lib/types.MIDICC)
    * [new MIDICC()](#new_module_m8-js/lib/types.MIDICC_new)
    * [.number](#module_m8-js/lib/types.MIDICC+number) : <code>Number</code>
    * [.defaultValue](#module_m8-js/lib/types.MIDICC+defaultValue) : <code>Number</code>

<a name="new_module_m8-js/lib/types.MIDICC_new"></a>

#### new MIDICC()
Creates an MIDI CC.

<a name="module_m8-js/lib/types.MIDICC+number"></a>

#### midicC.number : <code>Number</code>
**Kind**: instance property of [<code>MIDICC</code>](#module_m8-js/lib/types.MIDICC)  
<a name="module_m8-js/lib/types.MIDICC+defaultValue"></a>

#### midicC.defaultValue : <code>Number</code>
**Kind**: instance property of [<code>MIDICC</code>](#module_m8-js/lib/types.MIDICC)  
<a name="module_m8-js/lib/types.MIDIOutParameters"></a>

### m8-js/lib/types.MIDIOutParameters
Represents the MIDIOUT Instrument Parameters.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MIDIOutParameters](#module_m8-js/lib/types.MIDIOutParameters)
    * [new MIDIOutParameters(m8Version)](#new_module_m8-js/lib/types.MIDIOutParameters_new)
    * [.bankSelect](#module_m8-js/lib/types.MIDIOutParameters+bankSelect) : <code>Number</code>
    * [.channel](#module_m8-js/lib/types.MIDIOutParameters+channel) : <code>Number</code>
    * [.customCC](#module_m8-js/lib/types.MIDIOutParameters+customCC) : [<code>Array.&lt;MIDICC&gt;</code>](#module_m8-js/lib/types.MIDICC)
    * [.port](#module_m8-js/lib/types.MIDIOutParameters+port) : <code>Number</code>
    * [.programChange](#module_m8-js/lib/types.MIDIOutParameters+programChange) : <code>Number</code>
    * [.portToStr()](#module_m8-js/lib/types.MIDIOutParameters+portToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.MIDIOutParameters_new"></a>

#### new MIDIOutParameters(m8Version)
Create the MIDIOUT Instrument Parameters.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version (different versions of M8 use different MIDI ports) |

<a name="module_m8-js/lib/types.MIDIOutParameters+bankSelect"></a>

#### midiOutParameters.bankSelect : <code>Number</code>
**Kind**: instance property of [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters)  
<a name="module_m8-js/lib/types.MIDIOutParameters+channel"></a>

#### midiOutParameters.channel : <code>Number</code>
**Kind**: instance property of [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters)  
<a name="module_m8-js/lib/types.MIDIOutParameters+customCC"></a>

#### midiOutParameters.customCC : [<code>Array.&lt;MIDICC&gt;</code>](#module_m8-js/lib/types.MIDICC)
**Kind**: instance property of [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters)  
<a name="module_m8-js/lib/types.MIDIOutParameters+port"></a>

#### midiOutParameters.port : <code>Number</code>
**Kind**: instance property of [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters)  
<a name="module_m8-js/lib/types.MIDIOutParameters+programChange"></a>

#### midiOutParameters.programChange : <code>Number</code>
**Kind**: instance property of [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters)  
<a name="module_m8-js/lib/types.MIDIOutParameters+portToStr"></a>

#### midiOutParameters.portToStr() ⇒ <code>String</code>
Returns a string representation of the port.

**Kind**: instance method of [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters)  
<a name="module_m8-js/lib/types.MixerParameters"></a>

### m8-js/lib/types.MixerParameters
Represents the Mixer Parameters of an Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MixerParameters](#module_m8-js/lib/types.MixerParameters)
    * [new MixerParameters()](#new_module_m8-js/lib/types.MixerParameters_new)
    * [.cho](#module_m8-js/lib/types.MixerParameters+cho) : <code>Number</code>
    * [.del](#module_m8-js/lib/types.MixerParameters+del) : <code>Number</code>
    * [.dry](#module_m8-js/lib/types.MixerParameters+dry) : <code>Number</code>
    * [.pan](#module_m8-js/lib/types.MixerParameters+pan) : <code>Number</code>
    * [.rev](#module_m8-js/lib/types.MixerParameters+rev) : <code>Number</code>

<a name="new_module_m8-js/lib/types.MixerParameters_new"></a>

#### new MixerParameters()
Create an Instrument's Mixer Parameters.

<a name="module_m8-js/lib/types.MixerParameters+cho"></a>

#### mixerParameters.cho : <code>Number</code>
**Kind**: instance property of [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)  
<a name="module_m8-js/lib/types.MixerParameters+del"></a>

#### mixerParameters.del : <code>Number</code>
**Kind**: instance property of [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)  
<a name="module_m8-js/lib/types.MixerParameters+dry"></a>

#### mixerParameters.dry : <code>Number</code>
**Kind**: instance property of [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)  
<a name="module_m8-js/lib/types.MixerParameters+pan"></a>

#### mixerParameters.pan : <code>Number</code>
**Kind**: instance property of [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)  
<a name="module_m8-js/lib/types.MixerParameters+rev"></a>

#### mixerParameters.rev : <code>Number</code>
**Kind**: instance property of [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters"></a>

### m8-js/lib/types.SamplerParameters
Represents the SAMPLER Instrument Parameters.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.SamplerParameters](#module_m8-js/lib/types.SamplerParameters)
    * [new SamplerParameters()](#new_module_m8-js/lib/types.SamplerParameters_new)
    * [.degrade](#module_m8-js/lib/types.SamplerParameters+degrade) : <code>Number</code>
    * [.length](#module_m8-js/lib/types.SamplerParameters+length) : <code>Number</code>
    * [.loopStart](#module_m8-js/lib/types.SamplerParameters+loopStart) : <code>Number</code>
    * [.playMode](#module_m8-js/lib/types.SamplerParameters+playMode) : <code>Number</code>
    * [.samplePath](#module_m8-js/lib/types.SamplerParameters+samplePath) : <code>String</code>
    * [.slice](#module_m8-js/lib/types.SamplerParameters+slice) : <code>Number</code>
    * [.start](#module_m8-js/lib/types.SamplerParameters+start) : <code>Number</code>
    * [.playModeToStr()](#module_m8-js/lib/types.SamplerParameters+playModeToStr) ⇒ <code>String</code>
    * [.samplePathToStr()](#module_m8-js/lib/types.SamplerParameters+samplePathToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.SamplerParameters_new"></a>

#### new SamplerParameters()
Create the SAMPLER Instrument Parameters.

<a name="module_m8-js/lib/types.SamplerParameters+degrade"></a>

#### samplerParameters.degrade : <code>Number</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+length"></a>

#### samplerParameters.length : <code>Number</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+loopStart"></a>

#### samplerParameters.loopStart : <code>Number</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+playMode"></a>

#### samplerParameters.playMode : <code>Number</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+samplePath"></a>

#### samplerParameters.samplePath : <code>String</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+slice"></a>

#### samplerParameters.slice : <code>Number</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+start"></a>

#### samplerParameters.start : <code>Number</code>
**Kind**: instance property of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+playModeToStr"></a>

#### samplerParameters.playModeToStr() ⇒ <code>String</code>
Returns a string representation of the play mode.

**Kind**: instance method of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.SamplerParameters+samplePathToStr"></a>

#### samplerParameters.samplePathToStr() ⇒ <code>String</code>
Returns a sanitized representation of the sample path.

**Kind**: instance method of [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters)  
<a name="module_m8-js/lib/types.WavsynthParameters"></a>

### m8-js/lib/types.WavsynthParameters
Represents the WAVSYNTH Instrument Parameters.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.WavsynthParameters](#module_m8-js/lib/types.WavsynthParameters)
    * [new WavsynthParameters()](#new_module_m8-js/lib/types.WavsynthParameters_new)
    * [.mirror](#module_m8-js/lib/types.WavsynthParameters+mirror) : <code>Number</code>
    * [.mult](#module_m8-js/lib/types.WavsynthParameters+mult) : <code>Number</code>
    * [.shape](#module_m8-js/lib/types.WavsynthParameters+shape) : <code>Number</code>
    * [.size](#module_m8-js/lib/types.WavsynthParameters+size) : <code>Number</code>
    * [.warp](#module_m8-js/lib/types.WavsynthParameters+warp) : <code>Number</code>
    * [.shapeToStr()](#module_m8-js/lib/types.WavsynthParameters+shapeToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.WavsynthParameters_new"></a>

#### new WavsynthParameters()
Create the WAVSYNTH Instrument Parameters.

<a name="module_m8-js/lib/types.WavsynthParameters+mirror"></a>

#### wavsynthParameters.mirror : <code>Number</code>
**Kind**: instance property of [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)  
<a name="module_m8-js/lib/types.WavsynthParameters+mult"></a>

#### wavsynthParameters.mult : <code>Number</code>
**Kind**: instance property of [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)  
<a name="module_m8-js/lib/types.WavsynthParameters+shape"></a>

#### wavsynthParameters.shape : <code>Number</code>
**Kind**: instance property of [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)  
<a name="module_m8-js/lib/types.WavsynthParameters+size"></a>

#### wavsynthParameters.size : <code>Number</code>
**Kind**: instance property of [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)  
<a name="module_m8-js/lib/types.WavsynthParameters+warp"></a>

#### wavsynthParameters.warp : <code>Number</code>
**Kind**: instance property of [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)  
<a name="module_m8-js/lib/types.WavsynthParameters+shapeToStr"></a>

#### wavsynthParameters.shapeToStr() ⇒ <code>String</code>
Returns a string representation of the wave shape.

**Kind**: instance method of [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)  
<a name="module_m8-js/lib/types.Instrument"></a>

### m8-js/lib/types.Instrument
Represents an Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Instrument](#module_m8-js/lib/types.Instrument)
    * [new Instrument(m8Version, kind, kindStr, [instrParams])](#new_module_m8-js/lib/types.Instrument_new)
    * [.ampParams](#module_m8-js/lib/types.Instrument+ampParams) : [<code>AmplifierParameters</code>](#module_m8-js/lib/types.AmplifierParameters)
    * [.author](#module_m8-js/lib/types.Instrument+author) : <code>String</code>
    * [.env](#module_m8-js/lib/types.Instrument+env) : [<code>Array.&lt;EnvelopeParameters&gt;</code>](#module_m8-js/lib/types.EnvelopeParameters)
    * [.filterParams](#module_m8-js/lib/types.Instrument+filterParams) : [<code>FilterParameters</code>](#module_m8-js/lib/types.FilterParameters)
    * [.fineTune](#module_m8-js/lib/types.Instrument+fineTune) : <code>Number</code>
    * [.instrParams](#module_m8-js/lib/types.Instrument+instrParams) : [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters) \| [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters) \| [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters) \| [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters) \| [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)
    * [.kind](#module_m8-js/lib/types.Instrument+kind) : <code>Number</code>
    * [.lfo](#module_m8-js/lib/types.Instrument+lfo) : [<code>Array.&lt;LFOParameters&gt;</code>](#module_m8-js/lib/types.LFOParameters)
    * [.mixerParams](#module_m8-js/lib/types.Instrument+mixerParams) : [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)
    * [.m8Version](#module_m8-js/lib/types.Instrument+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
    * [.name](#module_m8-js/lib/types.Instrument+name) : <code>String</code>
    * [.pitch](#module_m8-js/lib/types.Instrument+pitch) : <code>Number</code>
    * [.tableData](#module_m8-js/lib/types.Instrument+tableData) : [<code>Table</code>](#module_m8-js/lib/types.Table)
    * [.tableTick](#module_m8-js/lib/types.Instrument+tableTick) : <code>Number</code>
    * [.transpose](#module_m8-js/lib/types.Instrument+transpose) : <code>Boolean</code>
    * [.volume](#module_m8-js/lib/types.Instrument+volume) : <code>Number</code>
    * [.destToStr(dest)](#module_m8-js/lib/types.Instrument+destToStr)
    * [.filterTypeToStr()](#module_m8-js/lib/types.Instrument+filterTypeToStr) ⇒ <code>String</code>
    * [.kindToStr()](#module_m8-js/lib/types.Instrument+kindToStr) ⇒ <code>String</code>
    * [.getUnusedBytes()](#module_m8-js/lib/types.Instrument+getUnusedBytes) ⇒ <code>Object</code>
    * [.updateUnusedBytes(unusedBytes)](#module_m8-js/lib/types.Instrument+updateUnusedBytes)

<a name="new_module_m8-js/lib/types.Instrument_new"></a>

#### new Instrument(m8Version, kind, kindStr, [instrParams])
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |
| kind | <code>Number</code> | The M8 instrument kind |
| kindStr | <code>String</code> | The M8 instrument kind as string |
| [instrParams] | [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters) \| [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters) \| [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters) \| [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters) \| [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters) | The instrument parameters |

<a name="module_m8-js/lib/types.Instrument+ampParams"></a>

#### instrument.ampParams : [<code>AmplifierParameters</code>](#module_m8-js/lib/types.AmplifierParameters)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+author"></a>

#### instrument.author : <code>String</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+env"></a>

#### instrument.env : [<code>Array.&lt;EnvelopeParameters&gt;</code>](#module_m8-js/lib/types.EnvelopeParameters)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+filterParams"></a>

#### instrument.filterParams : [<code>FilterParameters</code>](#module_m8-js/lib/types.FilterParameters)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+fineTune"></a>

#### instrument.fineTune : <code>Number</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+instrParams"></a>

#### instrument.instrParams : [<code>FMSynthParameters</code>](#module_m8-js/lib/types.FMSynthParameters) \| [<code>MacrosynthParameters</code>](#module_m8-js/lib/types.MacrosynthParameters) \| [<code>MIDIOutParameters</code>](#module_m8-js/lib/types.MIDIOutParameters) \| [<code>SamplerParameters</code>](#module_m8-js/lib/types.SamplerParameters) \| [<code>WavsynthParameters</code>](#module_m8-js/lib/types.WavsynthParameters)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+kind"></a>

#### instrument.kind : <code>Number</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+lfo"></a>

#### instrument.lfo : [<code>Array.&lt;LFOParameters&gt;</code>](#module_m8-js/lib/types.LFOParameters)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+mixerParams"></a>

#### instrument.mixerParams : [<code>MixerParameters</code>](#module_m8-js/lib/types.MixerParameters)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+m8Version"></a>

#### instrument.m8Version : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+name"></a>

#### instrument.name : <code>String</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+pitch"></a>

#### instrument.pitch : <code>Number</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+tableData"></a>

#### instrument.tableData : [<code>Table</code>](#module_m8-js/lib/types.Table)
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+tableTick"></a>

#### instrument.tableTick : <code>Number</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+transpose"></a>

#### instrument.transpose : <code>Boolean</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+volume"></a>

#### instrument.volume : <code>Number</code>
**Kind**: instance property of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+destToStr"></a>

#### instrument.destToStr(dest)
Returns a string representation of the destination.

**Kind**: instance method of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  

| Param | Type | Description |
| --- | --- | --- |
| dest | <code>String</code> | The destination |

<a name="module_m8-js/lib/types.Instrument+filterTypeToStr"></a>

#### instrument.filterTypeToStr() ⇒ <code>String</code>
Returns a string representation of the Filter type.

**Kind**: instance method of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+kindToStr"></a>

#### instrument.kindToStr() ⇒ <code>String</code>
Returns a string representation of the Instrument kind.

**Kind**: instance method of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
<a name="module_m8-js/lib/types.Instrument+getUnusedBytes"></a>

#### instrument.getUnusedBytes() ⇒ <code>Object</code>
Returns the unused bytes map.

**Kind**: instance method of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  
**Returns**: <code>Object</code> - the unused bytes map  
<a name="module_m8-js/lib/types.Instrument+updateUnusedBytes"></a>

#### instrument.updateUnusedBytes(unusedBytes)
Updates the unused bytes map.

**Kind**: instance method of [<code>Instrument</code>](#module_m8-js/lib/types.Instrument)  

| Param | Type | Description |
| --- | --- | --- |
| unusedBytes | <code>Object</code> | The unused bytes map |

<a name="module_m8-js/lib/types.FMSynth"></a>

### m8-js/lib/types.FMSynth
Represents an FMSYNTH Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  
<a name="new_module_m8-js/lib/types.FMSynth_new"></a>

#### new FMSynth(m8Version)
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.Macrosynth"></a>

### m8-js/lib/types.Macrosynth
Represents an Macrosynth Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  
<a name="new_module_m8-js/lib/types.Macrosynth_new"></a>

#### new Macrosynth(m8Version)
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.MIDIOut"></a>

### m8-js/lib/types.MIDIOut
Represents an MIDI Out Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  
<a name="new_module_m8-js/lib/types.MIDIOut_new"></a>

#### new MIDIOut(m8Version)
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.None"></a>

### m8-js/lib/types.None
Represents a None (empty) Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  
<a name="new_module_m8-js/lib/types.None_new"></a>

#### new None(m8Version)
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.Sampler"></a>

### m8-js/lib/types.Sampler
Represents an Sampler Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  
<a name="new_module_m8-js/lib/types.Sampler_new"></a>

#### new Sampler(m8Version)
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.Wavsynth"></a>

### m8-js/lib/types.Wavsynth
Represents an Wavnsynth Instrument.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  
<a name="new_module_m8-js/lib/types.Wavsynth_new"></a>

#### new Wavsynth(m8Version)
Create an Instrument.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.M8FileReader"></a>

### m8-js/lib/types.M8FileReader
M8 file reader.

Note: This class is written purely to read an M8 file from start to finish.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.M8FileReader](#module_m8-js/lib/types.M8FileReader)
    * [new M8FileReader(buffer)](#new_module_m8-js/lib/types.M8FileReader_new)
    * [.buffer](#module_m8-js/lib/types.M8FileReader+buffer) : <code>module:m8-js.Buffer</code>
    * [.cursor](#module_m8-js/lib/types.M8FileReader+cursor) : <code>Number</code>
    * [.fileType](#module_m8-js/lib/types.M8FileReader+fileType) : <code>Number</code>
    * [.m8Version](#module_m8-js/lib/types.M8FileReader+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
    * [.fileTypeToStr()](#module_m8-js/lib/types.M8FileReader+fileTypeToStr) ⇒ <code>String</code>
    * [.read([len])](#module_m8-js/lib/types.M8FileReader+read) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.readStr(len)](#module_m8-js/lib/types.M8FileReader+readStr) ⇒ <code>String</code>
    * [.skip(len)](#module_m8-js/lib/types.M8FileReader+skip) ⇒ <code>Object</code>
    * [.skipTo(offset)](#module_m8-js/lib/types.M8FileReader+skipTo) ⇒ <code>Object</code>

<a name="new_module_m8-js/lib/types.M8FileReader_new"></a>

#### new M8FileReader(buffer)
Creates an M8 File Reader.


| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>module:m8-js/Buffer</code> | The buffer containing the raw M8 file content |

<a name="module_m8-js/lib/types.M8FileReader+buffer"></a>

#### m8FileReader.buffer : <code>module:m8-js.Buffer</code>
**Kind**: instance property of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
<a name="module_m8-js/lib/types.M8FileReader+cursor"></a>

#### m8FileReader.cursor : <code>Number</code>
**Kind**: instance property of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
<a name="module_m8-js/lib/types.M8FileReader+fileType"></a>

#### m8FileReader.fileType : <code>Number</code>
**Kind**: instance property of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
<a name="module_m8-js/lib/types.M8FileReader+m8Version"></a>

#### m8FileReader.m8Version : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
**Kind**: instance property of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
<a name="module_m8-js/lib/types.M8FileReader+fileTypeToStr"></a>

#### m8FileReader.fileTypeToStr() ⇒ <code>String</code>
Returns the file type as string.

**Kind**: instance method of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
<a name="module_m8-js/lib/types.M8FileReader+read"></a>

#### m8FileReader.read([len]) ⇒ <code>Array.&lt;Number&gt;</code>
Returns an array of bytes at the current cursor position.

**Kind**: instance method of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  

| Param | Type | Description |
| --- | --- | --- |
| [len] | <code>Number</code> | The number of bytes to read (default: 1) |

<a name="module_m8-js/lib/types.M8FileReader+readStr"></a>

#### m8FileReader.readStr(len) ⇒ <code>String</code>
Reads a number of bytes and returns its string representation.

**Kind**: instance method of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  

| Param | Type | Description |
| --- | --- | --- |
| len | <code>Number</code> | The length of the string to read |

<a name="module_m8-js/lib/types.M8FileReader+skip"></a>

#### m8FileReader.skip(len) ⇒ <code>Object</code>
Records the skipped offset to allow for writing files.

**Kind**: instance method of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
**Returns**: <code>Object</code> - the skipped bytes  

| Param | Type | Description |
| --- | --- | --- |
| len | <code>Number</code> | The number of bytes to skip |

<a name="module_m8-js/lib/types.M8FileReader+skipTo"></a>

#### m8FileReader.skipTo(offset) ⇒ <code>Object</code>
Advances the cursor to the specified offset.

**Kind**: instance method of [<code>M8FileReader</code>](#module_m8-js/lib/types.M8FileReader)  
**Returns**: <code>Object</code> - the skipped bytes  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>Number</code> | The offset to skip to |

<a name="module_m8-js/lib/types.M8FileWriter"></a>

### m8-js/lib/types.M8FileWriter
M8 File Writer.

Note: This class is written purely to turn an M8 file in API form to bytes.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.M8FileWriter](#module_m8-js/lib/types.M8FileWriter)
    * [new M8FileWriter(fileType, [m8Version])](#new_module_m8-js/lib/types.M8FileWriter_new)
    * [.bytes](#module_m8-js/lib/types.M8FileWriter+bytes) : <code>Array.&lt;Number&gt;</code>
    * [.fileType](#module_m8-js/lib/types.M8FileWriter+fileType) : <code>Number</code>
    * [.m8Version](#module_m8-js/lib/types.M8FileWriter+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
    * [.fileTypeToStr()](#module_m8-js/lib/types.M8FileWriter+fileTypeToStr) ⇒ <code>String</code>
    * [.write(byteOrBytes)](#module_m8-js/lib/types.M8FileWriter+write)
    * [.writeBool(bool)](#module_m8-js/lib/types.M8FileWriter+writeBool)
    * [.writeStr(theString, padTo)](#module_m8-js/lib/types.M8FileWriter+writeStr)

<a name="new_module_m8-js/lib/types.M8FileWriter_new"></a>

#### new M8FileWriter(fileType, [m8Version])
Creates an M8 File Writer.


| Param | Type | Description |
| --- | --- | --- |
| fileType | <code>Number</code> | The M8 file type |
| [m8Version] | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The optional M8 version _(defaults to the latest version)_ |

<a name="module_m8-js/lib/types.M8FileWriter+bytes"></a>

#### m8FileWriter.bytes : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  
<a name="module_m8-js/lib/types.M8FileWriter+fileType"></a>

#### m8FileWriter.fileType : <code>Number</code>
**Kind**: instance property of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  
<a name="module_m8-js/lib/types.M8FileWriter+m8Version"></a>

#### m8FileWriter.m8Version : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
**Kind**: instance property of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  
<a name="module_m8-js/lib/types.M8FileWriter+fileTypeToStr"></a>

#### m8FileWriter.fileTypeToStr() ⇒ <code>String</code>
Returns the file type as string.

**Kind**: instance method of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  
<a name="module_m8-js/lib/types.M8FileWriter+write"></a>

#### m8FileWriter.write(byteOrBytes)
Write the byte or bytes to the file's buffer.

**Kind**: instance method of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  

| Param | Type | Description |
| --- | --- | --- |
| byteOrBytes | <code>Number</code> \| <code>Array.&lt;Number&gt;</code> | The byte or bytes to write |

<a name="module_m8-js/lib/types.M8FileWriter+writeBool"></a>

#### m8FileWriter.writeBool(bool)
Write the boolean to the file's buffer.

**Kind**: instance method of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  

| Param | Type | Description |
| --- | --- | --- |
| bool | <code>Boolean</code> | The boolean to write |

<a name="module_m8-js/lib/types.M8FileWriter+writeStr"></a>

#### m8FileWriter.writeStr(theString, padTo)
Write the string to the file's buffer and pad the end with empty values when necessar.

**Kind**: instance method of [<code>M8FileWriter</code>](#module_m8-js/lib/types.M8FileWriter)  

| Param | Type | Description |
| --- | --- | --- |
| theString | <code>String</code> | The string value to write |
| padTo | <code>Number</code> | The number of bytes in storage to use regardless of string length |

<a name="module_m8-js/lib/types.M8Version"></a>

### m8-js/lib/types.M8Version
M8 version.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.M8Version](#module_m8-js/lib/types.M8Version)
    * [new M8Version(majorVersion, minorVersion, patchVersion)](#new_module_m8-js/lib/types.M8Version_new)
    * [.majorVersion](#module_m8-js/lib/types.M8Version+majorVersion) : <code>Number</code>
    * [.minorVersion](#module_m8-js/lib/types.M8Version+minorVersion) : <code>Number</code>
    * [.patchVersion](#module_m8-js/lib/types.M8Version+patchVersion) : <code>Number</code>
    * [.compare(other)](#module_m8-js/lib/types.M8Version+compare) ⇒ <code>Number</code>

<a name="new_module_m8-js/lib/types.M8Version_new"></a>

#### new M8Version(majorVersion, minorVersion, patchVersion)
Creates an M8 version.


| Param | Type |
| --- | --- |
| majorVersion | <code>Number</code> | 
| minorVersion | <code>Number</code> | 
| patchVersion | <code>Number</code> | 

<a name="module_m8-js/lib/types.M8Version+majorVersion"></a>

#### m8Version.majorVersion : <code>Number</code>
**Kind**: instance property of [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)  
<a name="module_m8-js/lib/types.M8Version+minorVersion"></a>

#### m8Version.minorVersion : <code>Number</code>
**Kind**: instance property of [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)  
<a name="module_m8-js/lib/types.M8Version+patchVersion"></a>

#### m8Version.patchVersion : <code>Number</code>
**Kind**: instance property of [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)  
<a name="module_m8-js/lib/types.M8Version+compare"></a>

#### m8Version.compare(other) ⇒ <code>Number</code>
Compares two M8 versions and returns -1 if this < other, 1 if this > other and 0 of this === other.

**Kind**: instance method of [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>M8Version</code> | The second M8 version to compare |

<a name="module_m8-js/lib/types.PhraseStep"></a>

### m8-js/lib/types.PhraseStep
Represents a Step (within a Phrase).

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.PhraseStep](#module_m8-js/lib/types.PhraseStep)
    * [new PhraseStep()](#new_module_m8-js/lib/types.PhraseStep_new)
    * [.fx1](#module_m8-js/lib/types.PhraseStep+fx1) : [<code>FX</code>](#module_m8-js/lib/types.FX)
    * [.fx2](#module_m8-js/lib/types.PhraseStep+fx2) : [<code>FX</code>](#module_m8-js/lib/types.FX)
    * [.fx3](#module_m8-js/lib/types.PhraseStep+fx3) : [<code>FX</code>](#module_m8-js/lib/types.FX)
    * [.instrument](#module_m8-js/lib/types.PhraseStep+instrument) : <code>Number</code>
    * [.note](#module_m8-js/lib/types.PhraseStep+note) : <code>Number</code>
    * [.volume](#module_m8-js/lib/types.PhraseStep+volume) : <code>Number</code>
    * [.noteToStr()](#module_m8-js/lib/types.PhraseStep+noteToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.PhraseStep_new"></a>

#### new PhraseStep()
Creates a Phrase.

<a name="module_m8-js/lib/types.PhraseStep+fx1"></a>

#### phraseStep.fx1 : [<code>FX</code>](#module_m8-js/lib/types.FX)
**Kind**: instance property of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.PhraseStep+fx2"></a>

#### phraseStep.fx2 : [<code>FX</code>](#module_m8-js/lib/types.FX)
**Kind**: instance property of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.PhraseStep+fx3"></a>

#### phraseStep.fx3 : [<code>FX</code>](#module_m8-js/lib/types.FX)
**Kind**: instance property of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.PhraseStep+instrument"></a>

#### phraseStep.instrument : <code>Number</code>
**Kind**: instance property of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.PhraseStep+note"></a>

#### phraseStep.note : <code>Number</code>
**Kind**: instance property of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.PhraseStep+volume"></a>

#### phraseStep.volume : <code>Number</code>
**Kind**: instance property of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.PhraseStep+noteToStr"></a>

#### phraseStep.noteToStr() ⇒ <code>String</code>
Returns the string representation of the phrase note.

**Kind**: instance method of [<code>PhraseStep</code>](#module_m8-js/lib/types.PhraseStep)  
<a name="module_m8-js/lib/types.Phrase"></a>

### m8-js/lib/types.Phrase
Represents a Phrase.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Phrase](#module_m8-js/lib/types.Phrase)
    * [new Phrase()](#new_module_m8-js/lib/types.Phrase_new)
    * [.steps](#module_m8-js/lib/types.Phrase+steps) : [<code>Array.&lt;PhraseStep&gt;</code>](#module_m8-js/lib/types.PhraseStep)
    * [.findPhraseStepInstrumentNum([phraseStep])](#module_m8-js/lib/types.Phrase+findPhraseStepInstrumentNum) ⇒ <code>Number</code>

<a name="new_module_m8-js/lib/types.Phrase_new"></a>

#### new Phrase()
Creates a Phrase.

<a name="module_m8-js/lib/types.Phrase+steps"></a>

#### phrase.steps : [<code>Array.&lt;PhraseStep&gt;</code>](#module_m8-js/lib/types.PhraseStep)
**Kind**: instance property of [<code>Phrase</code>](#module_m8-js/lib/types.Phrase)  
<a name="module_m8-js/lib/types.Phrase+findPhraseStepInstrumentNum"></a>

#### phrase.findPhraseStepInstrumentNum([phraseStep]) ⇒ <code>Number</code>
Finds the instrument number for a given phrase step, or for the whole phrase (in isolation).

**Kind**: instance method of [<code>Phrase</code>](#module_m8-js/lib/types.Phrase)  
**Returns**: <code>Number</code> - the instrument number of `0xFF` if not found  

| Param | Type | Description |
| --- | --- | --- |
| [phraseStep] | <code>Number</code> | The optional phrase step (searches the whole phrase if not provided) |

<a name="module_m8-js/lib/types.NoteInterval"></a>

### m8-js/lib/types.NoteInterval
Represents a Note Interval.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.NoteInterval](#module_m8-js/lib/types.NoteInterval)
    * [new NoteInterval()](#new_module_m8-js/lib/types.NoteInterval_new)
    * [.enabled](#module_m8-js/lib/types.NoteInterval+enabled) : <code>Boolean</code>
    * [.offsetA](#module_m8-js/lib/types.NoteInterval+offsetA) : <code>Number</code>
    * [.offsetB](#module_m8-js/lib/types.NoteInterval+offsetB) : <code>Number</code>
    * [.offsetToStr()](#module_m8-js/lib/types.NoteInterval+offsetToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.NoteInterval_new"></a>

#### new NoteInterval()
Creates a Note Interval.

<a name="module_m8-js/lib/types.NoteInterval+enabled"></a>

#### noteInterval.enabled : <code>Boolean</code>
**Kind**: instance property of [<code>NoteInterval</code>](#module_m8-js/lib/types.NoteInterval)  
<a name="module_m8-js/lib/types.NoteInterval+offsetA"></a>

#### noteInterval.offsetA : <code>Number</code>
**Kind**: instance property of [<code>NoteInterval</code>](#module_m8-js/lib/types.NoteInterval)  
<a name="module_m8-js/lib/types.NoteInterval+offsetB"></a>

#### noteInterval.offsetB : <code>Number</code>
**Kind**: instance property of [<code>NoteInterval</code>](#module_m8-js/lib/types.NoteInterval)  
<a name="module_m8-js/lib/types.NoteInterval+offsetToStr"></a>

#### noteInterval.offsetToStr() ⇒ <code>String</code>
String representation of the offset.

**Kind**: instance method of [<code>NoteInterval</code>](#module_m8-js/lib/types.NoteInterval)  
<a name="module_m8-js/lib/types.Scale"></a>

### m8-js/lib/types.Scale
Represents a Scale.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Scale](#module_m8-js/lib/types.Scale)
    * [new Scale([m8Version])](#new_module_m8-js/lib/types.Scale_new)
    * [.m8Version](#module_m8-js/lib/types.Scale+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
    * [.name](#module_m8-js/lib/types.Scale+name) : <code>String</code>
    * [.intervals](#module_m8-js/lib/types.Scale+intervals) : [<code>Array.&lt;NoteInterval&gt;</code>](#module_m8-js/lib/types.NoteInterval)

<a name="new_module_m8-js/lib/types.Scale_new"></a>

#### new Scale([m8Version])
Creates a Scale.


| Param | Type | Description |
| --- | --- | --- |
| [m8Version] | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.Scale+m8Version"></a>

#### scale.m8Version : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
**Kind**: instance property of [<code>Scale</code>](#module_m8-js/lib/types.Scale)  
<a name="module_m8-js/lib/types.Scale+name"></a>

#### scale.name : <code>String</code>
**Kind**: instance property of [<code>Scale</code>](#module_m8-js/lib/types.Scale)  
<a name="module_m8-js/lib/types.Scale+intervals"></a>

#### scale.intervals : [<code>Array.&lt;NoteInterval&gt;</code>](#module_m8-js/lib/types.NoteInterval)
**Kind**: instance property of [<code>Scale</code>](#module_m8-js/lib/types.Scale)  
<a name="module_m8-js/lib/types.EffectsSettings"></a>

### m8-js/lib/types.EffectsSettings
Represents the Effects Settings.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.EffectsSettings](#module_m8-js/lib/types.EffectsSettings)
    * [new EffectsSettings()](#new_module_m8-js/lib/types.EffectsSettings_new)
    * [.chorusModDepth](#module_m8-js/lib/types.EffectsSettings+chorusModDepth) : <code>Number</code>
    * [.chorusModFreq](#module_m8-js/lib/types.EffectsSettings+chorusModFreq) : <code>Number</code>
    * [.chorusReverbSend](#module_m8-js/lib/types.EffectsSettings+chorusReverbSend) : <code>Number</code>
    * [.chorusWidth](#module_m8-js/lib/types.EffectsSettings+chorusWidth) : <code>Number</code>
    * [.delayFeedback](#module_m8-js/lib/types.EffectsSettings+delayFeedback) : <code>Number</code>
    * [.delayFilter](#module_m8-js/lib/types.EffectsSettings+delayFilter) : <code>Array.&lt;Number&gt;</code>
    * [.delayReverbSend](#module_m8-js/lib/types.EffectsSettings+delayReverbSend) : <code>Number</code>
    * [.delayTime](#module_m8-js/lib/types.EffectsSettings+delayTime) : <code>Array.&lt;Number&gt;</code>
    * [.delayWidth](#module_m8-js/lib/types.EffectsSettings+delayWidth) : <code>Number</code>
    * [.reverbDamping](#module_m8-js/lib/types.EffectsSettings+reverbDamping) : <code>Number</code>
    * [.reverbFilter](#module_m8-js/lib/types.EffectsSettings+reverbFilter) : <code>Array.&lt;Number&gt;</code>
    * [.reverbModDepth](#module_m8-js/lib/types.EffectsSettings+reverbModDepth) : <code>Number</code>
    * [.reverbModFreq](#module_m8-js/lib/types.EffectsSettings+reverbModFreq) : <code>Number</code>
    * [.reverbSize](#module_m8-js/lib/types.EffectsSettings+reverbSize) : <code>Number</code>
    * [.reverbWidth](#module_m8-js/lib/types.EffectsSettings+reverbWidth) : <code>Number</code>

<a name="new_module_m8-js/lib/types.EffectsSettings_new"></a>

#### new EffectsSettings()
Create an Effects Settings.

<a name="module_m8-js/lib/types.EffectsSettings+chorusModDepth"></a>

#### effectsSettings.chorusModDepth : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+chorusModFreq"></a>

#### effectsSettings.chorusModFreq : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+chorusReverbSend"></a>

#### effectsSettings.chorusReverbSend : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+chorusWidth"></a>

#### effectsSettings.chorusWidth : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+delayFeedback"></a>

#### effectsSettings.delayFeedback : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+delayFilter"></a>

#### effectsSettings.delayFilter : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+delayReverbSend"></a>

#### effectsSettings.delayReverbSend : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+delayTime"></a>

#### effectsSettings.delayTime : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+delayWidth"></a>

#### effectsSettings.delayWidth : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+reverbDamping"></a>

#### effectsSettings.reverbDamping : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+reverbFilter"></a>

#### effectsSettings.reverbFilter : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+reverbModDepth"></a>

#### effectsSettings.reverbModDepth : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+reverbModFreq"></a>

#### effectsSettings.reverbModFreq : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+reverbSize"></a>

#### effectsSettings.reverbSize : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.EffectsSettings+reverbWidth"></a>

#### effectsSettings.reverbWidth : <code>Number</code>
**Kind**: instance property of [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)  
<a name="module_m8-js/lib/types.MIDIMapping"></a>

### m8-js/lib/types.MIDIMapping
Represents a MIDI Mapping.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MIDIMapping](#module_m8-js/lib/types.MIDIMapping)
    * [new MIDIMapping()](#new_module_m8-js/lib/types.MIDIMapping_new)
    * [.channel](#module_m8-js/lib/types.MIDIMapping+channel) : <code>Number</code>
    * [.controlNum](#module_m8-js/lib/types.MIDIMapping+controlNum) : <code>Number</code>
    * [.empty](#module_m8-js/lib/types.MIDIMapping+empty) : <code>Boolean</code>
    * [.maxValue](#module_m8-js/lib/types.MIDIMapping+maxValue) : <code>Number</code>
    * [.minValue](#module_m8-js/lib/types.MIDIMapping+minValue) : <code>Number</code>
    * [.paramIndex](#module_m8-js/lib/types.MIDIMapping+paramIndex) : <code>Number</code>
    * [.type](#module_m8-js/lib/types.MIDIMapping+type) : <code>Number</code>
    * [.value](#module_m8-js/lib/types.MIDIMapping+value) : <code>Number</code>
    * [.destToStr()](#module_m8-js/lib/types.MIDIMapping+destToStr) ⇒ <code>String</code>
    * [.typeToChar()](#module_m8-js/lib/types.MIDIMapping+typeToChar) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.MIDIMapping_new"></a>

#### new MIDIMapping()
Create a MIDI Mapping.

<a name="module_m8-js/lib/types.MIDIMapping+channel"></a>

#### midiMapping.channel : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+controlNum"></a>

#### midiMapping.controlNum : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+empty"></a>

#### midiMapping.empty : <code>Boolean</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+maxValue"></a>

#### midiMapping.maxValue : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+minValue"></a>

#### midiMapping.minValue : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+paramIndex"></a>

#### midiMapping.paramIndex : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+type"></a>

#### midiMapping.type : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+value"></a>

#### midiMapping.value : <code>Number</code>
**Kind**: instance property of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+destToStr"></a>

#### midiMapping.destToStr() ⇒ <code>String</code>
Returns the string representation of the mapping destination.

**Kind**: instance method of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDIMapping+typeToChar"></a>

#### midiMapping.typeToChar() ⇒ <code>String</code>
Returns a single-character string representation of the mapping type.

**Kind**: instance method of [<code>MIDIMapping</code>](#module_m8-js/lib/types.MIDIMapping)  
<a name="module_m8-js/lib/types.MIDISettings"></a>

### m8-js/lib/types.MIDISettings
Represents the MIDI Settings.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MIDISettings](#module_m8-js/lib/types.MIDISettings)
    * [new MIDISettings()](#new_module_m8-js/lib/types.MIDISettings_new)
    * [.controlMapChannel](#module_m8-js/lib/types.MIDISettings+controlMapChannel) : <code>Number</code>
    * [.receiveSync](#module_m8-js/lib/types.MIDISettings+receiveSync) : <code>Boolean</code>
    * [.receiveTransport](#module_m8-js/lib/types.MIDISettings+receiveTransport) : <code>Number</code>
    * [.recordNoteChannel](#module_m8-js/lib/types.MIDISettings+recordNoteChannel) : <code>Number</code>
    * [.recordNoteDelayKillCommands](#module_m8-js/lib/types.MIDISettings+recordNoteDelayKillCommands) : <code>Boolean</code>
    * [.recordNoteVelocity](#module_m8-js/lib/types.MIDISettings+recordNoteVelocity) : <code>Boolean</code>
    * [.sendSync](#module_m8-js/lib/types.MIDISettings+sendSync) : <code>Boolean</code>
    * [.sendTransport](#module_m8-js/lib/types.MIDISettings+sendTransport) : <code>Number</code>
    * [.songRowCueChannel](#module_m8-js/lib/types.MIDISettings+songRowCueChannel) : <code>Number</code>
    * [.trackInputChannel](#module_m8-js/lib/types.MIDISettings+trackInputChannel) : <code>Array.&lt;Number&gt;</code>
    * [.trackInputInstrument](#module_m8-js/lib/types.MIDISettings+trackInputInstrument) : <code>Array.&lt;Number&gt;</code>
    * [.trackInputMode](#module_m8-js/lib/types.MIDISettings+trackInputMode) : <code>Number</code>
    * [.trackInputProgramChange](#module_m8-js/lib/types.MIDISettings+trackInputProgramChange) : <code>Boolean</code>
    * [.recordNoteDelayKillCommandsToStr()](#module_m8-js/lib/types.MIDISettings+recordNoteDelayKillCommandsToStr) ⇒ <code>String</code>
    * [.trackInputModeToStr()](#module_m8-js/lib/types.MIDISettings+trackInputModeToStr) ⇒ <code>String</code>
    * [.transportToStr(transport)](#module_m8-js/lib/types.MIDISettings+transportToStr) ⇒ <code>String</code>

<a name="new_module_m8-js/lib/types.MIDISettings_new"></a>

#### new MIDISettings()
Create a MIDI Settings.

<a name="module_m8-js/lib/types.MIDISettings+controlMapChannel"></a>

#### midiSettings.controlMapChannel : <code>Number</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+receiveSync"></a>

#### midiSettings.receiveSync : <code>Boolean</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+receiveTransport"></a>

#### midiSettings.receiveTransport : <code>Number</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+recordNoteChannel"></a>

#### midiSettings.recordNoteChannel : <code>Number</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+recordNoteDelayKillCommands"></a>

#### midiSettings.recordNoteDelayKillCommands : <code>Boolean</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+recordNoteVelocity"></a>

#### midiSettings.recordNoteVelocity : <code>Boolean</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+sendSync"></a>

#### midiSettings.sendSync : <code>Boolean</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+sendTransport"></a>

#### midiSettings.sendTransport : <code>Number</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+songRowCueChannel"></a>

#### midiSettings.songRowCueChannel : <code>Number</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+trackInputChannel"></a>

#### midiSettings.trackInputChannel : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+trackInputInstrument"></a>

#### midiSettings.trackInputInstrument : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+trackInputMode"></a>

#### midiSettings.trackInputMode : <code>Number</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+trackInputProgramChange"></a>

#### midiSettings.trackInputProgramChange : <code>Boolean</code>
**Kind**: instance property of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+recordNoteDelayKillCommandsToStr"></a>

#### midiSettings.recordNoteDelayKillCommandsToStr() ⇒ <code>String</code>
Returns a string representation of the record delay/kill commands.

**Kind**: instance method of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+trackInputModeToStr"></a>

#### midiSettings.trackInputModeToStr() ⇒ <code>String</code>
Returns a string representation of the track input mode.

**Kind**: instance method of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  
<a name="module_m8-js/lib/types.MIDISettings+transportToStr"></a>

#### midiSettings.transportToStr(transport) ⇒ <code>String</code>
Returns a string representation of the transport mode.

**Kind**: instance method of [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)  

| Param | Type | Description |
| --- | --- | --- |
| transport | <code>String</code> | The raw transport value |

<a name="module_m8-js/lib/types.SongStep"></a>

### m8-js/lib/types.SongStep
Represents a Song step.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.SongStep](#module_m8-js/lib/types.SongStep)
    * [new SongStep()](#new_module_m8-js/lib/types.SongStep_new)
    * [.track1](#module_m8-js/lib/types.SongStep+track1) : <code>Number</code>
    * [.track2](#module_m8-js/lib/types.SongStep+track2) : <code>Number</code>
    * [.track3](#module_m8-js/lib/types.SongStep+track3) : <code>Number</code>
    * [.track4](#module_m8-js/lib/types.SongStep+track4) : <code>Number</code>
    * [.track5](#module_m8-js/lib/types.SongStep+track5) : <code>Number</code>
    * [.track6](#module_m8-js/lib/types.SongStep+track6) : <code>Number</code>
    * [.track7](#module_m8-js/lib/types.SongStep+track7) : <code>Number</code>
    * [.track8](#module_m8-js/lib/types.SongStep+track8) : <code>Number</code>

<a name="new_module_m8-js/lib/types.SongStep_new"></a>

#### new SongStep()
Create a Song Step.

<a name="module_m8-js/lib/types.SongStep+track1"></a>

#### songStep.track1 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track2"></a>

#### songStep.track2 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track3"></a>

#### songStep.track3 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track4"></a>

#### songStep.track4 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track5"></a>

#### songStep.track5 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track6"></a>

#### songStep.track6 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track7"></a>

#### songStep.track7 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.SongStep+track8"></a>

#### songStep.track8 : <code>Number</code>
**Kind**: instance property of [<code>SongStep</code>](#module_m8-js/lib/types.SongStep)  
<a name="module_m8-js/lib/types.MixerSettings"></a>

### m8-js/lib/types.MixerSettings
Represents the Mixer Settings.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.MixerSettings](#module_m8-js/lib/types.MixerSettings)
    * [new MixerSettings()](#new_module_m8-js/lib/types.MixerSettings_new)
    * [.analogInputChorus](#module_m8-js/lib/types.MixerSettings+analogInputChorus) : <code>Array.&lt;Number&gt;</code>
    * [.analogInputDelay](#module_m8-js/lib/types.MixerSettings+analogInputDelay) : <code>Array.&lt;Number&gt;</code>
    * [.analogInputReverb](#module_m8-js/lib/types.MixerSettings+analogInputReverb) : <code>Array.&lt;Number&gt;</code>
    * [.analogInputVolume](#module_m8-js/lib/types.MixerSettings+analogInputVolume) : <code>Array.&lt;Number&gt;</code>
    * [.chorusVolume](#module_m8-js/lib/types.MixerSettings+chorusVolume) : <code>Number</code>
    * [.delayVolume](#module_m8-js/lib/types.MixerSettings+delayVolume) : <code>Number</code>
    * [.djFilter](#module_m8-js/lib/types.MixerSettings+djFilter) : <code>Number</code>
    * [.djFilterPeak](#module_m8-js/lib/types.MixerSettings+djFilterPeak) : <code>Number</code>
    * [.masterLimit](#module_m8-js/lib/types.MixerSettings+masterLimit) : <code>Number</code>
    * [.masterVolume](#module_m8-js/lib/types.MixerSettings+masterVolume) : <code>Number</code>
    * [.reverbVolume](#module_m8-js/lib/types.MixerSettings+reverbVolume) : <code>Number</code>
    * [.trackVolume](#module_m8-js/lib/types.MixerSettings+trackVolume) : <code>Array.&lt;Number&gt;</code>
    * [.usbInputChorus](#module_m8-js/lib/types.MixerSettings+usbInputChorus) : <code>Number</code>
    * [.usbInputDelay](#module_m8-js/lib/types.MixerSettings+usbInputDelay) : <code>Number</code>
    * [.usbInputReverb](#module_m8-js/lib/types.MixerSettings+usbInputReverb) : <code>Number</code>
    * [.usbInputVolume](#module_m8-js/lib/types.MixerSettings+usbInputVolume) : <code>Number</code>

<a name="new_module_m8-js/lib/types.MixerSettings_new"></a>

#### new MixerSettings()
Create a MIDI Settings.

<a name="module_m8-js/lib/types.MixerSettings+analogInputChorus"></a>

#### mixerSettings.analogInputChorus : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+analogInputDelay"></a>

#### mixerSettings.analogInputDelay : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+analogInputReverb"></a>

#### mixerSettings.analogInputReverb : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+analogInputVolume"></a>

#### mixerSettings.analogInputVolume : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+chorusVolume"></a>

#### mixerSettings.chorusVolume : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+delayVolume"></a>

#### mixerSettings.delayVolume : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+djFilter"></a>

#### mixerSettings.djFilter : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+djFilterPeak"></a>

#### mixerSettings.djFilterPeak : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+masterLimit"></a>

#### mixerSettings.masterLimit : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+masterVolume"></a>

#### mixerSettings.masterVolume : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+reverbVolume"></a>

#### mixerSettings.reverbVolume : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+trackVolume"></a>

#### mixerSettings.trackVolume : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+usbInputChorus"></a>

#### mixerSettings.usbInputChorus : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+usbInputDelay"></a>

#### mixerSettings.usbInputDelay : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+usbInputReverb"></a>

#### mixerSettings.usbInputReverb : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.MixerSettings+usbInputVolume"></a>

#### mixerSettings.usbInputVolume : <code>Number</code>
**Kind**: instance property of [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)  
<a name="module_m8-js/lib/types.Song"></a>

### m8-js/lib/types.Song
Represents a Song.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Song](#module_m8-js/lib/types.Song)
    * [new Song(m8Version)](#new_module_m8-js/lib/types.Song_new)
    * [.chains](#module_m8-js/lib/types.Song+chains) : [<code>Array.&lt;Chain&gt;</code>](#module_m8-js/lib/types.Chain)
    * [.directory](#module_m8-js/lib/types.Song+directory) : <code>String</code>
    * [.effectsSettings](#module_m8-js/lib/types.Song+effectsSettings) : [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)
    * [.grooves](#module_m8-js/lib/types.Song+grooves) : [<code>Array.&lt;Groove&gt;</code>](#module_m8-js/lib/types.Groove)
    * [.instruments](#module_m8-js/lib/types.Song+instruments) : [<code>Array.&lt;Instrument&gt;</code>](#module_m8-js/lib/types.Instrument)
    * [.key](#module_m8-js/lib/types.Song+key) : <code>Number</code>
    * [.midiSettings](#module_m8-js/lib/types.Song+midiSettings) : [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)
    * [.mixerSettings](#module_m8-js/lib/types.Song+mixerSettings) : [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)
    * [.name](#module_m8-js/lib/types.Song+name) : <code>String</code>
    * [.phrases](#module_m8-js/lib/types.Song+phrases) : [<code>Array.&lt;Phrase&gt;</code>](#module_m8-js/lib/types.Phrase)
    * [.quantize](#module_m8-js/lib/types.Song+quantize) : <code>Number</code>
    * [.scales](#module_m8-js/lib/types.Song+scales) : [<code>Array.&lt;Scale&gt;</code>](#module_m8-js/lib/types.Scale)
    * [.steps](#module_m8-js/lib/types.Song+steps) : [<code>Array.&lt;SongStep&gt;</code>](#module_m8-js/lib/types.SongStep)
    * [.tables](#module_m8-js/lib/types.Song+tables) : [<code>Array.&lt;Table&gt;</code>](#module_m8-js/lib/types.Table)
    * [.tempo](#module_m8-js/lib/types.Song+tempo) : <code>Number</code>
    * [.transpose](#module_m8-js/lib/types.Song+transpose) : <code>Number</code>
    * [.version](#module_m8-js/lib/types.Song+version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)

<a name="new_module_m8-js/lib/types.Song_new"></a>

#### new Song(m8Version)
Create a Song.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version (different versions of M8 use different M8 structures) |

<a name="module_m8-js/lib/types.Song+chains"></a>

#### song.chains : [<code>Array.&lt;Chain&gt;</code>](#module_m8-js/lib/types.Chain)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+directory"></a>

#### song.directory : <code>String</code>
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+effectsSettings"></a>

#### song.effectsSettings : [<code>EffectsSettings</code>](#module_m8-js/lib/types.EffectsSettings)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+grooves"></a>

#### song.grooves : [<code>Array.&lt;Groove&gt;</code>](#module_m8-js/lib/types.Groove)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+instruments"></a>

#### song.instruments : [<code>Array.&lt;Instrument&gt;</code>](#module_m8-js/lib/types.Instrument)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+key"></a>

#### song.key : <code>Number</code>
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+midiSettings"></a>

#### song.midiSettings : [<code>MIDISettings</code>](#module_m8-js/lib/types.MIDISettings)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+mixerSettings"></a>

#### song.mixerSettings : [<code>MixerSettings</code>](#module_m8-js/lib/types.MixerSettings)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+name"></a>

#### song.name : <code>String</code>
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+phrases"></a>

#### song.phrases : [<code>Array.&lt;Phrase&gt;</code>](#module_m8-js/lib/types.Phrase)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+quantize"></a>

#### song.quantize : <code>Number</code>
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+scales"></a>

#### song.scales : [<code>Array.&lt;Scale&gt;</code>](#module_m8-js/lib/types.Scale)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+steps"></a>

#### song.steps : [<code>Array.&lt;SongStep&gt;</code>](#module_m8-js/lib/types.SongStep)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+tables"></a>

#### song.tables : [<code>Array.&lt;Table&gt;</code>](#module_m8-js/lib/types.Table)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+tempo"></a>

#### song.tempo : <code>Number</code>
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+transpose"></a>

#### song.transpose : <code>Number</code>
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.Song+version"></a>

#### song.version : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
**Kind**: instance property of [<code>Song</code>](#module_m8-js/lib/types.Song)  
<a name="module_m8-js/lib/types.TableStep"></a>

### m8-js/lib/types.TableStep
Represents a Step (within a Table).

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.TableStep](#module_m8-js/lib/types.TableStep)
    * [new TableStep()](#new_module_m8-js/lib/types.TableStep_new)
    * [.fx1](#module_m8-js/lib/types.TableStep+fx1) : [<code>FX</code>](#module_m8-js/lib/types.FX)
    * [.fx2](#module_m8-js/lib/types.TableStep+fx2) : [<code>FX</code>](#module_m8-js/lib/types.FX)
    * [.fx3](#module_m8-js/lib/types.TableStep+fx3) : [<code>FX</code>](#module_m8-js/lib/types.FX)
    * [.transpose](#module_m8-js/lib/types.TableStep+transpose) : <code>Number</code>
    * [.volume](#module_m8-js/lib/types.TableStep+volume) : <code>Number</code>

<a name="new_module_m8-js/lib/types.TableStep_new"></a>

#### new TableStep()
Creates a Phrase.

<a name="module_m8-js/lib/types.TableStep+fx1"></a>

#### tableStep.fx1 : [<code>FX</code>](#module_m8-js/lib/types.FX)
**Kind**: instance property of [<code>TableStep</code>](#module_m8-js/lib/types.TableStep)  
<a name="module_m8-js/lib/types.TableStep+fx2"></a>

#### tableStep.fx2 : [<code>FX</code>](#module_m8-js/lib/types.FX)
**Kind**: instance property of [<code>TableStep</code>](#module_m8-js/lib/types.TableStep)  
<a name="module_m8-js/lib/types.TableStep+fx3"></a>

#### tableStep.fx3 : [<code>FX</code>](#module_m8-js/lib/types.FX)
**Kind**: instance property of [<code>TableStep</code>](#module_m8-js/lib/types.TableStep)  
<a name="module_m8-js/lib/types.TableStep+transpose"></a>

#### tableStep.transpose : <code>Number</code>
**Kind**: instance property of [<code>TableStep</code>](#module_m8-js/lib/types.TableStep)  
<a name="module_m8-js/lib/types.TableStep+volume"></a>

#### tableStep.volume : <code>Number</code>
**Kind**: instance property of [<code>TableStep</code>](#module_m8-js/lib/types.TableStep)  
<a name="module_m8-js/lib/types.Table"></a>

### m8-js/lib/types.Table
Represents a Table.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Table](#module_m8-js/lib/types.Table)
    * [new Table()](#new_module_m8-js/lib/types.Table_new)
    * [.steps](#module_m8-js/lib/types.Table+steps) : [<code>Array.&lt;TableStep&gt;</code>](#module_m8-js/lib/types.TableStep)

<a name="new_module_m8-js/lib/types.Table_new"></a>

#### new Table()
Creates a Table.

<a name="module_m8-js/lib/types.Table+steps"></a>

#### table.steps : [<code>Array.&lt;TableStep&gt;</code>](#module_m8-js/lib/types.TableStep)
**Kind**: instance property of [<code>Table</code>](#module_m8-js/lib/types.Table)  
<a name="module_m8-js/lib/types.Theme"></a>

### m8-js/lib/types.Theme
Represents a Theme.

**Kind**: static class of [<code>m8-js/lib/types</code>](#module_m8-js/lib/types)  

* [.Theme](#module_m8-js/lib/types.Theme)
    * [new Theme(m8Version)](#new_module_m8-js/lib/types.Theme_new)
    * [.background](#module_m8-js/lib/types.Theme+background) : <code>Array.&lt;Number&gt;</code>
    * [.textEmpty](#module_m8-js/lib/types.Theme+textEmpty) : <code>Array.&lt;Number&gt;</code>
    * [.textInfo](#module_m8-js/lib/types.Theme+textInfo) : <code>Array.&lt;Number&gt;</code>
    * [.textDefault](#module_m8-js/lib/types.Theme+textDefault) : <code>Array.&lt;Number&gt;</code>
    * [.textValue](#module_m8-js/lib/types.Theme+textValue) : <code>Array.&lt;Number&gt;</code>
    * [.textTitle](#module_m8-js/lib/types.Theme+textTitle) : <code>Array.&lt;Number&gt;</code>
    * [.playMarker](#module_m8-js/lib/types.Theme+playMarker) : <code>Array.&lt;Number&gt;</code>
    * [.cursor](#module_m8-js/lib/types.Theme+cursor) : <code>Array.&lt;Number&gt;</code>
    * [.selection](#module_m8-js/lib/types.Theme+selection) : <code>Array.&lt;Number&gt;</code>
    * [.scopeSlider](#module_m8-js/lib/types.Theme+scopeSlider) : <code>Array.&lt;Number&gt;</code>
    * [.meterLow](#module_m8-js/lib/types.Theme+meterLow) : <code>Array.&lt;Number&gt;</code>
    * [.meterMid](#module_m8-js/lib/types.Theme+meterMid) : <code>Array.&lt;Number&gt;</code>
    * [.meterPeak](#module_m8-js/lib/types.Theme+meterPeak) : <code>Array.&lt;Number&gt;</code>
    * [.m8Version](#module_m8-js/lib/types.Theme+m8Version) : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)

<a name="new_module_m8-js/lib/types.Theme_new"></a>

#### new Theme(m8Version)
Creates a Theme.


| Param | Type | Description |
| --- | --- | --- |
| m8Version | [<code>M8Version</code>](#module_m8-js/lib/types.M8Version) | The M8 version of the instrument |

<a name="module_m8-js/lib/types.Theme+background"></a>

#### theme.background : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+textEmpty"></a>

#### theme.textEmpty : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+textInfo"></a>

#### theme.textInfo : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+textDefault"></a>

#### theme.textDefault : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+textValue"></a>

#### theme.textValue : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+textTitle"></a>

#### theme.textTitle : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+playMarker"></a>

#### theme.playMarker : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+cursor"></a>

#### theme.cursor : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+selection"></a>

#### theme.selection : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+scopeSlider"></a>

#### theme.scopeSlider : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+meterLow"></a>

#### theme.meterLow : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+meterMid"></a>

#### theme.meterMid : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+meterPeak"></a>

#### theme.meterPeak : <code>Array.&lt;Number&gt;</code>
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
<a name="module_m8-js/lib/types.Theme+m8Version"></a>

#### theme.m8Version : [<code>M8Version</code>](#module_m8-js/lib/types.M8Version)
**Kind**: instance property of [<code>Theme</code>](#module_m8-js/lib/types.Theme)  
