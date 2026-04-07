"use client";

import { Hero } from "@/components/landing_page/Hero";
import { Feature1 } from "@/components/landing_page/Feature";
import { FeatureReveal } from "@/components/landing_page/FeatureReveal";
import SiteFooter from "@/components/SiteFooter";
import { EyeOff, PencilLine } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
      <Hero
        icon={<EyeOff className="size-10" />}
        heading="Camo Note"
        description="Camo Note - write privately in public."
        button={{
          text: "Try it now",
          icon: <PencilLine className="ml-0 size-4" />,
          url: "/editor",
        }}
      trustText="Fast and free demo available"
      imageSrc="/logo2.png"
      imageAlt="demo gif"
        />
    <Feature1
      title="Write privately in public"
      description="Camo Note allows you to write privately in public. You can write your notes in public and they will be encrypted. You can also share your notes with others and they will be encrypted."
      imageSrc="/feature1.png"
      imageAlt="privacy image"
      button={{
        text: "Try it now",
        icon: <PencilLine className="ml-0 size-4" />,
        url: "/editor",
      }}
    />
      <FeatureReveal />
      </main>
      <SiteFooter />
    </div>
  );
}
