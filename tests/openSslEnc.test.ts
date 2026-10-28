import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { decryptCamoNote, encryptCamoNote } from "../src/crypto/openSslEnc";

const PASSPHRASE = "hunter2";
const NOTE = "Secret note\nSecond line";

describe("openssl camo files", () => {
  test("round-trips a note with the same passcode", async () => {
    const file = await encryptCamoNote(NOTE, PASSPHRASE);
    expect(new TextDecoder().decode(file.subarray(0, 8))).toBe("Salted__");
    await expect(decryptCamoNote(file, PASSPHRASE)).resolves.toBe(NOTE);
    await expect(decryptCamoNote(file, "nope")).rejects.toThrow("Wrong passcode");
  });

  test("openssl can decrypt a file this app writes", async () => {
    const file = await encryptCamoNote(NOTE, PASSPHRASE);
    const dir = mkdtempSync(join(tmpdir(), "camo-"));
    const camoPath = join(dir, "note.camo");
    writeFileSync(camoPath, file);

    const plain = execFileSync("openssl", [
      "enc",
      "-d",
      "-aes-256-cbc",
      "-pbkdf2",
      "-iter",
      "10000",
      "-md",
      "sha256",
      "-in",
      camoPath,
      "-pass",
      `pass:${PASSPHRASE}`,
    ]);
    expect(plain.toString("utf8")).toBe(NOTE);
  });

  test("this app can decrypt a file openssl writes", async () => {
    const dir = mkdtempSync(join(tmpdir(), "camo-"));
    const plainPath = join(dir, "note.txt");
    const camoPath = join(dir, "note.camo");
    writeFileSync(plainPath, NOTE);
    execFileSync("openssl", [
      "enc",
      "-aes-256-cbc",
      "-pbkdf2",
      "-iter",
      "10000",
      "-md",
      "sha256",
      "-in",
      plainPath,
      "-out",
      camoPath,
      "-pass",
      `pass:${PASSPHRASE}`,
    ]);

    const bytes = new Uint8Array(readFileSync(camoPath));
    await expect(decryptCamoNote(bytes, PASSPHRASE)).resolves.toBe(NOTE);
  });
});
