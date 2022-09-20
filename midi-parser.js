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