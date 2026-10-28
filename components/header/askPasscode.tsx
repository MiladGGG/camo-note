"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

/** Returns the passcode, or null when the dialog is dismissed. */
export function askPasscode(options?: {
  confirm?: boolean;
  /** Return an error message to keep the dialog open, or null to accept the passcode. */
  verify?: (passcode: string) => Promise<string | null>;
}): Promise<string | null> {
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

    root.render(
      <PasscodeDialog confirm={options?.confirm ?? false} verify={options?.verify} onFinish={finish} />,
    );
  });
}

function PasscodeDialog({
  confirm,
  verify,
  onFinish,
}: {
  confirm: boolean;
  verify?: (passcode: string) => Promise<string | null>;
  onFinish: (value: string | null) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const inputId = useId();
  const confirmId = useId();
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submitPasscode = async () => {
    if (busy) {
      return;
    }
    const passcode = inputRef.current?.value ?? "";
    if (!passcode) {
      setError("Enter a passcode");
      inputRef.current?.focus();
      return;
    }
    if (confirm) {
      const repeated = confirmRef.current?.value ?? "";
      if (!repeated) {
        setError("Retype your passcode");
        confirmRef.current?.focus();
        return;
      }
      if (repeated !== passcode) {
        setError("Passcodes do not match");
        confirmRef.current?.focus();
        return;
      }
    }
    if (verify) {
      setBusy(true);
      try {
        const message = await verify(passcode);
        if (message) {
          setError(message);
          inputRef.current?.focus();
          inputRef.current?.select();
          return;
        }
      } finally {
        setBusy(false);
      }
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
                if (confirm) {
                  confirmRef.current?.focus();
                  return;
                }
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
        {confirm ? (
          <>
            <label htmlFor={confirmId} className="mt-3 block text-[13px] font-medium text-gray-800 dark:text-zinc-100">
              Retype passcode
            </label>
            <div className="relative mt-2">
              <input
                ref={confirmRef}
                id={confirmId}
                type={confirmVisible ? "text" : "password"}
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
                aria-controls={confirmId}
                aria-pressed={confirmVisible}
                aria-label={confirmVisible ? "Hide retyped passcode" : "Show retyped passcode"}
                className="absolute top-1/2 right-1.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                onClick={() => setConfirmVisible((current) => !current)}
              >
                {confirmVisible ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
              </button>
            </div>
          </>
        ) : null}
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
