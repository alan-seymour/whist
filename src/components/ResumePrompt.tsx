import { Prompt, PromptButton } from './ResumePrompt.styles'

interface Props {
  onResume: () => void
  onNewGame: () => void
}

export const ResumePrompt = ({ onResume, onNewGame }: Props) => (
  <Prompt role="dialog" aria-labelledby="resume-title">
    <h2 id="resume-title">Resume saved game?</h2>
    <p>There's a game in progress on this device.</p>
    <PromptButton type="button" onClick={onResume} autoFocus>
      Resume
    </PromptButton>
    <PromptButton type="button" onClick={onNewGame} $secondary>
      New game
    </PromptButton>
  </Prompt>
)
