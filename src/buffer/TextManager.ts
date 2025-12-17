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

// For the love of god refactor me 🙏
class TextManager { // Potentially use generic
    public _realTextBuffer : GapBuffer;
    private _words : word[];
    
    private _cursor : number = 0;
    
    private _currentWordIndex : number = 0; // Index for words[]
    
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

    private deleteWord(targetIndex : number) { // Deletes and shifts
        this._words.splice(targetIndex, 1);
    }
    
    private mergeWord() : boolean { // Merges eg, ['First*']['Second'] -> ['First*Second'][]
        const currentWord = this._words[this._currentWordIndex].realWord;
        const nextWord = this._words[this._currentWordIndex + 1]? this._words[this._currentWordIndex + 1].realWord : null;
        if (nextWord && this.isDelimeter(currentWord[0]) === this.isDelimeter(nextWord[0])) { // Next word exists and is of same type
            const replacementWord = this.generateWord(this._words[this._currentWordIndex].realWord += nextWord);
            this._words[this._currentWordIndex] = replacementWord;
            this.deleteWord(this._currentWordIndex + 1);
            return true; 
        }

        return false;
    }
    
    private replaceWord (targetIndex : number, replacementWords : word[]) {
        const validWordsAmount = this.length;
        const shiftAmount = replacementWords.length;
        this.resizeWordArray(validWordsAmount + shiftAmount);


        
        for (let i = validWordsAmount -1; i >= 0; i--) { // In place shift
            if (i == targetIndex){
                continue;
            }
            
            const offset = i >= targetIndex ? shiftAmount - 1 : 0;
            this._words[i + offset] = this.words[i];
        }

        for (let i = 0; i < shiftAmount; i++) {
            this._words[targetIndex + i] = replacementWords[i];    
        }

        if (shiftAmount == 1) {

        } else if (shiftAmount >= 2 && this._cursor != 0) { // First char is an edge case
            this._currentWordIndex++;
        }
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
        this.mergeWord();
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

    public getMaskedText() : string {
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
        console.log(`Current word index: ${this._currentWordIndex}`);
        console.log(`Current inner word index: ${this.getInnerWordIndex()}`);
        console.log(`Current cursor char: '${this.getCurrentCursorChar()}'`);
        console.log(`Current cursor: ${this._cursor}`);
        console.log(`Real text: \n${this.realGapText}`);
    }

    // Finds index of cursor relative to current word. Eg ABC 0123*45 returns 3
    public getInnerWordIndex() : number {
        if(this.length == 0) {
            return 0;
        }
        let count = 0;

        for (const w of this._words){
            if (!w) {
                continue;
            }
            count += w.realLength;

            if (count >= this._cursor) {
                //return (count - this._cursor)
                return w.realLength - (count - this._cursor)
            }
        }
    
        throw new Error("Could not find current index from cursor");
    }


    public getPreviousCursorChar(mode : string) {
        const char = this._realTextBuffer.buffer[this._realTextBuffer.cursor - 1 + (mode == 'R'? -1: 1)];
        return char != undefined? char : ''; 
    }

    public getCurrentCursorChar() {
        const char = this._realTextBuffer.charAt(this._cursor - 1);
        return char != undefined? char : ''; 
    }


    public getCursorChar(index : number  = this._cursor) : string {
        // return this.getCursorWord().realWord[this.getInnerWordIndex()];
        const char = this._realTextBuffer.buffer[this._realTextBuffer.cursor - 1 + index];
        return char != undefined? char : ''; 
    }

    public getCursorWord() : word {
        return this._words[this._currentWordIndex];
    }

    public getCursorMaskedText() : string | null {
        const targetWord = this._words[this._currentWordIndex];
        if ("maskedWord" in targetWord) {
            return targetWord.maskedWord;
        }
        return null;
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
        const prevChar = this.getCurrentCursorChar();
        this._cursor = this._realTextBuffer.cursor;
        const newChar = this.getCurrentCursorChar();


        if (this.isDelimeter(prevChar) !== this.isDelimeter(newChar)) {
            if (mode === 'L' && this._cursor != 0) {
                this._currentWordIndex -= 1; // New word only if going left
            }
            if (mode === 'R' && this._cursor != 1) {
                this._currentWordIndex += 1; // New word only if going right
            }
            return;
        }
    }




    private processDelete() {
        const targetWord = this._words[this._currentWordIndex];
        
        if (this.getInnerWordIndex() == 1 && targetWord.realLength == 1){ // Delete last char of word
            this.deleteWord(this._currentWordIndex);
            if (this.currentWordIndex != 0) {
                this._currentWordIndex--;
            }
            if (this.length == 0) {
                this.createNewWord('');
            }   
            this._cursor = this._realTextBuffer.cursor;
            this.mergeWord();
        } else if (this.getInnerWordIndex() == 1 && targetWord.realLength > 1) { //Edge case eg, "A*AAA"
            const oldString = targetWord.realWord;
            let newString = oldString.slice(1);

            const newWord = this.generateWord(newString);
            this._words[this._currentWordIndex] = newWord;

            this._cursor = this._realTextBuffer.cursor;
            if (this.currentWordIndex != 0) {
                this._currentWordIndex--;
            }
        }
        else { // Delete char of word
            const oldString = targetWord.realWord;

            this._cursor = this._realTextBuffer.cursor;
            let newString = oldString.slice(0, this.getInnerWordIndex()) + oldString.slice(this.getInnerWordIndex() + 1);
            
            const newWord = this.generateWord(newString);
            this._words[this._currentWordIndex] = newWord;
        }     
    }




    public setCursor(index : number) {
        const offset = index - this._cursor;

        for (let i = 0; i < Math.abs(offset); i++) {
            if(offset < 0) {
                this.left();
            } else if (offset > 0) {
                this.right()
            }
        }
    }


    public deleteRange(start: number, end : number) {
        if (end < start) {
            throw new Error("Cannot range delete when end index is greater than star index");
        }
        const deleteAmount = end - start;
        this.setCursor(end);
        for (let i = 0; i < deleteAmount; i++) {
            this.delete();
        }
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

    public delete() {
        if(this._realTextBuffer.delete()){
            this.processDelete();
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