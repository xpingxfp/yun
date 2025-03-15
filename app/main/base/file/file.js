function getDBInstance(dbName, version = 1) {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open(dbName, version);

        request.onerror = (event) => {
            console.error("数据库打开失败", event);
            reject(new Error("数据库打开失败"));
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
    });
}

async function getDirHandle() {
    try {
        let yunDB = await getDBInstance("yunDB");

        let transaction = yunDB.transaction(["app"], "readonly");
        let app_store = transaction.objectStore("app");

        let dirHandleRequest = app_store.get("dirHandle");

        return new Promise((resolve, reject) => {
            dirHandleRequest.onsuccess = () => resolve(dirHandleRequest.result);
            dirHandleRequest.onerror = () => reject(dirHandleRequest.error);
            transaction.oncomplete = () => yunDB.close();
        });
    } catch (error) {
        console.error("从IndexedDB获取目录句柄失败：", error);
        throw error;
    }
}

async function getCurrent() {
    try {
        let yunDB = await getDBInstance("yunDB");

        let transaction = yunDB.transaction(["save"], "readonly");
        let app_store = transaction.objectStore("save");

        let dirHandleRequest = app_store.get("current");

        return new Promise((resolve, reject) => {
            dirHandleRequest.onsuccess = () => resolve(dirHandleRequest.result);
            dirHandleRequest.onerror = () => reject(dirHandleRequest.error);
            transaction.oncomplete = () => yunDB.close();
        });
    } catch (error) {
        console.error("从IndexedDB获取目录句柄失败：", error);
        throw error;
    }
}

export async function getCurrentFile(name) {
    let current = await getCurrent();
    let file = await current.getFileHandle(name, { create: false });
    return file;
}

(async () => {
    let log = await getCurrentFile("yun.log");
    let file = await log.getFile();
    console.log(file);
})()