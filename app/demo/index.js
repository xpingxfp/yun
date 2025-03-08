import { Yun, page, element, menuInstance, eventList, pathBox, Dot, Path } from "../main/index.js";

class TemplateYun extends Yun {
    constructor() {
        super();
        this.box = null;
        this.header = element.create.header();
        this.contentBox = null;
        this.init();
    }

    init() {
        this.createYun();
        this.createBox();
        this.box.appendChild(this.header);
        this.createContentBox();
        this.drag();
        this.event();
        element.func.yun.zoom(this);
        element.func.yun.resize(this);
        element.func.yun.connect(this);
    }

    createBox() {
        this.box = document.createElement('div');
        this.box.classList.add('box');
        this.body.appendChild(this.box);
    }

    createContentBox() {
        this.contentBox = document.createElement('div');
        this.contentBox.classList.add('content');
        this.box.appendChild(this.contentBox);
    }

    drag() {
        this.header.addEventListener('mousedown', () => {
            let destroyDraggable = element.func.yun.draggable(this);
            document.addEventListener('mouseup', destroyDraggable)
        })
    }

    event() {
        let yun = this;
        element.func.HTMLelement.edit.dblclickEdit(this.header.data.title, (newValue) => {
            console.log('新的值是:', newValue);
        });
    }
}

let yuns = [];

let menu = {
    "打印信息": () => {
        let targetElement = menuInstance.event.target;
        let ancestorElement = targetElement.closest('.yun');
        ancestorElement.dispatchEvent(eventList.Yhandle((yun) => {
            console.log(yun);
        }));
    },
}

let func = menuInstance.setFunc(menu, "测试");
menuInstance.bindingFuncTarget(func, "yun");

let menuD = {
    "创建yun": (e) => {
        let yun = new TemplateYun();
        let yunBox = page.yunBox;
        let [x, y] = page.feature.coordinateTransformation(e.clientX, e.clientY);
        yun.setPosition(x, y);
        yunBox.appendChild(yun.body);
        yuns.push(yun);
    }
}

let funcD = menuInstance.setFunc(menuD, "测试");
menuInstance.bindingFuncTarget(funcD);
