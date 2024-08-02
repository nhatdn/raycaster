import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const raycaster = new THREE.Raycaster();

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(4, 4, 4);

light.lookAt(0, 0, 0);
scene.add(light);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0xffffbb, 30);
scene.add(hemisphereLight);

const AmbientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(AmbientLight);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({ color: 'gray' }));
plane.rotation.x = - Math.PI / 2;
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

loader.load('./home.glb', function (gltf) {
    const model = gltf.scene;
    window.model = model;
    for(let i = 0; i < model.children.length; i++) {
        model.children[i].castShadow = true;
        model.children[i].receiveShadow = true;
        model.children[i].name = i.toString();
        if(model.children[i].isMesh) {
            model.children[i].material = model.children[i].material.clone();
        }
    }
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 20;
camera.position.y = 15;
camera.position.x = -15;
window.scene = scene;

let mouse = new THREE.Vector2();
let selectedObject = null;
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 0.5;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 0.5;

    raycaster.setFromCamera(mouse, camera);

    if (window.model) {
        const intersects = raycaster.intersectObjects(window.model.children);
        if (intersects.length > 0) {
            console.log(selectedObject)

            selectedObject = intersects[0].object;
        }
    }
}

window.addEventListener('mousemove', onMouseClick);

window.addEventListener('click', (event) => {
    console.log(selectedObject);
    if (selectedObject) {
        window.clicked = selectedObject; 
        console.log(selectedObject);
        selectedObject.material.wireframe = !selectedObject.material.wireframe;
    }
})

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
