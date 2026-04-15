"use client";

import { Hero } from "@/components/landing_page/Hero";
import { Feature1 } from "@/components/landing_page/Feature";
import SiteFooter from "@/components/SiteFooter";
import { EyeOff, PencilLine } from "lucide-react";
import { FeatureReveal } from "@/components/landing_page/FeatureReveal";

export default function Home() {
  const ctaButton = {
    text: "Try it now",
    icon: <PencilLine className="ml-0 size-4" />,
    url: "/editor",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero
          icon={<EyeOff className="size-10" />}
          heading="Camo Note"
          description="Camo Note - write privately in public."
          button={ctaButton}
          trustText="Fast and free demo available"
          imageSrc="/logo2.png"
          imageAlt="demo gif"
        />

        <Feature1
          title="Text Masking"
          description="As you type in Camo Note, your words are masked so your page always looks like an innocent document to anyone glancing at your screen."
          imageSrc="/features/masking.gif"
          imageAlt="Text masking demo"
          button={ctaButton}
        />

        <Feature1
          title="Context Reveal"
          description="To keep your flow, words around your caret can reveal themselves in a small radius. You can tune the amount of context, or hold the backtick key (`) to temporarily reveal everything."
          imageSrc="/features/context.gif"
          imageAlt="Context reveal demo"
          button={ctaButton}
        />

        <Feature1
          title="Masking Styles"
          description="Masking styles control what onlookers see: scientific report, legal document, news article, and more. You stay readable to yourself while blending into any workspace."
          imageSrc="/features/styles.gif"
          imageAlt="Masking styles demo"
          button={ctaButton}
        />
        <FeatureReveal>
          
        </FeatureReveal>
      </main>
      <SiteFooter />
    </div>
  );
}
