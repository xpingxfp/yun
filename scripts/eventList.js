
class EventList {
    constructor() {
        this.event = null;
    }

    NconnectionSuccess(dot, connectingObject) {
        let eventDetail = {
            dot: dot,
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
            inputObject: inputObject
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

    NgetData() {
        let eventDetail = {
            eventName: "NgetData"
        };
        this.event = new CustomEvent("NgetData", { detail: eventDetail });
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

    error() {
        let eventDetail = {
            eventName: "error"
        };
        this.event = new CustomEvent("error", { detail: eventDetail });
    }

}

export { EventList };