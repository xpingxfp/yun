let isOnline = true;
if (!navigator.onLine) {
    isOnline = false;
}

window.addEventListener('online', function () {
    isOnline = true;
});

window.addEventListener('offline', function () {
    isOnline = false;
});

let yunDB = window.indexedDB.open('yunDB', 1);

yunDB.onerror = (error) => {
    console.error(error);
}

yunDB.onsuccess = (event) => {
    let db = event.target.result;

    let transaction = db.transaction(['app'], 'readonly');
    let appStore = transaction.objectStore('app');
    let dirHandleRequest = appStore.get('dirHandle');

    dirHandleRequest.onerror = (error) => {
        console.error(error);
    }

    dirHandleRequest.onsuccess = async () => {
        let dirHandle = dirHandleRequest.result;
        // console.log(dirHandle);
        let permission = await dirHandle.queryPermission();
        if (permission != "granted") {
            console.error("请给予文件夹访问权限");
            let requeryPermissionBtn = document.createElement('button');
            requeryPermissionBtn.innerHTML = "给予文件夹访问权限";
            document.body.appendChild(requeryPermissionBtn);
            requeryPermissionBtn.onclick = async () => {
                await dirHandle.requestPermission();
                if (await dirHandle.queryPermission() == "granted") {
                    requeryPermissionBtn.remove();
                    location.reload();
                }
            }
        }
    }
}

function addJSToDoc(url) {
    let script = document.createElement('script');
    script.src = url;
    script.type = "module";
    document.body.appendChild(script);
}

function addCSSToDoc(url) {
    let link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

addJSToDoc('../../path/yuns/allData/allData.js');
addJSToDoc('../../dome/index.js');


