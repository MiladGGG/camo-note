import TextUtils from "../TextUtils";

type rawMap =  Record<string, string[]>;
type WordMap = Map<Number, string[]>;

abstract class ReplacementSet {
    private _lengthMap : WordMap;
    
    private _wordCache : Map<string,string>;

    public static MAXWORDLENGTH = 9;

    constructor (wordSet : rawMap) {
        this._lengthMap = this.initialiseReplacementSet(wordSet);

        this._wordCache = new Map<string,string>();
    }

    private initialiseReplacementSet(words : rawMap) : WordMap {
        const newMap : WordMap = new Map();
        let rawWordSet = Object.entries(words); 
        rawWordSet.forEach(([key, value]) => {
            newMap.set(Number(key), value)
        });

        return newMap
    }

    get lengthMap() {
        return this._lengthMap;
    }



    private maskWord(word : string) : string {
        if(word == '') {
            return '';
        }
        const cache = this._wordCache.get(word);
        if (cache != undefined) {
            return cache;
        }

        const stringLength = word.length
        const chooseLength = stringLength <= ReplacementSet.MAXWORDLENGTH ? word.length : ReplacementSet.MAXWORDLENGTH
        const chooseWord = word.slice(0, chooseLength);
        const leftOver = word.slice(chooseLength);
        const targetWords : string[] | undefined = this._lengthMap.get(chooseLength);
        if (targetWords === undefined) {
            throw new Error(`There is no mapping for words of length ${stringLength}`);
        }


        let randomValue;
        let randomReplacementString : string;

        do { // Ensure new word is different
            randomValue = Math.floor(Math.random() * (targetWords.length));
            randomReplacementString = targetWords[randomValue];
        } while (randomReplacementString.toLowerCase() == word.toLowerCase())



        const replacementArray : string[] = new Array(stringLength);

        // Flip cases accordingly
        for (let i = 0; i < stringLength; i++) {
            const c = chooseWord.charAt(i);
            if (c.toUpperCase() == c) {
                replacementArray[i] = randomReplacementString.charAt(i).toUpperCase();
            } else {
                replacementArray[i] = randomReplacementString.charAt(i).toLowerCase();
            }
        }

        const finalMasked = replacementArray.join("") + this.maskWord(leftOver); 
        this._wordCache.set(word, finalMasked);
        return finalMasked;
    }

    private maskNumber(n : string) : string {
        let randomValue = Math.floor(Math.random() * 9);
        if (randomValue >= Number(n)){
            randomValue++;
        }
        return String(randomValue);
    }

    private maskSymbol(word : string) : string {
        const stringLength = word.length;
        const replacementArr = new Array(stringLength).fill(" ");
        let currentSubString = '';
        for (let i = 0; i < stringLength + 1; i++) {
            let c : string = word.charAt(i);

            if (TextUtils.isLetter(c)) {    // Queue Letter
                currentSubString += c;
                continue;
            } else if (TextUtils.isNumber(c)) {     // Mask Number
                replacementArr[i] = this.maskNumber(c);
            }
            else {      // Symbol reached
                replacementArr[i] = c;
            }

            if(currentSubString.length == 0) { // Process letters
                continue;
            }
            const replacementSubString = this.maskWord(currentSubString);
            const subLength = replacementSubString.length
            replacementArr.splice(i - subLength, subLength, ...replacementSubString);
            currentSubString = '';
        }

        return replacementArr.join("");
    }

    // Chooses and runs proper masking method
    private runMaskMethod(input : string) : string {
        let letterCount = 0;
        let numberCount = 0;
        let symbolCount = 0;

        for (let i = 0; i < input.length; i++) {
            let c : string = input.charAt(i);

            if (TextUtils.isLetter(c)){
                letterCount++;
            } else if (TextUtils.isNumber(c)){
                numberCount++;
            } else {
                symbolCount++;
            }
        }

        if (letterCount >= 1 && numberCount == 0 && symbolCount == 0){   // Raw Word 
            return this.maskWord(input);
        } else {
            return this.maskSymbol(input);
        }
    }

    public generateMasked(original : string[]) : string[] {
        const maskedArray = new Array(original.length);
        original.forEach((oldWord, index) => {
            maskedArray[index] = this.runMaskMethod(oldWord);
        });

        return maskedArray;
    }
}

export default ReplacementSet; 