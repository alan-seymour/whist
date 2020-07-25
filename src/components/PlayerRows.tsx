import React from 'react'
import { PlayerRow } from './PlayerRow'

interface Props {
  playerCount: number
  visibleRounds: number
}

export const PlayerRows = (props: Props) => {
  const playerRows = []
  for (let i = 0; i < props.playerCount; i++) {
    playerRows.push(<PlayerRow key={i} visibleRounds={props.visibleRounds} />)
  }
  return <>{playerRows}</>
}
