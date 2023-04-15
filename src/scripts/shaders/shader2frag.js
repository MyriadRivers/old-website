const shader2frag = `
// Automatically provided by three.js
//
// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;
// uniform bool isOrthographic;

varying vec3 v_normal;
varying vec2 v_texcoord;

uniform vec3 u_color;
uniform sampler2D u_colorTexture;
uniform vec3 u_ambient;
uniform float u_threshold;

void main() {
    // make up a light vector and use it for diffuse lighting
    vec3 light = vec3( 0.5, 0.2, 1.0 );
    light = normalize( light );

    // dot product of light and surface normal
    float dProd = max(0.0,dot( v_normal, light ));

    // calculate a gray scaling value from the texture, using the typical brightness formula of rgb
    vec4 tcolor = texture2D( u_colorTexture, v_texcoord );
    vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

    // calculate the diffuse color by multiplying the surface color by the dot product
    vec4 diffuse = vec4( u_color, 1.0 ) * dProd;
    vec4 ambient = vec4( u_ambient, 1.0 );

    int holeCount = 10;
    float stepSize = 1.0 / float(holeCount);
    float holeRadius = u_threshold * stepSize / 2.0;
    for (int i = 0; i < 10; i++) {
        for (int j = 0; j < 10; j++) {
            // hole positions
            vec2 holePos = vec2(float(i) / float(holeCount) + stepSize / 2.0, float(j) / float(holeCount) + stepSize / 2.0);
            // Check if vertex is within the hole
            if (pow(v_texcoord.x - holePos.x, 2.0) + pow(v_texcoord.y - holePos.y, 2.0) <= pow(holeRadius, 2.0)) {
                discard;
            }
        }        
    }

    // final color is diffuse + ambient * the gray scale of the texture
    gl_FragColor = gray * (diffuse + ambient);
}
`

export default shader2frag