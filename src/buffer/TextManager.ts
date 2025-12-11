import GapBuffer from "./GapBuffer";
import ReplacementSet from "../mask/ReplacementSet";
import NaturalReplacementSet from "../mask/NaturalReplacementSet";

type word = {
        realWord : string,
        maskedWord : string,
        delimeter: string, // string of succeeding space(s), newline literal(s) etc
    };

class TextManager { // Potentially use generic
    private _realTextBuffer : GapBuffer;
    private _words : word[];
    
    private _cursor : number = 0;
    
    private _currentWordIndex : number = 0;
    private _currentWord : string = "";
    
    private _delimeterSet = new Set([' ', '\n']);
    
    
    private _maskedCache: Map<string, string>;
    private _replacementSet : ReplacementSet;

    constructor (initArraySize : number = 8) {
        this._realTextBuffer = new GapBuffer();
        this._maskedCache = new Map<string, string>();
        this._words = new Array(initArraySize);

        this._replacementSet = new NaturalReplacementSet();

        this.setAndRegisterWord(0, this.generateWord()); // Very first empty word used to store inital delimeters
    }



    private resizeWordArray(index : number) { // Grow array if size exhausted
        const oldLength = this._words.length;
        if (index >= oldLength) {
            const temp = new Array(oldLength * 2)
            for (let i = 0; i < oldLength; i++){
                temp[i] = this._words[i];
            }
            this._words = temp;
        }
    }


    private registerWord () { // Registers old word and initalises new pending word
        this._currentWordIndex++;
        this.resizeWordArray(this._currentWordIndex);
        this._words[this._currentWordIndex] = this.generateWord();
    }

    private setAndRegisterWord(index : number, word : word) {  // Registers word and prepares for new word
        this._words[index] = word;
        this.registerWord();
    }

    private generateWord(realWord : string = "", maskedWord : string = "", delimeter : string = "") : word {
        return {
                realWord: realWord,
                maskedWord : maskedWord,
                delimeter : delimeter,
            };
    }

    private retrieveMaskedWord(index : number = this._currentWordIndex) : string{ // Retrieves cached masked word for specific word index
        const realWord = this._words[index].realWord;
        let maskedWord : string;
        if(this._maskedCache.has(realWord)) {
            maskedWord = this._maskedCache.get(realWord)!;
        } else {
            maskedWord = this._replacementSet.generateMasked(Array(realWord)).join("");
            this._maskedCache.set(realWord, maskedWord);
        }   
        return maskedWord;
    }

    // TODO refactor this function
    // private processInsert(str : string){ // No current word, delimeters split words
    //     for (const c of str) {
    //         this._cursor++;

    //         if (!this._delimeterSet.has(c)) { // Not delimeters
    //             const w = this._words[this._currentWordIndex].realWord
    //             this._words[this._currentWordIndex].realWord = w.slice() + c + w.slice();
    //             this._words[this._currentWordIndex].maskedWord = this.retrieveMaskedWord();
    //         }

    //         if (this._delimeterSet.has(c)) {
    //             if (this._currentWord.length > 0) {
    //                 this._words[this._currentWordIndex].delimeter += c;
    //                 this.registerWord()
    //                 this._currentWord = ""
    //             }
    //             else if (this._currentWord.length == 0) { // Add delimeters to previous word
    //                 this._words[this._currentWordIndex - 1].delimeter += c;
    //             }
    //         } else {
  
    //         }

    //     }
    // }
    private processInsert(str : string){ // No current word, delimeters split words
        for (const c of str) {
            this._cursor++;
            if (this._delimeterSet.has(c)) {
                if (this._currentWord.length > 0) {
                    this._words[this._currentWordIndex].delimeter += c;
                    this.registerWord()
                    this._currentWord = ""
                }
                else if (this._currentWord.length == 0) { // Add delimeters to previous word
                    this._words[this._currentWordIndex - 1].delimeter += c;
                }
            } else {
                this._currentWord += c;
                this._words[this._currentWordIndex].realWord += c;
                this._words[this._currentWordIndex].maskedWord = this.retrieveMaskedWord();
            }

        }
    }

    public getRealText() : string {
        const totalWords = this.length
        const strArr = new Array(totalWords);

        let i = 0;
        for (const w of this._words) {
            if(w){
                strArr[i] = w.realWord + w.delimeter;
                i++;
            }
        }

        return strArr.join("");
    }

    public getMaskedText() : string { // Violating DRY
        const totalWords = this.length
        const strArr = new Array(totalWords);

        let i = 0;
        for (const w of this._words) {
            if(w){
                strArr[i] = w.maskedWord + w.delimeter;
                i++;
            }
        }

        return strArr.join("");
    }

    // Finds index of cursor relative to current word. Eg ABC 0123*45 returns 3
    public getCurrentWordIndex() : number {
        let offset = 0;

        let c = this.getCursorChar();

        while (!this._delimeterSet.has(c) || this._cursor - offset == 0) { // Go back until delimeter
            c = this.getCursorChar(this._cursor - offset);
            offset += 1;
        }

        return offset;
    }

    public getCursorChar(index : number  = this._cursor) : string {
        return this._realTextBuffer.charAt(index);
    }

    public getCursorWord() : word {
        return this._words[this._currentWordIndex];
    }

    get cursor() : number {
        return this._cursor;
    }
    get currentWordIndex() : number {
        return this._currentWordIndex;
    }

    get words() : word[] {
        return this._words;
    }
    
    get length() : number { // Returns length ignoring empty or null values 
    let count = 0;
    for (let i = 0; i < this._words.length; i++){
            if (this._words[i] && this.words[i].realWord !== ''){ 
                count++;

            } else if (this._words[i] && this.words[i].realWord == ''){ // Skip blanks
                continue;
            }
            else {
                break;
            }
        }
        return count;
    }

    // Shifts the value of _currentWordIndex given it was previously correct
    private processShift(mode : string) {
        const prevChar = this.getCursorChar();
        this._cursor = this._realTextBuffer.cursor - 1;
        const newChar = this.getCursorChar();

        if (this._delimeterSet.has(newChar) && !this._delimeterSet.has(prevChar)) { // Arrived at delimeter from non-delimeter, new word
            this._currentWordIndex -= mode == 'L' ? 1 : 0; // New word only if going left
        } else if (this._delimeterSet.has(prevChar) && !this._delimeterSet.has(newChar)) {
            this._currentWordIndex += mode == 'R' ? 1 : 0; // New word only if going left
        }
    }

    // Delegated real rext GapBuffer methods
    public insert(str : string) {
        this._realTextBuffer.insert(str);
        this.processInsert(str);
    }

    public left() {
        this._realTextBuffer.left();
        this.processShift('L');
    }

    public right() {
        this._realTextBuffer.right();
        this.processShift('R');
    }

    get realText() : string {
        return this._realTextBuffer.toString();
    }

    get realGapText() : string { // String contains '*' denoting gaps
        return this._realTextBuffer.toGapString();
    }

}

export default TextManager;