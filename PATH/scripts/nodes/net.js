

import { Node } from "../../../scripts/node.js";
import { Menu } from "../../../scripts/menu.js";

let netMenu = new Menu("网络");

function createNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();

    return node;
}

// 请求
function requestNode() {
    let node = createNode();
}

netMenu.addItem("请求", requestNode);
netMenu.show();