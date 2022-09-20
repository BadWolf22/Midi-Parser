function readMidi(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        console.info(`Midi File Loaded: ${file.name}`);
        parseMidi(reader.result);
    });
    reader.readAsArrayBuffer(file);
}

class Midi {
    constructor() {
        this.header = {};
        this.tracks = [];
    }
}

let buf;
let midi_u;

function parseMidi(content = ArrayBuffer) {
    content = new Uint8Array(content);
    buf = content;
    let header = content.slice(0,14);

    let midi = new Midi();
    midi_u = midi;
    midi.header = parseHeader(header);

    let tracks = [];
    // FIXME: I don't really like this implementation much
    let pos = 14;
    for (let i = 0; i < midi.header.numTracks; i++) {
        let len = segmentToInt(content.slice(pos+4, pos+8));
        let offset = pos + 8 + len;
        let track = content.slice(pos, offset);
        tracks.push(track);
        pos = offset;
    }

    for (let track of tracks) {
        midi.tracks.push(parseTrack(track));
    }
}

function parseHeader(header) {
    let MThd = String.fromCharCode(...header.slice(0,4));
    if (MThd != "MThd") throw 'Not a Midi File!';
    let headerLength = segmentToInt(header.slice(4,8));
    let format = segmentToInt(header.slice(8,10));
    let numTracks = segmentToInt(header.slice(10,12));
    let division = segmentToInt(header.slice(12,14));

    console.info(`Midi Header Parsed`);
    return {MThd, headerLength, format, numTracks, division};
}

function parseTrack(track) {
    let MTrk = String.fromCharCode(...track.slice(0,4));
    if (MTrk != "MTrk") throw 'Track incorrectly formatted/loaded.'
    let trackLength = segmentToInt(track.slice(4,8));

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

function segmentToInt(segment = Uint8Array) {
    let hexStr = "";
    for (let val of segment) {
        hexStr += val.toString(16);
    }
    return parseInt(hexStr, 16);
}

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    for (let file in Object.keys(fileList)) {
        readMidi(fileList[file]);
    }
});