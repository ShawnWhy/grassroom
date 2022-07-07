import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { LoopOnce, SphereGeometry, TextureLoader } from 'three'
import $ from "./Jquery"
import gsap from "gsap"
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GridBroadphase } from 'cannon'

let reticle= null
let camera;
let renderer;
const container = document.createElement('div');
document.body.appendChild(container);
const textureLoader = new THREE.TextureLoader()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)


function addReticleToScene(){

  const geometry = new THREE.RingBufferGeometry(0.15,0.2,32).rotateX(-Math.PI/2);
  const material = new THREE.MeshBasicMaterial();
  reticle = new THREE.Mesh(geometry, material);
  
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);
  }

camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);

let grassgeo1;
let grassgeo2



gltfLoader.load(
    '/grass.glb',
    (gltf) =>
    {
        let scene=gltf.scene
        console.log(scene)
        grassgeo1 = scene.children[0].geometry


    }
)

gltfLoader.load(
  '/grass2.glb',
  (gltf) =>
  {
    let scene=gltf.scene
    console.log(scene)
    grassgeo2 = scene.children[0].geometry

  }
)

controller.addEventListener('select', ()=>{
  

    createGrass()
  })

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

  
addReticleToScene()
  
const button = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"]
});

      document.body.appendChild(button);

      window.addEventListener('resize', onWindowResize, false);
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // we have to enable the renderer for webxr
const controller= renderer.xr.getController(0);
scene.add(controller)
container.appendChild(renderer.domElement);

/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight('white', .2)
 scene.add(ambientLight)
 
 const directionalLight = new THREE.DirectionalLight('orange', 1)
 directionalLight.castShadow = true
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.camera.left = - 7
 directionalLight.shadow.camera.top = 7
 directionalLight.shadow.camera.right = 7
 directionalLight.shadow.camera.bottom = - 7
 directionalLight.position.set(- 5, 5, 0)
 scene.add(directionalLight)


$(window).click(e=>{
    
  e.preventDefault();
  e.stopPropagation();
})

const grassMaterial = new THREE.MeshBasicMaterial({color:"green"})


const createGrass =()=>{
  

  let randGrass= Math.floor(Math.random()*2+1)
  console.log(randGrass)
  let grass


  


  switch(randGrass){
    case 1: tag= new THREE.Mesh(grassgeo1, grassMaterial)
      break;
      
    case 2: tag= new THREE.Mesh(grassgeo2, grassMaterial)
      
}
  grass.position.setFromMatrixPosition(reticle.matrix);
  grass.quaternion.setFromRotationMatrix(reticle.matrix);
  grass.scale.x=.2
  grass.scale.y=.2
  grass.scale.z=.2
  scene.add(grass)
}

init();
// animate();

function init() {
addReticleToScene()
  
const button = ARButton.createButton(renderer, {
  requiredFeatures: ["hit-test"]
});

      document.body.appendChild(button);

      window.addEventListener('resize', onWindowResize, false);
  }





  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
  }

let rotationPos = 0



let hitTestSource = null;
let localSpace = null;
let hitTestSourceInitialized = false;


async function initializeHitTestSource() {
  const session = renderer.xr.getSession();
  
  // Reference spaces express relationships between an origin and the world.

  // For hit testing, we use the "viewer" reference space,
  // which is based on the device's pose at the time of the hit test.
  const viewerSpace = await session.requestReferenceSpace("viewer");
  hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

  // We're going to use the reference space of "local" for drawing things.
  // which gives us stability in terms of the environment.
  // read more here: https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace
  localSpace = await session.requestReferenceSpace("local");

  // set this to true so we don't request another hit source for the rest of the session
  hitTestSourceInitialized = true;
  
  // In case we close the AR session by hitting the button "End AR"
  session.addEventListener("end", () => {
    hitTestSourceInitialized = false;
    hitTestSource = null;
  });
}
//add reticle to scene




// gltfLoader.load(
//   '/Saury.gltf',
//   (gltf) =>
//   {
      
 

//      nesse=gltf.scene
//      console.log(gltf)
//       // console.log(boy)
//       nesse.position.x+=10
//       // nesse.scale.set(0.25, 0.25, 0.25)
      
    

      

          

//       nesseGroup = new THREE.Group()
//       nesseGroup.add(nesse)
      


//       // Animation
//       mixer = new THREE.AnimationMixer(nesse)
//       swim = mixer.clipAction(gltf.animations[0]) 
//       console.log(swim)

//       swim.timeScale=2.5
      
      
//       scene.add(nesseGroup)
//       swim.play()
      

//   }
// )