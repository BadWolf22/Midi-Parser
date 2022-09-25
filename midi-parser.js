/**
 * @class Automatically parses Midi files and stores the data.
 */
class Midi {
    static midiEvents = {};
    /**
     * @constructs
     * @param {ArrayBuffer} raw - The raw binary data of the selected midi file as an ArrayBuffer
     */
    constructor(raw) {
        this.header = {};
        this.tracks = [];
        this.raw = new Uint8Array(raw);
        // this.bufPointer = 0;
        this.parseMidi();
    }

    parseMidi = function () {
        let rawHeader = this.raw.readBytes(14);
        this.header = this.parseHeader(rawHeader);

        this.splitTracks();
    }

    splitTracks = function() {
        let tracks = [];
        for (let i = 0; i < this.header.numTracks; i++) {
            let MTrk = this.raw.readBytes(4, "str");
            if (MTrk != "MTrk") throw 'Track incorrectly formatted/loaded.'
            let len = this.raw.readBytes(4, "int");
            let track = this.raw.readBytes(len);
            tracks.push({track, len, MTrk});
        }

        for (let track of tracks) {
            this.tracks.push(this.parseTrack(track));
        }
    }

    parseHeader = function (header = Uint8Array) {
        let MThd = header.readBytes(4, "str");
        if (MThd != "MThd") throw 'Not a Midi File!';
        let headerLength = header.readBytes(4, "int");
        let format = header.readBytes(2, "int");
        let numTracks = header.readBytes(2, "int");
        let division = header.readBytes(2, "int");

        console.info(`Midi Header Parsed`);
        return { MThd, headerLength, format, numTracks, division };
    }

    parseTrack = function (track) {
        let events = [];

        // delta time is variable length. Therefore, we cannot guess how many bits long it is.
        // https://en.wikipedia.org/wiki/Variable-length_quantity

        
    }
}