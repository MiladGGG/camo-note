type rawMap =  Record<string, string[]>;
type WordMap = Map<Number, Set<String>>;

abstract class ReplacementSet {
    private lengthMap : WordMap;

    constructor (wordSet : rawMap) {
        this.lengthMap = this.initialiseReplacementSet(wordSet);
        console.log(this.lengthMap);
    }

    private initialiseReplacementSet(words : rawMap) : Map<Number,Set<String>> {
        const newMap : WordMap = new Map();
        let rawWordSet = Object.entries(words); 
        rawWordSet.forEach(([key, value]) => { //json to arra
            newMap.set(Number(key), new Set(value))
        });

        return newMap
    }

    //abstract handleNumber(length : number) : string;


}

export default ReplacementSet; 