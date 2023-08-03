uniform float u_time;
uniform float u_progress;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform vec2 u_accel;
uniform vec2 u_pixels;
uniform vec2 u_uvRate1;

varying vec2 vUv;
varying vec2 vUv1;
varying vec4 vPosition;

vec2 mirrored(vec2 v) {
    vec2 m = mod(v,2.);
    return mix(m,2. - m, step(1.0 ,m));
}

float tri(float p) {
    return mix(p, 1.0 - p, step(0.5, p)) * 2.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_pixels.xy;

    float p = fract(u_progress);
    
    float delayValue = p*7.0 - uv.y*2.0 + uv.x - 2.0;
    delayValue = clamp(delayValue, 0.0, 1.0);

    vec2 translateValue = p + delayValue * u_accel;
    vec2 translateValue1 = vec2(-0.5, 1.0) * translateValue;
    vec2 translateValue2 = vec2(-0.5, 1.0) * (translateValue - 1.0 - u_accel);

    vec2 w = sin(sin(u_time) * vec2(0.0, 0.3) + vUv.yx * vec2(0.0, 4.0)) * vec2(0.0, 0.5);
    vec2 xy = w * (tri(p) * 0.5 + tri(delayValue) * 0.5);

    vec2 uv1 = vUv1 + translateValue1 + xy;
    vec2 uv2 = vUv1 + translateValue2 + xy;

    vec4 rgba1 = texture2D(u_texture1, mirrored(uv1));
    vec4 rgba2 = texture2D(u_texture2, mirrored(uv2));

    // gl_FragColor = vec4(color, 1.0);
gl_FragColor = mix(rgba1, rgba2, delayValue);
}