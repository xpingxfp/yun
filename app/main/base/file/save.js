import { getCurrentFile } from "./index.js";

let fileHandle = await getCurrentFile("yun.json");
let file = await fileHandle.getFile();
let text = await file.text();


let jsonText = JSON.parse(text);

jsonText.tel = "12345678912";

export async function save() {
    const jsonString = JSON.stringify(jsonText, null, 2);

    const writable = await fileHandle.createWritable();

    await writable.write(jsonString);

    await writable.close();
}

async function logSave() {
    await save();
    file = await fileHandle.getFile();
    text = await file.text();
    let json = JSON.parse(text);
    console.log(json);
}
