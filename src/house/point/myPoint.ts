import * as THREE from 'three';
import { myInitScene, myInitHouse } from '../../main';

export class PointWall {
  scene: THREE.Scene;

  constructor() {
    this.scene = myInitScene.getScene();
  }
  create({ id = 0, pos }) {
    const obj = new THREE.Mesh(myInitHouse.myPoints.getGeometry(), myInitHouse.myPoints.getMaterialDef());

    obj.position.copy(pos);

    this.scene.add(obj);
  }
}
