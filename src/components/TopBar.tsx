import type { ReactNode } from 'react'
import styles from './TopBar.module.css'

interface Props {
  start?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  end?: ReactNode
}

export const TopBar = ({ start, title, subtitle, end }: Props) => (
  <header className={styles.bar}>
    <div className={styles.slot}>{start}</div>
    <div className={styles.titles}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    <div className={[styles.slot, styles.end].join(' ')}>{end}</div>
  </header>
)
