precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_position;

uniform vec4 u_color;

void main() {
  gl_FragColor = vec4(u_color);
}