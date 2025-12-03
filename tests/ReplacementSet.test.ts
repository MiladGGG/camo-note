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
    test('Input should be masked with words of same length', () => {
        const input = "I am so MAD";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);

        // Assert same length array
        expect(replacement.length).toStrictEqual(split.length);

        
        // Check new words are same length
        for (const index in replacement) {
            const newWord = replacement[index];
            const oldWord = split[index]

            expect(newWord.length).toStrictEqual(oldWord.length);
        }

        console.log(split);
        console.log(replacement);
    })

    test('Symbol Input should remain symbols, while text changes', () => {
        const input = "@@@?a";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);

        // Assert same length array
        expect(replacement.length).toStrictEqual(split.length);

        
        // Check new word starts with same symbols
        for (const index in replacement) {
            const newWord = replacement[index];

            expect(newWord.startsWith("@@@?")).toBeTruthy();
        }

        console.log(split);
        console.log(replacement);
    })
});