import { StyledAudio } from "./styles/Audio.styled"

const Audio = ({src}) => {
  return (
    <StyledAudio>
        <audio controls src={src}></audio>
    </StyledAudio>
  )
}

export default Audio