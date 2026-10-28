import { looksLikeRtf, rtfToPlainText } from "./rtfToPlainText";

export function plainTextFromBytes(bytes: Uint8Array, filename = ""): string {
  const head = new TextDecoder("ascii")
    .decode(bytes.subarray(0, Math.min(bytes.length, 64)))
    .trimStart();
  const isRtf = looksLikeRtf(head) || filename.toLowerCase().endsWith(".rtf");

  if (!isRtf) {
    return new TextDecoder("utf-8").decode(bytes);
  }

  const rtf = new TextDecoder("windows-1252").decode(bytes);
  return rtfToPlainText(rtf);
}

export function looksBinary(text: string): boolean {
  const sample = text.slice(0, 4000);
  let control = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0) {
      return true;
    }
    if (code < 9 || (code > 13 && code < 32)) {
      control++;
    }
  }
  return control > 8;
}

export async function plainTextFromFile(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return plainTextFromBytes(bytes, file.name);
}
