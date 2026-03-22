import type { ButtonHTMLAttributes } from "react";
import styles from "./IconButton.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  label: string;
};

export function IconButton({ icon, label, className, ...rest }: Props) {
  return (
    <button
      type="button"
      className={[styles.btn, className].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
