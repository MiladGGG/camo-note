import { Button } from "@/components/landing_page/ui/button";
import { cn } from "@/lib/utils";

interface Feature1Props {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  button: {
    text: string;
    icon?: React.ReactNode;
    url: string;
    className?: string;
  };
  className?: string;
}

const Feature1 = ({
  title = "Blocks built with Shadcn & Tailwind",
  description = "Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  imageSrc = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  imageAlt = "placeholder hero",
  button = {
    text: "Get Started",
    url: "https://shadcnblocks.com",
  },
  className,
}: Feature1Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="my-6 mt-0 text-4xl font-semibold text-balance lg:text-5xl">
              {title}
            </h2>
            {description && (
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
                {description}
              </p>
            )}
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button asChild className={button.className}>
                <a href={button.url}>
                  {button.text} {button.icon}
                </a>
              </Button>
            </div>
          </div>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { Feature1 };
