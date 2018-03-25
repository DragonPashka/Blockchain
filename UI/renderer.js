// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const oDialog = require('electron').remote.dialog;

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

/**
@TODO clear queue/remove specific elements?
*/
function addToUpload(){
    var oCheck = $("#showAddText"),
        oUploadElem = $('<li class="list-group-item d-flex justify-content-between align-items-center"><span class="badge badge-primary badge-pill">&#10005</span></li>'),
        sUploadElem = "";
    if(oCheck.prop('checked'))
    {
        //user wants to upload plain text
        let oTextArea = $("#plainText");
        oCheck.prop('checked', false);
        if(!oTextArea.val())
        {
            oDialog.showMessageBox({title:"Ошибка добавления", type: "warning", message:'Пустое поле для ввода текста'});
            return
        }
        //do adding operation here
        sUploadElem = oTextArea.text();
        oTextArea.text('');
    }
    else
    {
        try
        {
            oDialog.showOpenDialog({title:"Выберите файл", properties: ['openFile', 'showHiddenFiles, multiSelections']}, (vPath) => {
                debugger
            });
        }
        catch(oError)
        {
            oDialog.showMessageBox({title:"Ошибка выбора файла", type: "error", message:`Ошибка открытия файла: ${oErr.message}`});
        }
    }
    //$("uploadCount").text(`${$("uploadQueue").children().length} файлов`);
}

function fileUpload(oEvent){
    //process files here
    fs.readFile("filepath", 'utf8', (oErr, vData) => {
        if (oErr)
        {
            //smth's wrong with that file 
            throw oErr;
        }
        //get file contents here and make hash
        console.log(vData);
        HTTPSrequestWrapper("hostname", "path", "POST", oHeadersDef, sHash);
    });
}

$('#addBtn').click(addToUpload);