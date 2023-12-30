import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader();
const loader = new GLTFLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
dracoLoader.setDecoderConfig({type: 'js'});
loader.setDRACOLoader(dracoLoader);

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div');
document.body.appendChild(container);
container.classList.add('threejs');

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

/////////////////////////////////////////////////////////////////////////
///// RENDERER CREATION
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
}); // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding; // set color encoding
renderer.toneMapping = THREE.LinearToneMapping; // set the toneMapping
container.appendChild(renderer.domElement); // append the renderer to container div element

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);
camera.position.set(20, 69, 100);

/////////////////////////////////////////////////////////////////////////
///// CREATING LIGHT
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 50, 0);
// const light2 = new THREE.PointLight(0xffffff, 1);
// light2.position.set(0, 0, 0);
const light3 = new THREE.PointLight(0x00ff00, 0.1);
light3.position.set(20, 10, 100);
const rectLight = new THREE.RectAreaLight(0x87ceeb, 5, 100, 100);
rectLight.position.set(0, 100, 0);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);
scene.add(light);
// scene.add(light2);
scene.add(light3);

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2.2, 0);
controls.autoRotate = true;
controls.enableDamping = true;

/////////////////////////////////////////////////////////////////////////
///// LOADING THE TEXTURE FOR THE ENVIRONMENT
new RGBELoader().load('../assets/envmap.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load(document.getElementById("modelLink").value, function (gltf) {
  scene.add(gltf.scene);
});

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION
function rendeLoop() {
  controls.update(); // update orbit controls
  renderer.render(scene, camera); //render the scene without the composer
  requestAnimationFrame(rendeLoop); //loop the render function
}

rendeLoop(); //start rendering

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
