import styled from 'styled-components'

export const Prompt = styled.div`
  max-width: 320px;
  margin: 20vh auto 0;
  padding: 20px;
  text-align: center;
`

export const PromptButton = styled.button<{ $secondary?: boolean }>`
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 2px solid #5c6bc0;
  background: ${p => (p.$secondary ? '#fff' : '#5c6bc0')};
  color: ${p => (p.$secondary ? '#5c6bc0' : '#fff')};
  font: inherit;
  font-weight: bold;
  cursor: pointer;
`
