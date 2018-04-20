// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote} = require('electron'),
      {Menu, MenuItem, dialog} = remote,
      { requestWrapper, fileUpload } = require('./js/handlers'),
      oMenu = new Menu();

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

if(!localStorage.getItem("serverURL"))
    localStorage.setItem("serverURL", "http://localhost:8080/upload");

function createUploadElem(vName, bIsPath)
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
            "class":"list-group-item d-flex justify-content-between align-items-center"
        });
        return oElem.append(`<span class="d-inline-block text-truncate">${sName}</span>`).append(oSpan).data("isPath", bIsPath);
    });
}

function clearQueue()
{
    $("#uploadQueue").empty();
    $("#uploadCount").text(`${$("#uploadQueue").children().length} файлов`);
}

function addToUpload(){
    var oCheck = $("#showAddText"),
        oUpQueue = $("#uploadQueue");
    if(oCheck.prop('checked'))
    {
        //user wants to upload plain text
        let oTextArea = $("#plainText");
        oCheck.prop('checked', false);
        if(!oTextArea.val())
        {
            dialog.showMessageBox({title:"Ошибка добавления", type: "warning", message:'Пустое поле для ввода текста'});
            return
        }
        //do adding operation here
        oUpQueue.append(createUploadElem(oTextArea.val(), false));
        $("#uploadCount").text(`${oUpQueue.children().length} файлов`);
        oTextArea.val('');
    }
    else
    {
        try
        {
            dialog.showOpenDialog({title:"Выберите файл", properties: ['openFile', 'showHiddenFiles', 'multiSelections']}, (aPath) => {
                oUpQueue.append(createUploadElem(aPath || [], true));
                $("#uploadCount").text(`${oUpQueue.children().length} файлов`);
            });
        }
        catch(oError)
        {
            dialog.showMessageBox({title:"Ошибка выбора файла", type: "error", message:`Ошибка открытия файла: ${oErr.message}`});
        }
    };
}

function showReslts(vResults)
{
    const oResDialog = $("#modalDialog"),
          dialogBody = oResDialog.find(".modal-body"),
          dialogList = oResDialog.find(".list-group");
    if(vResults instanceof Error)
    {
        dialogBody.text(`Ошибка выполнения запроса: ${vResults.message}`);
    }
    else
    {
        vResults.forEach((oElem)=>{
            var oSpan = $('<span>', {
                "class":"badge badge-primary badge-pill",
                text: oElem.statusCode
            });
            dialogList.append($('<li class="list-group-item d-flex justify-content-between align-items-center"></li>').append(`<span class="d-inline-block text-truncate">${oElem.fileName}</span>`).append(oSpan));
        });
        clearQueue();
    }
    oResDialog.modal('show');
}

$('#addBtn').click(addToUpload);
$('#checkBtn').click(()=>{
    var oQueue = $("#uploadQueue");
    if(!$.trim($("#uploadQueue").html()))
    {
        dialog.showMessageBox({title:"Ошибка загрузки", type: "warning", message:'Нет выбранных файлов'});
        return
    }
    fileUpload($("#uploadQueue"), showReslts);
});
$(window).contextmenu((oEvent) => {
    oEvent.preventDefault();
    oMenu.popup(remote.getCurrentWindow())
});