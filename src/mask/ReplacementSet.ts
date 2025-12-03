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
        let randomReplacement = targetWords[randomValue];

        return randomReplacement;
    }


    public generateMasked(original : string[]) : string[] {
        const maskedArray = new Array(original.length);
        original.forEach((oldWord, index) => {
            maskedArray[index] = this.maskWord(oldWord);
        });

        return maskedArray;
    }


}

export default ReplacementSet; 