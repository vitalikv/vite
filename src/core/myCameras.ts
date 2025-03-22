import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class MyCameras {
  private cameraTop: THREE.OrthographicCamera;
  private camera3D: THREE.PerspectiveCamera;
  private cameraAct: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private controls1: OrbitControls;
  private controls2: OrbitControls;

  constructor({ container, renderer }) {
    this.cameraTop = this.initCamerTop({ container });
    this.camera3D = this.initCamer3D({ container });

    this.controls1 = new OrbitControls(this.cameraTop, renderer.domElement);
    this.controls1.enableRotate = false;
    this.controls1.mouseButtons.LEFT = THREE.MOUSE.PAN; // Включаем панорамирование

    this.controls2 = new OrbitControls(this.camera3D, renderer.domElement);

    this.setCameraAct({ camera: this.camera3D });
  }

  private initCamerTop({ container }) {
    const aspect = container.clientWidth / container.clientHeight;
    //camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 100 );
    const d = 5;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
    camera.position.set(0, 15, 0);
    camera.lookAt(new THREE.Vector3());
    camera.zoom = 1;
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    return camera;
  }

  private initCamer3D({ container }) {
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 5;
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    return camera;
  }

  private setCameraAct({ camera }: { camera: THREE.PerspectiveCamera | THREE.OrthographicCamera }) {
    this.cameraAct = camera;

    const camera3D = this.getCamera3D();
    const cameraTop = this.getCameraTop();

    this.controls1.enabled = false;
    this.controls2.enabled = false;

    if (camera === cameraTop) {
      this.controls1.enabled = true;
    } else {
      this.controls2.enabled = true;
    }
  }

  getCameraAct() {
    const camera3D = this.getCamera3D();
    const cameraTop = this.getCameraTop();

    const type = this.cameraAct === camera3D ? '3D' : 'Top';

    return { camera: this.cameraAct, type };
  }

  getCameraTop() {
    return this.cameraTop;
  }

  getCamera3D() {
    return this.camera3D;
  }

  changeCameraAct({ type }: { type: 'Top' | '3D' }) {
    const camera3D = this.getCamera3D();
    const cameraTop = this.getCameraTop();

    if (type === 'Top') {
      this.setCameraAct({ camera: cameraTop });
    }

    if (type === '3D') {
      this.setCameraAct({ camera: camera3D });
    }
  }
}
