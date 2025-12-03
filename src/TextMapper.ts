import ReplacementSet from "./mask/ReplacementSet";

const MIN_SIZE = 128;

// Called by frontend client
class TextMapper { 

    private _realText : string[];
    private _maskedText : string[];

    // Calls a replacementSet set
    private _replacementSet : ReplacementSet;

    constructor (replacementSet :ReplacementSet) {
        this._realText = new Array(MIN_SIZE);
        this._maskedText = new Array(MIN_SIZE);
        this._replacementSet = replacementSet;
    }

}