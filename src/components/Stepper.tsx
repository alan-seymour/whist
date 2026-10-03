import { Minus, Plus } from 'lucide-react'
import styles from './Stepper.module.css'

interface Props {
  label: string
  value: number | null
  max: number
  onChange: (value: number | null) => void
  invalid?: boolean
}

/**
 * −/+ control for a count. Empty (`null`) is a real state: tapping the empty
 * value sets 0, + from empty gives 1, and − from 0 clears it again.
 */
export const Stepper = ({ label, value, max, onChange, invalid }: Props) => {
  const lower = label.toLowerCase()
  const decrement = () =>
    onChange(value === null || value <= 0 ? null : value - 1)
  const increment = () =>
    onChange(value === null ? 1 : Math.min(value + 1, max))
  return (
    <div
      className={[styles.stepper, invalid && styles.invalid]
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={styles.control}
        onClick={decrement}
        disabled={value === null}
        aria-label={`Decrease ${lower}`}
      >
        <Minus size={20} aria-hidden="true" />
      </button>
      {value === null ? (
        <button
          type="button"
          className={styles.empty}
          onClick={() => onChange(0)}
          aria-label={`Set ${lower} to 0`}
        >
          –
        </button>
      ) : (
        <output className={styles.value}>{value}</output>
      )}
      <button
        type="button"
        className={styles.control}
        onClick={increment}
        disabled={value !== null && value >= max}
        aria-label={`Increase ${lower}`}
      >
        <Plus size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
