console.log("菜单已引入");
import { BaseScript } from './1-基类.js';

let bs = new BaseScript();
bs.addStyle("./2-样式/2-菜单.css");

class Menu {
    Menus = {};
    menu = document.createElement('div')
    name = null
    constructor(name = null) {
        this.setName(name);
    }

    ok() {
        console.log("菜单已经成功引入");
    }

    setName(name) {
        this.name = name
        let title = document.createElement("div");
        title.classList.add("menuTitle");
        title.innerHTML = name;
        this.menu.appendChild(title);
    }

    addItem(name, command) {
        this.Menus[name] = command;
        let menuItem = document.createElement("div");
        menuItem.classList.add("menuItem");
        menuItem.setAttribute("name", name);
        menuItem.innerHTML = name;
        menuItem.onmousedown = command
        this.menu.appendChild(menuItem);
    }

    removeItem(name) {
        let menuItem = this.menu.querySelector(".menuItem[name='" + name + "']");
        if (menuItem) {
            this.menu.removeChild(menuItem);
            delete this.Menus[name];
        }
    }

    getItem(name) {
        return this.Menus[name];
    }

    hasItem(name) {
        return this.Menus.hasOwnProperty(name);
    }

    hideItem(name) {
        let menuItem = this.menu.querySelector(".menuItem[name='" + name + "']");
        if (menuItem) {
            menuItem.classList.add("hide");
        }
    }

    showItem(name) {
        let menuItem = this.menu.querySelector(".menuItem[name='" + name + "']");
        if (menuItem) {
            menuItem.classList.remove("hide");
        }
    }

    #showMenu() {
        let menuBox = document.querySelector("#menuBox");
        menuBox.classList.remove("hide");
        this.menu.classList.remove('hide')
        menuBox.appendChild(this.menu)
    }

    #hideMenu() {
        let menuBox = document.querySelector("#menuBox");
        menuBox.classList.add("hide")
        this.menu.classList.add('hide')
    }

    show(element = document) {
        let showMenu = () => this.#showMenu();
        let hideMenu = () => this.#hideMenu();
        element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
        })

        element.addEventListener("mousedown", (e) => {
            if (e.button == 2) {
                let mousePos = { x: e.clientX, y: e.clientY };

                let menuBox = document.querySelector("#menuBox");
                showMenu();

                if (mousePos.x + menuBox.offsetWidth > window.innerWidth) {
                    mousePos.x = window.innerWidth - menuBox.offsetWidth;
                }
                if (mousePos.y + menuBox.offsetHeight > window.innerHeight) {
                    mousePos.y = window.innerHeight - menuBox.offsetHeight;
                }

                menuBox.style.top = mousePos.y + "px";
                menuBox.style.left = mousePos.x + "px";

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


let menuBox = document.createElement("div");
menuBox.id = "menuBox";
document.body.appendChild(menuBox);

let menu = new Menu();
menu.setName("菜单");


export { Menu }