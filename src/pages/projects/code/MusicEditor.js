import musicEditorVideo from "../../../resources/videos/MusicEditor.mov"
import Subtitle from "../../../components/Subtitle"
import Video from "../../../components/Video"
import { Caption } from "../../../components/styles/Caption.styled"

const MusicEditor = () => {
    return (
      <div>
        <Subtitle title={"MUSIC EDITOR"} subtitle={"August - December 2022"} />
        <br />
        <Video url={musicEditorVideo} width={"75%"} />
        <Caption>Video showcasing basic functionality.</Caption>
        <br />
        A sheet music editing interface developed in Java using the Swing library. Functionality includes the ability to
        add notes and rests of varying duration, extra staffs, accidentals, monophonic playback of notes, and stroke recognition
        for the addition of symbols. 
        <br />
        <br />
        The stroke recognizer is based off the $1 Unistroke Recognizer, which is powerful in that it needs no machine learning or 
        training to work, instead looking at how closely a drawn stroke matches a set of predrawn template strokes. However, 
        this means it can be finnicky at times, as seen in the video when I have trouble getting it to recognize the "flat" stroke 
        gesture that I try to add on the last whole note. 
        <br />
        <br />
        The $1 Unistroke Recognizer was developed by Jacob O. Wobbrock, Andrew D. Wilson and Yang Li. 
        The publication can be found
        <a href="https://dl.acm.org/doi/10.1145/1294211.1294238"> here. </a>
        <br />
        <br />
        This $1 Recognizer was ported to Java with other modifications by Keith Edwards in 2019.
      </div>
    )
  }

export default MusicEditor