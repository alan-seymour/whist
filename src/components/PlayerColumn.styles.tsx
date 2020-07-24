import styled from 'styled-components'

export const PlayerName = styled.div<{ playerIndex: number }>`
  grid-column: ${props => `${props.playerIndex * 3 + 2} / span 3`};
  grid-row: 1 / span 1;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  border: 1px solid #000;
`
export const PlayerTotal = styled.div<{ playerIndex: number }>`
  grid-column: ${props => `${props.playerIndex * 3 + 2} / span 3`};
  grid-row: 28 / span 1;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  border: 1px solid #000;
`
