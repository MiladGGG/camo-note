"use client";

export default function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-gray-200/80 bg-[var(--color-surface-muted)] px-4 py-3.5 text-xs text-gray-600 sm:px-8 lg:px-12 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <span>Camo Note</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/miladggg/camo-note"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-blue-700 hover:underline dark:hover:text-blue-300"
          >
            <img
              src="/icons/github.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain opacity-80 dark:invert"
              decoding="async"
            />
            GitHub
          </a>
          <a
            href="https://miladggg.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-blue-700 hover:underline dark:hover:text-blue-300"
          >
            <img
              src="/icons/website.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain opacity-80 dark:invert"
              decoding="async"
            />
            My Website
          </a>
        </div>
      </div>
    </footer>
  );
}
