import styles from "./RoutePlaceholder.module.css";

type Props = {
  title: string;
  description?: string;
};

export function RoutePlaceholder({ title, description }: Props) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.desc}>{description}</p> : null}
    </div>
  );
}
