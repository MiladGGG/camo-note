import TextHandler from "./TextHandler";


export default function Editor() {
    

  return (
    <div className="w-full max-w-4xl my-10 bg-white shadow-sm">

      {/* Text */}
      <div className="
      min-h-[200px]
      p-12
      outline-none
      whitespace-pre-wrap
      leading-relaxed
      "
      >
        <TextHandler/>  

      </div>
    </div>
  );
}
