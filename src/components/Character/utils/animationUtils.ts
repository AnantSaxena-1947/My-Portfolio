import * as THREE from "three";
import { GLTF } from "three-stdlib";

const setAnimations = (gltf: GLTF) => {
  let character = gltf.scene;
  let mixer = new THREE.AnimationMixer(character);
  
  if (gltf.animations && gltf.animations.length > 0) {
    const clip = gltf.animations[0];
    const action = mixer.clipAction(clip);
    action.play();
  }

  function startIntro() {}

  function hover(gltf: GLTF, hoverDiv: HTMLDivElement) {
    return () => {};
  }
  return { mixer, startIntro, hover };
};

export default setAnimations;
