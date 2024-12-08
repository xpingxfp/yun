

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from './node.js';
import { BaseBoard } from './baseBoard.js'



let dMenu = new Menu('动态实现');


let bs = new BaseScript();
bs.addStyle("./styles/dtsx.css");

class dtsx { };

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

function addNode() {
    let pos = getMenuPos();
    let x = pos.x;
    let y = pos.y;
    let addNode = new Node(x, y, "动态节点");
    addNode.setPos(x, y);
    addNode.quicknodecreation();
    addNode.setHeader("相加")
    addNode.addInputDot();
    addNode.addOutputDot();
    addNode.addToNodes();
}

dMenu.addItem('相加节点', addNode);

function dialysisNode() {
    let pos = getMenuPos();
    let x = pos.x;
    let y = pos.y;
    let dialysisNode = new Node(x, y, "透析节点");
    dialysisNode.setPos(x, y);
    dialysisNode.quicknodecreation();
    dialysisNode.setHeader("透析")
    dialysisNode.addInputDot();
    dialysisNode.addOutputDot();
    dialysisNode.addToNodes();

    dialysisNode.node.addEventListener("connectionSuccess", (e) => {
        console.log("连接成功", e.detail);
        let node = e.detail.dot.dot.parentNode.parentNode;
        // console.log(node.innerHTML);

        let pre = document.createElement("pre");
        pre.textContent = node.innerHTML;
        // console.log(pre.innerHTML);

        dialysisNode.content.innerHTML = "";
        dialysisNode.content.appendChild(pre);
    });
}
dMenu.addItem('透析节点', dialysisNode);

dMenu.show();

export { dtsx };