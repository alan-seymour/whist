import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  block?: boolean
}

export const Button = ({
  variant = 'primary',
  block,
  className,
  type = 'button',
  ...rest
}: Props) => (
  <button
    type={type}
    className={[
      styles.button,
      styles[variant],
      block && styles.block,
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  />
)
