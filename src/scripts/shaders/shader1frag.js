const shader1frag = `
// Automatically provided by three.js
//
// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;
// uniform bool isOrthographic;

varying vec3 v_normal;
varying vec2 v_texcoord;

uniform float u_time;

void main() {
    vec4 bg = vec4(0, 0, 0, 1.0);

    // z(n)
    vec2 z = vec2(2.0 * v_texcoord.x - 1.0, 2.0 * v_texcoord.y - 1.0);
    int max_iterations = 20;
    int current_iteration = 0;
    float max_radius = 2.0;

    for (int i = 0; i < 20; i++) {
        if (pow(z.x, 2.0) + pow(z.y, 2.0) > pow(max_radius, 2.0) || current_iteration >= max_iterations) {
            current_iteration = i;
            break;
        }
        // Calculate z(n + 1).x, derived from binomial theorem and complex number multiplication
        float x_temp = pow(z.x, 6.0) + 15.0 * pow(z.x, 2.0) * pow(z.y, 4.0) - 15.0 * pow(z.x, 4.0) * pow(z.y, 2.0) - pow(z.y, 6.0);
        // Calculate z(n + 1).y 
        // U_TIME IS USED HERE, MODIFY FOR SPEED CHANGE
        z.y = 6.0 * pow(z.x, 5.0) * z.y - 20.0 * pow(z.x, 3.0) * pow(z.y, 3.0) + 6.0 * z.x * pow(z.y, 5.0) + sin(float(u_time * 1.0)) / 2.0 + 0.5;
        z.x = x_temp;
        current_iteration++;
    }
    
    if (current_iteration == max_iterations) {
        // if remaining in julia set, set color to default bg
        gl_FragColor = bg;
    } else {
        // if outside of julia set, set color based on how many iterations it took to break out
        float color_ratio = float(current_iteration) / float(max_iterations);
        gl_FragColor = vec4(color_ratio, 0, 1.0 - color_ratio, 1.0) * color_ratio;
    }
}
`

export default shader1frag