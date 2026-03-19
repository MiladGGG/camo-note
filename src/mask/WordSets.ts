export type RawMap = Record<string, string[]>;

// Lazy, per-set loading using dynamic imports so we don't bundle all word sets at once.
export async function loadWordSet(name: string = "natural"): Promise<RawMap> {
  try {
    const mod = await import(`./words/${name}.json`);
    return mod.default as RawMap;
  } catch (err) {
    throw new Error(`Failed to load word set "${name}": ${(err as Error).message}`);
  }
}

