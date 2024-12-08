console.log("基类已经引入");


class BaseScript {
    constructor() {
    }

    addStyle(url) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    }

    drag(element) {
        element.onmousedown = function (event) {
            let disX = event.clientX - element.offsetLeft;
            let disY = event.clientY - element.offsetTop;
            document.onmousemove = function (event) {
                element.style.left = event.clientX - disX + "px";
                element.style.top = event.clientY - disY + "px";
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                element.onmousedown = null;
            };
            return false;
        };
    }
}

let bs = new BaseScript();

bs.addStyle('./styles/baseStyle.css');

export { BaseScript };