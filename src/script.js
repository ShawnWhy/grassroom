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
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';


let treeButton
let grassButton


let reticle= null
let camera;
let renderer;
let animations = [];
const container = document.createElement('div');
document.body.appendChild(container);
const textureLoader = new THREE.TextureLoader()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const grassMaterial = new THREE.MeshStandardMaterial({color:"#66a832"})
const pinkMaterial = new THREE.MeshStandardMaterial({color:"#f757ed"})
const orangeMaterial = new THREE.MeshStandardMaterial({color:"#fa4f1b"})
const blueMaterial = new THREE.MeshStandardMaterial({color:"#2ef5ff"})
const redMaterial = new THREE.MeshStandardMaterial({color:"#a11a56"})
const yellowMaterial = new THREE.MeshStandardMaterial({color:"#edb021"})
const treeButtonTexture = textureLoader.load('/treetag2.png')
const grassButtonTexture = textureLoader.load('/grasstag.png')
// const grassButtonMaterial = new THREE.MeshBasicMaterial({map:grassButtonTexture})

// const threeButtonMaterial = new THREE.MeshBasicMaterial({map:treeButtonTexture})
const grassButtonMaterial = new THREE.MeshBasicMaterial({map:grassButtonTexture})



const treeButtonMaterial = new THREE.MeshBasicMaterial({map:treeButtonTexture})
const buttonGeo = new THREE.BoxGeometry(.1, .1, .1);
grassButtonMaterial.side = THREE.DoubleSide
treeButtonMaterial.side = THREE.DoubleSide

 treeButton = new THREE.Mesh(buttonGeo, treeButtonMaterial)
 grassButton = new THREE.Mesh(buttonGeo, grassButtonMaterial)
 grassButton.position.x+=.1
 treeButton.position.z -=.5
 grassButton.position.z-=.5
 grassButton.rotateY=Math.PI*.5
 treeButton.rotateY=Math.PI*.5


 scene.add(grassButton)
 scene.add(treeButton)








function init() {
  addReticleToScene()
    
  const button = ARButton.createButton(renderer, {
    requiredFeatures: ["hit-test"]
  });
  
        document.body.appendChild(button);
  
        window.addEventListener('resize', onWindowResize, false);
    }
  


    
    
   
  
    const createGrass =()=>{
  

      let randGrass= Math.floor(Math.random()*2+1)
  
      console.log(randGrass)
      let grass
    
      switch(randGrass){
        case 1: grass= new THREE.Mesh(grassgeo1, grassMaterial)
          break;
          
        case 2: grass= new THREE.Mesh(grassgeo2, grassMaterial)
          
    }
      grass.position.setFromMatrixPosition(reticle.matrix);
      grass.quaternion.setFromRotationMatrix(reticle.matrix);
      // grass.rotation.x += Math.PI*.5
      
      grass.scale.x=.1
      grass.scale.y=.1
      grass.scale.z=.1
      console.log(grass)
      console.log(reticle.matrix)
      scene.add(grass)
    }

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

let hitTestSource = null;
let localSpace = null;
let hitTestSourceInitialized = false;

renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // we have to enable the renderer for webxr
const controller= renderer.xr.getController(0);
scene.add(controller)
console.log(controller)


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
let grassgeo2;
let tree1;
let tree2;
let tree3;
let butterfly;
let flower;
let butterflyGroupArray = [];


controller.addEventListener('select', ()=>{
  let randButter= Math.floor(Math.random()*5+1)
  let randFlower= Math.floor(Math.random()*5+1)
  let randColor = Math.floor(Math.random()*5+1)

  
  console.log("creategrass2")
  if(reticle.visible){
  console.log("creategrass")
  
  createGrass(randColor)
  if(randButter==3){
  createFlower(randColor)
  }
  if(randFlower==2){
    createButterFly(randColor)
    }

  }
    })

gltfLoader.load(

  '/butterfly.glb',
  (gltf) =>
  {
    butterfly = gltf

    // createButterFly();

   

  }
)
gltfLoader.load(

  '/flower.glb',
  (gltf) =>
  {
    flower = gltf
    // createFlower(flower);
  }
)

gltfLoader.load(

  '/tree2.glb',
  (gltf) =>
  {
    tree2 = gltf.scene
  }
)
gltfLoader.load(

  '/tree3.glb',
  (gltf) =>
  {
    tree3 = gltf.scene
  }
)
gltfLoader.load(

  '/tree3.glb',
  (gltf) =>
  {
    tree3 = gltf.scene
  }
)


gltfLoader.load(
    '/grass.glb',
    (gltf) =>
    {
        let grassscene=gltf.scene
        console.log(grassscene)
        grassgeo1 = grassscene.children[0].geometry


    }
)

const createFlower = (color)=>{

  let newFlower = SkeletonUtils.clone(flower.scene)
  let pedals = newFlower.children[0].children[2].children[1]
  switch(color){
    case 1:
      pedals.material = blueMaterial
      break;

    case 2:
      pedals.material = pinkMaterial
        break;
    case 3:
      pedals.material = redMaterial
       break;
  case 4:
    pedals.material = orangeMaterial
       break;
   case 5:
    pedals.material = yellowMaterial
       break;
  }
  console.log(newFlower)
  newFlower.scale.set(.02,.02,.02)
  // newFlower.position.z-=1
  
    let mixer2 = new THREE.AnimationMixer(newFlower)
    let action2 = mixer2.clipAction(flower.animations[0])
    action2.clampWhenFinished = true;
    action2.timeScale=1.5
    action2.setLoop( THREE.LoopOnce )
    animations.push(mixer2)
    newFlower.position.setFromMatrixPosition(reticle.matrix);
    newFlower.quaternion.setFromRotationMatrix(reticle.matrix);
    newFlower.position.y+=.2

    scene.add(newFlower)

    setTimeout(() => {
      action2.play()

    }, 2000);

    
  }

  const createButterFly = function(color){

    console.log(butterfly)
   
      let newButterfly = SkeletonUtils.clone(butterfly.scene)
      
      let wings = newButterfly.children[0].children[2]
      switch(color){
        case 1:
          wings.material = blueMaterial
          break;

        case 2:
            wings.material = pinkMaterial
            break;
        case 3:
           wings.material = redMaterial
           break;
      case 4:
           wings.material = orangeMaterial
           break;
       case 5:
           wings.material = yellowMaterial
           break;
      }
      let butterflyGroup = new THREE.Group();
      butterflyGroup.add(newButterfly)
      butterflyGroup.position.setFromMatrixPosition(reticle.matrix);
      butterflyGroup.quaternion.setFromRotationMatrix(reticle.matrix);
      newButterfly.position.x-=1;
      newButterfly.position.y+=1;
      butterflyGroupArray.push(butterflyGroup)
      scene.add(butterflyGroup)
      
      const mixer = new THREE.AnimationMixer(newButterfly)
      let action = mixer.clipAction(butterfly.animations[0])
      action.timeScale=.5
      
      action.play()
      animations.push(mixer)

    }

const createTree = function(){

  console.log("singleset")
  const randtree = Math.random()+1
  const cupbow = new CANNON.Cylinder(.0310,.02,.026,8)
  const plateDrop = new CANNON.Cylinder(.06,.03,.01,8)

  const cupHandle = new CANNON.Cylinder(.02,.02,.002,8)
  // cupHandle.quaternion.setClearColor(new CANNON.Vec3())
  
  const cupbody = new CANNON.Body({mass:1})
  const platebody = new CANNON.Body({mass:1})
  cupbody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI *0.5)
  platebody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0),Math.PI *0.5)
  cupbody.position=new CANNON.Vec3(0, .1, -.5)
  platebody.position=new CANNON.Vec3(0, .08, -.5)





  cupbody.material=defaultMaterial;
  platebody.material=defaultMaterial
  cupbody.addShape(cupbow,new CANNON.Vec3(0,0,0))
  cupbody.addShape(cupHandle,new CANNON.Vec3(.115,0,0))
  platebody.addShape(plateDrop,new CANNON.Vec3(0,0,0))



  const singleFakeCup = new THREE.Group()
  // singleplateMesh.rotation.x =  Math.PI * 0.5
  const singleCup= singleGroup.children[1].clone()
  const newsingleplate= singleGroup.children[0].clone()
  newsingleplate.rotation.x =  Math.PI * 0.5
  newsingleplate.position.z+=.03

  singleCup.rotation.x +=  Math.PI * 0.5
  singleCup.position.z +=.02
  singleCup.position.y-=.14;
  singleFakeCup.add(singleCup)
  const plateMesh = new THREE.Group();
  plateMesh.add(newsingleplate)
  // console.log(singleGroup)
  cupbody.sleepSpeedLimit = 1.0;
  platebody.sleepSpeedLimit = 1.0;
  plateArray.push(plateMesh)
  
  
  plateMesh.scale.set(.2,.2,.2)
  singleFakeCup.scale.set(.2,.2,.2)
  singleFakeCup.position.set(0,0,-.5).applyMatrix4(controller.matrixWorld);
  plateMesh.position.set(0,-.02,-.5).applyMatrix4(controller.matrixWorld);
  platebody.position.copy(plateMesh.position)
  cupbody.position.copy(singleFakeCup.position)
  world.add(platebody)
  scene.add(plateMesh)
  world.addBody(cupbody)
  scene.add(singleFakeCup)
 
  container.appendChild(renderer.domElement);





  objectsToUpdate.push({singleFakeCup,cupbody,plateMesh,platebody})
  
}



gltfLoader.load(
  '/grass2.glb',
  (gltf) =>
  {
    let grassscene=gltf.scene
    console.log(grassscene)
    grassgeo2 = grassscene.children[0].geometry

  }
)


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

// controller.add(grassButton)
// controller.add(treeButton)


  




/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight('green', .2)
 scene.add(ambientLight)
 
 const directionalLight = new THREE.DirectionalLight('#ebdbb7', 1)
 directionalLight.castShadow = true
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.camera.left = - 7
 directionalLight.shadow.camera.top = 7
 directionalLight.shadow.camera.right = 7
 directionalLight.shadow.camera.bottom = - 7
 directionalLight.position.set(- 5, 5, 0)
 scene.add(directionalLight)






function animate() {
  renderer.setAnimationLoop(render);
}
let oldElapsedTime=null;

const clock = new THREE.Clock()
let previousTime = 0


// animate();




  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
  }




init();
animate();

function render(timestamp, frame) {
const elapsedTime = clock.getElapsedTime()
const deltaTime = elapsedTime - oldElapsedTime
oldElapsedTime = elapsedTime
 
if(butterflyGroupArray.length>0){

  for (let i=0; i<butterflyGroupArray.length; i++){butterflyGroupArray[i].rotation.y -=.01;
}
}
// if(mixer2)
// {
//     mixer2.update(deltaTime)
// }
// if(mixer)
// {
//     mixer.update(deltaTime)
// }
if(animations.length>0)

{
  
  animations.forEach(function(mixer){
      mixer.update(deltaTime)

  })

// for(var i=0; i>animations.length; i++){
//   animations[i].update(deltaTime)

}
  if(frame){
    
    if(!hitTestSourceInitialized){
      initializeHitTestSource();
    }
  }
  
  if(hitTestSourceInitialized){
    const hitTestResults = frame.getHitTestResults(hitTestSource);
    // console.log(hitTestResults)
    
    if(hitTestResults.length>0){
      const hit = hitTestResults[0]
      
      const pose = hit.getPose(localSpace)
      reticle.visible = true;
      reticle.matrix.fromArray(pose.transform.matrix)
    }
    else{
      reticle.visible=false
    }
  }
  
        renderer.render(scene, camera);

  

}


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