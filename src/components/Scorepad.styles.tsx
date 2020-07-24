import styled from 'styled-components'

export const PadGrid = styled.div<{ playerCount: number }>`
  display: grid;
  grid-template-columns: ${props =>
    `40px repeat( ${props.playerCount * 3}, 30px)`};
  grid-template-rows: 40px repeat(26, 30px) 40px;
`

export const RoundNumber = styled.div<{ roundNumber: number }>`
  grid-column: '1 / span 1';
  grid-row: ${props => `${props.roundNumber * 2 + 2} / span 2`};
  line-height: '40px';
  font-weight: bold;
  line-height: 60px;
  text-align: center;
  border: 1px solid #000;
  border-left: none;
`
