import { describe ,test,it , expect, beforeEach } from "vitest";
import TextManager from "../src/buffer/TextManager";
import { text } from "stream/consumers";


let textManager : TextManager;

describe("Insertion test suite", () => {
    beforeEach(() => {
        textManager = new TextManager();
    });

    test("Single Character is registered", () => {
        textManager.insert("A");
        expect(textManager.length).toStrictEqual(1);
    });

    test("Multiple characters forms one word", () => {
        textManager.insert("A");
        textManager.insert("pple");

        expect(textManager.length).toStrictEqual(1);
        expect(textManager.words[0].realWord).toStrictEqual("Apple");
    });
    
    test("Text and delimeter is stored", () => {
        textManager.insert("One Two Three Four");
        
        textManager.left();
    });

        
    test("Cursor index is accurate", () => {
        textManager.insert("123456789 123456789");
        
        textManager.left();
        textManager.left();
        textManager.left();
        textManager.left();
        textManager.left();
        expect(textManager.getInnerWordIndex()).toStrictEqual(4);
    });
    
    
    test("Mixed delimeters and text are stored", () => {
        textManager.insert("\nHello Dear\nWorld");
        expect(textManager.length).toStrictEqual(6);
    });
});









describe("TextManager test suite", () => {
    beforeEach(() => {
        textManager = new TextManager();
    });

    test("All text and delimeters should be stored", () => {
        textManager.insert("Hello Dear World!");
        expect(textManager.length).toStrictEqual(5);
    });
        
    test("Real text is masked and stored", () => { // Flaky test, has chance to map to same word and fail
        const inputArr = ["3","Little","Piggies"]
        textManager.insert(inputArr.join(" "));
        const realText = textManager.getRealText().split(" ");
        const maskedText = textManager.getMaskedText().split(" ");
        for (let i = 0; i < inputArr.length; i++) {
            const s = inputArr[i];
            expect(realText[i]).toStrictEqual(s);
            expect(maskedText[i]).not.toStrictEqual(s);
            expect(maskedText[i]).toBeTruthy();
        }
    });


    test("Same real word maps to same masked word", () => {
        let input = "Apple";
        textManager.insert(input);

        const expectedMaskedWord = textManager.getCursorMaskedText();

        input = " Apple";
        textManager.insert(input);

    
        expect(expectedMaskedWord).toBe(textManager.getCursorMaskedText());

        for (let i = 0; i < 15; i++)
        textManager.left();

        textManager.insert("Apple ");
        for (let i = 0; i < 15; i++)
        textManager.left();
        expect(expectedMaskedWord).toBe(textManager.getCursorMaskedText());
    });

    test("Extra input spaces are stored", () => {
        const input = "one two  three   .";
        textManager.insert(input);
        
        const realString = textManager.getRealText();
        expect(realString).toStrictEqual(input);

        const maskedString = textManager.getMaskedText();

        const stringStructure = /^[a-z]{3} [a-z]{3} {2}[a-z]{5} {3}\.$/;
        expect(stringStructure.test(maskedString)).toBeTruthy(); 
    });

    test("Starting delimiters are stored", () => {
        const input = "\n Newline Space";
        textManager.insert(input);
        
        const realString = textManager.getRealText();
        expect(realString).toStrictEqual(input);

        const maskedString = textManager.getMaskedText();
        const stringStructure = /^\n [A-Z][a-z]{6} [A-Z][a-z]{4}$/;
        expect(stringStructure.test(maskedString)).toBeTruthy(); 
    });
});






describe("TextManager Cursor test suite", () => {
    beforeEach(() => {
        textManager = new TextManager();
    });
    
    test("Word can be retrieved by cursor position", () => {
        for (let i = 0; i < 4; i++) {
            textManager.left();
        }
        expect(textManager.getCursorWord().realWord).toBe('');


        const input = "I have $20 now";
        textManager.insert(input);
        for (let i = 0; i < 4; i++) {
            textManager.left();
        }
        const cursorWord = textManager.getCursorWord();

        expect(cursorWord.realWord).toStrictEqual("$20");

        const stringStructure = /^\$\d{2}$/;
        expect(textManager.getCursorMaskedText()).not.toStrictEqual("$20"); // Stored mask must be different
        expect(stringStructure.test(textManager.getCursorMaskedText()!)).toBeTruthy(); 
    });

    
    test("Inner word index is accurate for one word", () => {
        const input = "1234";
        textManager.insert(input);

        expect(textManager.getInnerWordIndex()).toStrictEqual(4);

        for (let i = 0; i < 2; i++) {
            textManager.left();
        }
        expect(textManager.getInnerWordIndex()).toStrictEqual(2);

        for (let i = 0; i < 10; i++) {
            textManager.left();
        }

        expect(textManager.getInnerWordIndex()).toStrictEqual(0);

        for (let i = 0; i < 10; i++) {
            textManager.right();
        }

        expect(textManager.getInnerWordIndex()).toStrictEqual(4);
    });


    test("Words should be shifted to correct order", () => {
        let input = " Third";
        textManager.insert(input);
        
        for (let i = 0; i < 15; i++) {
            textManager.left();
            
        }
        textManager.printDebugState()

        input = " Second";
        textManager.insert(input);
        for (let i = 0; i < 15; i++) {
            textManager.left();
        }
        textManager.printDebugState()

        input = "First";
        textManager.insert(input);
        textManager.printDebugState()
    
        expect(textManager.getRealText()).toBe("First Second Third");
    });


    test("Word index can be found", () => {
        const input = "ABC 123456";
        textManager.insert(input);

        let index = textManager.getInnerWordIndex();
        expect(index).toStrictEqual(6);
        for (let i = 0; i < 2; i++) {
            textManager.left();
        }

        index = textManager.getInnerWordIndex();
        expect(index).toStrictEqual(4);
        
        for (let i = 0; i < 5; i++) {
            textManager.left();
        }
        index = textManager.getInnerWordIndex();
        expect(index).toStrictEqual(3);

    });



    test("Editing word updates word type", () => {
        let input = "Dins rock";
        textManager.insert(input);
        for (let i = 0; i < 6; i++) {
            textManager.left();
        }
        textManager.insert("osaur");

        
        const cursorWord = textManager.getCursorWord();

        expect(textManager.currentWordIndex).toStrictEqual(0);

        expect(cursorWord.realWord).toStrictEqual("Dinosaurs");

        const stringStructure = /^[A-Z][a-z]{8}$/
        expect(stringStructure.test(textManager.getCursorMaskedText()!)).toBeTruthy(); 
    });
    
});