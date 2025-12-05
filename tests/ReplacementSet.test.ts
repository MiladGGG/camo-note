import { describe ,test,it , expect, beforeAll } from "vitest";
import NaturalReplacementSet from "../src/mask/NaturalReplacementSet";
import ReplacementSet from "../src/mask/ReplacementSet";
import TextUtils from "../src/TextUtils";
import { i } from "@vitest/runner/dist/tasks.d-Xu8VaPgy.js";


const replacementSet : ReplacementSet = new NaturalReplacementSet();


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
    test('Word input should be masked with words of same length', () => {
        const input = "I am so MAD";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);

        // Assert same length array
        expect(replacement.length).toStrictEqual(split.length);

        
        // Assert new words are same length
        for (const index in replacement) {
            const newWord = replacement[index];
            const oldWord = split[index]

            expect(newWord.length).toStrictEqual(oldWord.length);
        }

        console.log(split);
        console.log(replacement);
    })

    test('Symbol Input should remain symbols, while text changes', () => {
        const input = "@@@?Abc!&";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);

        // Assert same length array
        expect(replacement.length).toStrictEqual(split.length);

        
        // Assert new word starts and ends with same symbols
        for (const index in replacement) {
            const newWord = replacement[index];

            expect(newWord.startsWith("@@@?")).toBeTruthy();
            expect(newWord.endsWith("!&")).toBeTruthy();
        }


        console.log(split);
        console.log(replacement);
    })

    test('Raw number input should be masked', () => {
        const input = "1 123 9999";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        
        // Assert new numbers are different and only contain numbers
        for (const index in replacement) {
            const oldNum = split[index];
            const newNum = replacement[index];

            expect(newNum).not.toStrictEqual(oldNum);
            expect(TextUtils.isNumber(newNum)).toBeTruthy();
        }

        console.log(split);
        console.log(replacement);
    })

    test('Mixed numbers in input should be masked', () => {
        const input = "123ABC"
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        const replacementString = replacement[0];
        const replacementNumber = replacementString.substring(0,3);

        expect(replacementString.includes(" ")).toBeFalsy(); // No padded spaces should be present
        expect(replacementString.startsWith("123")).toBeFalsy();
        expect(TextUtils.isNumber(replacementNumber)).toBeTruthy();
    

        console.log(split);
        console.log(replacement);
    })
});