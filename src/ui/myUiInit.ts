import { MyUiBtnCamera } from './btnCamera/myUiBtnCamera';

export class MyUiInit {
  container;
  myUiBtnCamera: MyUiBtnCamera;

  constructor() {
    this.container = document.body.querySelector('[nameId="ui"]');
    this.myUiBtnCamera = new MyUiBtnCamera({ container: this.container });
    this.init();
  }

  init() {
    this.initBtnCamera();
  }

  initBtnCamera() {
    this.myUiBtnCamera.init();
  }
}
