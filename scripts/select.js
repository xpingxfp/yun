// console.log("");
import { BaseScript } from './baseScript.js';
// import { Menu } from "./2-菜单.js";
// import { BaseBoard } from './4-底板.js'
// import { Path } from './5-路径.js';

let bs = new BaseScript();
bs.addStyle("./styles/select.css");

let selectBox;
let appendTimeout;

let baseboard = document.querySelector("#baseboard");
baseboard.addEventListener("mousedown", function (event) {
    if (event.button !== 0 || document.querySelector("#selectBox")) return;
    // console.log("mousedown");

    clearTimeout(appendTimeout);
    appendTimeout = setTimeout(() => {
        if (!selectBox) {
            selectBox = document.createElement("div");
            selectBox.id = "selectBox";
        }
        let startX = event.clientX;
        let startY = event.clientY;
        document.body.appendChild(selectBox);
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);

        function move(event) {
            let endX = event.clientX;
            let endY = event.clientY;
            let width = Math.abs(endX - startX);
            let height = Math.abs(endY - startY);
            let left = Math.min(startX, endX);
            let top = Math.min(startY, endY);
            selectBox.style.width = width + "px";
            selectBox.style.height = height + "px";
            selectBox.style.left = left + "px";
            selectBox.style.top = top + "px";
        }

        function up(event) {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
            let nodes = document.querySelectorAll(".node");
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                let noderect = node.getBoundingClientRect();
                let nodeLeft = noderect.left;
                let nodeRight = noderect.right;
                let nodeTop = noderect.top;
                let nodeBottom = noderect.bottom;
                let selectLeft = selectBox.offsetLeft;
                let selectTop = selectBox.offsetTop;
                let selectRight = selectLeft + selectBox.offsetWidth;
                let selectBottom = selectTop + selectBox.offsetHeight;
                if (
                    nodeLeft < selectRight &&
                    nodeRight > selectLeft &&
                    nodeTop < selectBottom &&
                    nodeBottom > selectTop
                ) {
                    node.classList.add("checked");
                }
            }
            let paths = document.querySelectorAll(".path");
            for (let i = 0; i < paths.length; i++) {
                let path = paths[i];
                let pathrect = path.getBoundingClientRect();
                let pathLeft = pathrect.left;
                let pathRight = pathrect.right;
                let pathTop = pathrect.top;
                let pathBottom = pathrect.bottom;
                let selectLeft = selectBox.offsetLeft;
                let selectTop = selectBox.offsetTop;
                let selectRight = selectLeft + selectBox.offsetWidth;
                let selectBottom = selectTop + selectBox.offsetHeight;
                if (
                    pathLeft < selectRight &&
                    pathRight > selectLeft &&
                    pathTop < selectBottom &&
                    pathBottom > selectTop
                ) {
                    path.classList.add("checked");
                }
            }
            selectBox.style = "";
            selectBox.remove();
        }
    }, 50)

});

class Select { }

export { Select };