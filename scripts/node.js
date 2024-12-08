console.log("节点已经引入");

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { BaseBoard } from './baseBoard.js'
import { Path } from './path.js';
import { Dot } from './dot.js';


let nodeMenu = new Menu();
nodeMenu.setName("节点");

let bs = new BaseScript();
bs.addStyle("./styles/node.css");

let nodes = [];

class Node {
    node = null;
    pos = { x: 0, y: 0 };
    nodeBox = null;
    header = null;
    content = null;
    dots = [];

    quicknodecreation() {
        this.createNode();
        this.addHeader();
        this.addContent();
        this.nodeAddToBoard();
        this.addRemoveEvent();
        this.addDrapEvent();
        this.addCheckedEvent();
    }

    createNode() {
        this.node = document.createElement("div");
        this.node.classList.add("node");
        this.nodeBox = document.createElement("div");
        this.nodeBox.classList.add("nodeBox");
        this.node.appendChild(this.nodeBox);
    }

    setPos(x, y) {
        if (!this.node) this.createNode();
        this.pos.x = x;
        this.pos.y = y;
        this.node.style.transform = `translate(${x}px, ${y}px)`;
    }

    getPos() {
        return this.pos;
    }

    calculatingDisplay() {
        this.node.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
    }

    nodeAddToBoard() {
        let baseBox = document.getElementById("baseBox");
        if (!this.node) this.createNode();
        baseBox.appendChild(this.node);
        this.calculatingDisplay();
    }

    removeNode() {
        if (this.node) {
            this.node.remove();
            nodes.splice(nodes.indexOf(this), 1);
            this.node = null;
            this.dots.forEach(dot => {
                dot.removeDot();
            });
        }
    }

    addRemoveEvent() {
        let removeNode = this.removeNode.bind(this);
        this.node.addEventListener("contextmenu", function (e) {
            if (nodeMenu.hasItem("删除节点")) nodeMenu.removeItem("删除节点");
            nodeMenu.addItem("删除节点", removeNode);
        });

        document.addEventListener('mousedown', function (e) {
            if (e.target != this) nodeMenu.removeItem("删除节点");
        });
    }

    addHeader() {
        this.header = document.createElement("div");
        this.header.classList.add("header");
        this.header.innerText = "节点";
        this.nodeBox.appendChild(this.header);

        this.changingTheTitle();
    }

    setHeader(text) {
        this.header.innerText = text;
    }

    changingTheTitle() {
        this.header.addEventListener("dblclick", function (e) {
            e.stopPropagation();
            e.preventDefault();
            let input = document.createElement("input");
            input.value = this.innerText;
            this.innerText = "";
            this.appendChild(input);
            input.focus();
            input.addEventListener("blur", function () {
                this.parentNode.innerText = this.value;
            });
            input.addEventListener("keydown", function (e) {
                if (e.keyCode == 13) {
                    this.blur();
                }
            });
        });
    }

    addContent() {
        this.content = document.createElement("div");
        this.content.classList.add("content");
        let div = document.createElement("div");
        div.innerHTML = "内容"
        this.content.appendChild(div);
        this.content.addEventListener("mousedown", function (e) {
            this.contentEditable = true;
        })
        this.content.addEventListener("blur", function (e) {
            this.contentEditable = false;
        })
        this.nodeBox.appendChild(this.content);
    }

    addDrapEvent() {
        let t = this;
        let pos = this.getPos();
        if (this.header) {
            this.header.addEventListener("mousedown", function (event) {
                if (event.button != 0) return;
                let HPP = this.parentNode.parentNode;

                let startX = event.clientX;
                let startY = event.clientY;

                let tstartPos = { x: pos.x, y: pos.y };

                let startPoss = [tstartPos]
                let aims = [t]

                let hasHPP = false;

                let checkedElements = document.querySelectorAll(".checked");
                checkedElements.forEach(checked => {
                    nodes.forEach(node => {
                        if (node.node != checked) return;
                        if (node.node == HPP) hasHPP = true;
                        aims.push(node);
                        let startPos = { x: node.pos.x, y: node.pos.y };
                        startPoss.push(startPos);

                    });
                });

                let timeoutId;
                let startDrag = function () {
                    document.addEventListener("mousemove", move);
                    document.addEventListener("mouseup", up);
                };

                let cancelDrag = () => {
                    clearTimeout(timeoutId);
                };

                timeoutId = setTimeout(startDrag, 50); // 防止鼠标抖动

                document.addEventListener("mouseup", cancelDrag);

                let move = function (event) {
                    let endX = event.clientX;
                    let endY = event.clientY;

                    let offsetX = endX - startX;
                    let offsetY = endY - startY;

                    if (!hasHPP) {
                        let startPos = startPoss[0];
                        let endPos = { x: startPos.x + offsetX, y: startPos.y + offsetY };
                        t.node.classList.add("dragging");
                        t.dots.forEach(dot => {
                            dot.updateDot();
                        });
                        t.setPos(endPos.x, endPos.y);
                        return;
                    }

                    aims.forEach((aim, index) => {
                        let startPos = startPoss[index];
                        let endPos = { x: startPos.x + offsetX, y: startPos.y + offsetY };
                        aim.node.classList.add("dragging");
                        aim.dots.forEach(dot => {
                            dot.updateDot();
                        });
                        aim.setPos(endPos.x, endPos.y);
                    });
                };
                let up = function () {
                    let dragging = document.querySelectorAll(".dragging");
                    dragging.forEach(dragging => {
                        dragging.classList.remove("dragging");
                        dragging.classList.add("checked");
                    });
                    document.removeEventListener("mousemove", move);
                    document.removeEventListener("mouseup", up);
                };
            })
        }
    }

    addCheckedEvent() {
        let node = this.node;
        function checkNode(e) {
            if (e.button != 0) return;
            e.stopPropagation();
            // e.preventDefault();
            if (!e.ctrlKey) {
                let checkeds = document.querySelectorAll(".checked");
                checkeds.forEach(checked => {
                    if (checked.classList.contains("dragging")) return;
                    checked.classList.remove("checked");
                });
            }
            node.classList.add("checked");
        }
        node.addEventListener("mousedown", checkNode);
        document.addEventListener("mousedown", function (e) {
            if (e.button != 0) return;
            if (e.ctrlKey) return;
            let checkeds = document.querySelectorAll(".checked");
            checkeds.forEach(checked => {
                checked.classList.remove("checked");
            });
        });
    }

    addInputDot() {
        let dot = new Dot();
        dot.init();
        dot.setTypeToInput();
        dot.dotAddToElement(this.nodeBox);
        dot.addConnect();
        this.dots.push(dot);
    }

    addOutputDot() {
        let dot = new Dot();
        dot.init();
        dot.setTypeToOutput();
        dot.dotAddToElement(this.nodeBox);
        dot.addConnect();
        this.dots.push(dot);
    }

    addToNodes() {
        nodes.push(this);
    }

    removeFromNodes() {
        nodes.splice(nodes.indexOf(this), 1);
    }
}

nodeMenu.addItem("新建节点", function (e) {
    let node = new Node();
    let menuBox = document.getElementById("menuBox");
    let x = menuBox.offsetLeft;
    let y = menuBox.offsetTop;

    let BBPos = BaseBoard.pos;
    x = x - BBPos.x;
    y = y - BBPos.y;

    let BBScale = BaseBoard.scale
    x = (x / BBScale);
    y = (y / BBScale);

    node.setPos(x, y);
    node.quicknodecreation();
    node.addInputDot();
    node.addOutputDot();
    node.addToNodes();
});
nodeMenu.addItem("打印所有节点信息", function () {
    console.log(nodes);
});
nodeMenu.show();

export { Node };