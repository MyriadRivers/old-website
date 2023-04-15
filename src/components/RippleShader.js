import shader3frag from "../scripts/shaders/shader3frag"
import shader3vert from "../scripts/shaders/shader3vert"
import { Color } from "three"
import { useTexture } from "@react-three/drei"
import { useMemo, useRef } from 'react'
import { useFrame } from "@react-three/fiber"
import waterTex from "../resources/images/water.jpg"

const RippleShader = () => {
    const mesh = useRef();
    const water = useTexture(waterTex);
    
    const uniforms = useMemo(
        () => ({
            u_color: {
                value: new Color(0x84e4f5),
            },
            u_colorTexture: {
                value: water,
            }, 
            u_ambient: {
                value: new Color(0x999999),
            },
            u_time: {
                value: 0.0,
            },
        }), [water]
    );

    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[15, 15, 15, 15]}/>
            <shaderMaterial 
                fragmentShader={shader3frag}
                vertexShader={shader3vert}
                uniforms={uniforms}
            />
        </mesh>
    )
}

export default RippleShader