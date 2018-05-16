const http = require('http'),
      fs = require('fs'),
      { URL } = require('url');

/**
 * @function requestWrapper
 * @description Wrapper function that handles http requests. Internal one not for export
 * @param {string} hostname
 * @param {string} path
 * @param {string} method - http method to be used in request
 * @param {Object} headers
 * @param {number} port
 * @param {string} sData - path to file or plain text as a request content
 * @returns {Promise} - Promisified async http request
 */
function requestWrapper({hostname, path, method, headers, port}, sData)
{
    return new Promise((resolve, reject) => {
        //stringifying in order to correctly get file name from path later
        const sName = JSON.stringify(sData),
              boundary = "xxxxxxxxxx";
        //encoding also helps
        let data = `\r\n\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${encodeURIComponent(sName.slice(sName.lastIndexOf("\\")+1))}"\r\nContent-Type:application/octet-stream\r\n\r\n`;
        fs.readFile(sData, (oErr, oContent) => {
            var payload, oGlobalErr;
            if(oErr){
                //if we got an error, it's likely a plain text, so just put it in
                console.error(oErr);
                oContent = sData;
            }
            //creating binary buffer from parts
            payload = Buffer.concat([
                Buffer.from(data, "utf8"),
                new Buffer(oContent, 'binary'),
                Buffer.from(`\r\n\r\n--${boundary}--`, "utf8"),
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

/**
 * @function fileUpload
 * @description Creates promises for all files and handles the final result when all promises are finished. It is available for requiring in other scripts
 * @param {string[]} aFiles - Paths of plain texts
 * @param {function} fResultCb - Callback to be called on promises error or success 
 */
exports.fileUpload = function(aFiles, fResultCb){
    var oURL = localStorage && new URL(localStorage.getItem("serverURL"));
    Promise.all(aFiles.map(sElem => requestWrapper({hostname:oURL.hostname, path:oURL.pathname, method:"POST", port:oURL.port}, sElem))).then(aResults => {
        console.log(aResults);
        fResultCb(aResults);
    }, (oPromErr)=>{
        fResultCb(oPromErr);
    });
}