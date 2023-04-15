import Image from "../../../components/Image"
import { Caption } from "../../../components/styles/Caption.styled"
import Subtitle from "../../../components/Subtitle"
import Video from "../../../components/Video"
import interfaceScreenshot from "../../../resources/images/auditory_interface.png"
import synchroGoodVideo from "../../../resources/videos/SynchroAudioInterface_Good.mov"

const AuditoryInterface = () => {
  return (
    <div>
        <Subtitle title={"AUDITORY UI FOR SYNCHRONIZED SWIMMING"} subtitle={"January - May 2021"}/>
        <br />
        <Image url={interfaceScreenshot} alt={"Screenshot of the auditory interface, showing different knobs and sliders for controlling sounds."}
        width={"75%"} />
        <Caption>Screenshot of simulator showing the controls, to be operated in a Wizard-of-Oz style experiment during user testing.</Caption>
        <br />
        Simulation of a hypothetical auditory interface to help synchronized swimmers practice figures and routines, implemented in Processing.
        The proposed interface is a set of in-ear monitors and biometric monitors to be worn by swimmers during practice, where audio cues based on body orientation will assist with positioning.
        <br />
        <br />
        <Video url={synchroGoodVideo} width={"55%"} />
        <Caption>Simulator demo for the 'Ariana' figure, performed with minimal mistakes. Source: Swim England YouTube</Caption>
        <br />
        Synchronized swimming figures require swimmers to position limbs at certain angles and extensions. 
        Here, the interface maps each of the four primary limbs plus the shoulders to a wave generator playing a specific frequency.
        <br />
        <br />
        The tones corresponding to the left limbs play only in the left ear, and vice versa for the right, with the shoulders playing in both.
        Compared to the shoulder tone, the arms are pitched higher and the legs are pitched lower for a natural mapping. 
        The tones playing all together form a euphonic major chord. 
        <br />
        <br />
        Limbs that are relevant to a figure have their wave generator unmuted. 
        Based on the difference between the current angle and extension of the limb compared to the target, the relevant tone
        will be mixed to more of a harsh saw wave when the angle difference is great, and a pleasing sine wave as the 
        current angle approaches the target. A larger difference in extensions is mapped to a lower volume for the tone.
        <br />
        <br />
        In this way, swimmers can understand which limbs they have to fix by paying attention to the volume and timbre of the waves played by the monitors.
        <br />
        <br />
        Additionally, height of the swimmer above the water is mapped to the pitch of the entire chord. 
        As the swimmer's height above the water decreases, so does the pitch, reminding swimmers to try and increase their height.
        <br />
        <br />
        The simulator provides a way to user-test the proposed interface using a Wizard-of-Oz type experiment: 
        A human operator will view swimmers practicing their figures and manually change the parameters corresponding to the limbs. 
        This produces sounds as if the in-ear monitors were responding automatically to the body, 
        allowing users to get the experience of the auditory interface without having to develop the specific hardware. 
    </div>
  )
}

export default AuditoryInterface