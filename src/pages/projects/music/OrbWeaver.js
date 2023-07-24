import Subtitle from "../../../components/Subtitle"
import orbweaver from "../../../resources/images/orb_weaver.png"
import Image from "../../../components/Image"

const OrbWeaver = () => {
  return (
    <div>
      <Subtitle title={"ORB WEAVER"} subtitle={"April 2023"} link={"https://myriadrivers.github.io/orb-weaver/"} />
      <br />
      <Image url={orbweaver} alt={"Screenshot of gameplay."} width={"50%"} />
      Generative musical spider web inspired by the family Araneidae, developed in TypeScript and React.js.
      <br />
      <br />
      Constructs an orb web following the same thread spinning sequence as actual orb weaver spiders, with different points on the web controlling the parameters of the sounds produced.
    </div>
  )
}

export default OrbWeaver