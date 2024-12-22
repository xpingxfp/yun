

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from "./node.js";
import { BaseBoard } from './baseBoard.js';
import { EventList } from './eventList.js';

let eventList = new EventList();

let dMenu = new Menu('基础节点');

let bs = new BaseScript();
bs.addStyle("./styles/baseNode.css");

let nodeTypes = {
    'number': {
        'int': '整数',
        'float': '浮点数',
        'num': '数字',
    },
    'string': {
        'str': '字符串',
        'text': '文本',
    },
    'boolean': {
        'bool': '布尔值',
    },
    'array': {
        'arr': '数组',
    },
    'object': {
        'obj': '对象',
    },
    'function': {
        'func': '函数',
    },
    'null': {
        'null': '空',
    },
    'undefined': {
        'undefined': '未定义',
    },
}

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

function intNode() {
    let node = createNode();
    node.setType('int');
    node.addClass('NT_number');
    node.addClass('NT_int');
    node.setHeader('整数');
    let input = document.createElement('input');
    node.content.appendChild(input);
    node.setSize(100, 50);
    node.data = { value: 0 };

    input.addEventListener('change', function () {
        let value = parseInt(input.value);
        if (isNaN(value)) {
            input.value = 0;
        }
        node.data.value = value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'int') {
            let value = parseInt(e.detail.node.data.value);
            node.data.value = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        input.value = node.data.value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('整数', intNode);

function numbertNode() {
    let node = createNode();
    node.setType('number');
    node.addClass('NT_number');
    node.setHeader('数字');
    let input = document.createElement('input');
    node.content.appendChild(input);
    node.setSize(100, 50);
    node.data = { value: 0, type: 'num' };

    input.addEventListener('change', function () {
        let value = parseFloat(input.value);
        if (isNaN(value)) {
            input.value = 0;
        }
        node.data.value = value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'number') {
            let value = parseFloat(e.detail.node.data.value);
            node.data.value = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        input.value = node.data.value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('数字', numbertNode);

dMenu.show();


export { nodeTypes };