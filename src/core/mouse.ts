import * as THREE from 'three';

export class Mouse {
  scene;
  camera;
  private isDown = false;
  private isMove = false;
  private offset = new THREE.Vector2();

  constructor({ scene, camera }) {
    this.scene = scene;
    this.camera = camera;

    this.init();
  }

  init() {
    document.body.addEventListener('pointerdown', this.onMouseDown);
    document.body.addEventListener('pointermove', this.onMouseMove);
    document.body.addEventListener('pointerup', this.onMouseUp);
  }

  onMouseDown = (e) => {
    this.isDown = true;
  };

  onMouseMove = (e) => {
    if (!this.isDown) return;

    this.isMove = true;
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
  };

  getRaycaster({ event, camera = this.camera, objects = this.scene.children }) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(objects, false);

    return intersects;
  }
}
