import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { STORAGE_KEY, createGame, gameReducer, saveGame } from './game'

const startGame = async (user: ReturnType<typeof userEvent.setup>) => {
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Start game' }))
}

const card = (name: string) =>
  within(screen.getByRole('heading', { name }).closest('li')!)

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('starts on setup with four players and lets you rename them', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getAllByLabelText(/name$/)).toHaveLength(4)
    await user.clear(screen.getByLabelText('Player 1 name'))
    await user.type(screen.getByLabelText('Player 1 name'), 'Alice')
    await user.click(screen.getByRole('button', { name: 'Add player' }))
    expect(screen.getAllByLabelText(/name$/)).toHaveLength(5)
    await user.click(screen.getByRole('button', { name: 'Start game' }))
    expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Round 1 of 13/ }),
    ).toBeInTheDocument()
  })

  it('scores a hand live and enables next round when everyone is in', async () => {
    const user = userEvent.setup()
    await startGame(user)
    const next = screen.getByRole('button', { name: 'Next round' })
    expect(next).toBeDisabled()

    const p1 = card('Player 1')
    await user.click(p1.getByRole('button', { name: /increase player 1 bid/i }))
    await user.click(p1.getByRole('button', { name: /increase player 1 bid/i }))
    await user.click(p1.getByRole('button', { name: /increase player 1 bid/i }))
    await user.click(
      p1.getByRole('button', { name: /increase player 1 tricks/i }),
    )
    await user.click(
      p1.getByRole('button', { name: /increase player 1 tricks/i }),
    )
    await user.click(
      p1.getByRole('button', { name: /increase player 1 tricks/i }),
    )
    expect(p1.getByText('+8')).toBeInTheDocument()
    expect(p1.getByLabelText('Total')).toHaveTextContent('8')

    for (const name of ['Player 2', 'Player 3', 'Player 4']) {
      const c = card(name)
      await user.click(
        c.getByRole('button', {
          name: new RegExp(`set ${name} bid to 0`, 'i'),
        }),
      )
      await user.click(
        c.getByRole('button', {
          name: new RegExp(`increase ${name} tricks`, 'i'),
        }),
      )
    }
    expect(screen.getByText(/doesn’t add up/)).toBeInTheDocument()
    expect(next).toBeEnabled()
    await user.click(next)
    expect(
      screen.getByRole('heading', { name: /Round 2 of 13/ }),
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'View previous round' }),
    )
    expect(
      screen.getByRole('heading', { name: /Round 1 of 13/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Back to current round' }),
    ).toBeEnabled()
  })

  it('persists the game and offers to resume it', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Start game' }))
    await user.click(
      card('Player 1').getByRole('button', { name: /increase player 1 bid/i }),
    )
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"bids":[1,')
    unmount()

    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Resume' }))
    expect(
      card('Player 1').getByRole('group', { name: 'Player 1 bid' }),
    ).toHaveTextContent('1')
  })

  it('can start a new game instead of resuming', async () => {
    const user = userEvent.setup()
    let game = gameReducer(createGame(), { type: 'startGame' })
    game = gameReducer(game, { type: 'setBid', round: 0, player: 0, bid: 3 })
    saveGame(game)
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'New game' }))
    expect(
      screen.getByRole('button', { name: 'Start game' }),
    ).toBeInTheDocument()
  })

  it('shows the scoreboard and game over', async () => {
    const user = userEvent.setup()
    let game = gameReducer(createGame(), { type: 'startGame' })
    for (let r = 0; r < 13; r++) {
      for (let p = 0; p < 4; p++) {
        game = gameReducer(game, {
          type: 'setBid',
          round: r,
          player: p,
          bid: p === 0 ? 1 : 0,
        })
        game = gameReducer(game, {
          type: 'setTricks',
          round: r,
          player: p,
          tricks: p === 0 ? 1 : 0,
        })
      }
    }
    game = gameReducer(game, { type: 'goToRound', round: 12 })
    saveGame(game)
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Resume' }))
    await user.click(screen.getByRole('button', { name: 'Scoreboard' }))
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(15)
    await user.click(screen.getByRole('button', { name: 'Back to round' }))
    await user.click(screen.getByRole('button', { name: 'Finish game' }))
    expect(
      screen.getByRole('heading', { name: 'Game over' }),
    ).toBeInTheDocument()
    expect(screen.getByText('78')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play again' }))
    expect(
      screen.getByRole('button', { name: 'Start game' }),
    ).toBeInTheDocument()
  })
})
