const http = require('http'),
      fs = require('fs'),
      { URL } = require('url');
//default headers used for all requests. There's probably no need to modify them
const oDefHeaders = {
    'accept-language': 'en-US,en;q=0.8',
    'content-type': 'application/octet-stream',
    'accept': 'application/json'
};

/*wrapper function that handles https requests. Returns a promise since requests are async. accepts hostname (hostname string should not contain http/https in the beginning), path (with a slash in the beginning), request method, headers (use the default ones above and data that needs to be passed to request (have to be already querystringifed))
*/
function requestWrapper({hostname, path, method, headers, port}, sData)
{
    return new Promise((resolve, reject) => {
        //stringifying in order to correctly get file name from path later
        const sName = JSON.stringify(sData),
              boundary = "xxxxxxxxxx";
        //encoding also helps
        let data = `--${boundary}\r\n
Content-Disposition: form-data; name="file"; filename="${encodeURIComponent(sName.slice(sName.lastIndexOf("\\")+1))}"\r\n
Content-Type:application/octet-stream\r\n\r\n`;
        fs.readFile(sData, (oErr, oContent) => {
            var payload, oGlobalErr;
            if(oErr){
                //if we got an error, it's likely a plain text, so just put it in
                console.error(err);
                payload = `${sData}\r\n--${boundary}\r\n`;
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
                headers: headers || {"Content-Type": `multipart/form-data; boundary=${boundary}`}
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

            oReq.on('error', (oErr) => {
                //something went wrong with forming or sending the request
                reject(oErr);
            });
            oReq.write(payload);
            oReq.end();
        });
    });
}

exports.fileUpload = function(oQueue, fResultCb){
    var aFiles = oQueue.children().map((iNum, oElem) => $(oElem).children().first().text()).toArray(),
        oURL = localStorage && new URL(localStorage.getItem("serverURL"));
    Promise.all(aFiles.map(sElem => requestWrapper({hostname:oURL.hostname, path:oURL.pathname, method:"POST", port:oURL.port}, sElem))).then(aResults => {
        console.log(aResults);
        fResultCb(aResults);
    }, (oPromErr)=>{
        fResultCb(oPromErr);
        debugger
    });
}