console.log("底板已经引入");

import { BaseScript } from './1-基类.js';
import { Menu } from "./2-菜单.js";

let baseMenu = new Menu("底板");

let bs = new BaseScript();
bs.addStyle('./2-样式/4-底板.css')

let BaseBoard = {
    pos: { x: 0, y: 0 },
    scale: 1,
}

let baseboard = document.createElement('div');
baseboard.id = 'baseboard';
document.body.appendChild(baseboard);

let baseTranslateBox = document.createElement('div');
baseTranslateBox.id = 'baseTranslateBox';
baseboard.appendChild(baseTranslateBox);

let baseScaleBox = document.createElement('div');
baseScaleBox.id = 'baseScaleBox';
baseTranslateBox.appendChild(baseScaleBox);

let baseBox = document.createElement('div');
baseBox.id = 'baseBox';
baseScaleBox.appendChild(baseBox);

baseboard.addEventListener('mousedown', (e) => {
    if (e.button == 1) {
        baseboard.classList.add('dragging');

        let startX = e.clientX;
        let startY = e.clientY;

        let BBPosSX = BaseBoard.pos.x;
        let BBPosSY = BaseBoard.pos.y;

        function move(e) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            BaseBoard.pos.x = BBPosSX + dx;
            BaseBoard.pos.y = BBPosSY + dy;

            baseTranslateBox.style.transform = `translate(${BaseBoard.pos.x}px, ${BaseBoard.pos.y}px)`;
        }

        function up(e) {
            baseboard.classList.remove('dragging');
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
    }
})

// document.addEventListener('DOMContentLoaded', function () {
//     baseboard.addEventListener('wheel', function (event) {
//         event.preventDefault();

//         let scale = BaseBoard.scale;

//         scale += event.deltaY / 1000;
//         scale = Math.max(0.1, Math.min(5, scale));

//         BaseBoard.scale = scale;

//         let cx = event.clientX
//         let cy = event.clientY

//         let dx = (cx * scale - BaseBoard.pos.x);
//         let dy = (cy * scale - BaseBoard.pos.y);

//         baseScaleBox.style.transformOrigin = `${dx}px ${dy}px`;
//         baseScaleBox.style.transform = `scale(${BaseBoard.scale})`;
//     })
// })

baseMenu.addItem("打印底板坐标", () => {
    console.log(BaseBoard.pos);
});
// baseMenu.addItem("打印底板缩放", () => {
//     console.log(BaseBoard.scale);
// });
baseMenu.show();

export { BaseBoard }