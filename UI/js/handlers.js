const http = require('http'),
      fs = require('fs');
//default headers used for all requests. There's probably no need to modify them
const oDefHeaders = {
    'accept-language': 'en-US,en;q=0.8',
    'content-type': 'application/octet-stream',
    'accept': 'application/json'
};

/*wrapper function that handles https requests. Returns a promise since requests are async. accepts hostname (hostname string should not contain http/https in the beginning), path (with a slash in the beginning), request method, headers (use the default ones above and data that needs to be passed to request (have to be already querystringifed))
*/
function requestWrapper({hostname, path, method, headers, port}, vData)
{
    return new Promise((resolve, reject) => {
        const sName = JSON.stringify(vData.path || vData),
              boundary = "xxxxxxxxxx";
        let data = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${encodeURIComponent(sName.slice(sName.lastIndexOf("\\")+1))}"\r\n`;
        data += "Content-Type:application/octet-stream\r\n\r\n";
        fs.readFile(vData.path, (oErr, oContent) => {
            var payload;
            if(oErr){
                console.error(err);
                payload = `${vData}\r\n--${boundary}\r\n`;
            }
            payload = Buffer.concat([
                Buffer.from(data, "utf8"),
                new Buffer(oContent, 'binary'),
                Buffer.from(`\r\n--${boundary}\r\n`, "utf8"),
            ]);
            const oReq = http.request({
                hostname: hostname,
                port: port || 80,
                path: path,
                method: method || "POST",
                headers: {"Content-Type": `multipart/form-data; boundary=${boundary}`}
            }, (oRes) => {
                oRes.setEncoding('utf8');
                let oFinObj = {};
                oRes.on('data', (chunk) => {
                    //receiving response data here
                    oFinObj.data = chunk;
                });
                oRes.on('end', function(){
                    //response status code and headers are being received here
                    oFinObj.headers = oRes.headers;
                    oFinObj.statusCode = oRes.statusCode;
                    oFinObj.fileName = JSON.parse(sName);
                    //resolving promise with object, containing all relevant response data
                    resolve(oFinObj);
                });
            });
            oReq.on('error', (e) => {
                //something went wrong with forming or sending the request
                reject(`problem with request: ${e.message}`);
            });
            oReq.write(payload);
            oReq.end();
        });
    });
}

exports.fileUpload = function(oQueue, fResultCb){
    var aFiles = oQueue.children().map(function(iNum, oElem){
        var oJqElem = $(oElem),
            sFile = oJqElem.children().first().text();
        return oJqElem.data("isPath") ? fs.createReadStream(sFile) : sFile;
    });
    Promise.all(aFiles.toArray().map(vElem => {
        if(typeof vElem === 'object')
        {
            const sName = JSON.stringify(vElem.path);
            return requestWrapper({hostname:"localhost", path:"/upload", method:"POST", port:8080, headers: Object.assign({}, oDefHeaders, {'Content-Disposition': `attachment; filename=${encodeURIComponent(sName.slice(sName.lastIndexOf("\\")+1))}`})}, vElem);
        }
        return requestWrapper({hostname:"localhost", path:"/upload", method:"POST", port:8080, headers: {'accept-language': 'en-US,en;q=0.8', 'content-type':"text/plain", 'accept':"application/json"}}, vElem);
    })).then(aResults => {
        console.log(aResults);
        fResultCb(aResults);
    });
}