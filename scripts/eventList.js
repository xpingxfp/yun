
class EventList {
    constructor() {
        this.event = null;
    }

    NconnectionSuccess(connectingObject) {
        let eventDetail = {
            connectingObject: connectingObject,
            eventName: "NconnectionSuccess"
        };
        this.event = new CustomEvent("NconnectionSuccess", { detail: eventDetail });
    }

    Ndelete() {
        let eventDetail = {
            eventName: "Ndelete"
        };
        this.event = new CustomEvent("Ndelete", { detail: eventDetail });
    }

    // 上级节点删除时触发
    NremoveSuperior(node) {
        let eventDetail = {
            eventName: "NremoveSuperior",
            node: node
        };
        this.event = new CustomEvent("NremoveSuperior", { detail: eventDetail });
    }

    Ninput(inputObject, content, node, type) {
        let eventDetail = {
            eventName: "Ninput",
            type: type,
            inputObject: inputObject,
            content: content,
            node: node
        };
        this.event = new CustomEvent("Ninput", { detail: eventDetail });
    }

    NinputOff(inputObject) {
        let eventDetail = {
            eventName: "NinputOff",
            node: inputObject
        };
        this.event = new CustomEvent("NinputOff", { detail: eventDetail });
    }

    Noutput(outputObject, content) {
        let eventDetail = {
            eventName: "Noutput",
            outputObject: outputObject,
            content: content
        };
        this.event = new CustomEvent("Noutput", { detail: eventDetail });
    }

    NoutputOff(outputObject) {
        let eventDetail = {
            eventName: "NoutputOff",
            outputObject: outputObject
        };
        this.event = new CustomEvent("NoutputOff", { detail: eventDetail });
    }

    NgetData(dataName, data) {
        let eventDetail = {
            eventName: "NgetData",
            dataName: dataName,
            data: data
        };
        this.event = new CustomEvent("NgetData", { detail: eventDetail });
    }

    NputData(dataName, putAim, data) {
        let eventDetail = {
            eventName: "NputData",
            dataName: dataName,
            putAim: putAim,
            data: data
        };
        this.event = new CustomEvent("NputData", { detail: eventDetail });
    }

    Nupdate(node) {
        let eventDetail = {
            eventName: "Nupdate",
            node: node
        };
        this.event = new CustomEvent("Nupdate", { detail: eventDetail });
    }

    Nupdating() {
        let eventDetail = {
            eventName: "Nupdating"
        };
        this.event = new CustomEvent("Nupdating", { detail: eventDetail });
    }

    NupdateComplete() {
        let eventDetail = {
            eventName: "NupdateComplete",
        };
        this.event = new CustomEvent("NupdateComplete", { detail: eventDetail });
    }

    NinTransitEnd() {

    }

    // 在循环中触发，循环结束时触发
    Nloop() {
        let eventDetail = {
            eventName: "Nloop"
        };
        this.event = new CustomEvent("Nloop", { detail: eventDetail });
    }

    error() {
        let eventDetail = {
            eventName: "error"
        };
        this.event = new CustomEvent("error", { detail: eventDetail });
    }

}

export { EventList };