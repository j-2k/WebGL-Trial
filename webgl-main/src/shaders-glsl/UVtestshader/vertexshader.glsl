attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  //clip space was from -1 to 1 with only gl_Position = a_position; (a pos is vec4 previously)

  //apply/multiply the matrix to the position
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  //making the position from pixels to 0 to 1!
  vec2 uv01 = position/u_resolution;

  vec2 scaledUV02 = uv01 * 2.0;

  //shift the position from 0 to 2 to -1 to 1 back to clip space
  vec2 clipSpace = scaledUV02 - 1.0;

  //flip y to fit standard 2d graphics api coordinate system (0,0) at top left and was (0,0) at bottom left
  clipSpace *= vec2(1.0, -1.0);

  gl_Position = vec4(clipSpace, 0.0,1.0);
}