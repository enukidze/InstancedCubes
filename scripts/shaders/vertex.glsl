// uniform vec2 uResolution;

// void main() {

//     vec3 newPosition = position;
//     vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;
//     gl_Position = projectedPosition;
// }

uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}