import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const raycaster = new THREE.Raycaster();

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(4, 4, 4);

light.lookAt(0, 0, 0);
scene.add(light);

const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0xffffbb, 1);
scene.add(hemisphereLight);

const AmbientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(AmbientLight);

// floor
const plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({ color: 'gray' }));
plane.rotation.x = - Math.PI / 2;
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


camera.position.z = 20;
camera.position.y = 15;
camera.position.x = -15;

const house = new THREE.Group();
scene.add(house);

const floor = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 1), new THREE.MeshPhongMaterial({ color: 'red' }));
floor.position.set(0, 0.5, 0);
floor.rotation.x = - Math.PI / 2;
floor.castShadow = true;
floor.receiveShadow = true;
house.add(floor);


const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 1), new THREE.MeshPhongMaterial({ color: 'pink' }));
wallLeft.position.y = 10;
wallLeft.position.z = -10;
house.add(wallLeft);


const wallRight = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 1), new THREE.MeshPhongMaterial({ color: 'yellow' }));
wallRight.position.z = 10;
wallRight.position.y = 10;
house.add(wallRight);

const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(35, 20, 1), new THREE.MeshPhongMaterial({ color: 'blue' }));
roofLeft.position.z = -9;
roofLeft.rotation.x = Math.PI / 2.5;
roofLeft.position.y = 21;
house.add(roofLeft);


const roofRight = new THREE.Mesh(new THREE.BoxGeometry(35, 20, 1), new THREE.MeshPhongMaterial({ color: 'blue' }));
roofRight.position.z = 9;
roofRight.rotation.x = -Math.PI / 2.5;
roofRight.position.y = 21;
house.add(roofRight);

let object = null;
const pointer = new THREE.Vector2();
window.addEventListener('mousemove', () => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(house.children);

    if (object) {
        object.material.wireframe = false;
    }
    if (intersects.length > 0) {
        object = intersects[0].object;
        object.material.wireframe = true;
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
