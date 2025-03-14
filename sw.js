const CACHE_NAME = `yun-v1`;
const MIME_STORE_NAME = 'mimeTypes';

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll([
            '/',
            '/index.html',
            '/manifest.json',
            '/icon.png',
        ]);
        self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.filter(name => name !== CACHE_NAME)
                .map(name => caches.delete(name))
        );
        clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    let url = new URL(event.request.url);
    let path = url.pathname;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        } else {
            try {
                const dirHandleOrRedirect = await getDirHandle();

                if (dirHandleOrRedirect.type === 'redirect') {
                    const response = await fetch(dirHandleOrRedirect.url);
                    return response;
                } else {
                    const fileHandle = await getFileFromDirHandle(path, dirHandleOrRedirect);

                    if (fileHandle) {
                        const file = await fileHandle.getFile();
                        const blob = await file.arrayBuffer();
                        return new Response(blob, {
                            headers: {
                                'Content-Type': await getContentTypeFromDB(path)
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('无法获取文件:', error);
            }
            return fetch(event.request);
        }
    })());
});

async function getContentTypeFromDB(path) {
    const db = await openMimeDb();
    const transaction = db.transaction([MIME_STORE_NAME], 'readonly');
    const store = transaction.objectStore(MIME_STORE_NAME);

    const ext = path.split('.').pop().toLowerCase();
    const request = store.get(ext);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result || 'application/octet-stream');
        };
        request.onerror = () => {
            reject(new Error('Failed to retrieve MIME type'));
        };
    });
}

function openMimeDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('mimeDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(MIME_STORE_NAME, { keyPath: 'ext' });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(new Error(`Database error: ${event.target.errorCode}`));
        };
    });
}

async function getDirHandle() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open('yunDB', 1);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            resolve({ type: 'redirect', url: '/index.html' });
        };

        request.onupgradeneeded = (event) => {
            console.warn('indexedDB未注册');
            resolve({ type: 'redirect', url: '/index.html' });
        }

        request.onsuccess = async (event) => {
            let db = event.target.result;
            let transaction = db.transaction(['app'], 'readonly');
            let objectStore = transaction.objectStore('app');

            let getDirHandleRequest = objectStore.get('dirHandle');

            getDirHandleRequest.onerror = (event) => {
                reject(new Error(`Error fetching directory handle from DB: ${event.target.error}`));
            };

            getDirHandleRequest.onsuccess = async (event) => {
                let dirHandle = getDirHandleRequest.result;

                if (!dirHandle) {
                    resolve({ type: 'redirect', url: '/index.html' });
                    return;
                }

                const permissionStatus = await dirHandle.queryPermission();
                if (permissionStatus !== 'granted') {
                    resolve({ type: 'redirect', url: '/index.html' });
                    return;
                }
                resolve(dirHandle);
            };
        };
    });
}

async function getFileFromDirHandle(path, dirHandle) {
    let segments = path.split('/').filter(segment => segment !== '');

    let yunHandle = await dirHandle.getDirectoryHandle('yun');
    let currentHandle = await yunHandle.getDirectoryHandle('app');

    try {
        let lastSegment = segments[segments.length - 1];
        let fileNameParts = lastSegment.split('.');
        let isFile = fileNameParts.length > 1;

        for (let i = 0; i < segments.length - 1; i++) {
            let segment = segments[i];
            currentHandle = await currentHandle.getDirectoryHandle(segment);
        }

        let targetHandle;
        if (isFile) {
            let fileName = segments[segments.length - 1];
            targetHandle = await currentHandle.getFileHandle(fileName);
        } else {
            targetHandle = await currentHandle.getFileHandle('index.html');
        }

        return targetHandle;
    } catch (error) {
        console.log('getting file from dir handle:', error);
        return null;
    }
}