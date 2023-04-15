import { useFrame } from "@react-three/fiber"
import shader1frag from "../scripts/shaders/shader1frag"
import shader1vert from "../scripts/shaders/shader1vert"
import { useMemo, useRef } from 'react'

const FractalShader = () => {  
    const mesh = useRef();

    const uniforms = useMemo(
        () => ({
            u_time: {
                value: 0.0,
            },
        }), []
    );

    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    });

    return (
        <mesh ref={mesh} >
            <planeGeometry args={[7.5, 7.5, 7.5, 7.5]}/>
            <shaderMaterial 
                fragmentShader={shader1frag}
                vertexShader={shader1vert}
                uniforms={uniforms}
            />
        </mesh>
    )
}

export default FractalShader