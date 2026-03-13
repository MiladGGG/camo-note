import MaskedEditor from "@/components/MaskedEditor";
import DocsHeader from "@/components/DocsHeader";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <DocsHeader />

      <main className="flex-1 overflow flex justify-center">
        <MaskedEditor />
      </main>
    </div>
  );
}
