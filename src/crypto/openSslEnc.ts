const SALTED_MAGIC = "Salted__";
const SALT_LENGTH = 8;
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const PBKDF2_ITERATIONS = 10_000;

export class CamoDecryptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CamoDecryptError";
  }
}

/**
 * OpenSSL `enc -aes-256-cbc -pbkdf2 -iter 10000` file layout:
 * "Salted__" + 8-byte salt + ciphertext.
 * PBKDF2-HMAC-SHA256 derives 32 key bytes and 16 IV bytes.
 *
 * Decrypt outside the app:
 * openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 -md sha256 -in note.camo -out note.txt
 */
export async function encryptCamoNote(plainText: string, passcode: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const { key, iv } = await deriveKeyAndIv(passcode, salt);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-CBC", iv: copyBytes(iv) },
      key,
      copyBytes(new TextEncoder().encode(plainText))
    )
  );

  const file = new Uint8Array(SALTED_MAGIC.length + SALT_LENGTH + ciphertext.length);
  file.set(new TextEncoder().encode(SALTED_MAGIC), 0);
  file.set(salt, SALTED_MAGIC.length);
  file.set(ciphertext, SALTED_MAGIC.length + SALT_LENGTH);
  return file;
}

export async function decryptCamoNote(bytes: Uint8Array, passcode: string): Promise<string> {
  const headerLength = SALTED_MAGIC.length + SALT_LENGTH;
  if (bytes.length <= headerLength || !hasSaltedMagic(bytes)) {
    throw new CamoDecryptError("This file is not an encrypted note");
  }

  const salt = bytes.subarray(SALTED_MAGIC.length, headerLength);
  const ciphertext = bytes.subarray(headerLength);
  const { key, iv } = await deriveKeyAndIv(passcode, salt);

  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-CBC", iv: copyBytes(iv) }, key, copyBytes(ciphertext));
    return new TextDecoder().decode(plain);
  } catch {
    throw new CamoDecryptError("Wrong passcode");
  }
}

export function isCamoFilename(name: string): boolean {
  return name.toLowerCase().endsWith(".camo");
}

function copyBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(bytes.byteLength);
  const copy = new Uint8Array(buffer);
  copy.set(bytes);
  return copy;
}

function hasSaltedMagic(bytes: Uint8Array): boolean {
  const magic = new TextEncoder().encode(SALTED_MAGIC);
  if (bytes.length < magic.length) {
    return false;
  }
  for (let i = 0; i < magic.length; i++) {
    if (bytes[i] !== magic[i]) {
      return false;
    }
  }
  return true;
}

async function deriveKeyAndIv(passcode: string, salt: Uint8Array): Promise<{ key: CryptoKey; iv: Uint8Array }> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passcode),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt.slice(),
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      material,
      (KEY_LENGTH + IV_LENGTH) * 8
    )
  );
  const key = await crypto.subtle.importKey(
    "raw",
    derived.slice(0, KEY_LENGTH),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
  return { key, iv: derived.slice(KEY_LENGTH) };
}
