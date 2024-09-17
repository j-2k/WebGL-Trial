precision mediump float;

uniform vec2 u_resolution;

uniform vec4 u_color;

//passed from vertex shader
varying vec4 v_color;

void main() {
  //gl_FragColor = vec4(gl_FragCoord.xy/u_resolution.xy,0,1); UV

  gl_FragColor = v_color;
}