import styled from 'styled-components'

export const CardRow = styled.div`
  display: flex;
  height: 50px;
  width: auto;
  background: #5c6bc0;
  color: #fff;
`

export const CardCount = styled.div`
  width: 100px;
  flex-shrink: 0;
  line-height: 50px;
  text-align: center;
  border-right: 3px solid #fff;
  font-weight: bold;
  &:last-child {
    border-right: none;
    padding-right: 3px;
  }
`
