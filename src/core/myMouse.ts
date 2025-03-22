import * as THREE from 'three';
import { myInitScene } from '../main';

export class MyMouse {
  scene;
  private isDown = false;
  private isMove = false;
  private offset = new THREE.Vector2();

  constructor({ scene }) {
    this.scene = scene;

    this.init();
  }

  init() {
    document.body.addEventListener('pointerdown', this.onMouseDown);
    document.body.addEventListener('pointermove', this.onMouseMove);
    document.body.addEventListener('pointerup', this.onMouseUp);
    document.body.addEventListener('wheel', this.mouseWheel);
  }

  onMouseDown = (e) => {
    this.isDown = true;

    myInitScene.render();
  };

  onMouseMove = (e) => {
    if (!this.isDown) return;

    this.isMove = true;

    myInitScene.render();
  };

  onMouseUp = (e) => {
    if (!this.isMove) {
      const intersects = this.getRaycaster({ event: e });

      let actObj = null;

      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj.userData.tag && obj.userData.tag === 'block') {
          actObj = obj;

          break;
        }
      }

      if (actObj) {
        const obj = actObj as THREE.Mesh;

        if (obj.userData.tag && obj.userData.tag === 'block') {
          obj.removeFromParent();
          console.log(obj);
        }
      }
    }
    this.isDown = false;
    this.isMove = false;

    myInitScene.render();
  };

  mouseWheel = (e) => {
    myInitScene.render();
  };

  getRaycaster({ event, objects = this.scene.children }) {
    const raycaster = new THREE.Raycaster();
    const camera = myInitScene.getMyCameras().getCameraAct().camera;
    const pos = this.getMousePosition(event);

    raycaster.setFromCamera(pos, camera);

    const intersects = raycaster.intersectObjects(objects, false);

    return intersects;
  }

  getMousePosition(event) {
    const container = myInitScene.getContainer();

    const x = ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
    const y = -((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;

    return new THREE.Vector2(x, y);
  }
}
