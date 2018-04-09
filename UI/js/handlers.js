const https = require('https'),
      fs = require('fs');
//default headers used for all requests. There's probably no need to modify them
const oDefHeaders = {
    'accept-language': 'en-US,en;q=0.8',
    'content-type': 'application/octet-stream',
    'accept': 'application/json'
};

/*wrapper function that handles https requests. Returns a promise since requests are async. accepts hostname (hostname string should not contain http/https in the beginning), path (with a slash in the beginning), request method, headers (use the default ones above and data that needs to be passed to request (have to be already querystringifed))
*/
exports.requestWrapper = function (sHostname, sPath, sMethod, oHeaders, vData)
{
    return new Promise((resolve, reject) => {
      const oReq = https.request({
          hostname: sHostname,
          port: 443,
          path: sPath,
          method: sMethod,
          headers: oHeaders
        }, (oRes) => {
          oRes.setEncoding('utf8');
          let oFinObj = {};
          oRes.on('data', (chunk) => {
            //receiving response data here
            oFinObj.data = chunk;
          });
          oRes.on('end', () => {
            //response status code and headers are being received here
            finObj.headers = oRes.headers;
            finObj.statusCode = oRes.statusCode;
            //resolving promise with object, containing all relevant response data
            resolve(finObj);
          });
      });
      oReq.on('error', (e) => {
        //something went wrong with forming or sending the request
        //tip: check function arguments
        reject(`problem with request: ${e.message}`);
      });
      //some requests may not have data to pass, so there's a check for it
      if(vData)
        oReq.write(vData);
      oReq.end();
  });
}

exports.fileUpload = function(oQueue){
    var aFiles = oQueue.children().map(function(iNum, oElem){
        var oJqElem = $(oElem),
            sFile = oJqElem.children().first().text();
        return oJqElem.data("isPath") ? fs.createReadStream(sFile) : sFile;
    });
    console.log("");
    Promise.all(aFiles.map(vElem => {
        if(typeof vElem === 'object')
        {
            return requestWrapper("localhost", "/test", "POST", Object.assign({}, oDefHeaders, {'Content-Disposition': `attachment; filename=${vElem.path}`}), vElem);
        }
        return requestWrapper("localhost", "/test", "POST", {'accept-language': 'en-US,en;q=0.8', 'content-type':"text/plain", 'accept':"application/json"}, vElem);
    })).then(aResults => {
        debugger
    });
}