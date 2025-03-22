import './style/style.css';
import { MyUiInit } from './ui/myUiInit';
import { MyInitScene } from './core/myInitScene';
import { MyInitHouse } from './house/myInitHouse';

export const myUiInit = new MyUiInit();
export const myInitScene = new MyInitScene();
export const myInitHouse = new MyInitHouse();

//saveFileInDir({ file: { id: 1 } });
//loadFileInDir({});

// сохранение в папку через php
async function saveFileInDir({ file }) {
  const url = './php/saveJson.php';
  const body = new URLSearchParams();
  body.append('myarray', JSON.stringify(file));
  body.append('nameFile', 'test1.json');

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
  const data = await response.json();
  console.log(data);
}

async function loadFileInDir({ url = './php/test1.json' }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
  const data = await response.json();
  console.log(data);
}
