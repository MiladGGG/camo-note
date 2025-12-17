import Editor from "@/components/Editor";
import TextHandler from "@/components/TextHandler";


export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-12 bg-white border-b flex items-center px-14">
        <span className="font-medium">Untitled Document</span>
      </header>

      {/* Toolbar */}
      <div className="h-10 bg-white border-b flex items-center px-4 gap-2">
        <button className="px-2 py hover:bg-gray-100 rounded">B</button>
        <button className="px-2 py hover:bg-gray-100 rounded">I</button>
        <button className="px-2 py hover:bg-gray-100 rounded">U</button>
      </div>

      {/* Editor Area */}
      <main className="flex-1 overflow flex justify-center">
        <Editor/>

      </main>
    </div>
  );
}
