import { myUiInit, myInitScene } from '../main';
import { MyPoints } from './point/myPoints';
import { Wall } from './wall';

export class MyInitHouse {
  myPoints: MyPoints;

  constructor() {
    this.myPoints = new MyPoints();

    this.startCamera();

    new Wall({ scene: myInitScene.getScene() });

    myInitScene.render();
  }

  startCamera() {
    const type = 'Top';
    myInitScene.getMyCameras().changeCameraAct({ type });
    myUiInit.myUiBtnCamera.changeTxt({ type });
  }
}
