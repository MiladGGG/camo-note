import GapBuffer from "./GapBuffer";
import ReplacementSet from "../mask/ReplacementSet";
import NaturalReplacementSet from "../mask/NaturalReplacementSet";

type word = {
        realWord : string,
        maskedWord : string,
        index : number
    };

class TextManager { // Potentially use generic
    private _realTextBuffer : GapBuffer;
    private _maskedCache: Map<string, string>;
    private _words : word[];

    private _cursor : number = 0;
    private _currentWordIndex : number = 0;


    private _replacementSet : ReplacementSet;

    constructor () {
        this._realTextBuffer = new GapBuffer();
        this._maskedCache = new Map<string, string>();
        this._words = new Array();

        this._replacementSet = new NaturalReplacementSet();
    }

    private updateState() {
        this._cursor = this._realTextBuffer.cursor;
    }

    public insert(str : string) {
        this._realTextBuffer.insert(str);
    }

    public left() {
        this._realTextBuffer.left();
    }

    public right() {
        this._realTextBuffer.right();
    }

    get realText() : string {
        return this._realTextBuffer.toString();
    }

    get realGapText() : string { // String contains '*' denoting gaps
        return this._realTextBuffer.toGapString();
    }

    public getCursorWord() : word {
        throw new Error();
    }

    get words() {
        return this._words;
    }
}

export default TextManager;