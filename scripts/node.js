// 用于创建节点

// 导入依赖
import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { BaseBoard } from './baseBoard.js'
import { Path } from './path.js';
import { Dot } from './dot.js';
import { EventList } from './eventList.js';

let eventList = new EventList();

// 创建节点菜单
let nodeMenu = new Menu();
nodeMenu.setName("节点");

// 引入节点样式
let bs = new BaseScript();
bs.addStyle("./styles/node.css");

// 整合节点
let nodes = [];

let passingLists = [];

// 节点类
class Node {
    node = null;
    pos = { x: 0, y: 0 };
    size = { w: 200, h: 100 };
    nodeBox = null;
    header = null;
    content = null;
    dots = [];
    type = "";
    data = {};

    // 快速创建节点
    quicknodecreation() {
        this.createNode();
        this.addHeader();
        this.addContent();
        this.nodeAddToBoard();
        this.addRemoveEvent();
        this.addDrapEvent();
        this.addCheckedEvent();
        this.resize();
        this.#eventDetection();
    }

    // 创建节点
    createNode() {
        this.node = document.createElement("div");
        this.node.classList.add("node");

        this.node.style.width = `${this.size.w}px`;
        this.node.style.height = `${this.size.h}px`;

        this.nodeBox = document.createElement("div");
        this.nodeBox.classList.add("nodeBox");

        this.node.appendChild(this.nodeBox);
    }

    // 为节点添加类
    addClass(className) {
        this.node.classList.add(className);
    }

    // 移除节点类
    removeClass(className) {
        this.node.classList.remove(className);
    }

    // 设置节点位置
    setPos(x, y) {
        if (!this.node) this.createNode();
        this.pos.x = x;
        this.pos.y = y;
        this.node.style.transform = `translate(${x}px, ${y}px)`;
    }

    // 获取节点位置
    getPos() {
        return this.pos;
    }

    // 计算节点显示位置
    calculatingDisplay() {
        this.node.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
    }

    // 节点添加到画布
    nodeAddToBoard() {
        let baseBox = document.getElementById("baseBox");
        if (!this.node) this.createNode();
        baseBox.appendChild(this.node);
        this.calculatingDisplay();
    }

    // 节点移除
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

    // 添加移除节点事件菜单项
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

    // 添加节点头部
    addHeader() {
        this.header = document.createElement("div");
        this.header.classList.add("header");
        this.header.innerText = "节点";
        this.nodeBox.appendChild(this.header);
    }

    // 设置节点头部内容
    setHeader(text) {
        this.header.innerText = text;
    }

    // 节点头部双击修改标题
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

    // 添加节点内容
    addContent() {
        this.content = document.createElement("div");
        this.content.classList.add("content");
        let div = document.createElement("div");
        div.innerHTML = ""
        this.content.appendChild(div);
        this.nodeBox.appendChild(this.content);

        // this.#addContentEditable();
    }

    // 设置节点内容
    #addContentEditable() {
        this.content.Editable = true;
        if (!this.content.Editable) return;
        this.content.addEventListener("mousedown", function (e) {
            this.contentEditable = true;
        })
        this.content.addEventListener("blur", function (e) {
            this.contentEditable = false;
        })
    }

    // 设置节点内容
    #removeContentEditable() {
        this.content.Editable = false;
        this.content.addEventListener("mousedown", function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.contentEditable = false;
        });
    }

    // 添加节点拖拽事件
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

    // 添加节点选中事件
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
            node.classList.toggle("checked");
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

    // 添加输入点
    addInputDot() {
        let dot = new Dot();
        dot.init();
        dot.setTypeToInput();
        dot.dotAddToElement(this.nodeBox);
        dot.addConnect();
        this.dots.push(dot);
    }

    // 添加输出点
    addOutputDot() {
        let dot = new Dot();
        dot.init();
        dot.setTypeToOutput();
        dot.dotAddToElement(this.nodeBox);
        dot.addConnect();
        this.dots.push(dot);
    }

    // 将节点添加到节点数组中
    addToNodes() {
        nodes.push(this);
    }

    // 从节点数组中移除节点
    removeFromNodes() {
        nodes.splice(nodes.indexOf(this), 1);
    }

    // 设置节点大小
    setSize(w, h) {
        this.size.w = w;
        this.size.h = h;
        this.node.style.width = `${w}px`;
        this.node.style.height = `${h}px`;
    }

    // 节点大小调整
    resize() {
        let resizerBottomRight = document.createElement("div");
        resizerBottomRight.classList.add("resizerBottomRight");
        this.nodeBox.appendChild(resizerBottomRight);

        let setSize = this.setSize.bind(this);
        let size = this.size;
        let dots = this.dots;

        resizerBottomRight.addEventListener("mousedown", function (event) {
            if (event.button != 0) return;
            let startX = event.clientX;
            let startY = event.clientY;

            let startSize = { w: size.w, h: size.h };

            let timeoutId;
            let startResize = function () {
                document.addEventListener("mousemove", resize);
                document.addEventListener("mouseup", up);
            };

            let cancelResize = () => {
                clearTimeout(timeoutId);
            };

            timeoutId = setTimeout(startResize, 50); // 防止鼠标抖动

            document.addEventListener("mouseup", cancelResize);

            let resize = function (event) {
                let endX = event.clientX;
                let endY = event.clientY;

                let offsetX = endX - startX;
                let offsetY = endY - startY;

                let w = startSize.w + offsetX;
                let h = startSize.h + offsetY;

                if (w < 100) w = 100;
                if (h < 40) h = 40;

                setSize(w, h);
                dots.forEach(dot => {
                    dot.updateDot();
                });
            };
            let up = function () {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", up);
            };

        });
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setType(type) {
        this.type = type;
    }

    getType() {
        return this.type;
    }

    // 事件检测
    #eventDetection() {
        let node = this.node;
        let NODE = this;
        let removeNode = this.removeNode.bind(this);
        let dots = this.dots;
        let data = this.data;
        let getType = this.getType.bind(this);
        let setData = this.setData.bind(this);
        let getData = this.getData.bind(this);

        node.addEventListener("Ndelete", function (e) {
            e.stopPropagation();
            e.preventDefault();
            removeNode();
        });

        node.addEventListener("Noutput", function (e) {
            // console.log("传出数据", e.detail);
            let outputObject = e.detail.outputObject;
            let type = getType();
            eventList.Ninput(node, null, NODE, type);
            outputObject.dispatchEvent(eventList.event);
        });

        node.addEventListener("Ninput", function (e) {
            // console.log("传入数据", e.detail);
            // 将获取的添加到data中
        });

        node.addEventListener("NgetData", function (e) {
            // console.log("获取数据", e.detail)
            // 向上级发送需要的数据
            let upNode = e.detail.node;
            eventList.Noutput(node, data);
            upNode.dispatchEvent(eventList.event);
        })

        node.addEventListener("Nupdate", function (e) {
            // console.log("更新节点", e.detail)
            // 向上级发送输出数据事件

            let upNode = e.detail.node;
            eventList.Noutput(node, null);
            upNode.dispatchEvent(eventList.event);
            // 向自己添加更新中事件
            eventList.Nupdating();
            node.dispatchEvent(eventList.event);
        });

        node.addEventListener("Nupdating", function (e) {
            // console.log("节点更新中", e.detail)
            if (passingLists.includes(node)) {
                // removeNode();
                dots.forEach(dot => {
                    let lastPath = dot.paths[dot.paths.length - 1];
                    lastPath.removePath();
                });
                alert("您似乎创建了一个无法停止的循环\nYou seem to have created a loop that can't be stopped");
                passingLists = [];
                return;
            };
            passingLists.push(node);
        });

        node.addEventListener("NupdateComplete", function (e) {
            // console.log("更新节点完成", e.detail)
            // 向连接的节点发送更新事件
            let nextNodes = [];
            dots.forEach(dot => {
                if (dot.type == "output") {
                    dot.connectingObjects.forEach(connectingObject => {
                        eventList.Nupdate(node);
                        let nextNode = connectingObject.dot.parentNode.parentNode;
                        nextNodes.push(nextNode);
                        nextNode.dispatchEvent(eventList.event);
                    });
                }
                if (nextNodes.length == 0) passingLists = [];
            });
        });

        node.addEventListener("error", function (e) {
            console.error("节点发生错误", e.detail);
            data = null;
        });
    }
}

// 在节点菜单块中添加新建节点选项
nodeMenu.addItem("新建节点", function (e) {
    let node = new Node();
    // 计算鼠标点击位置
    let menuBox = document.getElementById("menuBox");
    let x = menuBox.offsetLeft;
    let y = menuBox.offsetTop;

    let BBPos = BaseBoard.pos;
    x = x - BBPos.x;
    y = y - BBPos.y;

    let BBScale = BaseBoard.scale
    x = (x / BBScale);
    y = (y / BBScale);

    // 新建节点并设置位置
    node.setPos(x, y);
    node.quicknodecreation();
    node.addInputDot();
    node.addOutputDot();
    node.addToNodes();
});

// 在节点菜单块中添加打印节点信息选项
nodeMenu.addItem("打印所有节点信息", function () {
    console.log(nodes);
});
// 在菜单中添加节点菜单块
nodeMenu.show();

export { Node };