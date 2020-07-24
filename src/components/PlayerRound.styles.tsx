import styled from 'styled-components'

export const BidBox = styled.div<{ playerIndex: number; roundNumber: number }>`
  grid-column: ${props => `${props.playerIndex * 3 + 2} / span 1`};
  grid-row: ${props => `${props.roundNumber * 2 + 2} / span 1`};
  line-height: 30px;
  text-align: center;
  border: 1px solid #000;
`

export const GotBox = styled.div<{ playerIndex: number; roundNumber: number }>`
  grid-column: ${props => `${props.playerIndex * 3 + 2} / span 1`};
  grid-row: ${props => `${props.roundNumber * 2 + 3} / span 1`};
  line-height: 30px;
  text-align: center;
  border: 1px solid #000;
`

export const ScoreBox = styled.div<{
  playerIndex: number
  roundNumber: number
}>`
  grid-column: ${props => `${props.playerIndex * 3 + 3} / span 2`};
  grid-row: ${props => `${props.roundNumber * 2 + 2} / span 2`};
  line-height: 60px;
  text-align: center;
  border: 1px solid #000;
  font-size: 20px;
`
