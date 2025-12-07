import { describe ,test,it , expect, beforeEach } from "vitest";
import GapBuffer from "../src/buffer/GapBuffer";



const INITGAPSIZE = 10;
const GAPGROWSIZE = 5;

let gapBuffer : GapBuffer;



describe("GapBuffer test suite", () => {
    beforeEach(() => {
        gapBuffer =  new GapBuffer(INITGAPSIZE, GAPGROWSIZE);
    });

    test("GapBuffer should be created with existing gap", () => {
        // Assert exists and is type of string array
        const buffer = gapBuffer.buffer;
        expect(buffer).not.toBeNull();
        expect(buffer).toBeInstanceOf(Array<string>);

        expect(buffer.length).toStrictEqual(INITGAPSIZE);

        console.log(buffer)
    })


    test("Insert should use up buffer", () => {
        gapBuffer.insert("Four");

        const buffer = gapBuffer.buffer;

        // Assert buffer remains init size 
        expect(buffer.length).toStrictEqual(INITGAPSIZE);

        console.log(buffer)
    })


    test("Gap should shift left inside buffer", () => {
        gapBuffer.insert("ABC");
        gapBuffer.left();
        const buffer = gapBuffer.buffer;

        const emptySpaces = `"",`.repeat(Math.max(INITGAPSIZE - 3, 0));
        const charArr = `["A","B",${emptySpaces}"C"]`;
        const bufferString = JSON.stringify(buffer)

        expect(bufferString).toStrictEqual(charArr);

        console.log(buffer)
    })

    test("Gap should shift bi-directionally inside buffer", () => {
        gapBuffer.insert("ABC");
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.right();
        const buffer = gapBuffer.buffer;

        const emptySpaces = `"",`.repeat(Math.max(INITGAPSIZE - 3, 0));
        const charArr = `["A",${emptySpaces}"B","C"]`;
        const bufferString = JSON.stringify(buffer)

        expect(bufferString).toStrictEqual(charArr);

        console.log(buffer)
    })

    test("Gap should remain within left boundary", () => {
        gapBuffer.insert("ABC");
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.left(); // No room to go left
        const buffer = gapBuffer.buffer;

        const emptySpaces = `"",`.repeat(Math.max(INITGAPSIZE - 3, 0));
        const charArr = `[${emptySpaces}"A","B","C"]`;
        const bufferString = JSON.stringify(buffer)

        expect(bufferString).toStrictEqual(charArr);

        console.log(buffer)
    })

    test("Gap should remain within right boundary", () => {
        gapBuffer.insert("ABC");
        gapBuffer.right();
        gapBuffer.right();
        gapBuffer.right();
        gapBuffer.right(); // No room to go right
        const buffer = gapBuffer.buffer;

        const emptySpaces = `"",`.repeat(Math.max(INITGAPSIZE - 3 - 1, 0));
        const charArr = `["A","B","C",${emptySpaces}""]`;
        const bufferString = JSON.stringify(buffer)

        expect(bufferString).toStrictEqual(charArr);

        console.log(buffer)
    })

    test("Gap should grow after being depleted", () => {
        gapBuffer.insert("A".repeat(INITGAPSIZE));
        gapBuffer.insert("A");

        const buffer = gapBuffer.buffer;

        // Assert buffer has grown in size
        expect(buffer.length).toStrictEqual(INITGAPSIZE + GAPGROWSIZE);

        console.log(buffer)
    })

    test("Gap should grow after being moved and depleted", () => {
        gapBuffer.insert("A".repeat(INITGAPSIZE));
        gapBuffer.left();
        gapBuffer.insert("A");

        const buffer = gapBuffer.buffer;

        // Assert buffer has grown in size
        expect(buffer.length).toStrictEqual(INITGAPSIZE + GAPGROWSIZE);


        const insertedA = `${'"A",'.repeat(INITGAPSIZE)}`
        const emptySpaces = `"",`.repeat(GAPGROWSIZE - 1);

        const charArr = `[${insertedA + emptySpaces}"A"]`;
        const bufferString = JSON.stringify(buffer)

        expect(bufferString).toStrictEqual(charArr);

        console.log(buffer)
    })

    test("GapBuffer should return gap-free string", () => {
        gapBuffer.insert("AD");
        gapBuffer.left();
        gapBuffer.insert("BC");

        const bufferText = gapBuffer.toString();

        expect(bufferText).toBe("ABCD");
    })

    // XXXXXXX_ABC12345****
    test("GapBuffer should pass the ultimate insertion test", () => {
        gapBuffer.right();
        gapBuffer.insert("BC");
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.insert("A");
        gapBuffer.left();
        gapBuffer.insert("X".repeat(7));
        gapBuffer.insert("_");
        gapBuffer.right();
        gapBuffer.right();
        gapBuffer.right();
        gapBuffer.right();
        gapBuffer.insert("12345");

        const buffer = gapBuffer.buffer;

        // Assert buffer has grown in size twice
        expect(buffer.length).toStrictEqual(INITGAPSIZE + 2 * GAPGROWSIZE);

        const bufferText = gapBuffer.toString();
        const expectedString = "XXXXXXX_ABC12345"

        expect(bufferText).toStrictEqual(expectedString);
    })
});
