import { StyledImage } from "./styles/Image.styled"

const Image = ({url, alt, width, height}) => {
  return (
    <StyledImage>
        <img src={url} alt={alt} width={width} height={height}/>
    </StyledImage>
  )
}

export default Image