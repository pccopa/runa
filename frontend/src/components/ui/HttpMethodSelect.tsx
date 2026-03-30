import { useEffect, useId, useRef, useState } from "react";
import { HTTP_METHODS, MethodBadge, type HttpMethod } from "./MethodBadge";
import styles from "./HttpMethodSelect.module.css";

type Props = {
  /** Para asociar `<label htmlFor>`. */
  id?: string;
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  disabled?: boolean;
};

export function HttpMethodSelect({ id: idProp, value, onChange, disabled }: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        id={id}
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <MethodBadge method={value} />
        <span className={`material-symbols-outlined ${styles.chevron}`} aria-hidden>
          expand_more
        </span>
      </button>
      {open ? (
        <ul id={`${id}-listbox`} className={styles.menu} role="listbox" aria-label="Método HTTP">
          {HTTP_METHODS.map((m) => (
            <li key={m} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={m === value}
                className={styles.option}
                onClick={() => {
                  onChange(m);
                  setOpen(false);
                }}
              >
                <MethodBadge method={m} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
