import { cn } from "@/lib/utils";

const TITLE = "Peek behind the mask";

/** Preset copy — masked line shown until hover reveals the real line. */
const BULLETS: { masked: string; real: string }[] = [
  {
    masked:
      "Cell structure █████ but method an increase average cycle.",
    real: "Your sensitive ideas are masked by innocent looking words.",
  },
  {
    masked:
      "Reliability trend mean ████ an result sensor - Estimates that they are λ sample system be mean █████.",
    real: "Confidently write your ideas in public spaces - Onlookers will only see a masked facade of your document.",
  },
  {
    masked:
      "Data aims be approach █████ can data of- can one aim with being derived methods █████ this by figure.",
    real: "Your text is revealed when you need it - you can see your ideas flowing without exposing them to others.",
  },
  {
    masked:
      "Code licenses but of legislation an that principle █████: a agreements wills, a statutes claims, a claim licenses, to interest wills act laws!",
    real: "Your document can be disguised in many different styles: a scientific paper, a business report, a legal document, an acedemic paper and more!",
  },
];

type FeatureRevealProps = {
  className?: string;
};

/**
 * Second feature block: title + four bullets that show preset “masked” text until hover reveals real text.
 */
export function FeatureReveal({ className }: FeatureRevealProps) {
  return (
    <section className={cn("py-24 sm:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl">
          {TITLE}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          Hover any point to reveal what it really says.
        </p>
        <ul className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          {BULLETS.map((item, index) => (
            <li
              key={index}

              className="group flex gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3.5 shadow-sm transition-colors hover:border-primary/25 hover:bg-muted/40 sm:px-5 sm:py-4"
            >
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary/80 ring-2 ring-primary/20"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm leading-relaxed text-muted-foreground transition-opacity group-hover:hidden sm:text-base"
                  aria-hidden
                >
                  {item.masked}
                </p>
                <p className="hidden text-sm font-medium leading-relaxed text-foreground group-hover:block sm:text-base">
                  {item.real}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
