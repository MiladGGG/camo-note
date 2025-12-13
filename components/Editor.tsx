"use client"
import TextManager from "@/src/buffer/TextManager";
import TextUtils from "@/src/TextUtils";
import { useEffect, useState } from "react";




const textManager = new TextManager()

function parseKey(event : KeyboardEvent) {
    let key = event.key;
    const shiftHeld : boolean = event.shiftKey;
    const capsLock : boolean = event.getModifierState('CapsLock');
    console.log(key);
    if (TextUtils.isLetter(key) && key.length == 1) {
        if (shiftHeld && capsLock) {
            key = key.toLowerCase();
        } 
        textManager.insert(key);
    } else if (key.length == 1) {
        textManager.insert(key)
    } else if (key == "Enter") {
        textManager.insert("\n")
    } else if (key == "Backspace") {
        textManager.delete();
    } else if (key == "ArrowLeft") {
        textManager.left();
    } else if (key == "ArrowRight") {
        textManager.right();
    }
}

export default function Editor() {
    
    const [realText, setRealText] = useState<string>("");
    const [maskedText, setMaskedText] = useState<string>("");
    const [lastKey, setLastKey] = useState<string>("");



    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setLastKey(event.key);

            parseKey(event);

            setRealText(textManager.realText);
            setMaskedText(textManager.getMaskedText());
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


  return (
    <>
        <div style={{whiteSpace: "pre-wrap"}}>
        REAL: {realText}
        </div>

        <div style={{whiteSpace: "pre-wrap"}}>
        MAKSED: {maskedText}
        </div>
    </>
  );
}
