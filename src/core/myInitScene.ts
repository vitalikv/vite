import * as THREE from 'three';
import { MyCameras } from './myCameras';
import { MyMouse } from './myMouse';

export class MyInitScene {
  private container;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private myCameras: MyCameras;

  constructor() {
    this.init();

    new MyMouse({ scene: this.getScene() });

    this.render();

    window.addEventListener('resize', this.windowResize);
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.container = document.body.querySelector('[nameId="scene"]');
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight, false);
    this.container.appendChild(this.renderer.domElement);

    this.myCameras = new MyCameras({ container: this.container, renderer: this.renderer });

    this.initLight();
  }

  initLight() {
    const gridHelper = new THREE.GridHelper(30, 30);
    this.scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.4));
  }

  windowResize = () => {
    const container = this.container;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const needResize = container.width !== width || container.height !== height;
    //if (!needResize) { return; }

    this.renderer.setSize(width, height, false);

    const aspect = width / height;
    const d = 5;

    const cameraTop = this.myCameras.getCameraTop();
    const camera3D = this.myCameras.getCamera3D();

    cameraTop.left = -d * aspect;
    cameraTop.right = d * aspect;
    cameraTop.top = d;
    cameraTop.bottom = -d;
    cameraTop.updateMatrixWorld();
    cameraTop.updateProjectionMatrix();

    camera3D.aspect = aspect;
    camera3D.updateMatrixWorld();
    camera3D.updateProjectionMatrix();

    this.render();
  };

  render() {
    let composer = false;
    if (composer) {
      //composer.render();
    } else {
      this.renderer.render(this.scene, this.myCameras.getCameraAct().camera);
    }
  }

  getContainer() {
    return this.container;
  }

  getScene() {
    return this.scene;
  }

  getRenderer() {
    return this.renderer;
  }

  getMyCameras() {
    return this.myCameras;
  }
}
