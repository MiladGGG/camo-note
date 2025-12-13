import ReplacementSet from './ReplacementSet'
import words from './words/natural.json'

class NaturalReplacementSet extends ReplacementSet {
    constructor () {
        super(words);
    }
}

new NaturalReplacementSet();

export default NaturalReplacementSet;