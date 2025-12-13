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


    public left() : boolean {
        if (this._gapStartIndex <= 0) {
            return false;
        }
        const shiftedCharIndex = this._gapStartIndex - 1;
        const shiftedChar : string = this._buffer[shiftedCharIndex];
        this._buffer[shiftedCharIndex] = ""
        this.buffer[this._gapEndIndex] = shiftedChar;

        this._gapStartIndex--;
        this._gapEndIndex--;
        return true;
    }

    public right() : boolean {
        if (this._gapEndIndex >= this._buffer.length - 1) {
            return false;
        }
        const shiftedCharIndex = this._gapEndIndex + 1;
        const shiftedChar : string = this._buffer[shiftedCharIndex];
        this._buffer[shiftedCharIndex] = ""
        this.buffer[this._gapStartIndex] = shiftedChar;

        this._gapStartIndex++;
        this._gapEndIndex++;
        return true;
    }

    public delete() : boolean {
        if (this._gapStartIndex <= 0) {
            return false;
        }
        this._buffer[this._gapStartIndex -1] = '';
        this._gapStartIndex--;
        return true;
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
        return this._gapStartIndex;
    }

    get gapSize() : number {
        return this._gapEndIndex - this._gapStartIndex + 1;
    }

    public toString() : string {
        return this._buffer.join("");
    }

    public charAt(index : number) : string {
        let offset = index >= this._gapStartIndex? this.gapSize : 0
        return this._buffer[index + offset];
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