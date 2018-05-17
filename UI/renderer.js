/**
 * requiring all electrons necessary electron modules and custom handlers here 
 */
const {remote} = require('electron'),
      {Menu, MenuItem, dialog} = remote,
      { requestWrapper, fileUpload } = require('./js/handlers'),
      oMenu = new Menu();

/**
 * configuring global context menu options with queue clear and server address change
 */
oMenu.append(new MenuItem({label: 'Очистить очередь', click: () => {
    dialog.showMessageBox({title:"Очистить очередь", type: "question", message:"Вы уверены, что хотите очистить очередь загрузки?", buttons:["Да", "Отмена"], cancelId:1}, function(nResponse){
        if(!nResponse)
        {
            clearQueue();
        }
    }.bind(this));
}}));

oMenu.append(new MenuItem({label: 'Изменить адрес сервера для проверки', click:() => {
    const oURLDialog = $("#urlDialog"),
          dialogInput = oURLDialog.find("input");
    oURLDialog.on('show.bs.modal', function (oEvent) {
        dialogInput.val(localStorage.getItem("serverURL"));
    });
    oURLDialog.on('hide.bs.modal', function (oEvent) {
        localStorage.setItem("serverURL", dialogInput.val());
    });
    oURLDialog.modal('show');
}}));

/**
 * there's no server address on the first app launch, so we set it manually here
 */
if(!localStorage.getItem("serverURL"))
    localStorage.setItem("serverURL", "http://localhost:8080/upload");

/**
 * @function createUploadElem
 * @description Creates an array of list elements from file paths or texts
 * @param {(string|string[])} vName - File name or text for displaying in the list
 * @returns {jQuery[]} Array of jQuery virtual DOM nodes
 */
function createUploadElem(vName)
{
    vName = Array.isArray(vName) ? vName : [vName];
    return vName.map((sName)=>{
        var oSpan = $('<span>', {
            "class":"badge badge-primary badge-pill badge-delete",
            on: {
                click: function(oEvent){
                    dialog.showMessageBox({title:"Удаление из очереди", type: "question", message:`Вы хотите удалить файл ${sName} из очереди загрузки?`, buttons:["Да", "Отмена"], cancelId:1}, function(nResponse){
                        if(!nResponse)
                        {
                            $(this).parent().remove();          
                            $("#uploadCount").text(`${$("#uploadQueue").children().length} файлов`);
                        }
                    }.bind(this));
                }
            },
            html:"&#10005"
        });
        var oElem = $('<li>',{
            "class":"list-group-item d-flex justify-content-between align-items-center py-4"
        });
        return oElem.append(`<span class="d-inline-block text-truncate">${sName}</span>`).append(oSpan);
    });
}

/**
 * @function clearQueue
 * @description Removes all upload elements and resets the file counter
 */
function clearQueue()
{
    $("#uploadQueue").empty();
    $("#uploadCount").text(`${$("#uploadQueue").children().length} файлов`);
}

/**
 * @function addToUpload
 * @description Handles user's action on clicking the add button. Watches checkbox state and acts accordingly
 */
function addToUpload(){
    var oCheck = $("#showAddText"),
        oUpQueue = $("#uploadQueue");
    //user wants to upload plain text instead of file if checkbox is checked
    if(oCheck.prop('checked'))
    {
        //user wants to upload plain text
        let oTextArea = $("#plainText");
        oCheck.prop('checked', false);
        //cutting leading and trailing whitespaces 
        if(!$.trim(oTextArea.val()))
        {
            dialog.showMessageBox({title:"Ошибка добавления", type: "warning", message:'Пустое поле для ввода текста'});
            oTextArea.val("");
            return
        }
        //doing adding operation here
        oUpQueue.append(createUploadElem(oTextArea.val()));
        $("#uploadCount").text(`${oUpQueue.children().length} файлов`);
        oTextArea.val('');
    }
    else
    {
        //user simply adds one or multiple files to upload queue through native system selection dialog
        try
        {
            dialog.showOpenDialog({title:"Выберите файл", properties: ['openFile', 'showHiddenFiles', 'multiSelections']}, (aPath) => {
                oUpQueue.append(createUploadElem(aPath || []));
                $("#uploadCount").text(`${oUpQueue.children().length} файлов`);
            });
        }
        catch(oError)
        {
            //dialog throws an error in case smth went wrong, so we need to catch it here
            dialog.showMessageBox({title:"Ошибка выбора файла", type: "error", message:`Ошибка открытия файла: ${oErr.message}`});
        }
    };
}

/**
 * @function showReslts
 * @description displays final results after server responded for all requests sent
 * @param {Error|Object[]} vResults - File check results from server. Might be anything really, so there's a check for an Error
 */
function showReslts(vResults)
{
    //getting predefined bootstrap dialog in order not to create the whole structure every time
    const oResDialog = $("#modalDialog"),
          dialogBody = oResDialog.find(".modal-body"),
          dialogList = oResDialog.find(".list-group").empty();
    if(vResults instanceof Error)
    {
        dialogBody.text(`Ошибка выполнения запроса: ${vResults.message}`);
    }
    else
    {
        vResults.forEach((oElem)=>{
            var oData = JSON.parse(oElem.data),
                bRes = !!oData.hash,
                oSpan = $('<span>', {
                    //displaydifferent badge colors and symbols inside depending on results received
                    "class":`badge badge-${bRes ? 'success' : 'danger'} badge-pill`,
                    "title": oData.state || oData.error,
                    html: () => {

                        if(oElem.statusCode == 200)
                        {
                            return bRes ? "&#10003" : "&#10060"
                        }
                        return oElem.statusCode
                    } 
                });
            dialogList.append($('<li class="list-group-item d-flex justify-content-between align-items-center py-4"></li>').append(`<span class="d-inline-block text-truncate">${oElem.fileName}</span>`).append(oSpan));
        });
        clearQueue();
    }
    $("#progressDialog").on('hidden.bs.modal', function (e) {
        oResDialog.modal('show');
    }).modal('hide');
}

/**
 * Attaching various event handlers to elements
*/
$('#addBtn').click(addToUpload);
$('#checkBtn').click(()=>{
    var oQueue = $("#uploadQueue");
    if(!$.trim(oQueue.html()))
    {
        dialog.showMessageBox({title:"Ошибка загрузки", type: "warning", message:'Нет выбранных файлов'});
        return
    }
    $("#progressDialog").off('shown.bs.modal').on('shown.bs.modal', function (e) {
        fileUpload(oQueue.children().map((iNum, oElem) => $(oElem).children().first().text()).toArray(), showReslts);
    }).modal('show');
});
$(window).contextmenu((oEvent) => {
    oEvent.preventDefault();
    oMenu.popup(remote.getCurrentWindow())
});