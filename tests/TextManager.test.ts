import { describe ,test,it , expect, beforeEach } from "vitest";
import TextManager from "../src/buffer/TextManager";


let textManager : TextManager;



describe("TextManager test suite", () => {
    beforeEach(() => {
        textManager = new TextManager();
    });

    test("Real and masked text should be same length", () => {
        textManager.insert("Hello Dear World!");

        expect(textManager.words.length).toStrictEqual(3);
    });
        
    test("Real text is masked and stored", () => {
        const inputArr = ["3","Little","Piggies"]
        textManager.insert(inputArr.join(" "));

        for (let i = 0; i < inputArr.length; i++) {
            const s = inputArr[i];
            expect(textManager.words[i].realWord).toStrictEqual(s);
            expect(textManager.words[i].maskedWord).not.toStrictEqual(s);
            expect(textManager.words[i].maskedWord).toBeTruthy();
        }
    });

    test("Appending to word updates word type", () => {
        const input = "Dinos rock";
        textManager.insert(input);
        for (let i = 0; i < 5; i++) {
            textManager.left();
        }
        textManager.insert("aurs");

        
        const cursorWord = textManager.getCursorWord();

        expect(cursorWord.index).toStrictEqual(0);

        expect(cursorWord.realWord).toStrictEqual("Dinosaurs");

        const stringStructure = /^[A-Z][a-z]{8}$/
        expect(stringStructure.test(cursorWord.maskedWord)).toBeTruthy(); 
    });

    test("Extra input spaces are stored", () => {
        const input = "one two  three   .";
        textManager.insert(input);
        
        const realString = textManager.getRealText();
        expect(realString).toStrictEqual(input);

        const maskedString = textManager.getMaskedText();
        const stringStructure = /^[a-z]{3} [a-z]{3}  {a-z}{5}   .$/;
        expect(stringStructure.test(maskedString)).toBeTruthy(); 
    });

    test("Word can be retrieved by cursor position", () => {
        const input = "I have $20 now";
        textManager.insert(input);
        for (let i = 0; i < 4; i++) {
            textManager.left();
        }
        
        const cursorWord = textManager.getCursorWord();
        expect(cursorWord.realWord).toStrictEqual("$20");

        const stringStructure = /^\$\d{2}$/;
        expect(cursorWord.maskedWord).not.toStrictEqual("$20"); // Stored mask must be different
        expect(stringStructure.test(cursorWord.maskedWord)).toBeTruthy(); 
    });

});