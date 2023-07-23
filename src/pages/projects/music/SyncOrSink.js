import Image from "../../../components/Image"
import { Caption } from "../../../components/styles/Caption.styled"
import Subtitle from "../../../components/Subtitle"
import gameScreenshot from "../../../resources/images/sync_or_sink.png"
import splash from "../../../resources/sounds/splash.mp3"
import Audio from "../../../components/Audio"

const SyncOrSink = () => {
  return (
    <div>
      <Subtitle title={"SYNC OR SINK"} subtitle={"June 2017 - December 2019"} link={"https://amarantgames.itch.io/sync-or-sink-dreamhack-demo"} />
      <br />
      <Image url={gameScreenshot} alt={"Screenshot of gameplay."} width={"75%"} />
      <Caption>Screenshot of the rhythm game section.</Caption>
      <br />
      Sync or Sink is a rhythm game themed around synchronized swimming made by Jason Gao,
      Sean Choi, Alice Hayes, Angie Chen, and Catherine Sun, developed in Unity using C#.
      <br />
      <br />
      Soundtrack for the game was composed mostly by me, with two additional tracks by William Choi.
      <br />
      <br />
      Below is a sample of the title screen music.
      <br />
      <br />
      <Audio src={splash}></Audio>
    </div>
  )
}

export default SyncOrSink