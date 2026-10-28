"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

/** Returns the passcode, or null when the dialog is dismissed. */
export function askPasscode(): Promise<string | null> {
  return new Promise((resolve) => {
    const host = document.createElement("div");
    host.className = document.querySelector(".dark") ? "dark" : "";
    document.body.appendChild(host);
    const root = createRoot(host);
    let settled = false;

    const finish = (value: string | null) => {
      if (settled) {
        return;
      }
      settled = true;
      root.unmount();
      host.remove();
      resolve(value);
    };

    root.render(<PasscodeDialog onFinish={finish} />);
  });
}

function PasscodeDialog({ onFinish }: { onFinish: (value: string | null) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const inputId = useId();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  const submitPasscode = () => {
    const passcode = inputRef.current?.value ?? "";
    if (!passcode) {
      setError("Enter a passcode");
      inputRef.current?.focus();
      return;
    }
    onFinish(passcode);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    dialog.showModal();
    inputRef.current?.focus();

    const onCancel = (event: Event) => {
      event.preventDefault();
      onFinish(null);
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onFinish]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="passcode-dialog"
      onMouseDown={(event) => {
        if (event.target === dialogRef.current) {
          onFinish(null);
        }
      }}
    >
      <div className="w-[18rem] rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <label id={titleId} htmlFor={inputId} className="text-[13px] font-medium text-gray-800 dark:text-zinc-100">
          Passcode
        </label>
        <div className="relative mt-2">
          <input
            ref={inputRef}
            id={inputId}
            type={visible ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pr-9 pl-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-900"
            onChange={() => {
              if (error) {
                setError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitPasscode();
              }
            }}
          />
          <button
            type="button"
            aria-controls={inputId}
            aria-pressed={visible}
            aria-label={visible ? "Hide passcode" : "Show passcode"}
            className="absolute top-1/2 right-1.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-100"
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-1.5 text-[11px] text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-white/10"
            onClick={() => onFinish(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-[12px] font-medium text-white hover:bg-blue-700"
            onClick={submitPasscode}
          >
            Continue
          </button>
        </div>
      </div>
    </dialog>
  );
}
