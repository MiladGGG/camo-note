import { describe ,test,it , expect } from "vitest";
import NaturalReplacementSet from "../src/mask/NaturalReplacementSet";
import ReplacementSet from "../src/mask/ReplacementSet";



describe("intialiseReplacementSet", () => {
    test('JSON file should be parsed as WordMap from constructor', () => {
        const wordSet = new NaturalReplacementSet().lengthMap;

        console.log(wordSet);

        expect(wordSet).not.toBeNull();
        expect(wordSet).toBeInstanceOf(Map<Number, Set<String>>);
    })
});
