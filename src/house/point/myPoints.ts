import * as THREE from 'three';

export class MyPoints {
  private geometry;
  private materiaDef;

  constructor() {
    this.geometry = this.crGeometry();
    this.materiaDef = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  }

  private crGeometry() {
    let geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 18);

    let attrP: any = geometry.getAttribute('position');

    for (let i = 0; i < attrP.array.length; i += 3) {
      attrP.array[i + 0] *= 0.5; // x
      attrP.array[i + 2] *= 0.5; // z

      let y = attrP.array[i + 1];
      if (y < 0) {
        attrP.array[i + 1] = 0;
      }
    }

    geometry.attributes.position.needsUpdate = true;

    geometry.userData.attrP = geometry.getAttribute('position').clone();

    return geometry;
  }

  getGeometry() {
    return this.geometry;
  }

  getMaterialDef() {
    return this.materiaDef;
  }

  crPoint() {}
}
