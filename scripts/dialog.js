


import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";

let dMenu = new Menu('弹窗');

let bs = new BaseScript();
bs.addStyle("./styles/dialog.css");

let dialog = document.createElement('div');
dialog.id = 'dialog';

document.body.appendChild(dialog);


class Dialog { }

export { Dialog };