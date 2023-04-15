import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { CanvasContainer } from "../../../components/containers/CanvasContainer"

import FractalShader from "../../../components/FractalShader"
import HolesShader from "../../../components/HolesShader"
import RippleShader from "../../../components/RippleShader"
import { Caption } from "../../../components/styles/Caption.styled"
import Subtitle from "../../../components/Subtitle"

const Shaders = () => {
  return (
    <div>
      <Subtitle title={"SHADERS"} subtitle={"August - December 2021"} />
      <br />
      A set of shaders implemented in GLSL and displayed with the Three.js JavaScript graphics library. 
      Drag around and zoom with your mouse to view them!
      <br />
      <br />
      <CanvasContainer >
        <Canvas camera={{position: [0, 0, 10]}}>
          <FractalShader />
          <OrbitControls />
        </Canvas>
      </CanvasContainer >
      <Caption>
        <br />
        Radial Julia set fractal.
      </Caption>
      <br />
      Fragment shader that displays a radial rendition of the Julia set fractal.
      <br />
      <br />
      <br />
      <CanvasContainer >
        <Canvas camera={{position: [0, 0, 10]}}>
          <HolesShader />
          <OrbitControls />
        </Canvas>
      </CanvasContainer >
      <Caption>
        <br />
        Holes in a brick wall. 
      </Caption>
      <br />
      Fragment shader that displays a set of shrinking and expanding holes in a brick texture. 
      <br />
      <br />
      <br />
      <CanvasContainer >
        <Canvas camera={{position: [0, 0, 20]}}>
          <RippleShader />
          <OrbitControls />
        </Canvas>
      </CanvasContainer>
      <Caption>
        <br />
        Wave effect.
      </Caption>
      <br />
      Fragment and vertex shader that render a rippling wave animation through a water texture.
    </div>
  )
}

export default Shaders