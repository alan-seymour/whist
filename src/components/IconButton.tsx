import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const IconButton = ({ label, className, ...rest }: Props) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={[styles.button, className].filter(Boolean).join(' ')}
    {...rest}
  />
)
