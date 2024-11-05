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
}

let bs = new BaseScript();

bs.addStyle('./2-样式/1-基本样式.css');

export { BaseScript };