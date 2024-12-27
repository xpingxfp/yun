import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { BaseBoard } from './baseBoard.js'
import { Path } from './path.js';
import { EventList } from './eventList.js';

let bs = new BaseScript();
bs.addStyle("./styles/dot.css");

let dotMenu = new Menu('点');

let tempDot = null;

let dots = [];

class Dot {
    type = '';
    dot = null;
    connectingObjects = [];
    pos = { x: 0, y: 0 };
    paths = [];

    addDotToDots() {
        dots.push(this);
    }

    removeDotFromDots() {
        let index = dots.indexOf(this);
        if (index > -1) {
            dots.splice(index, 1);
        }
    }

    setType(type) {
        this.type = type;
    }

    setTypeToInput() {
        this.type = 'input';
        this.addClass('input');
        this.addDotToDots();
    }

    setTypeToOutput() {
        this.type = 'output';
        this.addClass('output');
        this.addDotToDots();
    }

    setTypeToTemp() {
        this.type = 'temp';
        this.addClass('temp');
        this.dot.id = 'tempDot';
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    getPos() {
        return this.pos;
    }

    addConnectingObject(object) {
        this.connectingObjects.push(object);
    }

    removeConnectingObject(object) {
        let index = this.connectingObjects.indexOf(object);
        if (index > -1) {
            this.connectingObjects.splice(index, 1);
        }
    }

    addPath(path) {
        this.paths.push(path);
    }

    removePath(path) {
        let index = this.paths.indexOf(path);
        if (index > -1) {
            this.paths.splice(index, 1);
        }
    }

    init() {
        this.create();
        this.dotAddToBoard();
        // this.addDotToDots();
    }

    create() {
        this.dot = document.createElement('div');
        this.dot.classList.add('dot');
    }

    addClass(className) {
        if (!this.dot) this.create();
        this.dot.classList.add(className);
    }

    removeClass(className) {
        if (!this.dot) return;
        this.dot.classList.remove(className);
    }

    dotAddToElement(element) {
        if (!this.dot) this.create();
        element.appendChild(this.dot);
    }

    dotAddToBoard() {
        let baseBox = document.getElementById("baseBox");
        if (!this.dot) this.create();
        baseBox.appendChild(this.dot);
        this.calculatingDisplay();
    }

    calculatingDisplay() {
        this.dot.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
    }

    addDrag() {
        let pos = this.getPos();
        let setPos = this.setPos.bind(this);
        let dot = this.dot;
        this.dot.addEventListener("mousedown", function (event) {
            if (!event.button == 0) return;
            let startX = event.clientX;
            let startY = event.clientY;
            let startPos = { x: pos.x, y: pos.y };
            let endPos = { x: 0, y: 0 };
            dot.classList.add("dragging");
            let move = function (event) {
                let endX = event.clientX;
                let endY = event.clientY;
                endPos = { x: endX - startX + startPos.x, y: endY - startY + startPos.y };
                dot.style.transform = `translate(${endPos.x}px, ${endPos.y}px)`;
            };
            let up = function () {
                setPos(endPos.x, endPos.y);
                dot.classList.remove("dragging");
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        });
    }

    addConnect() {
        let dot = this.dot;
        let Dot = this
        let type = this.type;
        let addPath = this.addPath.bind(this);
        let removePath = this.removePath.bind(this);
        let connectingObject = tempDot;
        let connectingObjects = this.connectingObjects;
        let addConnectingObject = this.addConnectingObject.bind(this);

        dot.addEventListener("mousedown", function (event) {
            if (!event.button == 0) return;
            let startX = event.clientX - BaseBoard.pos.x;
            let startY = event.clientY - BaseBoard.pos.y;

            tempDot.removeClass('hide')
            tempDot.setPos(startX - 5, startY - 5);
            tempDot.dotAddToBoard();
            tempDot.addClass('dragging');
            let endPos = { x: 0, y: 0 };

            let path = new Path();
            path.draw();
            path.addToPaths();
            addPath(path);

            dots.forEach(d => {
                if (d.type == type) return;
                function over() {
                    connectingObject = d;
                }
                function out() {
                    connectingObject = tempDot;
                }
                d.dot.addEventListener("mouseover", over);
                d.dot.addEventListener("mouseout", out);
                document.addEventListener("mouseup", function (event) {
                    d.dot.removeEventListener("mouseover", over);
                    d.dot.removeEventListener("mouseout", out);
                });
            });

            let move = function (event) {
                let endX = event.clientX - BaseBoard.pos.x;
                let endY = event.clientY - BaseBoard.pos.y;
                endPos = { x: endX - startX + startPos.x, y: endY - startY + startPos.y };
                tempDot.setPos(endPos.x, endPos.y);
                tempDot.calculatingDisplay();
                if (type == 'input') path.connectingTwoPoints(connectingObject, Dot);
                if (type == 'output') path.connectingTwoPoints(Dot, connectingObject);
            };

            let up = function () {
                tempDot.removeClass('dragging');
                tempDot.addClass('hide');
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);

                if (connectingObject == tempDot) {
                    console.log("未选择连接点");
                    removePath(path);
                    path.remove();
                    path.removeFromPaths();
                    connectingObject = tempDot;
                    return;
                }
                if (dot.parentNode == connectingObject.dot.parentNode) {
                    console.log("不能连接到自己");
                    removePath(path);
                    path.remove();
                    path.removeFromPaths();
                    connectingObject = tempDot;
                    return;
                }
                let hasRepeat = false;
                for (let i = 0; i < connectingObjects.length; i++) {
                    if (connectingObjects[i] == connectingObject) {
                        hasRepeat = true;
                        break;
                    }
                }
                if (hasRepeat) {
                    console.log("不能重复连接");
                    removePath(path);
                    path.remove();
                    path.removeFromPaths();
                    connectingObject = tempDot;
                    return;
                }
                addConnectingObject(connectingObject);
                connectingObject.addConnectingObject(Dot);
                connectingObject.addPath(path);

                let event = new EventList();

                let inputDot, outputDot;
                if (type == 'input') {
                    inputDot = Dot;
                    outputDot = connectingObject;
                } else {
                    inputDot = connectingObject;
                    outputDot = Dot;
                }

                event.Noutput(inputDot.dot.parentNode.parentNode)
                outputDot.dot.parentNode.parentNode.dispatchEvent(event.event);

                event.NconnectionSuccess(inputDot.dot.parentNode.parentNode);
                outputDot.dot.parentNode.parentNode.dispatchEvent(event.event);
                event.NconnectionSuccess(outputDot.dot.parentNode.parentNode);
                inputDot.dot.parentNode.parentNode.dispatchEvent(event.event);

                connectingObject = tempDot;
            };
            let startPos = { x: tempDot.getPos().x, y: tempDot.getPos().y };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        });
    }

    updateDot() {
        if (this == tempDot) return;
        let rect = this.dot.getBoundingClientRect();
        let BBPos = BaseBoard.pos;
        let BBScale = BaseBoard.scale;
        let x = (rect.left - BBPos.x) / BBScale;
        let y = (rect.top - BBPos.y) / BBScale;
        this.setPos(x, y);
        // console.log(this.pos);

        this.paths.forEach(path => {
            path.updatePath();
        });
    }

    removeDot() {
        // console.log("removeDot");

        this.removeDotFromDots();
        // this.dot.remove();
        this.connectingObjects.forEach(object => {
            object.removeConnectingObject(this);
        });
        this.paths.forEach(path => {
            path.remove();
        });
    }
}

tempDot = new Dot();
tempDot.init();
tempDot.setTypeToTemp();
tempDot.addDrag();
tempDot.dotAddToBoard();

function getMenuPos() {
    let menuBox = document.getElementById("menuBox");
    let x = menuBox.offsetLeft;
    let y = menuBox.offsetTop;

    let BBPos = BaseBoard.pos;
    x = x - BBPos.x;
    y = y - BBPos.y;

    let BBScale = BaseBoard.scale
    x = (x / BBScale);
    y = (y / BBScale);

    return { x: x, y: y };
}

// window.addEventListener("connectionSuccess", function (event) {
//     console.log("connectionSuccess", event.detail.dot, event.detail.connectingObject);

// });

// dotMenu.show();

export { Dot };