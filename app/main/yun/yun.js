const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = '../../main/yun/yun.css';
document.head.appendChild(style);

// 随机id
function generateRandomId() {
    const timestamp = new Date().getTime().toString(36);
    const randomPart = (Math.random() * 36 ** 9 << 0).toString(36);
    return `N${timestamp}${randomPart}`;
}

// 节点类
export class Yun {
    constructor() {
        this.data = { pos: { x: 0, y: 0 }, scale: 1, size: { width: 100, height: 100 } };
        this.subYuns = [];
        this.body = null;
        this.state = 'free';
        this.content = {};
    }

    setSize(w, h) {
        if (w < 50) w = 50;
        if (h < 25) h = 25;
        this.data.size.width = w;
        this.data.size.height = h;
        this.body.style.width = `${this.data.size.width}px`;
        this.body.style.height = `${this.data.size.height}px`;
    }

    setPosition(x, y) {
        this.data.pos.x = x;
        this.data.pos.y = y;
        this.body.style.transform = `translate(${this.data.pos.x}px, ${this.data.pos.y}px)`;
    }

    // 创建云
    createYun() {
        this.body = document.createElement('div');
        this.body.id = generateRandomId();
        this.body.classList.add('yun');
        this.#eventDetection();
    }

    setID(id) {
        this.body.id = id;
    }

    addSubYun(element) {
        this.subYuns.push(element);
    }

    // 事件检测
    #eventDetection() {
        let yun = this;
        this.body.addEventListener('Ychecked', () => {
            this.body.classList.add('checked');
        })

        this.body.addEventListener('YcheckedRemove', () => {
            this.body.classList.remove('checked');
        })

        this.body.addEventListener('mousedown', (e) => {
            if (e.button != 0) return;
            let checkedEvent = new CustomEvent("Ychecked");
            this.body.dispatchEvent(checkedEvent);
            if (e.ctrlKey) return;
            let checkedYuns = document.querySelectorAll('.checked');
            let checkedRemoveEvent = new CustomEvent("YcheckedRemove");
            for (let yun of checkedYuns) {
                yun.dispatchEvent(checkedRemoveEvent);
            }
            this.body.dispatchEvent(checkedEvent);
        })

        this.body.addEventListener('Ymove', (e) => {
            this.setPosition(this.data.pos.x + e.detail.dx, this.data.pos.y + e.detail.dy);
        })

        this.body.addEventListener("Yhandle", (e) => {
            e.detail(yun);
        });

        addEventListener("Ndelete", function (e) { });

        this.body.addEventListener("YaddSubYun", function (e) {
            let subYun = document.querySelector(`#${e.detail}`);
            yun.addSubYun(subYun);
        });
        addEventListener("NremoveSubYun", function (e) { });
        addEventListener("NinputOff", function (e) { });
        addEventListener("Noutput", function (e) { });
        addEventListener("Ninput", function (e) { });
        addEventListener("NgetData", function (e) { });
        addEventListener("NputData", function (e) { })
        addEventListener("Nupdate", function (e) { });
        this.body.addEventListener("Yupdating", function (e) {
            if (!yun.#handleNupdating(e)) return;
            console.log("Yupdating");

        });
        addEventListener("Nloop", function (e) { });
        addEventListener("NupdateComplete", function (e) { });
        addEventListener('NchangeState', (e) => { });
    }

    /**
     * 设置处理 Nupdating 事件的回调函数
     * @param {function} callback - 用户提供的回调函数
     */
    setUpdatingEventHandler(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        this.callback = callback;
    }

    /**
     * 内部方法，用于处理 Nupdating 事件
     * @param {Event} e - The event object.
     */
    #handleNupdating(e) {
        if (this.callback) {
            this.callback(e);
            return 1;
        } else {
            console.log('No callback function has been set.');
        }
    }
}




