
class EventList {
    constructor() {
        this.event = null;
    }

    NconnectionSuccess(dot, connectingObject) {
        let eventDetail = {
            dot: dot,
            connectingObject: connectingObject,
            type: "NconnectionSuccess"
        };
        this.event = new CustomEvent("NconnectionSuccess", { detail: eventDetail });

    }

    Ndelete() {
        let eventDetail = {
            type: "Ndelete"
        };
        this.event = new CustomEvent("Ndelete", { detail: eventDetail });
    }

    Ninput(inputObject, content, node) {
        let eventDetail = {
            type: "Ninput",
            inputObject: inputObject,
            content: content,
            node: node
        };
        this.event = new CustomEvent("Ninput", { detail: eventDetail });
    }

    NinputOff(inputObject) {
        let eventDetail = {
            type: "NinputOff",
            inputObject: inputObject
        };
        this.event = new CustomEvent("NinputOff", { detail: eventDetail });
    }

    Noutput(outputObject, content) {
        let eventDetail = {
            type: "Noutput",
            outputObject: outputObject,
            content: content
        };
        this.event = new CustomEvent("Noutput", { detail: eventDetail });
    }

    NoutputOff(outputObject) {
        let eventDetail = {
            type: "NoutputOff",
            outputObject: outputObject
        };
        this.event = new CustomEvent("NoutputOff", { detail: eventDetail });
    }

    Nupdate(node) {
        let eventDetail = {
            type: "Nupdate",
            node: node
        };
        this.event = new CustomEvent("Nupdate", { detail: eventDetail });
    }

    error() {
        let eventDetail = {
            type: "error"
        };
        this.event = new CustomEvent("error", { detail: eventDetail });
    }

}

export { EventList };