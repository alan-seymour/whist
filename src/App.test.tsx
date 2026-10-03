import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { STORAGE_KEY, createGame, gameReducer, saveGame } from './game'

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('renders the scorepad with four default players', () => {
    render(<App />)
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 4')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add player/i }),
    ).toBeInTheDocument()
  })

  it('scores a hand and shows the running total', async () => {
    const user = userEvent.setup()
    render(<App />)
    const [bid] = screen.getAllByLabelText('Bid')
    const [tricks] = screen.getAllByLabelText('Tricks won')
    await user.type(bid, '3')
    await user.type(tricks, '3')
    expect(screen.getByText('8')).toBeInTheDocument()
    await user.clear(bid)
    expect(screen.queryByText('8')).not.toBeInTheDocument()
  })

  it('persists the game and offers to resume it', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.type(screen.getAllByLabelText('Bid')[0], '3')
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"bids":[3,')
    unmount()

    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Resume' }))
    expect(screen.getAllByLabelText('Bid')[0]).toHaveValue(3)
  })

  it('can start a new game instead of resuming', async () => {
    const user = userEvent.setup()
    saveGame(
      gameReducer(createGame(), {
        type: 'setBid',
        round: 0,
        player: 0,
        bid: 3,
      }),
    )
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'New game' }))
    expect(screen.getAllByLabelText('Bid')[0]).toHaveValue(null)
  })
})
