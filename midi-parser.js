/**
 * @class Automatically parses Midi files and stores the data.
 */
class Midi {
    /**
     * @constructs
     * @param {ArrayBuffer} raw - The raw binary data of the selected midi file as an ArrayBuffer
     */
    constructor(raw) {
        this.header = {};
        this.tracks = [];
        this.raw = raw;
        this.bufPointer = 0;
        this.parseMidi(raw);
    }

    /**
     * @todo: Implement reading `numBytes` bytes.
     * @todo: Implement reading `numBytes` bytes as an `Integer`.
     * @todo: Implement reading an arbitrary number of bytes using the [variable length standard](http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BM1_1).
     */
    readBytes = function(numBytes = Number, asInt = Boolean, variableLength = Boolean) {

    }

    /**
     * Converts a portion of a `Uint8Array` to an integer.
     * @param {Uint8Array} segment The portion to convert.
     * @returns {Integer} An equivalent integer.
     * @method
     * @deprecated To be integrated into `this.readBytes()`.
     */
    segmentToInt = function(segment) {
        let hexStr = "";
        for (let val of segment) {
            hexStr += val.toString(16);
        }
        return parseInt(hexStr, 16);
    }

    parseMidi = function(content = ArrayBuffer) {
        content = new Uint8Array(content);
        // buf = content;
        let header = content.slice(0,14);
    
        // let midi = new Midi();
        // midi_u = midi;
        this.header = this.parseHeader(header);
    
        let tracks = [];
        // FIXME: I don't really like this implementation much
        let pos = 14;
        for (let i = 0; i < this.header.numTracks; i++) {
            let len = this.segmentToInt(content.slice(pos+4, pos+8));
            let offset = pos + 8 + len;
            let track = content.slice(pos, offset);
            tracks.push(track);
            pos = offset;
        }
    
        for (let track of tracks) {
            this.tracks.push(this.parseTrack(track));
        }
    }

    parseHeader = function(header = Uint8Array) {
        let MThd = String.fromCharCode(...header.slice(0,4));
        if (MThd != "MThd") throw 'Not a Midi File!';
        let headerLength = this.segmentToInt(header.slice(4,8));
        let format = this.segmentToInt(header.slice(8,10));
        let numTracks = this.segmentToInt(header.slice(10,12));
        let division = this.segmentToInt(header.slice(12,14));
    
        console.info(`Midi Header Parsed`);
        return {MThd, headerLength, format, numTracks, division};
    }

    parseTrack = function(track = Uint8Array) {
        let MTrk = String.fromCharCode(...track.slice(0,4));
        if (MTrk != "MTrk") throw 'Track incorrectly formatted/loaded.'
        let trackLength = this.segmentToInt(track.slice(4,8));
    
        let pos = 8;
        let events = [];
        // delta time is variable length. Therefore, we cannot guess how many bits long it is.
        // https://en.wikipedia.org/wiki/Variable-length_quantity
        // FIXME: Incomplete (also make me better)
        // while (pos - 8 < trackLength) {
            let offset = -1;
            let deltaTime = "";
            do {
                offset++;
                let rawDelta = track[pos+offset].toString(2);
                deltaTime += rawDelta.length < 8 ? rawDelta : rawDelta.slice(1,8);
            } while (track[pos+offset] >= 128);
            offset++;
            // midi, meta, sysex
            let eventType = track[pos+offset];
            offset++;
    
            deltaTime = parseInt(deltaTime, 2);
            console.log(track[pos+offset+1]);
        // }
        
        // console.log(trackLength);
    }
}

// Listens for File Select in HTML
const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    for (let file in Object.keys(fileList)) {
        readMidi(fileList[file]);
    }
});

function readMidi(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        console.info(`Midi File Loaded: ${file.name}`);
        let parsed = new Midi(reader.result);
    });
    reader.readAsArrayBuffer(file);
}