

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from './node.js';
import { BaseBoard } from './baseBoard.js'
import { EventList } from './eventList.js';

let eventList = new EventList();

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
    addNode.setSize(100, 50);
    addNode.type = "funcNode";

    let inputValue = [];
    addNode.data = { inputValue: inputValue, value: "" };
    // 计算inputValue
    async function calculate() {
        let result = 0;

        for (let i = 0; i < inputValue.length; i++) {
            let item = inputValue[i];
            if (item.type === "number") {
                result += item.value;
            } else if (item.type === "funcNode") {
                // 异步等待100ms然后增加值
                result += await new Promise(resolve => setTimeout(() => resolve(item.value), 100));
            }
        }

        addNode.data.value = result;
        addNode.content.innerHTML = result;
    }

    addNode.node.addEventListener("Ninput", (e) => {
        eventList.Nupdate(addNode);
        this.dispatchEvent(eventList.event)
        let node = e.detail.node
        let value = {
            type: node.type,
            value: node.data.value,
            node: node
        }
        inputValue.push(value);
        // console.log(inputValue);
        calculate();
    });

    addNode.node.addEventListener("Nupdate", async (e) => {
        let node = e.detail.node;
        // 查询node在inputValue中的索引
        let index = inputValue.findIndex(item => item.node === node);
        // 更新index对应的值
        inputValue[index] = {
            type: node.type,
            value: node.data.value,
            node: node
        }
        // console.log(inputValue);
        calculate();
        addNode.dots.forEach(dot => {
            if (dot.type == "output") {
                // console.log(dot);
                dot.connectingObjects.forEach(connectingObject => {
                    // console.log(connectingObject.dot.parentNode.parentNode);
                    eventList.Nupdate(addNode);
                    connectingObject.dot.parentNode.parentNode.dispatchEvent(eventList.event);
                });
            }
        });

        /*
        // 确保只处理一次更新，避免无限循环
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            let detailData = e.detail && e.detail.data;

            if (detailData && detailData.type === "funcNode") {
                // 使用 Promise 和 await 来等待异步操作完成
                await new Promise(resolve => setTimeout(resolve, 100));
                // 更新数据
                this.data = detailData;
            }

            // 收集所有需要更新的节点
            const updatePromises = addNode.dots
                .filter(dot => dot.type === "output")
                .flatMap(dot =>
                    dot.connectingObjects.map(connectingObject => {
                        const targetNode = connectingObject.dot.parentNode.parentNode;
                        // 返回一个Promise来处理每个节点的更新
                        return new Promise((resolve) => {
                            eventList.Nupdate(addNode);
                            targetNode.dispatchEvent(eventList.event);
                            resolve();
                        });
                    })
                );

            // 等待所有更新完成
            await Promise.all(updatePromises);

        } catch (error) {
            console.error('Error during Nupdate:', error);
        } finally {
            // 更新完成后重置标志位
            this.isUpdating = false;
        }
            */
    });

    addNode.node.addEventListener("NinputOff", (e) => {
        let node = e.detail.inputObject;
        let index
        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i].node === node) {
                index = i;
                break;
            }
        }
        inputValue.splice(index, 1);
        calculate();
    });

    addNode.node.addEventListener("error", (e) => {
        inputValue = [];
    });
}

dMenu.addItem('相加节点', addNode);

function dialysisNode() {
    let pos = getMenuPos();
    let x = pos.x;
    let y = pos.y;
    let dialysisNode = new Node();
    dialysisNode.setPos(x, y);
    dialysisNode.quicknodecreation();
    dialysisNode.setHeader("透析")
    dialysisNode.addInputDot();
    dialysisNode.addOutputDot();
    dialysisNode.addToNodes();

    let objContent = null;

    let copyBtn = document.createElement("button");
    copyBtn.classList.add("copyBtn");
    copyBtn.innerHTML = "复制";
    copyBtn.addEventListener("click", (e) => {
        console.log("copyBtn clicked", objContent);

        let copyText = objContent;
        let input = document.createElement("input");
        input.value = copyText;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    });
    dialysisNode.header.appendChild(copyBtn);

    dialysisNode.addClass("dialysisNode");

    let connectingObjectIndex = 0;

    let inpotDot = dialysisNode.dots[0];

    dialysisNode.node.addEventListener("Ninput", (e) => {
        if (inpotDot.connectingObjects.length > 1) {
            // console.log("透析节点只能连接一个节点");
            inpotDot.paths[0].remove();
            inpotDot.paths.shift();
            inpotDot.connectingObjects[0].paths.splice(connectingObjectIndex, 1);
            inpotDot.connectingObjects[0].connectingObjects.splice(connectingObjectIndex, 1);
            inpotDot.connectingObjects.shift();
        }

        connectingObjectIndex = inpotDot.connectingObjects[0].connectingObjects.length - 1;

        let node = e.detail.node.node;
        objContent = simpleFormatHTML(node.outerHTML);

        let code = document.createElement("code");
        code.textContent = objContent;

        let pre = document.createElement("pre");
        pre.appendChild(code);

        dialysisNode.content.innerHTML = "";
        dialysisNode.content.appendChild(pre);
    });
}
dMenu.addItem('透析节点', dialysisNode);

dMenu.show();

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;<br>")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function simpleFormatHTML(html) {
    // 初始化变量
    let indentLevel = 0;
    const indentChar = '  '; // 使用两个空格作为缩进字符

    // 去除多余的空白
    html = html.replace(/>\s+</g, '><');

    // 添加换行符和缩进
    return html.replace(/(<[^>]+>)/g, function (match, p1) {
        let tag = p1.match(/^<([\w]+)/);
        let isClosingTag = p1.startsWith('</');
        let isSelfClosingTag = p1.includes('/>');

        if (tag && !isClosingTag && !isSelfClosingTag) {
            // 开始标签，增加缩进级别
            indentLevel++;
            return '\n' + indentChar.repeat(indentLevel - 1) + p1;
        } else if (isClosingTag) {
            // 结束标签，减少缩进级别后添加换行符
            indentLevel--;
            return '\n' + indentChar.repeat(indentLevel) + p1;
        } else if (isSelfClosingTag) {
            // 自闭合标签
            return '\n' + indentChar.repeat(indentLevel) + p1;
        }
        return match; // 其他情况保持不变
    }).replace(/\n\n+/g, '\n') // 移除多余的连续换行符
        // .replace(/>\n\s</g, '><') // 移除没有内容的元素之间的换行符
        .trim(); // 移除首尾多余的换行
}


export { dtsx };