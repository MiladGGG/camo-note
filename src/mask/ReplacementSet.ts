import TextUtils from "../TextUtils";

type rawMap =  Record<string, string[]>;
type WordMap = Map<Number, string[]>;

abstract class ReplacementSet {
    private _lengthMap : WordMap;

    constructor (wordSet : rawMap) {
        this._lengthMap = this.initialiseReplacementSet(wordSet);
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
        const stringLength = word.length
        const targetWords : string[] | undefined = this._lengthMap.get(stringLength);
        if (targetWords === undefined) {
            return "ERROR_PLACEHOLDER";
        }

        const randomValue = Math.floor(Math.random() * (targetWords.length -1));
        let randomReplacementArr = Array(targetWords[randomValue]);

        // Flip cases accordingly
        for (let i = 0; i < randomReplacementArr.length; i++) {
            if (word.charAt(i).toUpperCase() == word.charAt(i)) {
                randomReplacementArr[0] = randomReplacementArr[0].toUpperCase();
            }
        }

        return randomReplacementArr.join("");
    }

    private maskSymbol(word : string) : string {
        const stringLength = word.length;
        const replacementArr = new Array(stringLength).fill(" ");

        let currentSubString = '';
        for (let i = 0; i < stringLength + 1; i++) {
            let c : string = word.charAt(i) ;
            if (TextUtils.isLetter(c)) {
                currentSubString += c;
            } else {
                if(currentSubString.length == 0){
                    replacementArr[i] = c;
                    continue;
                }

                const replacementSubString = this.maskWord(currentSubString);
                const subLength = replacementSubString.length

                replacementArr.splice(i - subLength, subLength, ...replacementSubString);
                i--;
                currentSubString = '';
                continue;
            }
        }
        return replacementArr.join("");
    }

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