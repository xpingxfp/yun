

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from "./node.js";
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

// 引入节点
function importNode() {
    let node = createNode();
    node.setHeader("引入");

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

    let url = document.createElement("input");
    url.className = "IONode-importNode-url";
    url.type = "text";
    url.placeholder = "请输入URL";

    node.content.appendChild(url);

    let typeSelect = document.createElement("div");
    typeSelect.className = "IONode-importNode-typeSelect";

    let select = document.createElement("select");
    select.className = "IONode-importNode-typeSelect-select";

    let importTypes = ["js", "css", "json"];

    for (let i = 0; i < importTypes.length; i++) {
        let option = document.createElement("option");
        option.value = importTypes[i];
        option.innerText = importTypes[i];
        select.appendChild(option);
    }

    typeSelect.appendChild(select);

    let button = document.createElement("button");
    button.className = "IONode-importNode-typeSelect-button";
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
        // 判断引入的类型
        let type = data.type;
        if (type == "js") {
            let script = document.createElement("script");
            script.src = url.value;
            document.head.appendChild(script);
        } else if (type == "css") {
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url.value;
            document.head.appendChild(link);
        } else if (type == "json") {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url.value, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let json = JSON.parse(xhr.responseText);
                    // console.log(json);
                }
            }
            xhr.send();
        } else {
            console.log("未知类型");
        }
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event);
    });

}

IONMenu.addItem("引入", importNode)

// PATH.json引入
function importPath() {
    let node = createNode();
    node.setHeader("");

    let data = node.getData();

    let objs = [];
    data.objs = objs;

    node.setData(data);

    function createPathBtn(json) {
        pathbtn.innerHTML = "";
        for (let key in json) {
            let name = key;
            let btn = document.createElement("button");
            btn.className = "IONode-importPath-btn";
            btn.innerText = name;
            pathbtn.appendChild(btn);
            btn.addEventListener("click", function () {
                // 拼接URL
                url.innerHTML += "/" + name
                if (json[name].type == "dir") {
                    // 回调createPathBtn
                    json = json[name].content;
                    createPathBtn(json);
                }
                else if (json[name].type == "file") {
                    // 清空pathbtn
                    pathbtn.innerHTML = "";
                }
            });
        }
    }

    fetch("./PATH/PATH.json").then(function (response) {
        return response.json();
    }).then(function (json) {
        data.path = json;
        node.setData(data);
        createPathBtn(json);
    });

    let url = document.createElement("div");
    url.className = "IONode-importPath-url";
    url.innerText = "./PATH";
    node.content.appendChild(url);

    let button = document.createElement("button");
    button.className = "IONode-importPath-button";
    button.innerText = "获取";
    node.header.appendChild(button);

    button.addEventListener("click", function () {
        let path = url.innerText;
        fetch(path).then(function (response) {
            let type = response.headers.get("Content-Type");
            if (type.includes("text/css")) {
                // 在head中引入CSS
                let link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = path;
                document.head.appendChild(link);
                tipBox.innerText = "CSS引入成功";
            } else if (type.includes("application/javascript")) {
                // 在head中引入JS
                let script = document.createElement("script");
                script.type = "module";
                script.src = path;
                document.head.appendChild(script);
                tipBox.innerText = "JS引入成功";
            } else {
                console.log(response.headers.get("Content-Type"));
                response.text().then(function (text) {
                    tipBox.innerText = text;
                });
            }
            eventList.Nupdating();
            node.node.dispatchEvent(eventList.event);
        })
    });

    let clearbtn = document.createElement("button");
    clearbtn.className = "IONode-importPath-clearbtn";
    clearbtn.innerText = "清空";
    node.header.appendChild(clearbtn);

    clearbtn.addEventListener("click", function () {
        url.innerHTML = "./PATH";
        createPathBtn(data.path);
        tipBox.innerText = "请选择路径";
    });

    let pathbtn = document.createElement("div");
    pathbtn.className = "IONode-importPath-pathbtn";
    node.content.appendChild(pathbtn);

    let tipBox = document.createElement("div");
    tipBox.className = "IONode-importPath-tipBox";
    tipBox.innerText = "请选择路径";
    node.content.appendChild(tipBox);

    node.node.addEventListener("Nupdating", function () {

        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event);
    });
}

IONMenu.addItem("PATH引入", importPath)

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


IONMenu.show();
INMenu.show();
ONMenu.show();

let IONode = {}

export { IONode };