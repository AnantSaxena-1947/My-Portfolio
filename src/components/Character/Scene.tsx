import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import { armTracking } from "../utils/GsapScroll";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let leftArm: THREE.Object3D | null = null;
      let rightArm: THREE.Object3D | null = null;
      let leftForeArm: THREE.Object3D | null = null;
      let rightForeArm: THREE.Object3D | null = null;
      let mouseGroup: THREE.Group | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          mouseGroup = new THREE.Group();
          mouseGroup.add(character);
          setChar(character);
          scene.add(mouseGroup);
          headBone = character.getObjectByName("Head") || character.getObjectByName("Neck") || character.getObjectByName("spine006") || null;
          leftArm = character.getObjectByName("LeftArm") || null;
          rightArm = character.getObjectByName("RightArm") || null;
          leftForeArm = character.getObjectByName("LeftForeArm") || null;
          rightForeArm = character.getObjectByName("RightForeArm") || null;
          
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }

        if (armTracking.progress > 0.01) {
          const p = armTracking.progress;
          // Apply crossed arms overrides dynamically from calibrator
          const o = {
            LA_x: -1.09, LA_y: 0.71, LA_z: 1.56,
            RA_x: -1.34, RA_y: -0.59, RA_z: -1.69,
            LF_x: -0.34, LF_y: -0.04, LF_z: 1.5,
            RF_x: 0.21, RF_y: 0.06, RF_z: -1.49
          };
          if (leftArm) {
             leftArm.rotation.x += o.LA_x * p;
             leftArm.rotation.y += o.LA_y * p;
             leftArm.rotation.z += o.LA_z * p;
          }
          if (rightArm) {
             rightArm.rotation.x += o.RA_x * p;
             rightArm.rotation.y += o.RA_y * p;
             rightArm.rotation.z += o.RA_z * p;
          }
          if (leftForeArm) {
             leftForeArm.rotation.x += o.LF_x * p;
             leftForeArm.rotation.y += o.LF_y * p;
             leftForeArm.rotation.z += o.LF_z * p;
          }
          if (rightForeArm) {
             rightForeArm.rotation.x += o.RF_x * p;
             rightForeArm.rotation.y += o.RF_y * p;
             rightForeArm.rotation.z += o.RF_z * p;
          }
        }

        if (mouseGroup) {
          if (window.scrollY < 200) {
            mouseGroup.rotation.y = THREE.MathUtils.lerp(mouseGroup.rotation.y, mouse.x * 0.6, interpolation.y);
            mouseGroup.rotation.x = THREE.MathUtils.lerp(mouseGroup.rotation.x, -mouse.y * 0.3, interpolation.x);
          } else {
            mouseGroup.rotation.y = THREE.MathUtils.lerp(mouseGroup.rotation.y, 0, interpolation.y);
            mouseGroup.rotation.x = THREE.MathUtils.lerp(mouseGroup.rotation.x, 0, interpolation.x);
          }
        }

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
        }
        if (screenLight) {
          light.setPointLight(screenLight);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
