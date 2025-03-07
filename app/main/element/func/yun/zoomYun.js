
/** 
 * @param {Yun} yun
 * @returns {function} destroy
 */
export function zoomYun(yun) {
    function wheelHandler(e) {
        if (!e.ctrlKey) return;
        e.preventDefault();

        const zoomDirection = Math.sign(e.deltaY) > 0 ? -1 : 1;
        const zoomFactor = e.shiftKey ? 0.01 : 0.1;
        const newScale = Math.max(0.1, Math.min(yun.data.scale + zoomDirection * zoomFactor, 10));

        let size = {
            w: yun.data.size.width * newScale,
            h: yun.data.size.height * newScale,
        }

        yun.setSize(size.w, size.h);
    }

    yun.body.addEventListener('wheel', wheelHandler);

    return function destroy() {
        yun.body.removeEventListener('wheel', wheelHandler);
    };
}

