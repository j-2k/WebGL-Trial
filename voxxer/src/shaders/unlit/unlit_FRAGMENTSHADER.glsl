#version 300 es
precision mediump float;

// Uniforms
uniform vec4 u_color;  // The color uniform

// Output fragment color
out vec4 outColor;

void main() {
    // Set the output color to the uniform color
    outColor = u_color;
}
