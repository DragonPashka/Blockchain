// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');

//default headers used for all requests. There's probably no need to modify them
const oHeadersDef = {
  'accept-language': 'en-US,en;q=0.8',
  'content-type': 'application/x-www-form-urlencoded',
  'accept': 'application/json'
};

/*wrapper function that handles https requests. Returns a promise since requests are async. accepts hostname (hostname string should not contain http/https in the beginning), path (with a slash in the beginning), request method, headers (use the default ones above and data that needs to be passed to request (have to be already querystringifed))
*/
function HTTPSrequestWrapper(sHostname, sPath, sMethod, oHeaders, vData)
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

function fileUpload(oEvent){
    console.log(oEvent);
    const oDialog = require('electron').remote.dialog;
    var sHash = "hash";
    //process files here
    try
    {
        oDialog.showOpenDialog({title:"Выберите файл", properties: ['openFile', 'showHiddenFiles']}, (aPath) => {
            //open given file by path
            fs.readFile(aPath.toString() || aPath[0], 'utf8', (oErr, vData) => {
                if (oErr)
                {
                    //smth's wrong with that file 
                    throw oErr;
                }
                //get file contents here and make hash
                console.log(vData);
                HTTPSrequestWrapper("hostname", "path", "POST", oHeadersDef, sHash);
            });
        });
    }
    catch(oError)
    {
        oDialog.showMessageBox({title:"Ошибка выбора файла", type: "error", message:`Ошибка открытия файла: ${oErr.message}`});
    }
}

document.querySelector('#fileBtn').addEventListener('click', fileUpload);