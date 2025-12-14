import { describe ,test,it , expect, beforeAll } from "vitest";
import NaturalReplacementSet from "../src/mask/NaturalReplacementSet";
import ReplacementSet from "../src/mask/ReplacementSet";
import TextUtils from "../src/TextUtils";


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
        for (let i = 1; i <= ReplacementSet.MAXWORDLENGTH; i++) {
            const input = 'A'.repeat(i);
            const split : string[] = input.split(" ");

            const replacement : string[] = replacementSet.generateMasked(split);
            const replacementString : string = replacement[0]; 
            expect(replacementString.length).toStrictEqual(i);
        }        
    })

    test('Words greater than max length should be masked 1', () => {
        const input = "QwertyuioAbcd";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        const replacementString : string = replacement[0]

        // Word wraps?
        const pattern = /^[A-Z][a-z]{8}[A-Z][a-z]{3}/
        expect(pattern.test(replacementString)).toBeTruthy();

        expect(replacementString.length).toStrictEqual(input.length);
    })

    test('Words greater than max length should be masked 2', () => {
        const input = "Supercalifragilisticexpialidocious";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        const replacementString : string = replacement[0]


        const pattern = /^[A-Z][a-z]+/
        expect(pattern.test(replacementString)).toBeTruthy();

        expect(replacementString.length).toStrictEqual(input.length);
    })

    test('Symbol Input should remain symbols, while text changes', () => {
        const input = "@@@?Abc!&";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        const replacementString = replacement[0];

        // Assert same length array
        expect(replacement.length).toStrictEqual(split.length);

        // Use regex to assert same structure string
        const pattern = /^@@@\?[A-Z][a-z]{2}!&$/
        expect(pattern.test(replacementString)).toBeTruthy();
    })

    test('Raw number input should be masked', () => {
        const input = "1 123 9999";
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        
        // Assert new numbers are different and only contain numbers
        for (const index in replacement) {
            const oldNum : string = split[index];
            const newNum : string = replacement[index];

            expect(newNum.length).toStrictEqual(oldNum.length);
            expect(newNum).not.toStrictEqual(oldNum);
            expect(TextUtils.isNumber(newNum)).toBeTruthy();
        }
    })

    test('Mixed numbers in input should be masked', () => {
        const input = "123ABC"
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        const replacementString = replacement[0];
        const replacementNumber = replacementString.substring(0,3);

        expect(replacementString.startsWith("123")).toBeFalsy();
        expect(TextUtils.isNumber(replacementNumber)).toBeTruthy();

        // Use regex to assert same structure string
        const pattern = /^\d{3}[A-Z]{3}$/
        expect(pattern.test(replacementString)).toBeTruthy();
    })

    test('Mixed numbers in input should be masked 2', () => {
        const input = "ABC123"
        const split : string[] = input.split(" ");

        const replacement : string[] = replacementSet.generateMasked(split);
        const replacementString = replacement[0];

        // Use regex to assert same structure string
        const pattern = /^[A-Z]{3}\d{3}$/
        expect(pattern.test(replacementString)).toBeTruthy();
    })
});