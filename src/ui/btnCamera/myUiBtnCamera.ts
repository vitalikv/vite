import { myInitScene } from '../../main';

// кнопка для создания сетки для теплого пола
export class MyUiBtnCamera {
  container;
  activated = false;
  wrapBtn;
  btnCamera;
  btnCameraTxt;

  constructor({ container }) {
    this.container = container;
  }

  // вкл отображение кнопки создания сетки
  init() {
    if (this.activated) return; // уже активирована кнопка

    this.activated = true;

    this.wrapBtn = this.container;

    this.crBtn();
    this.btnCamera = this.wrapBtn.querySelector('[nameId="btnCamera"]');
    this.btnCameraTxt = this.btnCamera.querySelector('[nameId="btnCameraTxt"]');

    this.initEvent();
  }

  crBtn() {
    let div = document.createElement('div') as any;
    div.innerHTML = this.html_1();
    div = div.children[0];

    this.wrapBtn.append(div);

    return div;
  }

  // по клику на кнопки показываем модальное окно с информацией
  initEvent() {
    this.btnCamera.onmousedown = () => {
      const myCameras = myInitScene.getMyCameras();
      const type = myCameras.getCameraAct().type;
      const newType = type === 'Top' ? '3D' : 'Top';
      myCameras.changeCameraAct({ type: newType });

      this.changeTxt({ type: newType });
    };
  }

  html_1() {
    const wrapBtn = `display: flex;
		align-items: center;
		width: auto;
		height: 42px;
		margin: auto;
		text-decoration: none;
		text-align: center;
		border: solid 1px #b3b3b3;
		border-radius: 4px;
		font: 18px Arial, Helvetica, sans-serif;
		font-weight: bold;
		color: #737373;
		background-color: #ffffff;
		background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%);
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;
		cursor: pointer;
    user-select: none;`;

    const html = `<div style="${wrapBtn}">
			<div nameId="btnCamera" style="display: flex; align-items: center; height: 100%; padding: 11px;">
				<div nameId="btnCameraTxt">Камера</div>
			</div>
		</div>`;

    return html;
  }

  changeTxt({ type }: { type: 'Top' | '3D' }) {
    const txt = type === 'Top' ? '3D' : '2D';
    this.btnCameraTxt.textContent = txt;
  }
}
