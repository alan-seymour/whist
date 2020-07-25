import styled from 'styled-components'

export const SideBar = styled.div`
  display: inline-flex;
  flex-direction: column;
  color: #000;
  flex-shrink: 0;
  z-index: 10;
  background: #fff;
`

export const Name = styled.div`
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  text-align: right;
  font-weight: bold;
  border-bottom: 3px solid #dee2e6;
  border-right: 3px solid #dee2e6;
`
export const AddPlayer = styled.button`
  background: #5c6bc0;
  color: #fff;
  border: none;
  margin: 10px 0;
  padding: 10px;
`
