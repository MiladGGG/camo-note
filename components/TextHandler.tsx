"use client"
import TextManager from "@/src/buffer/TextManager";
import TextUtils from "@/src/TextUtils";
import { useEffect, useRef, useState } from "react";





const textManager = new TextManager()

export default function TextHandler() {
    
    const [realText, setRealText] = useState<string>("");
    const [maskedText, setMaskedText] = useState<string>("");
    
    const [textHolder, setTextHolder] = useState<HTMLElement | null>()
    const [currentDiv, setCurrentDiv] = useState<HTMLElement | null>()
    const [createdDivCount, setCreatedDivCount] = useState<number>(0);

    const [isHighlighted , setIsHighlighted] = useState<boolean>(false);
    const [startHighlighted, setStartHighlighted] = useState<number>();
    const [endHighlighted, setEndHighlighted] = useState<number>();

    
    const divIdentifier = "lineDiv_";
    

    useEffect(() => {
        setTextHolder(document.getElementById("textHolder"));
        setCurrentDiv(document.getElementById(`${divIdentifier}${createdDivCount.toString()}`));
    }, [])


    function handleKeyDown(e : React.KeyboardEvent<HTMLDivElement>) {
        let key = e.key;
        const shiftHeld : boolean = e.shiftKey;
        const capsLock : boolean = e.getModifierState('CapsLock');
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
        setRealText(textManager.getRealText());
        setMaskedText(textManager.getMaskedText())
        // e.preventDefault();
    }

    function renameDiv() {
        const children = textHolder?.children;
        if(!children){
            return;
        }
        let targetIndex = 0;

        for (let i = 0; i < children.length; i++) {
            if (children[i].id == currentDiv?.id){
                targetIndex = i + 1;
                break;
            }
        }

        setCreatedDivCount((prevState) => prevState += 1);
        let targetDiv = children[targetIndex] as HTMLElement;
        targetDiv.id = `${divIdentifier}${createdDivCount.toString()}`;

        setCurrentDiv(targetDiv);
    }

    function handleInput(e : React.KeyboardEvent<HTMLDivElement>) {
        
        const i = e.nativeEvent as unknown;
        const inputEvent = i as InputEvent;
        
        if (inputEvent.inputType === "insertParagraph") {
            renameDiv();
        }
    }

    function getAbsoluteCaretPostion() : number {
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return 0;

        let selectedDivId : string; 
        const targetNode = sel.anchorNode;

        if (targetNode.parentElement && targetNode.parentElement.id != "textHolder") {
            selectedDivId = targetNode.parentElement.id;
        } else {
            const element = targetNode as HTMLElement;
            selectedDivId = element.id;
        }

        let count = 0;
        for (const child of textHolder?.childNodes!) {
            const el = child as HTMLElement;

            if (el.id == selectedDivId) {
                count += sel.anchorOffset;
                break;
            }

            count += el.textContent? el.textContent?.length! : 0;
            count++;
        }
        return count;
    }
    

    function handleClick() {
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return;
        
        if (sel.type == "Caret") {
            const caretIndex = getAbsoluteCaretPostion();
            textManager.setCursor(caretIndex);
        } else if (sel.type == "Range") {
            console.log(sel.toString());
            // setStartHighlighted(sel.extentOffset!);
            setEndHighlighted(sel.anchorOffset);
        }

        // console.log(caretIndex);
        console.log(window.getSelection());
    }

  return (
    <>
        <div 
        id="textHolder"
        contentEditable
        suppressContentEditableWarning={true}
        className="whitespace-pre-wrap outline-none text-blue-600"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        >
            <div id={`${divIdentifier}${createdDivCount.toString()}`}><br/></div>
        </div>
        <br/>
        <div>
            {maskedText}
        </div>
               
    </>

  );
}
