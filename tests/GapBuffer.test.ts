import { describe ,test,it , expect, beforeAll } from "vitest";
import GapBuffer from "../src/buffer/GapBuffer";



describe("GapBuffer Initalise", () => {
    const INITGAPSIZE = 10;
    const GAPGROWSIZE = 5;
    const gapBuffer : GapBuffer = new GapBuffer(INITGAPSIZE);

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
        gapBuffer.left();
        gapBuffer.left();
        gapBuffer.left();
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
        gapBuffer.insert("CD");

        const bufferText = gapBuffer.toString();

        expect(bufferText).toBe("ABCD");

        console.log(bufferText)
    })
});
