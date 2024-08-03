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

// floor
const plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({ color: 'gray' }));
plane.rotation.x = - Math.PI / 2;
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

// group house will save all mesh in home.glb
const house = new THREE.Group();
scene.add(house);

loader.load('./home.glb', function (gltf) {
    const model = gltf.scene;
    window.model = model;
    for (let i = 0; i < model.children.length; i++) {
        model.children[i].castShadow = true;
        model.children[i].receiveShadow = true;
        model.children[i].name = i.toString();
        if (model.children[i].isMesh) {
            model.children[i].material = model.children[i].material.clone();
            house.add(model.children[i].clone());
        } else {
            // if it's not mesh, it will be added to scene
            scene.add(model.children[i]);
        }
    }
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 20;
camera.position.y = 15;
camera.position.x = -15;

let object = null;

let mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 0.5;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 0.5;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(house.children);
    if (object) {
        object.material.wireframe = false;
    }
    if (intersects.length > 0) {
        object = intersects[0].object;
        object.material.wireframe = true;
    }
}

window.addEventListener('mousemove', onMouseClick);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
