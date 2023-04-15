import { YouTubeContainer } from "../../../components/containers/YouTubeContainer"
import Subtitle from "../../../components/Subtitle"

const VocaloidSimulation = () => {
  return (
    <div>
      <Subtitle title={"VOCALOID SIMULATION"} subtitle={"December 2022"}/>
      <br />
      <YouTubeContainer>
        <iframe src="https://www.youtube.com/embed/K_vPjv7AYiw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </YouTubeContainer>
      <br />
      Demonstration of a concatenative synthesis engine developed using Max MSP, where lyrics an a MIDI 
      melody can be input and transformed into a relatively realistic singing voice. Technology was made to 
      mimic Yamaha's commerical Vocaloid software, which uses the same fundamental principles. 
      <br />
      <br />
      Voice phoneme samples provided by Shimiao Liu and Max patch developed by me. 
    </div>
  )
}

export default VocaloidSimulation