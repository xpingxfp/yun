import { page } from "../index.js";
let paths = [];

export class Path {
    constructor() {
        this.body = null;
        this.data = {
            d: '',
            fill: 'none',
            stroke: 'black',
            strokeWidth: 2,
            dot: { start: null, end: null },
        }
        this.init();
    }

    init() {
        this.createPath();
    }

    createPath() {
        if (this.body) return;
        this.body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.body.setAttribute('class', 'path');
    }

    setDot(start, end) {
        this.data.dot.start = start;
        this.data.dot.end = end;
    }

    draw() {
        this.body.setAttribute('d', this.data.d);
        this.body.setAttribute('fill', this.data.fill);
        this.body.setAttribute('stroke', this.data.stroke);
        this.body.setAttribute('stroke-width', this.data.strokeWidth);
    }

    getDotPos() {
        let startRect = this.data.dot.start.body.getBoundingClientRect();
        let endRect = this.data.dot.end.body.getBoundingClientRect();
        let startX = startRect.left + startRect.width / 2 - page.data.pos.x;
        let startY = startRect.top + startRect.height / 2 - page.data.pos.y;
        let endX = endRect.left + endRect.width / 2 - page.data.pos.x;
        let endY = endRect.top + endRect.height / 2 - page.data.pos.y;

        return [startX / page.data.scale,
        startY / page.data.scale,
        endX / page.data.scale,
        endY / page.data.scale];
    }

    drawLine() {
        let [startX, startY, endX, endY] = this.getDotPos();
        let d = `M ${startX} ${startY} L ${endX} ${endY}`;
        this.data.d = d;
        this.draw();
    }

    drawThreeBezierLine() {
        let [startX, startY, endX, endY] = this.getDotPos();
        let xDifference = Math.abs(endX - startX);

        let d = `M ${startX} ${startY} C 
        ${startX + xDifference / 2} ${startY} 
        ${endX - xDifference / 2} ${endY} 
        ${endX} ${endY}`;

        this.data.d = d;
        this.draw();
    }
}