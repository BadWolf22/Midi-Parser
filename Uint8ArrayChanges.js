Uint8Array.prototype.pointer = 0;
/**
 * @todo: Implement reading an arbitrary number of bytes using the [variable length standard](http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BM1_1).
 */
Uint8Array.prototype.readBytes = function (numBytes = Number, readType="raw") {
    if (numBytes == 0) {

    } else {
        let offset = this.pointer + numBytes;
        let segment = this.slice(this.pointer, offset);
        this.pointer += numBytes;
        if (readType == "int") return this.segmentToInt(segment);
        if (readType == "str") return this.segmentToStr(segment);
        return segment;
    }
}
/**
 * Converts a portion of a `Uint8Array` to an integer.
 * @param {Uint8Array} segment The portion to convert.
 * @returns {Integer} An equivalent integer.
 * @method
 * @deprecated To be integrated into `this.readBytes()`.
 */
Uint8Array.prototype.segmentToInt = function (segment) {
    let hexStr = "";
    for (let val of segment) {
        hexStr += val.toString(16);
    }
    return parseInt(hexStr, 16);
}

Uint8Array.prototype.segmentToStr = function (segment) {
    return String.fromCharCode(...segment);
}