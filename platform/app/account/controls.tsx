"use client";
import { useEffect, useId, useRef, useState } from "react";

export function PasswordField({ fresh = false }: { fresh?: boolean }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div className="password-field">
      <label htmlFor={id}>{fresh ? "New password" : "Password"}</label>
      <div className="password-input">
        <input id={id} name="password" type={visible ? "text" : "password"}
          minLength={8} maxLength={128} required
          autoComplete={fresh ? "new-password" : "current-password"}
          aria-describedby={`${id}-hint`} />
        <button type="button" aria-controls={id} aria-pressed={visible}
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button>
      </div>
      <small id={`${id}-hint`}>At least 8 characters. A password manager can help.</small>
    </div>
  );
}

export function AccountNotice({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (message && !dialog.current?.open) dialog.current?.showModal();
    else if (!message && dialog.current?.open) dialog.current.close();
  }, [message]);
  return (
    <dialog ref={dialog} className="account-notice" aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`} onClose={onDismiss}>
      <h2 id={`${id}-title`}>Account notice</h2>
      <p id={`${id}-message`}>{message}</p>
      <button type="button" className="fitness-primary" autoFocus
        onClick={() => dialog.current?.close()}>Got it</button>
    </dialog>
  );
}
