"use client"
import TextManager from "@/src/buffer/TextManager";
import { useEffect, useState } from "react";

export default function Editor() {
    const textManger = new TextManager()
    
    const [realText, setRealText] = useState<string>("");
    const [maskedText, setMaskedText] = useState<string>("");
    const [lastKey, setLastKey] = useState<string>("");

    function parseKey(key : string) {
        console.log(key);
        return String(key);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setLastKey(event.key);
            textManger.insert(parseKey(event.key));
            setRealText(textManger.realText);
            setMaskedText(textManger.getMaskedText());
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


  return (
    <div style={{whiteSpace: "pre-wrap"}}>
      {realText}
      <br></br>
      {maskedText}
    </div>
  );
}
