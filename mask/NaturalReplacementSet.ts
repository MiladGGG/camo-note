import ReplacementSet from './ReplacementSet.ts'
import words from './words/natural.json'

class NaturalReplacementSet extends ReplacementSet {
    constructor () {
        super(words);

    }
}

const a = new NaturalReplacementSet();