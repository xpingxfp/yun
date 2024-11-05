console.log("节点已经引入");

import { BaseScript } from './1-基类.js';
import { BaseBoard } from './4-底板.js'

let bs = new BaseScript();
bs.addStyle("./2-样式/3-节点.css");

import { Menu } from "./2-菜单.js";

let nodes = [];

class Node {
    node = null;
    pos = { x: 0, y: 0 };

    createNode() {
        this.node = document.createElement("div");
        this.node.classList.add("node");
    }

    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
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
            this.node = null;
        }
    }

    addRemoveEvent() {
        this.node.addEventListener("contextmenu", function (e) {
            if (nodeMenu.hasItem("删除节点")) nodeMenu.removeItem("删除节点");
            nodeMenu.addItem("删除节点", function () {
                nodes.forEach(node => {
                    if (node.node == e.target) {
                        node.removeNode();
                        nodes.splice(nodes.indexOf(node), 1);
                        nodeMenu.removeItem("删除节点");
                    }
                })
            })
        });

        document.addEventListener('mousedown', function (e) {
            if (e.target != this) nodeMenu.removeItem("删除节点");
            // if (e.target != this) nodeMenu.removeItem("打印节点信息");/
        });
    }
}

let nodeMenu = new Menu();
nodeMenu.setName("节点");
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
    node.nodeAddToBoard();
    node.addRemoveEvent();
    nodes.push(node);
})
nodeMenu.addItem("打印所有节点信息", function () {
    console.log(nodes);
});
nodeMenu.show();

let node = new Node();
node.setPos(100, 100);
node.nodeAddToBoard();
node.addRemoveEvent();
nodes.push(node);

export { Node };