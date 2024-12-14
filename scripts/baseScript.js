// 用于一些基础的功能，如添加样式、添加脚本、拖拽、删除元素等
// 详细见“documents/各文件解释”文件

// 导入EventList
import { EventList } from './eventList.js';

// 定义BaseScript类
class BaseScript {

    // 添加样式
    addStyle(url) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    }

    // 添加脚本
    addScript(url) {
        let script = document.createElement("script");
        script.src = url;
        document.head.appendChild(script);
    }

    // 拖拽元素，不建议使用
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

// 添加样式
bs.addStyle('./styles/baseStyle.css');

// 创建删除事件
let event = new EventList();
event.Ndelete();

// 删除.checked元素
function removeChecked() {
    let checked = document.querySelectorAll('.checked');
    for (let i = 0; i < checked.length; i++) {
        checked[i].parentNode.removeChild(checked[i]);
        // 为删除的元素添加一个删除事件
        checked[i].dispatchEvent(event.event);
    }
}

// 检测当用户按下x的时候删除元素
document.onkeydown = function (event) {
    if (event.key.toLowerCase() === 'x') {
        removeChecked();
    }
}

export { BaseScript };