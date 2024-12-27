

import { BaseScript } from './baseScript.js';
import { Menu } from "./menu.js";
import { Node } from "./node.js";
import { BaseBoard } from './baseBoard.js';
import { EventList } from './eventList.js';

let eventList = new EventList();

let dMenu = new Menu('基础节点');

let bs = new BaseScript();
bs.addStyle("./styles/baseNode.css");

let nodeTypes = {
    'number': {
        'number': '数字',
        'int': '整数',
        'float': '浮点数',
        'num': '数字',
    },
    'text': {
        'string': '文本',
        'txt': '文本',
        'text': '文本',
        'json': 'JSON',
        'xml': 'XML',
        'html': 'HTML',
        'css': 'CSS',
        'javascript': 'JavaScript',
        'url': 'URL',
    },
    'image': {
        'image': '图片',
        'jpg': 'JPG图片',
        'png': 'PNG图片',
        'gif': 'GIF图片',
        'webp': 'WebP图片',
        'psd': 'PSD图片',
        'ai': 'AI图片',
        'eps': 'EPS图片',
        'pdf': 'PDF图片',
    },
    'video': {
        'video': '视频',
        'mp4': 'MP4视频',
        'mov': 'MOV视频',
        'avi': 'AVI视频',
        'mkv': 'MKV视频',
        'wmv': 'WMV视频',
        'flv': 'FLV视频',
        'webm': 'WebM视频',
    },
    'audio': {
        'audio': '音频',
        'mp3': 'MP3音频',
        'wav': 'WAV音频',
        'ogg': 'OGG音频',
        'flac': 'FLAC音频',
        'aac': 'AAC音频',
        'amr': 'AMR音频',
    },
}

function getMenuPos() {
    let menuBox = document.getElementById("menuBox");
    let x = menuBox.offsetLeft;
    let y = menuBox.offsetTop;

    let BBPos = BaseBoard.pos;
    x = x - BBPos.x;
    y = y - BBPos.y;

    let BBScale = BaseBoard.scale
    x = (x / BBScale);
    y = (y / BBScale);

    return { x: x, y: y };
}

function createNode() {
    let node = new Node();
    let menuPos = getMenuPos();
    node.setPos(menuPos.x, menuPos.y);
    node.quicknodecreation();
    node.addInputDot();
    node.addOutputDot();
    node.addToNodes();
    return node;
}

// 空白节点
function blankNode() {
    let node = createNode();
    node.setHeader('空白节点');
}

dMenu.addItem('空白节点', blankNode);

function intNode() {
    let node = createNode();
    node.setType('int');
    node.addClass('NT_number');
    node.addClass('NT_int');
    node.setHeader('整数');
    let input = document.createElement('input');
    node.content.appendChild(input);
    node.setSize(100, 50);
    node.data = { value: 0 };

    input.addEventListener('change', function () {
        let value = parseInt(input.value);
        if (isNaN(value)) {
            input.value = 0;
        }
        node.data.value = value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'int') {
            let value = parseInt(e.detail.node.data.value);
            node.data.value = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        input.value = node.data.value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

// dMenu.addItem('整数', intNode);

function numbertNode() {
    let node = createNode();
    node.setType('number');
    node.addClass('NT_number');
    node.setHeader('数字');
    let input = document.createElement('input');
    node.content.appendChild(input);
    node.setSize(100, 50);
    node.data = { value: 0, type: 'num' };

    input.addEventListener('change', function () {
        let value = parseFloat(input.value);
        if (isNaN(value)) {
            input.value = 0;
        }
        node.data.value = value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'number') {
            let value = parseFloat(e.detail.node.data.value);
            node.data.value = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        input.value = node.data.value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('数字', numbertNode);

function textNode() {
    let node = createNode();
    node.setType('string');
    node.addClass('NT_string');
    node.setHeader('文本');
    let textarea = document.createElement('textarea');
    textarea.classList.add('NC_textarea');
    node.content.appendChild(textarea);
    node.setSize(100, 50);
    node.data = { value: '' };

    textarea.addEventListener('change', function () {
        let value = textarea.value;
        node.data.value = value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'string') {
            let value = e.detail.node.data.value;
            node.data.value = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        textarea.value = node.data.value;
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('文本', textNode);

function imageNode() {
    let node = createNode();
    node.setType('image');
    node.addClass('NT_image');
    node.setHeader('图片');
    let img = document.createElement('img');
    img.classList.add('NC_image');
    node.content.appendChild(img);
    node.data = { value: '' };

    let openImage = function () {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function () {
            let file = input.files[0];
            let reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
                node.data.value = e.target.result;
                eventList.NupdateComplete();
                node.node.dispatchEvent(eventList.event)
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    let menuBtn = document.createElement('div');
    menuBtn.classList.add('NC_menuBtn');
    menuBtn.innerHTML = '选择图片';
    menuBtn.addEventListener('click', openImage);
    node.header.appendChild(menuBtn);

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'image') {
            let value = e.detail.node.data.value;
            img.src = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('图片', imageNode);

function videoNode() {
    let node = createNode();
    node.setType('video');
    node.addClass('NT_video');
    node.setHeader('视频');
    let video = document.createElement('video');
    video.controls = true;
    video.classList.add('NC_video');
    node.content.appendChild(video);
    node.data = { value: '' };

    let openVideo = function () {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = function () {
            let file = input.files[0];
            let reader = new FileReader();
            reader.onload = function (e) {
                video.src = e.target.result;
                node.data.value = e.target.result;
                eventList.NupdateComplete();
                node.node.dispatchEvent(eventList.event)
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    let menuBtn = document.createElement('div');
    menuBtn.classList.add('NC_menuBtn');
    menuBtn.innerHTML = '选择视频';
    menuBtn.addEventListener('click', openVideo);
    node.header.appendChild(menuBtn);

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'video') {
            let value = e.detail.node.data.value;
            video.src = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('视频', videoNode);

function audioNode() {
    let node = createNode();
    node.setType('audio');
    node.addClass('NT_audio');
    node.setHeader('音频');
    let audio = document.createElement('audio');
    audio.controls = true;
    audio.classList.add('NC_audio');
    node.content.appendChild(audio);
    node.data = { value: '' };

    let openAudio = function () {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = function () {
            let file = input.files[0];
            let reader = new FileReader();
            reader.onload = function (e) {
                audio.src = e.target.result;
                node.data.value = e.target.result;
                eventList.NupdateComplete();
                node.node.dispatchEvent(eventList.event)
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    let menuBtn = document.createElement('div');
    menuBtn.classList.add('NC_menuBtn');
    menuBtn.innerHTML = '选择音频';
    menuBtn.addEventListener('click', openAudio);
    node.header.appendChild(menuBtn);

    node.node.addEventListener('Ninput', (e) => {
        let inType = e.detail.type;
        if (inType == 'audio') {
            let value = e.detail.node.data.value;
            audio.src = value;
        }
        eventList.Nupdating();
        node.node.dispatchEvent(eventList.event)
    });

    node.node.addEventListener('Nupdating', (e) => {
        eventList.NupdateComplete();
        node.node.dispatchEvent(eventList.event)
    });

}

dMenu.addItem('音频', audioNode);


dMenu.show();


export { nodeTypes };