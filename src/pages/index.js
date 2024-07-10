import styles from "@/styles/app.module.css";
import CommonsGraph from "./graph";

export default function Home() {
  return (
    <main className={styles.main}>
      <CommonsGraph />
    </main>
  );
}
