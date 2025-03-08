/**
 * 事件列表
 */
export let eventList = {
    YaddSubYun: (m_detail) => {
        let event = new CustomEvent("YaddSubYun", { detail: m_detail });
        return event;
    },
    /** @param {function} func */
    Yhandle: (func) => {
        let event = new CustomEvent("Yhandle", { detail: func });
        return event;
    },
    /** @param {id} id */
    YaddSubYun: (id) => {
        let event = new CustomEvent("YaddSubYun", { detail: id });
        return event;

    }
}