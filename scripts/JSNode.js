
import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from "./node.js";
import { BaseBoard } from './baseBoard.js';
import { EventList } from './eventList.js';

let eventList = new EventList();

let JSNMenu = new Menu('JS节点');

let bs = new BaseScript();
bs.addStyle("./styles/JSNode.css");

let JSNode = {}

// 变量节点
function letNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();
    node.addInputDot();
    node.addOutputDot();
    node.addToNodes();

    node.setHeader("变量名");

    // 设置变量名
    node.changingTheTitle();

    // 传入设置
    node.node.addEventListener('Ninput', (e) => {
        // console.log(e.detail);
        let type = e.detail.type;
    });

}

// letNode();

JSNMenu.addItem('变量节点', letNode);

JSNMenu.show();



export { JSNode }