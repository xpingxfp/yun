
import { BaseScript } from './baseScript.js';
import { Menu } from './menu.js';
import { Node } from './node.js';


let editorMenu = new Menu('编辑器');

let bs = new BaseScript();
bs.addStyle("./styles/editor.css");

class Editor { }


let fileData = {
    name: "",
    type: "",
    content: "",
    source: null,
}

let editor = document.createElement('div');
editor.id = 'editor';

editor.classList.add('hide');

let menu = document.createElement('div');
menu.classList.add('editor-menu');

// 拖动编辑器
menu.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    e.preventDefault();

    let startX = e.clientX;
    let startY = e.clientY;
    let startLeft = editor.offsetLeft;
    let startTop = editor.offsetTop;
    let mousemove = function (e) {
        editor.classList.add('dragging');

        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        // 窗口边缘检测
        if (newLeft < 0) {
            newLeft = 0;
        }
        if (newTop < 0) {
            newTop = 0;
        }
        if (newLeft + editor.offsetWidth > window.innerWidth) {
            newLeft = window.innerWidth - editor.offsetWidth;
        }
        if (newTop + editor.offsetHeight > window.innerHeight) {
            newTop = window.innerHeight - editor.offsetHeight;
        }

        // 移动编辑器
        editor.style.left = newLeft + 'px';
        editor.style.top = newTop + 'px';
    }
    let mouseup = function (e) {
        editor.classList.remove('dragging');
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
    }
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
});

let menuItems = {
    "打开": function () {
        let file = document.createElement('input');
        file.type = 'file';
        file.addEventListener('change', function (e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                textArea.value = e.target.result;
                fileData.name = file.name;
                fileData.type = file.type;
                fileData.content = e.target.result;
                fileData.source = file;

                footerText.innerText = file.name + '(' + file.type + ')';
            }
        });
        file.click();
    },
    "保存": function () {
        let file = document.createElement('input');
        file.type = 'file';
        file.addEventListener('change', function (e) {
            let file = e.target.files[0];
            let content = textArea.value;
            let blob = new Blob([content], { type: fileData.type });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = fileData.name;
            a.click();
            URL.revokeObjectURL(url);
        });
        file.click();
    },
    "传递": function () {
        let content = textArea.value;
    },
    "清空": function () {
        textArea.value = "";
    },
}

for (let item in menuItems) {
    let menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    let menuText = document.createElement('span');
    menuText.innerText = item;
    menuItem.appendChild(menuText);
    menuItem.addEventListener('click', menuItems[item]);
    menu.appendChild(menuItem);
}


editor.appendChild(menu);

let content = document.createElement('div');
content.classList.add('content');
editor.appendChild(content);

let textArea = document.createElement('textarea');
content.appendChild(textArea);
document.body.appendChild(editor);

let footer = document.createElement('div');
footer.classList.add('footer');
let footerText = document.createElement('span');
footerText.innerText = 'footer';
footer.appendChild(footerText);
editor.appendChild(footer);



let resizerBottomRight = document.createElement('div');
resizerBottomRight.classList.add('resizer-bottom-right');
resizerBottomRight.addEventListener('mousedown', function (e) {
    e.preventDefault();
    let startX = e.clientX;
    let startY = e.clientY;
    let startWidth = editor.offsetWidth;
    let startHeight = editor.offsetHeight;
    let startRight = editor.offsetLeft + startWidth;
    let startBottom = editor.offsetTop + startHeight;
    let mousemove = function (e) {
        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        let newWidth = startWidth + deltaX;
        let newHeight = startHeight + deltaY;
        let newRight = startRight + deltaX;
        let newBottom = startBottom + deltaY;
        if (newWidth > 188) {
            editor.style.width = newWidth + 'px';
        }
        if (newHeight > 100) {
            editor.style.height = newHeight + 'px';
        }
        if (newRight > window.innerWidth) {
            editor.style.left = window.innerWidth - newWidth + 'px';
        }
        if (newBottom > window.innerHeight) {
            editor.style.top = window.innerHeight - newHeight + 'px';
        }
    }
    let mouseup = function (e) {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
    }
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
});

editor.appendChild(resizerBottomRight);

let fullscreen = document.createElement('div');
fullscreen.classList.add('full');
fullscreen.classList.add('menu-item');
let fullscreenText = document.createElement('span');
fullscreenText.innerText = '<>';
fullscreen.appendChild(fullscreenText);

fullscreen.addEventListener('click', function () {
    // 判断当前是否全屏
    if (document.fullscreenElement) {
        document.exitFullscreen();
        editor.appendChild(resizerBottomRight);
        fullscreenText.innerText = '<>';
    } else {
        fullscreenText.innerText = '><';
        editor.requestFullscreen();
        editor.removeChild(resizerBottomRight);
    }
});
menu.appendChild(fullscreen);

let fulleditor = document.createElement('div');
fulleditor.classList.add('fulleditor');
let fulleditorText = document.createElement('span');
fulleditorText.innerText = '<>';
fulleditor.appendChild(fulleditorText);
content.appendChild(fulleditor);
let isFull = false;

fulleditor.addEventListener('click', function () {
    // 判断当前是否全编辑器
    if (isFull) {
        isFull = false;
        // 显示菜单栏和footer
        editor.classList.remove('fulleditor');
        editor.appendChild(menu);
        editor.appendChild(footer);
        // 调整content
        content.style.top = '30px';
        content.style.bottom = '20px';
        fulleditorText.innerText = '<>';
    } else {
        isFull = true;
        // 隐藏菜单栏和footer
        editor.classList.add('fulleditor');
        editor.removeChild(menu);
        editor.removeChild(footer);
        // 调整content
        content.style.top = '0px';
        content.style.bottom = '0px';
        fulleditorText.innerText = '><';
    }
});

let close = document.createElement('div');
close.classList.add('close');
close.classList.add('menu-item');
let closeText = document.createElement('span');
closeText.innerText = '+';
close.appendChild(closeText);
close.addEventListener('click', function () {
    editor.classList.add('hide');
});
menu.appendChild(close);

function showEditor() {
    editor.classList.remove('hide');
}

editorMenu.addItem('显示编辑器', showEditor);

function createEditorNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();

    node.addInputDot();
    node.addOutputDot();

    node.addClass('editor-node');

    let data = {
        name: null,
        type: null,
        content: null,
        source: null,
    };

    // header
    node.header.innerText = '';

    node.header.classList.add('editor-menu');

    let menuitems = {
        "打开": function () {
            let file = document.createElement('input');
            file.type = 'file';
            file.addEventListener('change', function (e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function (e) {
                    textArea.value = e.target.result;
                    data.name = file.name;
                    data.type = file.type;
                    data.content = e.target.result;
                    data.source = file;

                    footerText.innerText = file.name + '(' + file.type + ')';
                }
            });
            file.click();
        },
        "保存": function () {
            let file = document.createElement('input');
            file.type = 'file';
            file.addEventListener('change', function (e) {
                let file = e.target.files[0];
                let content = textArea.value;
                let blob = new Blob([content], { type: fileData.type });
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = fileData.name;
                a.click();
                URL.revokeObjectURL(url);
            });
            file.click();
        },
        "传递": function () {
            let content = textArea.value;
        },
        "清空": function () {
            textArea.value = "";
        },
        "全屏": function () {
            // 判断当前是否全屏
            if (document.fullscreenElement) {
                document.exitFullscreen();
                // node.nodeBox.appendChild(resizerBottomRight);
            } else {
                node.node.requestFullscreen();
                // node.nodeBox.removeChild(resizerBottomRight);
            }
        },
        '打印': function () {
            console.log(data);
        },
    };

    for (let item in menuitems) {
        let menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        let menuText = document.createElement('span');
        menuText.innerText = item;
        menuItem.appendChild(menuText);
        menuItem.addEventListener('click', menuitems[item]);
        node.header.appendChild(menuItem);
    }

    // content
    node.content.innerText = '';
    node.content.classList.add('editor-content');

    let textArea = document.createElement('textarea');
    textArea.classList.add('editor-textarea');
    node.content.appendChild(textArea);

    // footer
    let footer = document.createElement('div');
    footer.classList.add('editor-footer');
    let footerText = document.createElement('span');
    footerText.innerText = 'footer';
    footer.appendChild(footerText);

    node.nodeBox.appendChild(footer)
}

editorMenu.addItem('创建编辑器节点', createEditorNode);

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

function createHTMLEditorNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();

    node.addInputDot();
    node.addOutputDot();

    node.addClass('editor-node');

    let data = {
        name: null,
        type: null,
        content: null,
        source: null,
    };

    // header
    node.header.innerText = '';

    node.header.classList.add('editor-menu');

    let menuitems = {
        "传递": function () {
            // data.source.node.outerHTML = data.content;
        },
        "全屏": function () {
            // 判断当前是否全屏
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                node.node.requestFullscreen();
            }
        },
    };

    for (let item in menuitems) {
        let menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        let menuText = document.createElement('span');
        menuText.innerText = item;
        menuItem.appendChild(menuText);
        menuItem.addEventListener('click', menuitems[item]);
        node.header.appendChild(menuItem);
    }

    // content
    node.content.innerText = '';
    node.content.classList.add('editor-content');

    let textArea = document.createElement('textarea');
    textArea.classList.add('editor-textarea');
    node.content.appendChild(textArea);

    textArea.value = "不建议使用此功能，目前阶段无法实现"

    // 检测textarea内容是否改变
    textArea.addEventListener('input', function () {
        data.content = textArea.value;
    });

    // footer
    let footer = document.createElement('div');
    footer.classList.add('editor-footer');
    let footerText = document.createElement('span');
    footerText.innerText = 'html';
    footer.appendChild(footerText);

    node.nodeBox.appendChild(footer)

    // 事件检测
    node.node.addEventListener('Ninput', function (e) {

        let obj = e.detail.node;

        let id = obj.id;

        data.name = id + '.html';
        data.type = 'text/html';
        data.source = obj;

        let html = simpleFormatHTML(obj.node.outerHTML);

        textArea.value = html;
        footerText.innerText = data.name + '(' + data.type + ')';
    });
}

editorMenu.addItem('创建HTML编辑器节点', createHTMLEditorNode, true);

function createCSSEditorNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();

    node.addInputDot();
    node.addOutputDot();

    node.addClass('editor-node');

    let data = {
        name: null,
        type: null,
        content: null,
        source: null,
    };

    // header
    node.header.innerText = '';

    node.header.classList.add('editor-menu');

    let menuitems = {
        "传递": function () {
            let oldStyle = data.source.node.querySelector('style');
            if (oldStyle) {
                data.source.node.removeChild(oldStyle);
            }
            let style = document.createElement('style');
            style.innerHTML = data.content;
            data.source.node.appendChild(style);
        },
        "全屏": function () {
            // 判断当前是否全屏
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                node.node.requestFullscreen();
            }
        },
        "打印": function () {
            console.log(data);
        },
    };

    for (let item in menuitems) {
        let menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        let menuText = document.createElement('span');
        menuText.innerText = item;
        menuItem.appendChild(menuText);
        menuItem.addEventListener('click', menuitems[item]);
        node.header.appendChild(menuItem);
    }

    // content
    node.content.innerText = '';
    node.content.classList.add('editor-content');

    let textArea = document.createElement('textarea');
    textArea.classList.add('editor-textarea');
    node.content.appendChild(textArea);

    // 检测textarea内容是否改变
    textArea.addEventListener('input', function () {
        data.content = textArea.value;
    });

    // footer
    let footer = document.createElement('div');
    footer.classList.add('editor-footer');
    let footerText = document.createElement('span');
    footerText.innerText = 'css';
    footer.appendChild(footerText);

    node.nodeBox.appendChild(footer)

    // 事件检测
    node.node.addEventListener('Ninput', function (e) {

        let obj = e.detail.node;

        let id = obj.id;

        data.name = id + '.css';
        data.type = 'text/css';
        data.source = obj;

        textArea.value = "#" + id + "{\n\n}";
        footerText.innerText = data.name + '(' + data.type + ')';
    });
}

editorMenu.addItem('创建CSS编辑器节点', createCSSEditorNode);


function createJSEditorNode() {
    let node = new Node();
    node.quicknodecreation();
    node.quickSetPos();
    node.addInputDot();
    node.addOutputDot();

    node.addClass('editor-node');

    let data = {
        name: null,
        type: null,
        content: null,
        source: null,
    };

    // header
    node.header.innerText = '';

    node.header.classList.add('editor-menu');

    let menuitems = {
        "传递": function () {
            let oldScript = data.source.node.querySelector('script');
            if (oldScript) {
                data.source.node.removeChild(oldScript);
            }
            let script = document.createElement('script');
            script.innerHTML = data.content;
            data.source.node.appendChild(script);
        },
        "全屏": function () {
            // 判断当前是否全屏
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                node.node.requestFullscreen();
            }
        },
    };

    for (let item in menuitems) {
        let menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        let menuText = document.createElement('span');
        menuText.innerText = item;
        menuItem.appendChild(menuText);
        menuItem.addEventListener('click', menuitems[item]);
        node.header.appendChild(menuItem);
    }

    // content
    node.content.innerText = '';
    node.content.classList.add('editor-content');

    let textArea = document.createElement('textarea');
    textArea.classList.add('editor-textarea');
    node.content.appendChild(textArea);

    textArea.value = "不建议使用此功能，目前阶段无法实现"

    // 检测textarea内容是否改变
    textArea.addEventListener('input', function () {
        data.content = textArea.value;
    });

    // footer
    let footer = document.createElement('div');
    footer.classList.add('editor-footer');
    let footerText = document.createElement('span');
    footerText.innerText = 'javascript';
    footer.appendChild(footerText);

    node.nodeBox.appendChild(footer)

    // 事件检测
    node.node.addEventListener('Ninput', function (e) {

        let obj = e.detail.node;

        let id = obj.id;

        data.name = id + '.js';
        data.type = 'text/javascript';
        data.source = obj;

        textArea.value = "let " + id + " = document.getElementById('" + id + "');";
        footerText.innerText = data.name + '(' + data.type + ')';
    });


}

editorMenu.addItem('创建JavaScript编辑器节点', createJSEditorNode, true);


editorMenu.show();

export { Editor };
