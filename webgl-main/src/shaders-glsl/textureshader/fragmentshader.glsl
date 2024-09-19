precision mediump float;

//Used to sample the texture
uniform sampler2D u_texture;

//Texture Coordinates passed from vertex shader
varying vec2 v_texcoord;

void main() {

  gl_FragColor = texture2D(u_texture, v_texcoord);  
}