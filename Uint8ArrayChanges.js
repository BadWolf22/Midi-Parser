Uint8Array.prototype.readBytes = function (numBytes = Number, readType="raw", peek=true) {
    if (numBytes == 0) { // variable length
        let varlen = [];
        do {
            varlen.push(this.readBytes(1));
        } while (varlen[varlen.length] > 128);
        varlen = new Uint8Array(varlen);
        if (readType == "int") return this.segmentToInt(varlen);
        if (readType == "str") return this.segmentToStr(varlen);
        return varlen;
    } else {
        let offset = this.pointer + numBytes;
        let segment = this.slice(this.pointer, offset);
        if (peek) this.pointer += numBytes;
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