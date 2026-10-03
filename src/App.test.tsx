import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the scorepad with four default players', () => {
    render(<App />)
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 4')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add player/i }),
    ).toBeInTheDocument()
  })
})
