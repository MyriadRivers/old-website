const shader3vert = `
// Automatically provided by three.js
//
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat3 normalMatrix;
// uniform vec3 cameraPosition;
// uniform bool isOrthographic;
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

// interpolate the normal and texture coordinates across the surface
varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;

void main() {
    vec3 tempPos = position;
    tempPos.z = sin(tempPos.x + u_time * 10.0);

    vec3 tempNorm = normalize(vec3(-cos(tempPos.x + u_time * 10.0), 0, 1));
    v_normal = mat3(normalMatrix) * tempNorm;
    v_texcoord = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( tempPos, 1.0 );
}
`

export default shader3vert