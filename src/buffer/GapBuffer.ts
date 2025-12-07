class GapBuffer {
    private _gapStartIndex: number;
    private _gapEndIndex: number;
    
    public initGapSize : number;
    public gapGrowSize : number;

    private _buffer : string[];
    constructor (initGapSize = 10, gapGrowSize = 5) {
        this.initGapSize = initGapSize;
        this.gapGrowSize = gapGrowSize;

        this._gapStartIndex = 0;
        this._gapEndIndex = this.initGapSize - 1;
        
        this._buffer = new Array<string>(this.initGapSize).fill("");
    }

    public insert(str : string) {
        for (const c of str) {
            if (this._gapStartIndex == this._gapEndIndex) {
                this.grow();
            }
            this._buffer[this._gapStartIndex] = c;
            this._gapStartIndex++;
        }        
    }


    public left() {
        if (this._gapStartIndex <= 0) {
            return;
        }
        const shiftedCharIndex = this._gapStartIndex - 1;
        const shiftedChar : string = this._buffer[shiftedCharIndex];
        this._buffer[shiftedCharIndex] = ""
        this.buffer[this._gapEndIndex] = shiftedChar;

        this._gapStartIndex--;
        this._gapEndIndex--;
    }

    public right() {
        if (this._gapEndIndex >= this._buffer.length - 1) {
            return;
        }
        const shiftedCharIndex = this._gapEndIndex + 1;
        const shiftedChar : string = this._buffer[shiftedCharIndex];
        this._buffer[shiftedCharIndex] = ""
        this.buffer[this._gapStartIndex] = shiftedChar;

        this._gapStartIndex++;
        this._gapEndIndex++;
    }

    private grow() {
        const newSize = this._buffer.length + this.gapGrowSize;
        let newArr = new Array<string>(newSize).fill("");
        for (let i = 0; i < this._buffer.length; i++){ // Copy old array accordingly
            const offset : number = i > this._gapStartIndex? this.gapGrowSize : 0;
            newArr[i + offset] = this._buffer[i]
        }

        this._gapEndIndex += this.gapGrowSize;
        this._buffer = newArr;
    }

    get buffer() : string[] {
        return this._buffer;
    }
    
    get cursor() : number {
        return this._gapStartIndex
    }

    public toString() : string {
        return this._buffer.join("");
    }

    public toGapString() : string { // String contains '*' denoting gaps
        let str = "";
        for (let i = 0; i < this._buffer.length; i++){
            const char = this.buffer[i];
            str += char != "" ? char : '*';
        }
        return str;
    }
}

export default GapBuffer;