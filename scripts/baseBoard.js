console.log("底板已经引入");

import { BaseScript } from './baseScript.js';

let bs = new BaseScript();
bs.addStyle('./styles/baseBoard.css')

let BaseBoard = {
    pos: { x: 0, y: 0 },
    scale: 1,
}

// 创建底板
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

// 移动页面
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

// baseMenu.addItem("打印底板坐标", () => {
//     console.log(BaseBoard.pos);
// });

// baseMenu.show();

export { BaseBoard }