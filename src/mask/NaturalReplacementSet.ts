import ReplacementSet from './ReplacementSet.ts'
import words from './words/natural.json'

class NaturalReplacementSet extends ReplacementSet {
    constructor () {
        super(words);
    }
}

new NaturalReplacementSet();

export default NaturalReplacementSet;