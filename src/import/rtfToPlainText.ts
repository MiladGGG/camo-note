const SKIP_DESTINATIONS = new Set([
  "fonttbl",
  "colortbl",
  "stylesheet",
  "info",
  "pict",
  "object",
  "datastore",
  "themedata",
  "colorschememapping",
  "latentstyles",
  "generator",
  "header",
  "footer",
  "headerl",
  "headerr",
  "headerf",
  "footerl",
  "footerr",
  "footerf",
  "footnote",
  "annotation",
  "fldinst",
  "xe",
  "tc",
  "listtable",
  "listoverridetable",
  "revtbl",
  "rsidtbl",
  "pgdsctbl",
  "xmlnstbl",
  "filetbl",
  "nonshppict",
  "shppict",
  "blipuid",
]);

/** Windows-1252 bytes that are not the same as Latin-1. */
const CP1252_EXTRA: Record<number, string> = {
  0x80: "\u20ac",
  0x82: "\u201a",
  0x83: "\u0192",
  0x84: "\u201e",
  0x85: "\u2026",
  0x86: "\u2020",
  0x87: "\u2021",
  0x88: "\u02c6",
  0x89: "\u2030",
  0x8a: "\u0160",
  0x8b: "\u2039",
  0x8c: "\u0152",
  0x8e: "\u017d",
  0x91: "\u2018",
  0x92: "\u2019",
  0x93: "\u201c",
  0x94: "\u201d",
  0x95: "\u2022",
  0x96: "\u2013",
  0x97: "\u2014",
  0x98: "\u02dc",
  0x99: "\u2122",
  0x9a: "\u0161",
  0x9b: "\u203a",
  0x9c: "\u0153",
  0x9e: "\u017e",
  0x9f: "\u0178",
};

function windows1252Char(code: number): string {
  return CP1252_EXTRA[code] ?? String.fromCharCode(code);
}

export function looksLikeRtf(text: string): boolean {
  return text.trimStart().startsWith("{\\rtf");
}

/**
 * Pulls visible text out of an RTF document.
 * Control words, font tables, and other formatting groups are dropped.
 */
export function rtfToPlainText(rtf: string): string {
  let i = 0;
  const length = rtf.length;
  let ucSkip = 1;
  let skip = 0;
  const stack: { uc: number; skip: number }[] = [];
  const out: string[] = [];

  const pushChar = (char: string) => {
    if (skip === 0 && char !== "\u0000") {
      out.push(char);
    }
  };

  const consumeUnicodeFallback = () => {
    let remaining = ucSkip;
    while (remaining > 0 && i < length) {
      const char = rtf[i];
      if (char === "{" || char === "}") {
        break;
      }
      if (char === "\\") {
        const next = rtf[i + 1];
        if (next === "'") {
          i += 4;
          remaining--;
          continue;
        }
        if (next === "\\" || next === "{" || next === "}") {
          i += 2;
          remaining--;
          continue;
        }
        break;
      }
      if (char === "\n" || char === "\r") {
        i++;
        continue;
      }
      i++;
      remaining--;
    }
  };

  while (i < length) {
    const char = rtf[i]!;

    if (char === "{") {
      stack.push({ uc: ucSkip, skip });
      i++;
      continue;
    }

    if (char === "}") {
      const frame = stack.pop();
      if (frame) {
        ucSkip = frame.uc;
        skip = frame.skip;
      }
      i++;
      continue;
    }

    if (char === "\\") {
      i++;
      if (i >= length) {
        break;
      }
      const next = rtf[i]!;

      if (next === "\\" || next === "{" || next === "}") {
        pushChar(next);
        i++;
        continue;
      }

      if (next === "\n" || next === "\r") {
        i++;
        if (next === "\r" && rtf[i] === "\n") {
          i++;
        }
        continue;
      }

      if (next === "'") {
        const hex = rtf.slice(i + 1, i + 3);
        i += 3;
        const code = Number.parseInt(hex, 16);
        if (!Number.isNaN(code)) {
          pushChar(windows1252Char(code));
        }
        continue;
      }

      if (next === "*") {
        skip++;
        i++;
        continue;
      }

      if (!/[a-zA-Z]/.test(next)) {
        i++;
        if (skip === 0) {
          if (next === "~") {
            pushChar("\u00a0");
          } else if (next === "-") {
            pushChar("\u00ad");
          } else if (next === "_") {
            pushChar("\u2011");
          }
        }
        continue;
      }

      const wordStart = i;
      while (i < length && /[a-zA-Z]/.test(rtf[i]!)) {
        i++;
      }
      const word = rtf.slice(wordStart, i).toLowerCase();

      let negative = false;
      if (rtf[i] === "-") {
        negative = true;
        i++;
      }
      let arg: number | undefined;
      if (i < length && /[0-9]/.test(rtf[i]!)) {
        const numStart = i;
        while (i < length && /[0-9]/.test(rtf[i]!)) {
          i++;
        }
        arg = Number.parseInt(rtf.slice(numStart, i), 10);
        if (negative) {
          arg = -arg;
        }
      }
      if (rtf[i] === " ") {
        i++;
      }

      if (word === "uc" && arg !== undefined) {
        ucSkip = arg;
        continue;
      }

      if (word === "bin" && arg !== undefined && arg > 0) {
        i += arg;
        continue;
      }

      if (word === "u" && arg !== undefined) {
        if (skip === 0) {
          const code = arg < 0 ? arg + 65536 : arg;
          pushChar(String.fromCharCode(code & 0xffff));
        }
        consumeUnicodeFallback();
        continue;
      }

      if (SKIP_DESTINATIONS.has(word)) {
        skip++;
        continue;
      }

      if (skip === 0 && (word === "par" || word === "line" || word === "page")) {
        pushChar("\n");
        continue;
      }
      if (skip === 0 && word === "tab") {
        pushChar("\t");
        continue;
      }
      if (skip === 0 && word === "emdash") {
        pushChar("\u2014");
        continue;
      }
      if (skip === 0 && word === "endash") {
        pushChar("\u2013");
        continue;
      }
      if (skip === 0 && word === "lquote") {
        pushChar("\u2018");
        continue;
      }
      if (skip === 0 && word === "rquote") {
        pushChar("\u2019");
        continue;
      }
      if (skip === 0 && word === "ldblquote") {
        pushChar("\u201c");
        continue;
      }
      if (skip === 0 && word === "rdblquote") {
        pushChar("\u201d");
        continue;
      }
      if (skip === 0 && word === "bullet") {
        pushChar("\u2022");
        continue;
      }
      continue;
    }

    if (char === "\n" || char === "\r") {
      i++;
      continue;
    }

    pushChar(char);
    i++;
  }

  return out.join("");
}
