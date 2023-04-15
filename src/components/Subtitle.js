import { StyledSubtitle } from "./styles/Subtitle.styled"

const Subtitle = ({title, subtitle, link}) => {
  return (
    <StyledSubtitle>
        <div className={"title"}>{link == null ? <div>{title}</div> : <a href={link}>{title}</a>}</div>
        <div className={"subtitle"}>{subtitle}</div>
    </StyledSubtitle>
  )
}

export default Subtitle