
import { BaseScript } from './baseScript.js';
import { BaseBoard } from './baseBoard.js'
import { Menu } from "./menu.js";
import { EventList } from './eventList.js';

let eventList = new EventList();

let pathMenu = new Menu();
pathMenu.setName('路径');

let bs = new BaseScript();
bs.addStyle('./styles/path.css');

let baseBox = document.querySelector('#baseBox');

let svgBox = document.createElement('div');
svgBox.bounds = { left: 0, top: 0, right: 1000, bottom: 1000 };
svgBox.id = 'svgBox';
baseBox.appendChild(svgBox);

let pathBox = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
pathBox.id = 'pathBox';
pathBox.setAttribute('width', '100%');
pathBox.setAttribute('height', '100%');
svgBox.appendChild(pathBox);

let paths = []

class Path {
    path = null;
    d = '';
    fill = 'none';
    stroke = 'black';
    strokeWidth = 2;
    dotStart = null;
    dotEnd = null;
    connectingType = 'bezier';

    createPath() {
        if (this.path) return;
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('class', 'path');
        pathBox.appendChild(this.path);

        this.#eventDetection();
    }

    // 目前阶段使用点击删除的方式
    #eventDetection() {
        this.path.addEventListener('mousedown', function (event) {
            event.preventDefault();
            event.stopPropagation();
            // this.removePath();
            this.path.classList.add('checked');
        }.bind(this));

        this.path.addEventListener('Ndelete', function (event) {
            this.removePath();
        }.bind(this));
    }

    removePath() {
        let index = this.dotEnd.connectingObjects.findIndex(item => item === this.dotStart);
        this.dotEnd.connectingObjects.splice(index, 1);
        index = this.dotStart.connectingObjects.findIndex(item => item === this.dotEnd);
        this.dotStart.connectingObjects.splice(index, 1);
        index = this.dotEnd.paths.findIndex(item => item === this);
        this.dotEnd.paths.splice(index, 1);
        index = this.dotStart.paths.findIndex(item => item === this);
        this.dotStart.paths.splice(index, 1);
        eventList.NinputOff(this.dotStart.dot.parentNode.parentNode);
        this.dotEnd.dot.parentNode.parentNode.dispatchEvent(eventList.event);
        this.remove();
    }

    getBoounds() {
        let left = this.dotStart.pos.x;
        let right = this.dotEnd.pos.x;
        if (left > right) {
            let temp = left;
            left = right;
            right = temp;
        }
        let top = this.dotStart.pos.y;
        let bottom = this.dotEnd.pos.y;
        if (top > bottom) {
            let temp = top;
            top = bottom;
            bottom = temp;
        }
        return { left: left, top: top, right: right, bottom: bottom };
    }

    draw() {
        this.createPath();
        this.path.setAttribute('d', this.d);
        this.path.setAttribute('fill', this.fill);
        this.path.setAttribute('stroke', this.stroke);
        this.path.setAttribute('stroke-width', this.strokeWidth);
    }

    remove() {
        // console.log('移除路径');

        if (this.path) {
            pathBox.removeChild(this.path);
            this.removeFromPaths();
            this.path = null;
            this.dotStart = null;
            this.dotEnd = null;
        }
    }

    drawLine(startX, startY, endX, endY) {
        let d = `M ${startX} ${startY} L ${endX} ${endY}`;
        this.d = d;
        this.draw();
    }

    drawThreeBezierLine(startX, startY, endX, endY) {
        let xDifference = Math.abs(endX - startX);

        let d = `M ${startX} ${startY} C 
        ${startX + xDifference / 2} ${startY} 
        ${endX - xDifference / 2} ${endY} 
        ${endX} ${endY}`;

        this.d = d;
        this.draw();
    }

    connectingTwoPoints(g_dotStart, g_dotEnd) {
        this.dotStart = g_dotStart;
        this.dotEnd = g_dotEnd;

        let BBPos = BaseBoard.pos;

        let startRect = this.dotStart.dot.getBoundingClientRect();
        let endRect = this.dotEnd.dot.getBoundingClientRect();

        let startX = startRect.left + startRect.width / 2 - BBPos.x;
        let startY = startRect.top + startRect.height / 2 - BBPos.y;
        let endX = endRect.left + endRect.width / 2 - BBPos.x;
        let endY = endRect.top + endRect.height / 2 - BBPos.y;

        // this.setPos(startX, startY);
        // this.setSize(endX - startX, endY - startY);

        switch (this.connectingType) {
            case 'line':
                this.drawLine(startX, startY, endX, endY);
                break;
            case 'bezier':
                this.drawThreeBezierLine(startX, startY, endX, endY);
                break;
        }

        updateBox(this);
    }

    addToPaths() {
        paths.push(this);
    }

    removeFromPaths() {
        let index = paths.indexOf(this);
        if (index > -1) {
            paths.splice(index, 1);
        }
    }

    getPaths() {
        return paths;
    }

    updatePath() {
        if (!this.path) return;
        this.connectingTwoPoints(this.dotStart, this.dotEnd);
    };
}

function updateBox(path) {
    let { left, top, right, bottom } = path.getBoounds();
    // console.log(left, top, right, bottom);
    let buffer = (right - left) * 0.1 + 100;
    left -= buffer;
    right += buffer;
    top -= buffer;
    bottom += buffer;

    if (left < svgBox.bounds.left) svgBox.bounds.left = left;
    if (top < svgBox.bounds.top) svgBox.bounds.top = top;
    if (right > svgBox.bounds.right) svgBox.bounds.right = right;
    if (bottom > svgBox.bounds.bottom) svgBox.bounds.bottom = bottom;
    // console.log(svgBox.bounds);

    let width = svgBox.bounds.right - svgBox.bounds.left;
    let height = svgBox.bounds.bottom - svgBox.bounds.top;
    // console.log(width, height);


    pathBox.setAttribute('viewBox', `${svgBox.bounds.left} ${svgBox.bounds.top} ${width} ${height}`);

    svgBox.style.width = `${width}px`;
    svgBox.style.height = `${height}px`;
    svgBox.style.left = `${svgBox.bounds.left}px`;
    svgBox.style.top = `${svgBox.bounds.top}px`;
}

// pathMenu.addItem('打印所有路径信息', function () {
//     console.log(paths);
// })

// pathMenu.show();


export { Path }