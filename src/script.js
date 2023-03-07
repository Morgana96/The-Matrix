import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {CSS2DRenderer,CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

let crab
let ground
let pig
let bird
let koala
let girl
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const raycaster = new THREE.Raycaster();

//loadingmanager
const progressBar = document.querySelector('#progress-bar')
const progressContainer = document.querySelector('.progress-container')
const button = document.querySelector('.button')
const label = document.querySelector('label')

const loadingManager = new THREE.LoadingManager()
loadingManager.onProgress = function(url,loaded,total){
   progressBar.value = (loaded / total) * 100
}

loadingManager.onLoad = function(){
    progressBar.style.display = 'none'
    button.style.display = 'block'
    label.innerText = ''
    button.addEventListener('click',function(){
        progressContainer.style.display = 'none'

        const listener = new THREE.AudioListener();
        camera.add( listener );
    // create a global audio source
        const sound = new THREE.Audio( listener );
    // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'music/music.wav', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.1 );
        sound.autoplay = true
        sound.play();
        console.log(sound);
    
    });
})
}

/**
 * Models
 */

//Texture Loader
const textureLoader = new THREE.TextureLoader()
//Draco Loader
const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath('/draco/')
//GLTF Loader
const gltfLoader = new GLTFLoader(loadingManager)

gltfLoader.setDRACOLoader(dracoLoader)


let mixer = null

//load models
gltfLoader.load(
    '/model/ground/scene2.gltf',
    (gltf) =>
    {   
        ground = gltf.scene
        ground.name = 'ground'
        console.log('loaded');
        ground.scale.set(1, 1, 1)
        ground.castShadow = true
        ground.receiveShadow = true
        ground.traverse(function(node){
            node.receiveShadow = true    
        })
        scene.add(ground)
       
    })

    //crab
    gltfLoader.load(
        '/model/crab/crab.gltf',
        (gltf) =>
        {   
            // a crab is eating an icecream
            crab = gltf.scene;
            crab.name = 'crab'
            console.log('loaded');
            crab.scale.set(3, 3, 3);
            crab.castShadow = true;
            crab.traverse(function(node){
                node.castShadow = true   
                node.receiveShadow = true  
            })
            scene.add(crab)
        })

    //pig
    gltfLoader.load(
        '/model/pig/pig.gltf',
        (gltf) =>
        {   
            // a pig is reading a book
            pig = gltf.scene;
            pig.name = 'pig'
            console.log('loaded');
            pig.scale.set(3, 3, 3);
            pig.position.set(10,0,-2)
            pig.castShadow = true;
            pig.traverse(function(node){
                node.castShadow = true  
                node.receiveShadow = true   
            })
            scene.add(pig)
        })

    //bird
    gltfLoader.load(
        '/model/bird/bird.gltf',
        (gltf) =>
        {   
            // a crab is eating an icecream
            bird = gltf.scene;
            bird.name = 'bird';
            console.log('loaded');
            bird.scale.set(3, 3, 3);
            bird.position.set(-6,4,8)
            bird.castShadow = true;
            bird.traverse(function(node){
                node.castShadow = true 
                node.receiveShadow = true 
            })
            scene.add(bird)
        })
    //koala
    gltfLoader.load(
        '/model/Koala/koala.gltf',
        (gltf) =>
        {   
            // a crab is eating an icecream
            koala = gltf.scene;
            koala.name = 'koala'
            console.log('loaded');
            koala.scale.set(3, 3, 3);
            koala.position.set(-7,0,9)
            koala.castShadow = true;
            koala.traverse(function(node){
                node.castShadow = true 
                node.receiveShadow = true 
            })
            scene.add(koala)
        })
    //girl
    gltfLoader.load(
        '/model/girl/girl.gltf',
        (gltf) =>
        {   
            // a crab is eating an icecream
            girl = gltf.scene;
            girl.name = 'girl'
            console.log('loaded');
            girl.scale.set(3, 3, 3);
            girl.position.set(-3,0,13)
            girl.castShadow = true;
            girl.traverse(function(node){
                node.castShadow = true 
                node.receiveShadow = true 
            })
            scene.add(girl)
        })
//sky
let skySphere
function createSkySphere(file) {
    const geometry = new THREE.SphereGeometry(30, 30, 20);
    // Invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);
  
    const texture = new THREE.TextureLoader().load(file);
    texture.encoding = THREE.sRGBEncoding;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    skySphere = new THREE.Mesh(geometry, material);
    skySphere.name = 'skysphere'; 
    scene.add(skySphere);
  }
  createSkySphere("model/sky.jfif");


  
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(-10, 20, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//resize
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
    cssRenderer.setSize(sizes.width, sizes.height)

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 6, 15)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.min = -10
controls.maxDistance = 30
controls.maxPolarAngle = Math.PI*4/9
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(sizes.width, sizes.height)
cssRenderer.domElement.style.position = 'absolute'
cssRenderer.domElement.style.top = '0px'
cssRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(cssRenderer.domElement);
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    cssRenderer.render(scene, camera)
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


const p = document.createElement('p')

const divContainer = new CSS2DObject(p)
scene.add(divContainer)

//Raycaster
window.addEventListener('mousemove', onMouseOver);

function onMouseOver(event) {
  // 将鼠标位置转换为 three.js 坐标系下的位置
  const mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // 根据鼠标位置和相机等参数计算出射线
  raycaster.setFromCamera(mouse, camera);

  // 检测射线与模型之间的交互
  const intersects = raycaster.intersectObjects(scene.children, true);

  // 处理交互结果
  if (intersects.length > 2) {
    switch(intersects[0].object.parent.name){
        case 'pig': 
            p.textContent = 'A pig is reading a book'
            p.className = 'tip show';
            divContainer.position.set(mouse.x, 2, mouse.y)
            console.log( divContainer.position);
            break;
        case 'crab':
            p.textContent = 'A crab is eating an icecream'
            p.className = 'tip show';
            break;
        case 'koala':
            p.textContent = 'A koala is listening to music with headphones '
            p.className = 'tip show';
            break;
        case 'girl':
            p.textContent = 'A girl is sitting on the floor'
            p.className = 'tip show';
            break;   
        case 'bird':
            p.textContent = 'A bird is flying'
            p.className = 'tip show';
            break;   
        default:
            break;
    }
  } else {
    p.className = 'tip hide';
  }
}

