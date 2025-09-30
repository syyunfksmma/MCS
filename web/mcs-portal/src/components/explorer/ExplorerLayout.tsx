import type { ReactNode } from 'react';
import styles from './ExplorerLayout.module.css';

interface ExplorerLayoutProps {
  ribbon: ReactNode;
  tree: ReactNode;
  main: ReactNode;
  aside?: ReactNode;
}

export default function ExplorerLayout({
  ribbon,
  tree,
  main,
  aside
}: ExplorerLayoutProps) {
  return (
    <div className={styles.root}>
      <header className={styles.ribbon} role="banner">
        {ribbon}
      </header>
      <div className={styles.body}>
        <aside className={styles.tree} aria-label="Explorer navigation">
          {tree}
        </aside>
        <main className={styles.main} aria-label="Explorer workspace">
          {main}
        </main>
        {aside ? (
          <section className={styles.aside} aria-label="Explorer preview">
            {aside}
          </section>
        ) : null}
      </div>
    </div>
  );
}
