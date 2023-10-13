import RayTracing from "../../../components/RayTracing"
import { Caption } from "../../../components/styles/Caption.styled"
import Subtitle from "../../../components/Subtitle"

const RayTracer = () => {
  return (
    <div>
      <Subtitle title={"RAY TRACER"} subtitle={"August - December 2021"} />
      <br />
      <RayTracing />
      <Caption>Live demo of the ray tracer implementation, showing colored spheres and lights.</Caption>
      <br />
      Distribution ray tracer implemented in TypeScript with objects illuminated based on the Phong Reflection Model.
      Super-sampling, anti-aliasing, and jitter make the final result look a little smoother.
    </div>
  )
}

export default RayTracer