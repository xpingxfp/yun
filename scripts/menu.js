// 菜单类，
// 详细见“documents/各文件解释”文件

// 导入基础脚本，用于添加样式
import { BaseScript } from './baseScript.js';

// 添加样式
let bs = new BaseScript();
bs.addStyle("./styles/menu.css");

// 菜单类
class Menu {
    Menus = {};
    menu = document.createElement('div')
    name = null
    constructor(name = null) {
        this.setName(name);
    }

    // 设置菜单名称
    setName(name) {
        this.name = name
        let title = this.menu.querySelector(".menuTitle")
        // 如果菜单名称已经存在，则不再添加
        if (!title) {
            title = document.createElement("div");
            title.classList.add("menuTitle");
            this.menu.appendChild(title);
        }
        title.innerHTML = name;
    }

    // 添加菜单项
    addItem(name, command) {
        // 菜单项结构{name: "菜单项名称", command: "执行的命令"}
        this.Menus[name] = command;
        let menuItem = document.createElement("div");
        menuItem.classList.add("menuItem");
        // 用于查询已经添加到页面的菜单项
        menuItem.setAttribute("name", name);

        menuItem.innerHTML = name;
        menuItem.onmousedown = command
        this.menu.appendChild(menuItem);
    }

    // 移除菜单项
    removeItem(name) {
        let menuItem = this.menu.querySelector(".menuItem[name='" + name + "']");
        if (menuItem) {
            this.menu.removeChild(menuItem);
            delete this.Menus[name];
        }
    }

    // 获取菜单项
    getItem(name) {
        return this.Menus[name];
    }

    // 是否存在菜单项
    hasItem(name) {
        return this.Menus.hasOwnProperty(name);
    }

    // 隐藏菜单项
    hideItem(name) {
        let menuItem = this.menu.querySelector(".menuItem[name='" + name + "']");
        if (menuItem) {
            menuItem.classList.add("hide");
        }
    }

    // 显示菜单项
    showItem(name) {
        let menuItem = this.menu.querySelector(".menuItem[name='" + name + "']");
        if (menuItem) {
            menuItem.classList.remove("hide");
        }
    }

    // 显示菜单
    #showMenu() {
        let menuBox = document.querySelector("#menuBox");
        menuBox.classList.remove("hide");
        this.menu.classList.remove('hide')
        menuBox.appendChild(this.menu)
    }

    // 隐藏菜单
    #hideMenu() {
        let menuBox = document.querySelector("#menuBox");
        menuBox.classList.add("hide")
        this.menu.classList.add('hide')
    }

    // 显示菜单
    show(element = document) {
        // 传入参数为元素时，绑定事件到元素上，目的为点击元素显示菜单
        let showMenu = () => this.#showMenu();
        let hideMenu = () => this.#hideMenu();

        // 阻止右键菜单
        element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
        })

        // 鼠标按下
        element.addEventListener("mouseup", (e) => {
            if (e.button == 2) {
                let mousePos = { x: e.clientX, y: e.clientY };

                let menuBox = document.querySelector("#menuBox");
                showMenu();

                // 防止菜单溢出窗口
                if (mousePos.x + menuBox.offsetWidth > window.innerWidth) {
                    mousePos.x = window.innerWidth - menuBox.offsetWidth;
                }
                if (mousePos.y + menuBox.offsetHeight > window.innerHeight) {
                    mousePos.y = window.innerHeight - menuBox.offsetHeight;
                }

                menuBox.style.top = mousePos.y + "px";
                menuBox.style.left = mousePos.x + "px";

                // 隐藏菜单
                document.addEventListener("click", hideMenu, { once: true });
                document.addEventListener("mousedown", (ev) => {
                    if (ev.button == 1) {
                        hideMenu();
                    }
                }, { once: true });
            }
        })
    }

}

// 将菜单盒子添加到body中
let menuBox = document.createElement("div");
menuBox.id = "menuBox";
document.body.appendChild(menuBox);

export { Menu }