// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const oDialog = require('electron').remote.dialog;

const { requestWrapper, fileUpload } = require('./js/handlers');

function createUploadElem(vName, bIsPath)
{
    vName = Array.isArray(vName) ? vName : [vName];
    return vName.map((sName)=>{
        var oSpan = $('<span>', {
            "class":"badge badge-primary badge-pill",
            on: {
                click: function(oEvent){
                    oDialog.showMessageBox({title:"Удаление из очереди", type: "question", message:`Вы хотите удалить файл ${sName} из очереди загрузки?`, buttons:["Да", "Отмена"], cancelId:1}, function(nResponse){
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

/**
@TODO clear queue
*/
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
            oDialog.showMessageBox({title:"Ошибка добавления", type: "warning", message:'Пустое поле для ввода текста'});
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
            oDialog.showOpenDialog({title:"Выберите файл", properties: ['openFile', 'showHiddenFiles', 'multiSelections']}, (aPath) => {
                oUpQueue.append(createUploadElem(aPath || [], true));
                $("#uploadCount").text(`${oUpQueue.children().length} файлов`);
            });
        }
        catch(oError)
        {
            oDialog.showMessageBox({title:"Ошибка выбора файла", type: "error", message:`Ошибка открытия файла: ${oErr.message}`});
        }
    };
}

function showReslts(aResults)
{
    const oDialog = $("#modalDialog"),
          oDialogBody = $("#modalDialog .list-group");
    oDialog.on('hidden.bs.modal', function (oEvent) {
        oDialogBody.empty();
    });
    aResults.forEach((oElem)=>{
        var oSpan = $('<span>', {
            "class":"badge badge-primary badge-pill",
            text: oElem.statusCode
        });
        oDialogBody.append($('<li class="list-group-item d-flex justify-content-between align-items-center"></li>').append(`<span class="d-inline-block text-truncate">${oElem.fileName}</span>`).append(oSpan));
    });
    oDialog.modal('show');
    clearQueue();
}

$('#addBtn').click(addToUpload);
$('#checkBtn').click(fileUpload.bind($('#checkBtn'), $("#uploadQueue"), showReslts));