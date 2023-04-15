import shader2frag from "../scripts/shaders/shader2frag"
import shader2vert from "../scripts/shaders/shader2vert"
import { Color } from "three"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from 'react'
import brickTex from "../resources/images/brick_diffuse.jpg"

const HolesShader = () => {  
    const mesh = useRef();
    const bricks = useTexture(brickTex);

    const uniforms = useMemo(
        () => ({
            u_color: {
                value: new Color(0xeb7060),
            },
            u_colorTexture: {
                value: bricks,
            }, 
            u_ambient: {
                value: new Color(0xbbbbbb),
            },
            u_threshold: {
                value: 0.5,
            },
        }), [bricks]
    );

    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.u_threshold.value = Math.sin(clock.getElapsedTime());
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[7.5, 7.5, 7.5, 7.5]}/>
            <shaderMaterial 
                fragmentShader={shader2frag}
                vertexShader={shader2vert}
                uniforms={uniforms}
            />
        </mesh>
    )
}

export default HolesShader