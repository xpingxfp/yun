const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 80;

// 定义支持的MIME类型
const mimes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    txt: 'text/plain'
}

// 创建HTTP服务器
const server = http.createServer((request, response) => {
    //禁止POST请求
    if (request.method !== 'GET') {
        response.writeHead(405, { 'Content-Type': 'text/plain' });
        response.write('Method Not Allowed');
        response.end();
        return;
    }
    let pathname = request.url; // 获取请求的路径
    console.log('Request for' + pathname);
    let root = path.join(__dirname, '../../'); // 设置根目录
    let filePath = root + pathname; // 拼接文件路径
    console.log('Request for' + filePath);
    if (pathname === '/') {
        filePath = root + 'index.html'; // 默认请求index.html
    }

    // 读取文件
    fs.readFile(filePath, (err, data) => {
        //错误处理
        if (err) {
            switch (err.code) {
                case 'ENOENT':
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.write('Not Found');
                    response.end();
                    break;

                case 'EISDIR':
                    response.writeHead(403, { 'Content-Type': 'text/plain' });
                    response.write('Forbidden');
                    response.end();
                    break;

                default:
                    response.writeHead(500, { 'Content-Type': 'text/plain' });
                    response.write('Internal Server Error');
                    response.end();
                    break;
            }
            return;
        };
        //设置mime类型
        let ext = path.extname(filePath).slice(1); // 获取文件扩展名
        // 根据文件扩展名获取对应的 MIME 类型
        // 如果找不到对应的 MIME 类型，则默认为 'application/octet-stream'
        let contentType = mimes[ext] || 'application/octet-stream';

        // responst.setHeader('Content-Type', contentType + '; charset=UTF-8');
        response.setHeader('Content-Type', contentType); // 设置响应头

        response.end(data); // 结束响应，发送数据
    });
});

// 监听3000端口
server.listen(port, () => {
    console.log('Server is running at http://localhost/'); // 服务器启动提示
});