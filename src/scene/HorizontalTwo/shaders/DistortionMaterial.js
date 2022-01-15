import { ShaderMaterial, Vector2, GLSL3 } from "three";
import { extend } from "@react-three/fiber";

class DistortionMaterial extends ShaderMaterial {
  constructor() {
    super({
      glslVersion: GLSL3,
      uniforms: {
        effectFactor: { type: "f", value: 0 },
        scrollFactor: { type: "f", value: 0 },
        mousePosition: { type: "v2", value: new Vector2(0, 0) },
        direction: { type: "v2", value: new Vector2(0, 0) },
        imageTexture: { type: "t", value: undefined },
        displacementTexture: { type: "t", value: undefined },
        displacementIntensity: { type: "f", value: 5.0 },
        distortionIntensity: { type: "f", value: 0.05 },
        scrollIntensity: { type: "f", value: 0.002 },
      },
      vertexShader: /* glsl */ `
        uniform vec2 mousePosition;
        uniform float effectFactor;
        uniform float displacementIntensity;
        varying vec2 vUv;
        varying float distanceFactor;

        void main() {
          vUv = uv;

          distanceFactor = pow(cos(distance(mousePosition, uv) * 3.14159265) / 2.0 + 0.5, 10.0);
          distanceFactor = distanceFactor * effectFactor;

          vec3 pos = position;
          pos.z = pos.z + (distanceFactor * displacementIntensity);

          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.0 );
        
        }`,
      fragmentShader: /* glsl */ `
        
        uniform float effectFactor;
        uniform float scrollFactor;
        uniform vec2 mousePosition;
        uniform vec2 direction;
        uniform sampler2D imageTexture;
        uniform float distortionIntensity;
        uniform float scrollIntensity;

        varying vec2 vUv;
        varying float distanceFactor;
        out vec4 fragColor;

        void main() {
          // get uv from the vertex shaders
          vec2 uv = vUv;

          // calculate distortion
          float distortion = distanceFactor * distortionIntensity;
          
          // claculate uv's from displacement and direction
          vec2 uvR = uv + (distortion * direction);
          vec2 uvG = uv;
          vec2 uvB = uv - (distortion * direction);
          // add scroll offset to uvs
          uvR.y = uvR.y + (scrollFactor * scrollIntensity);
          uvB.y = uvB.y - (scrollFactor * scrollIntensity);

          // get prev and current image based on indicies
          float imageR = texture2D(imageTexture, uvR).r;
          float imageG = texture2D(imageTexture, uvG).g;
          float imageB = texture2D(imageTexture, uvB).b;

          // mix prev and current image based on effectFactor
          vec4 finalTexture = vec4(imageR, imageG, imageB, 1.0);
          // apply noise to final texture
          fragColor = finalTexture;
        }`,
    });
  }

  get effectFactor() {
    return this.uniforms.effectFactor.value;
  }
  set effectFactor(v) {
    this.uniforms.effectFactor.value = v;
  }
  get scrollFactor() {
    return this.uniforms.scrollFactor.value;
  }
  set scrollFactor(v) {
    this.uniforms.scrollFactor.value = v;
  }
  get mousePosition() {
    return this.uniforms.mousePosition.value;
  }
  set mousePosition(v) {
    this.uniforms.mousePosition.value = v;
  }
  get direction() {
    return this.uniforms.direction.value;
  }
  set direction(v) {
    this.uniforms.direction.value = v;
  }
  get imageTexture() {
    return this.uniforms.imageTexture.value;
  }
  set imageTexture(v) {
    this.uniforms.imageTexture.value = v;
  }
  get displacementTexture() {
    return this.uniforms.displacementTexture.value;
  }
  set displacementTexture(v) {
    this.uniforms.displacementTexture.value = v;
  }
  get displacementIntensity() {
    return this.uniforms.displacementIntensity.value;
  }
  set displacementIntensity(v) {
    this.uniforms.displacementIntensity.value = v;
  }
  get distortionIntensity() {
    return this.uniforms.distortionIntensity.value;
  }
  set distortionIntensity(v) {
    this.uniforms.distortionIntensity.value = v;
  }
  get scrollIntensity() {
    return this.uniforms.scrollIntensity.value;
  }
  set scrollIntensity(v) {
    this.uniforms.scrollIntensity.value = v;
  }
}

// register element in r3f
extend({ DistortionMaterial });
