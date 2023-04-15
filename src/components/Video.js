import { StyledVideo } from "./styles/Video.styled"

const Video = ({url, width, height}) => {
  return (
    <StyledVideo>
        <video controls width={width} height={height}>
            <source src={url} />
        </video>
    </StyledVideo>
  )
}

export default Video