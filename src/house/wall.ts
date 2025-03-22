import * as THREE from 'three';
import { SUBTRACTION, INTERSECTION, ADDITION, Brush, Evaluator, computeMeshVolume } from 'three-bvh-csg';

export class Wall {
  scene;

  constructor({ scene }) {
    this.scene = scene;

    this.calcWall_1();

    this.calcWall_2();
  }

  getBlockParams() {
    let dlina = 0.6;
    let h = 0.3;
    const offset = 0.01;

    return { dlina, h, offset };
  }

  calcWall_2() {
    const wall = this.crWall({ size: new THREE.Vector3(5, 3, 0.3) });
    wall.rotateY(Math.PI / 2);
    wall.position.x = -5 + 0.3 / 2;
    wall.position.z = -5 / 2 + 0.3 / 2;

    let localBox = this.getLocalBox({ obj: wall });
    let x = localBox.max.x - localBox.min.x;
    let y = localBox.max.y - localBox.min.y;

    const { pos1a, pos1b, pos1c, pos2a, pos2b, pos2c, dir } = this.getDirWall({ wall });

    const { dlina, h, offset } = this.getBlockParams();
    let countY = 0;

    const arrBloks = [];
    for (let i = 0; i < y; i += h + offset) {
      const startX = countY % 2 === 0 ? dlina / 2 : 0;
      countY++;
      for (let i2 = 0; i2 < x; i2 += dlina + offset) {
        const pos = pos1c.clone().add(
          dir
            .clone()
            .multiplyScalar(i2)
            .add(dir.clone().multiplyScalar(startX))
            .add(new THREE.Vector3(0, i + h / 2, 0))
        );
        const block = this.crBlock({ pos });
        block.rotateY(Math.PI / 2);
        arrBloks.push(block);
      }
    }
    console.log(arrBloks.length);

    let newBlocks = this.cutObj({ wall, arrBloks });

    this.cutBlock({ wall, newBlocks });
  }

  getDirWall({ wall }) {
    let localBox = this.getLocalBox({ obj: wall });

    wall.updateMatrixWorld();
    const pos1a = new THREE.Vector3(localBox.min.x, localBox.min.y, localBox.min.z).applyMatrix4(wall.matrixWorld);
    const pos1b = new THREE.Vector3(localBox.min.x, localBox.min.y, localBox.max.z).applyMatrix4(wall.matrixWorld);
    const pos1d = new THREE.Vector3(localBox.min.x, localBox.max.y, localBox.min.z).applyMatrix4(wall.matrixWorld);
    const pos1e = new THREE.Vector3(localBox.min.x, localBox.max.y, localBox.max.z).applyMatrix4(wall.matrixWorld);

    const pos2a = new THREE.Vector3(localBox.max.x, localBox.min.y, localBox.min.z).applyMatrix4(wall.matrixWorld);
    const pos2b = new THREE.Vector3(localBox.max.x, localBox.min.y, localBox.max.z).applyMatrix4(wall.matrixWorld);
    const pos2d = new THREE.Vector3(localBox.max.x, localBox.max.y, localBox.min.z).applyMatrix4(wall.matrixWorld);
    const pos2e = new THREE.Vector3(localBox.max.x, localBox.max.y, localBox.max.z).applyMatrix4(wall.matrixWorld);

    const pos1c = pos1b.clone().sub(pos1a).divideScalar(2).add(pos1a);
    const pos2c = pos2b.clone().sub(pos2a).divideScalar(2).add(pos2a);
    const pos1cc = pos1e.clone().sub(pos1d).divideScalar(2).add(pos1d);
    const pos2cc = pos2e.clone().sub(pos2d).divideScalar(2).add(pos2d);

    this.crBlock({ pos: pos1c, size: new THREE.Vector3(0.1, 0.1, 0.1), color: 0xff0000 });
    this.crBlock({ pos: pos2c, size: new THREE.Vector3(0.1, 0.1, 0.1), color: 0xff0000 });

    const dir = pos2c.clone().sub(pos1c).normalize();
    console.log('dir', dir);

    return { pos1a, pos1b, pos1d, pos1e, pos1c, pos2a, pos2b, pos2c, pos2d, pos2e, pos1cc, pos2cc, dir };
  }

  calcWall_1() {
    const wall = this.crWall({ size: new THREE.Vector3(10, 3, 0.3) });
    let localBox = this.getLocalBox({ obj: wall });
    let x = localBox.max.x - localBox.min.x;
    let y = localBox.max.y - localBox.min.y;

    const { pos1a, pos1b, pos1c, pos2a, pos2b, pos2c, dir } = this.getDirWall({ wall });

    const { dlina, h, offset } = this.getBlockParams();
    let countY = 0;

    const arrBloks = [];
    for (let i = 0; i < y; i += h + offset) {
      const startX = countY % 2 === 0 ? dlina / 2 : 0;
      countY++;
      for (let i2 = 0; i2 < x; i2 += dlina + offset) {
        const pos = pos1c.clone().add(
          dir
            .clone()
            .multiplyScalar(i2)
            .add(dir.clone().multiplyScalar(startX))
            .add(new THREE.Vector3(0, i + h / 2, 0))
        );
        const block = this.crBlock({ pos });
        arrBloks.push(block);
      }
    }
    console.log(arrBloks.length);

    let newBlocks = this.cutObj({ wall, arrBloks });

    this.cutBlock({ wall, newBlocks });
  }

  private crWall({ size, color = 0xcccccc }) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({ color });
    const obj = new THREE.Mesh(geometry, material);
    obj.position.y = size.y / 2;

    obj.geometry.computeBoundingBox();

    this.scene.add(obj);

    return obj;
  }

  private crBlock({ pos, size = new THREE.Vector3(0.6, 0.3, 0.32), color = 0xffffff }) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({ color });
    const obj = new THREE.Mesh(geometry, material);
    obj.userData = { tag: 'block' };
    obj.position.copy(pos);

    //this.scene.add(obj);

    return obj;
  }

  getGlobalBox({ obj }) {
    const boundingBox = new THREE.Box3().setFromObject(obj);

    // Получаем глобальные координаты BoundingBox
    const min = boundingBox.min; // Минимальные координаты (x, y, z)
    const max = boundingBox.max; // Максимальные координаты (x, y, z)

    return boundingBox;
  }

  getLocalBox({ obj }) {
    obj.geometry.computeBoundingBox();

    return obj.geometry.boundingBox;
  }

  cutObj({ wall, arrBloks }) {
    const { pos1a, pos1b, pos1c, pos2a, pos2b, pos2c, dir } = this.getDirWall({ wall });

    const pos = pos2c.clone().sub(pos1c).divideScalar(2).add(pos1c);
    pos.y = 1.5;

    const box = this.crWall({ size: new THREE.Vector3(2, 1.5, 0.6), color: 0xff0000 });
    box.rotation.copy(wall.rotation);
    box.position.copy(pos);

    const newWall = this.csg({ obj1: wall, obj2: box });
    newWall.visible = false;

    let newBlocks = [];
    for (let i = 0; i < arrBloks.length; i++) {
      const b = this.csg({ obj1: arrBloks[i], obj2: box });
      newBlocks.push(b);
    }

    return newBlocks;
  }

  cutBlock({ wall, newBlocks }) {
    const { pos1a, pos1b, pos1d, pos1c, pos2a, pos2b, pos2c, dir } = this.getDirWall({ wall });
    const dlina = pos1c.distanceTo(pos2c);
    const h = pos1a.distanceTo(pos1d) + 1;

    const posC1 = pos2c.clone().sub(pos1c).divideScalar(2).add(pos1c);

    let box = this.crWall({ size: new THREE.Vector3(dlina + 1, 0.5, 1), color: 0x0000ff });
    box.rotation.copy(wall.rotation);
    box.position.copy(posC1.clone().add(new THREE.Vector3(0, pos1d.y + 0.5 / 2, 0)));

    let newBlocks2 = [];
    for (let i = 0; i < newBlocks.length; i++) {
      const b = this.csg({ obj1: newBlocks[i], obj2: box });
      newBlocks2.push(b);
    }
    newBlocks = newBlocks2;

    box = this.crWall({ size: new THREE.Vector3(0.5, h, 1), color: 0x0000ff });
    box.rotation.copy(wall.rotation);
    box.position.copy(
      pos1a
        .clone()
        .add(new THREE.Vector3(0, h / 2 - 0.5, 0))
        .add(dir.clone().multiplyScalar(-0.5 / 2))
    );

    newBlocks2 = [];
    for (let i = 0; i < newBlocks.length; i++) {
      const b = this.csg({ obj1: newBlocks[i], obj2: box });
      newBlocks2.push(b);
    }
    newBlocks = newBlocks2;

    box = this.crWall({ size: new THREE.Vector3(0.5, h, 1), color: 0x0000ff });
    box.rotation.copy(wall.rotation);
    box.position.copy(
      pos2a
        .clone()
        .add(new THREE.Vector3(0, h / 2 - 0.5, 0))
        .add(dir.clone().multiplyScalar(0.5 / 2))
    );

    newBlocks2 = [];
    for (let i = 0; i < newBlocks.length; i++) {
      const b = this.csg({ obj1: newBlocks[i], obj2: box });
      b.userData = { tag: 'block' };
      newBlocks2.push(b);

      b.updateMatrixWorld(true);
      const n = computeMeshVolume(b) as any;
      //console.log(n);
      if (n < 0.057 / 1) {
        b.material['color'].copy(new THREE.Color().setHex(0x00ff00));
      }
    }
    newBlocks = newBlocks2;

    console.log(newBlocks.length);
  }

  csg({ obj1, obj2, visible = false }) {
    obj1.updateMatrixWorld(true);
    obj2.updateMatrixWorld(true);

    // Преобразуем в CSG-объекты (Brush)
    const brushA = new Brush(obj1.geometry, obj1.material);
    const brushB = new Brush(obj2.geometry, obj2.material);
    brushA.position.copy(obj1.position);
    brushB.position.copy(obj2.position);
    brushA.rotation.copy(obj1.rotation);
    brushB.rotation.copy(obj2.rotation);
    brushA.scale.copy(obj1.scale);
    brushB.scale.copy(obj2.scale);

    brushA.updateMatrixWorld(true);
    brushB.updateMatrixWorld(true);

    if (!visible) {
      obj1.visible = visible;
      obj2.visible = visible;

      obj1.remove();
      obj2.remove();
    }

    // Создаем экземпляр Evaluator
    const evaluator = new Evaluator();
    evaluator.useGroups = false;

    // Выполняем булеву операцию (вычитание сферы из куба)
    const obj = evaluator.evaluate(brushA, brushB, SUBTRACTION);

    this.scene.add(obj);

    obj.updateMatrixWorld();

    return obj;
  }
}
