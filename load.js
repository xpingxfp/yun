function check() {
    checkIndexedDB();
    checkPermissions();
    let btn = document.createElement('button');
    btn.innerHTML = '开始';
    document.body.appendChild(btn);
    btn.onclick = () => {
        window.location.href = '/app/page/start.html';
    }
}

function checkIndexedDB() {
    let yunDB = window.indexedDB.open('yunDB', 1);

    yunDB.onerror = (error) => {
        window.location.href = '/install.html';
        console.error(error);
    }

    yunDB.onupgradeneeded = (event) => {
        let db = event.target.result;
        db.createObjectStore('app');
        db.createObjectStore('save');
        window.location.href = '/install.html';
    }

    yunDB.onsuccess = (event) => {
        let db = event.target.result;

        if (!db.objectStoreNames.contains('app')) window.location.href = '/install.html';

        let transaction = db.transaction(['app'], 'readonly');
        let objectStore = transaction.objectStore('app');

        let getDirHandleRequest = objectStore.get('dirHandle');
        getDirHandleRequest.onerror = (event) => {
            console.error(`Error fetching directory handle from DB: ${event.target.error}`);
        };

        getDirHandleRequest.onsuccess = () => {
            let dirHandle = getDirHandleRequest.result;

            if (!dirHandle) {
                window.location.href = '/install.html';
            }
        }
    }
}

function checkPermissions() {
    let request = indexedDB.open('yunDB', 1);
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    request.onsuccess = async (event) => {
        let db = event.target.result;
        let transaction = db.transaction(['app'], 'readonly');
        let objectStore = transaction.objectStore('app');

        let getDirHandleRequest = objectStore.get('dirHandle');

        getDirHandleRequest.onerror = (event) => {
            console.error(`Error fetching directory handle from DB: ${event.target.error}`);
        };

        getDirHandleRequest.onsuccess = async () => {
            let dirHandle = getDirHandleRequest.result;

            if (!dirHandle) {
                console.error("无法找到或恢复目录句柄");
                return;
            }

            const permissionStatus = await dirHandle.queryPermission();
            if (permissionStatus === 'prompt') {
                let btn = document.createElement('button');
                btn.innerHTML = '授权访问权限';
                btn.style.zIndex = "9999";
                document.body.appendChild(btn);
                btn.onclick = async () => {
                    let permission = await dirHandle.requestPermission();
                    if (permission === 'granted') location.reload();
                }
            }
        };
    };
}

check();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('Service Worker 已成功注册，scope 是:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker 注册失败:', error);
            });
    });
} else {
    console.log('当前浏览器不支持 Service Worker');
}