
import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from "./node.js";
import { BaseBoard } from './baseBoard.js';
import { EventList } from './eventList.js';

let eventList = new EventList();

let CMenu = new Menu('自定义节点');

let bs = new BaseScript();
bs.addStyle("./styles/customizeNode.css");

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

function createNode() {
    let node = new Node();
    let menuPos = getMenuPos();
    node.setPos(menuPos.x, menuPos.y);
    node.quicknodecreation();
    node.addInputDot();
    node.addOutputDot();
    node.addToNodes();
    return node;
}

function styleNode() {
    let node = createNode();
}

CMenu.addItem("样式节点", styleNode);

// CMenu.show();


class CustomizeNode { }

export { CustomizeNode };