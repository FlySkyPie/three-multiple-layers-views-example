import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import './style.css';

let stats: any;

let scene: any;

let mouseX = 0;

let windowWidth: any, windowHeight: any;

const views = [
  {
    left: 0,
    bottom: 0,
    width: 0.5,
    height: 1.0,
    background: new THREE.Color(0.5, 0.5, 0.7),
    eye: [0, 300, 1800],
    up: [0, 1, 0],
    fov: 30,
    camera: new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000),
    updateCamera: function (camera: THREE.Camera, scene: THREE.Scene, mouseX: number) {

      camera.position.x += mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), - 2000);
      camera.lookAt(scene.position);

    }
  },
  {
    left: 0.5,
    bottom: 0,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.7, 0.5, 0.5),
    eye: [0, 1800, 0],
    up: [0, 0, 1],
    fov: 45,
    camera: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000),
    updateCamera: function (camera: THREE.Camera, _: THREE.Scene, mouseX: number) {

      camera.position.x -= mouseX * 0.05;
      camera.position.x = Math.max(Math.min(camera.position.x, 2000), - 2000);
      camera.lookAt(camera.position.clone().setY(0));

    }
  },
  {
    left: 0.5,
    bottom: 0.5,
    width: 0.5,
    height: 0.5,
    background: new THREE.Color(0.5, 0.7, 0.7),
    eye: [1400, 800, 1400],
    up: [0, 1, 0],
    fov: 60,
    camera: new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000),
    updateCamera: function (camera: THREE.Camera, scene: THREE.Scene, mouseX: number) {

      camera.position.y -= mouseX * 0.05;
      camera.position.y = Math.max(Math.min(camera.position.y, 1600), - 1600);
      camera.lookAt(scene.position);

    }
  }
];



function init() {
  const container = document.getElementById('app')!;

  for (let ii = 0; ii < views.length; ++ii) {

    const view = views[ii];
    const camera = view.camera;
    camera.position.fromArray(view.eye);
    camera.up.fromArray(view.up);
    view.camera = camera;

  }

  scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff);
  light.layers.enableAll();
  light.position.set(0, 0, 1);
  scene.add(light);


  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;

  const radius = 200;

  const geometry1 = new THREE.IcosahedronGeometry(radius, 1);
  const geometry2 = geometry1.clone();
  const geometry3 = geometry1.clone();

  const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });

  let mesh1 = new THREE.Mesh(geometry1, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
  let wireframe1 = new THREE.Mesh(geometry1, wireframeMaterial);
  mesh1.add(wireframe1);
  mesh1.position.x = - 400;
  mesh1.rotation.x = - 1.87;
  mesh1.layers.set(0);
  wireframe1.layers.enableAll();
  scene.add(mesh1);

  const mesh2 = new THREE.Mesh(geometry2, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
  const wireframe2 = new THREE.Mesh(geometry2, wireframeMaterial);
  mesh2.add(wireframe2);
  mesh2.position.x = 400;
  mesh2.layers.set(1);
  wireframe2.layers.enableAll();
  scene.add(mesh2);

  const mesh3 = new THREE.Mesh(geometry3, new THREE.MeshPhongMaterial({ color: 0x0000ff }));
  const wireframe3 = new THREE.Mesh(geometry3, wireframeMaterial);
  mesh3.add(wireframe3);
  mesh3.layers.set(2);
  wireframe3.layers.enableAll();
  scene.add(mesh3);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  stats = new (Stats as any)();
  container.appendChild(stats.dom);

  document.addEventListener('mousemove', onDocumentMouseMove);

  return { renderer };
}

const { renderer } = init();

views[0].camera.layers.enable(0);

views[1].camera.layers.enable(1);
views[1].camera.layers.disable(0);

views[2].camera.layers.disable(0);
views[2].camera.layers.enable(2);


function onDocumentMouseMove(event: any) {

  mouseX = (event.clientX - windowWidth / 2);
  //mouseY = (event.clientY - windowHeight / 2);

}

function updateSize() {

  if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    renderer.setSize(windowWidth, windowHeight);

  }

}

function animate() {

  render();
  stats.update();

  requestAnimationFrame(animate);

}

function render() {

  updateSize();

  for (let ii = 0; ii < views.length; ++ii) {

    const view = views[ii];
    const camera = view.camera;

    view.updateCamera(camera, scene, mouseX);
    //view.updateCamera(camera, scene, mouseX, mouseY);

    const left = Math.floor(windowWidth * view.left);
    const bottom = Math.floor(windowHeight * view.bottom);
    const width = Math.floor(windowWidth * view.width);
    const height = Math.floor(windowHeight * view.height);

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    renderer.setClearColor(view.background);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);

  }

}


animate();