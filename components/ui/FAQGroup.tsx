import type { ReactNode } from 'react';
import styles from './FAQGroup.module.css';

type FAQItem = {
  question: string;
  answer: ReactNode;
};

type FAQGroupProps = {
  title: string;
  description: string;
  items: FAQItem[];
};

export function FAQGroup({ title, description, items }: FAQGroupProps) {
  return (
    <section className={styles.group}>
      <header className={styles.groupHeader}>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className={styles.items}>
        {items.map((item, index) => (
          <details className={styles.item} key={item.question} open={index === 0}>
            <summary>
              <span>{item.question}</span>
              <i aria-hidden="true">+</i>
            </summary>
            <div className={styles.answer}>{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
