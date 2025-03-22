import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Mouse } from './core/mouse';
import { Wall } from './house/wall';

// Создание сцены
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Создание камеры
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 5;

// Создание рендерера
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

new Mouse({ scene, camera });
new Wall({ scene });

const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Цвет и интенсивность
scene.add(ambientLight);
scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.4));

// Функция анимации
function animate() {
  requestAnimationFrame(animate);

  // Рендеринг сцены
  renderer.render(scene, camera);
}

// Запуск анимации
animate();

saveFileInDir({ file: { id: 1 } });
//loadFileInDir({});

// сохранение в папку через php
async function saveFileInDir({ file }) {
  const url = './php/saveJson.php';
  const body = new URLSearchParams();
  body.append('myarray', JSON.stringify(file));
  body.append('nameFile', 'test1.json');

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
  const data = await response.json();
  console.log(data);
}

async function loadFileInDir({ url = './php/test1.json' }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
  const data = await response.json();
  console.log(data);
}
