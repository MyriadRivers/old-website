import { YouTubeContainer } from "../../../components/containers/YouTubeContainer"
import Subtitle from "../../../components/Subtitle"

const NyanCatRemix = () => {
  return (
    <div>
      <Subtitle title={"NYAN CAT - REMIX"} subtitle={"February 2021"} />
      <br />
      <YouTubeContainer>
        <iframe src="https://www.youtube.com/embed/ENX0IeDVcl8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </YouTubeContainer>
      <br />
      Arrangement of a popular internet <a href="https://www.youtube.com/watch?v=QH2-TGUlwu4"> video </a> 
      and meme that originated in 2011 on YouTube, which paired an animation of a cat with a short loop
      composed by Japanese producer <a href="https://www.youtube.com/watch?v=QH2-TGUlwu4"> daniwell </a>.
      
    </div>
  )
}

export default NyanCatRemix