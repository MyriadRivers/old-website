import Subtitle from "../../../components/Subtitle"
import voicemail from "../../../resources/sounds/voicemail.wav"
import Audio from "../../../components/Audio"

const Voicemail = () => {
  return (
    <div>
      <Subtitle title={"VOICEMAIL"} subtitle={"March 2022"} />
      <br />
      <Audio src={voicemail} />
      A short composition using edited samples taken from common phone sounds. 
      <br />
      <br />
      An ultrasonic sensor and a slide potentiometer were hooked up to an arduino, 
      which was then used to trigger the different samples on Ableton Live 11 using a custom Max For Live plugin.
      This allowed for a live, unscripted performance that resulted in a unique composition every time. 
      <br />
      <br />
      One such performance was recorded, of which this is an excerpt. 
    </div>
  )
}

export default Voicemail