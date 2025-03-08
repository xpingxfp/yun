import { Yun, page, element, menuInstance, eventList } from "../main/index.js";

class TemplateYun extends Yun {
    constructor() {
        super();
        this.structure = {
            box: null,
            header: element.create.header(),
            content: null,
        };
        this.init();
    }

    init() {
        this.createYun();
        this.createBox();
        this.structure.box.appendChild(this.structure.header);
        this.createContentBox();
        this.drag();
        this.event();
        element.func.yun.zoom(this);
        element.func.yun.resize(this);
        element.func.yun.connect(this);
    }

    createBox() {
        this.structure.box = document.createElement('div');
        this.structure.box.classList.add('box');
        this.body.appendChild(this.structure.box);
    }

    createContentBox() {
        this.structure.content = document.createElement('div');
        this.structure.content.classList.add('content');
        this.structure.box.appendChild(this.structure.content);
    }

    drag() {
        this.structure.header.addEventListener('mousedown', () => {
            let destroyDraggable = element.func.yun.draggable(this);
            document.addEventListener('mouseup', destroyDraggable)
        })
    }

    event() {
        let yun = this;
        element.func.HTMLelement.edit.dblclickEdit(this.structure.header.data.title, (e) => {
            if (e.state == "editing") {
                yun.state = 'changeTitle';
            } else if (e.state == "edited") {
                yun.state = 'free';
            }
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
        yun.structure.content.setAttribute("contenteditable", "plaintext-only");
        yunBox.appendChild(yun.body);
        yuns.push(yun);
    }
}

let funcD = menuInstance.setFunc(menuD, "测试");
menuInstance.bindingFuncTarget(funcD);
