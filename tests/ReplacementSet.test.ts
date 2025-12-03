import { describe ,test,it , expect, beforeAll } from "vitest";
import NaturalReplacementSet from "../src/mask/NaturalReplacementSet";
import ReplacementSet from "../src/mask/ReplacementSet";


const replacementSet : ReplacementSet = new NaturalReplacementSet();

beforeAll(() => {

});


describe("intialiseReplacementSet", () => {
    const wordSet = replacementSet.lengthMap

    test("JSON file should be parsed as WordMap from constructor", () => {

        // Assert exists and is type of WordMap
        expect(wordSet).not.toBeNull();
        expect(wordSet).toBeInstanceOf(Map<Number, Set<String>>);
    })

    test("Each word array size should >= 2 from word JSON files", () => {
        for(const wordArr of wordSet.values()) {
            expect(wordArr.length).toBeGreaterThanOrEqual(2);
        }
    })
});


describe("generateMask", () => {
    test('Input words should be masked with words of same length', () => {
        const input = "I am so mad";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);

        // Assert same length array
        expect(replacement.length).toStrictEqual(split.length);
        for (const index in replacement) {
            const newWord = replacement[index];
            const oldWord = split[index]

            // Check new word is different
            expect(newWord).not.toBe(oldWord);

            // Check new word is same length
            expect(newWord.length).toStrictEqual(oldWord.length);
        }

    })
});