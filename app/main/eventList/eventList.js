/**
 * 事件列表
 */
export let eventList = {
    YaddSubYun: (m_detail) => {
        let event = new CustomEvent("YaddSubYun", { detail: m_detail });
        return event;
    },
    /** @param {function} m_detail */
    Yhandle: (m_detail) => {
        let event = new CustomEvent("Yhandle", { detail: m_detail });
        return event;
    }
}