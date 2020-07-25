import styled from 'styled-components'

export const PlayerRoundStyled = styled.div`
  width: 100px;
  flex-shrink: 0;
  text-align: center;
  display: flex;
  border-right: 3px solid #dee2e6;
`
export const PlayerRaw = styled.div`
  flex: 1 0 50%;
  height: 50px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dee2e6;
  justify-content: center;
`

export const PlayerBid = styled.div`
  flex: 1 0 auto;
  border-bottom: 1px solid #dee2e6;
  align-items: center;
  display: flex;
  & > div {
    flex: 1 0 auto;
  }
`

export const PlayerGot = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  & > div {
    flex: 1 0 auto;
  }
`

export const PlayerTotal = styled.div`
  flex: 1 0 50%;
  display: flex;
  align-items: center;
  & > div {
    flex: 1 0 auto;
  }
`
export const UnstyledInput = styled.input`
  background-color: transparent;
  border-radius: 0px;
  border: none;
  display: block;
  padding: 0px;
  text-align: center;
  font: inherit;
  width: 100%;
`
