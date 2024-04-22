// common core modules...
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const logEvent = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};
// initialize object ... 
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvent(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    //console.log(`In serveFile and filePath = ${filePath} and contentType = ${contentType}`);
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : '' // since a string is expected an empty string is used for image content type
        );

        //console.log(contentType);
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;

        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            {'Content-Type': contentType});

        response.end(contentType === 'application/json' ? JSON.stringify(data) : data);

    } catch (err) {
        console.log(err);
        myEmitter.emit('log',  `${err.name}:\t${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end(
        );
    }
    //console.log(`serveFile filePath = ${filePath}`);
}
//
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    myEmitter.emit('log',  `${req.url}\t${req.method}`, 'reqLog.txt');


    const extension  = path.extname(req.url); // get the extension from the request url
    //console.log(`Extension: ${extension}`);
    let contentType; // variable to hold the content type once determined via a switch statement

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // this makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';
    //console.log(`This is the filepath --- ${filePath}`);
    
    //console.log(`path.parse = ${path.parse(filePath).base}`);

    const fileExists = fs.existsSync(filePath);

    if (fileExists){ 
        // serve the file
        serveFile(filePath, contentType, res);
        //console.log(`File Exists: path.parse = ${path.parse(filePath).base}`);
    }else{
        //console.log(`File Does Not Exist: path.parse = ${path.parse(filePath).base}`);
        switch (path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
                console.log('Serve File');        
        }
        //console.log(`filePath: ${filePath}\ncontentType: ${contentType}`);
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*


setTimeout(() => {
    // emit event
    myEmitter.emit('logg', 'log event emitted');
}, 3000);
*/