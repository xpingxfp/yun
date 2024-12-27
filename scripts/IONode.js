

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from "./node.js";
import { BaseBoard } from './baseBoard.js';
import { EventList } from './eventList.js';

import { typelist } from './TO/typelist.js';

let eventList = new EventList();


let bs = new BaseScript();
bs.addStyle("./styles/IONode.css");


function createNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();
    node.addToNodes();
    return node;
}
let IONMenu = new Menu('IO');

let INMenu = new Menu('设置');

// 设置TYPE
function setType() {
    let node = createNode();
    node.addOutputDot();
    node.setHeader("设置类型");
    node.setSize(100, 50);

    let data = node.getData();

    let objs = [];
    data.objs = objs;

    node.setData(data);

    node.node.addEventListener("NconnectionSuccess", function (e) {
        let obj = e.detail.connectingObject;
        let nodes = node.getNodes();
        let NODE = null;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == obj) {
                NODE = nodes[i];
                continue;
            }
        }
        objs.push(NODE);
    });

    let typeSelect = document.createElement("div");
    typeSelect.className = "IONode-typeSelect";

    let select = document.createElement("select");
    select.className = "IONode-typeSelect-select";

    for (let key in typelist) {
        let option = document.createElement("option");
        option.value = key;
        option.innerText = typelist[key].name;
        select.appendChild(option);
    }

    typeSelect.appendChild(select);

    let button = document.createElement("button");
    button.className = "IONode-typeSelect-button";
    button.innerText = "确定";

    typeSelect.appendChild(button);

    button.addEventListener("click", function () {
        let type = select.value;
        data.type = type;
        node.setData(data);
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event);
    });

    node.content.appendChild(typeSelect);

    node.node.addEventListener("Nupdating", function () {
        // console.log("更新中");
        for (let i = 0; i < objs.length; i++) {
            let obj = objs[i];
            obj.setType(data.type);
        }
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event);
    });
}

INMenu.addItem("设置类型", setType)


/**
 * 
 */



let ONMenu = new Menu('获取');

// 获取基本信息
function getInfo() {
    let node = createNode();
    node.setHeader("获取基本信息");
    node.setSize(150, 130);
    node.addInputDot();

    let data = node.getData();

    let objs = [];
    data.objs = objs;

    node.setData(data);

    node.node.addEventListener("Ninput", function (e) {
        let obj = e.detail.node;
        objs.push(obj);
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event);
    });

    node.node.addEventListener("Nupdating", function () {
        // 展示最后一个输入的基本信息
        let obj = objs[objs.length - 1];
        let id = obj.id;
        let type = obj.type;
        let pos = obj.pos;
        let size = obj.size;

        let info = {
            id: id,
            type: type,
            pos: pos,
            size: size
        }

        data.info = info;
        node.setData(data);
        let infoBox = document.createElement("div");
        infoBox.className = "IONode-infoBox";
        let idText = document.createElement("p");
        idText.innerText = "id: " + id;
        let typeText = document.createElement("p");
        typeText.innerText = "type: " + type;
        let posText = document.createElement("p");
        posText.innerText = "pos: " + pos.x + ", " + pos.y;
        let sizeText = document.createElement("p");
        sizeText.innerText = "size: " + size.w + ", " + size.h;
        infoBox.appendChild(idText);
        infoBox.appendChild(typeText);
        infoBox.appendChild(posText);
        infoBox.appendChild(sizeText);
        node.content.innerText = "";
        node.content.appendChild(infoBox);
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event);
    });

}

ONMenu.addItem("获取基本信息", getInfo)


// IONMenu.show();
INMenu.show();
ONMenu.show();

let IONode = {}

export { IONode };