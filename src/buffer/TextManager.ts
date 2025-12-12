import GapBuffer from "./GapBuffer";
import ReplacementSet from "../mask/ReplacementSet";
import NaturalReplacementSet from "../mask/NaturalReplacementSet";

type text = {
        realWord : string,
        maskedWord : string,
        realLength : number,
    };

type delimeter = {
        realWord : string,
        realLength : number,
};

type word = text | delimeter;

class TextManager { // Potentially use generic
    private _realTextBuffer : GapBuffer;
    private _words : word[];
    
    private _cursor : number = 0;

    
    private _currentWordIndex : number = 0; // Index for words[]
    private _innerWordIndex : number = 0; //Index for word inside words[], replaces cursor
    
    private _delimeterSet = new Set([' ', '\n']);
    
    
    private _maskedCache: Map<string, string>;
    private _replacementSet : ReplacementSet;

    constructor (initArraySize : number = 8) {
        this._realTextBuffer = new GapBuffer();
        this._maskedCache = new Map<string, string>();
        this._words = new Array(initArraySize);

        this._replacementSet = new NaturalReplacementSet();
        this.createNewWord('');
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


    private replaceWord (targetIndex : number, replacementWords : word[]) {
        const validWordsAmount = this.length;
        const shiftAmount = replacementWords.length;
        this.resizeWordArray(validWordsAmount + shiftAmount);

        for (let i = 0; i < validWordsAmount; i++) { // In place shift
            if (i == targetIndex){
                continue;
            }
            const offset = i >= targetIndex ? shiftAmount - 1 : 0;
            this._words[i + offset] = this.words[i];
        }

        for (let i = 0; i < shiftAmount; i++) {
            this._words[targetIndex + i] = replacementWords[i];
            
        }
    }

    private generateWord(realWord : string) : word {
        if (this.isDelimeter(realWord[0])) {
            return {               
                realWord: realWord,
                realLength : realWord.length,
            }
        }
        return {
                realWord: realWord,
                maskedWord : this.retrieveMaskedWord(realWord),
                realLength : realWord.length,
            };
    }

    private retrieveMaskedWord(str : string) : string { // Retrieves cached masked word for specific word index
        const realWord = str;
        let maskedWord : string;
        if(this._maskedCache.has(realWord)) {
            maskedWord = this._maskedCache.get(realWord)!;
        } else {
            maskedWord = this._replacementSet.generateMasked(Array(realWord)).join("");
            this._maskedCache.set(realWord, maskedWord);
        }   
        return maskedWord;
    }

    private isDelimeter(c : string) : boolean {
        c = c? c[0] : c; // Extract first char (if exists)
        if (this._delimeterSet.has(c)) {
            return true;
        }
        return false;
    } 

    private differingCharacters(c : string) : boolean {  // Inserted char is different type to last char
        if (this._cursor - 1 < 0) {
            return true;
        }
        if (this.isDelimeter(c) !== this.isDelimeter(this.getCursorChar(this._cursor - 1))) { 
            return true;
        }

        return false;
    }

    private updateWord(c : string) {
        const targetWord  = this._words[this._currentWordIndex];
        const w = targetWord.realWord
        this._words[this._currentWordIndex] = this.generateWord(w.slice(0, this.getInnerWordIndex()) + c + w.slice(this.getInnerWordIndex(), targetWord.realLength));
        this._innerWordIndex++;
        this._words[this._currentWordIndex].realLength += 1;
    }

    private splitWord(c : string) {
        const prevWord = this._words[this._currentWordIndex].realWord;

        let leftString = prevWord.slice(0, this.getInnerWordIndex());
        let middleString = c;
        let rightString = prevWord.slice(this.getInnerWordIndex());
        
        // Merge same type words
        if (this.isDelimeter(leftString) == this.isDelimeter(middleString)) {
            let temp = leftString + middleString;
            middleString = temp;
            leftString = ''
        }
        if (this.isDelimeter(middleString) == this.isDelimeter(rightString)) {
            middleString +=  rightString;
            rightString = ''
        }


        const leftWord = this.generateWord(leftString);
        const middleWord = this.generateWord(middleString);
        const rightWord = this.generateWord(rightString);

        let replacementWords = [leftWord, middleWord, rightWord].filter((word) => word.realWord != '')
        this.replaceWord(this._currentWordIndex, replacementWords);
    }

    // Should only work when no words exist
    private createNewWord(c : string) {
        this.resizeWordArray(0);
        this._words[0] = this.generateWord(c);
    }

    private processInsert(str : string){ // No current word, delimeters split words
        for (const c of str) {
            this.splitWord(c);

            this._cursor++;
        }
    }

    public getRealText() : string {
        const totalWords = this.length
        const strArr = new Array(totalWords);
        let i = 0;
        for (const w of this._words) {
            if(w){
                strArr[i] = w.realWord;
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
                if ("maskedWord" in w) {
                    strArr[i] = w.maskedWord;
                } else {
                    strArr[i] = w.realWord;
                }
                i++;
            }
        }

        return strArr.join("");
    }

    public printDebugState() {
        console.log(this._words);
        // console.log(`Current word: ${this.getCursorWord().realWord}`);
        console.log(`Current word index: ${this._currentWordIndex}`);
        console.log(`Current inner word index: ${this.getInnerWordIndex()}`);
        console.log(`Current cursor char: '${this.getCursorChar()}'`);
        console.log(`Current cursor: ${this._cursor}`);
        console.log(`Real text: \n${this.realGapText}`);
    }

    // Finds index of cursor relative to current word. Eg ABC 0123*45 returns 3
    public getInnerWordIndex() : number {
        let leftShift = 0;
        const initialChar = this.getCursorChar();
        const prevType : boolean = this.isDelimeter(initialChar);

        while (this.isDelimeter(this.getCursorChar(this._cursor - leftShift)) == prevType && this._cursor - leftShift > 0) {
            leftShift++;
        }
        return leftShift;
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
        this._cursor = this._realTextBuffer.cursor;
        const newChar = this.getCursorChar();

        if (this.isDelimeter(prevChar) !== this.isDelimeter(newChar)) {
            if (mode === 'L') {
                this._currentWordIndex -= 1; // New word only if going left
                this._innerWordIndex = this.getCursorWord().realLength;
                return;
            }
            if (mode === 'R') {
                this._currentWordIndex += 1; // New word only if going right
                this._innerWordIndex = 0;
                return;
            }
        }
        // No new word, just update index
        this._innerWordIndex += mode == 'R' ? 1 : -1;
    }

    // Delegated real rext GapBuffer methods
    public insert(str : string) {
        this._realTextBuffer.insert(str);
        this.processInsert(str);
    }

    public left() {
        if(this._realTextBuffer.left()){
            this.processShift('L');
        }
    }

    public right() {
        if(this._realTextBuffer.right()){
            this.processShift('R');
        }
    }

    get realText() : string {
        return this._realTextBuffer.toString();
    }

    get realGapText() : string { // String contains '*' denoting gaps
        return this._realTextBuffer.toGapString();
    }

}

export default TextManager;