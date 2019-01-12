var clients = [];

function AddClient() {

    var name = $("#name").val();
    var id = $("#id").val();

    if (name.length < 3 || !id) {
        alert("Не заполнены поля!");
        return;
    }

    $("#name").val("");
    $("#id").val("");

    var client = {
        id: id,
        name: name,
        startTime: (new Date()).getTime(),
        notificationTime: (new Date()).getTime() + 7800000,
        endTime: (new Date()).getTime() + 9000000
    };

    clients.push(client);

    $("#totalCount").html(parseInt($("#totalCount").html())+1);
}

function Prolong(id) {
    for (var clientId in clients) {
        if (clients[clientId].id == id) {
            var allow = confirm("Вы действительно хотите добавить 1 час ко времени клиента "+clients[clientId].name+" с номером "+clients[clientId].id+"?");

            if (allow) {
                clients[clientId].endTime += 3600000;
                clients[clientId].notificationTime += 3600000;
            }
        }
    }
}

$(document).ready(function () {
    setInterval(function () {
        var tableContent = "<tr>" +
            "<td><b>ID</b></td>" +
            "<td><b>Имя Ф.О.</b></td>" +
            "<td><b>Зашел</b></td>" +
            "<td><b>Уведомление</b></td>" +
            "<td><b>Окончание</b></td>" +
            "<td><b>Осталось</b></td>" +
            "<td><b>Продлить</b></td>" +
            "</tr>";

        for (var clientId in clients) {
            var startTime = (new Date(clients[clientId].startTime)).toTimeString().substring(0,8);
            var notifyTime = (new Date(clients[clientId].notificationTime)).toTimeString().substring(0,8);
            var endTime = (new Date(clients[clientId].endTime)).toTimeString().substring(0,8);
            var remainingTime = (clients[clientId].endTime - ((new Date()).getTime())) / 60000;

            if (remainingTime <= 0) {
                var isToDelete = confirm("ВРЕМЯ ВЫШЛО!\nКлиенту "+clients[clientId].name+" с номером "+clients[clientId].id+" пора выходить прямо сейчас!\n\nУдалить клиента из списка?\nOK - удалить, Отмена - добавить час ко времени");

                if (isToDelete) {
                    clients.splice(clientId, 1);
                } else {
                    Prolong(clients[clientId].id);
                }
            }

            remainingTime = remainingTime.toString().split(".")[0] + "мин";

            tableContent += "<tr>" +
                "<td>"+clients[clientId].id+"</td>" +
                "<td>"+clients[clientId].name+"</td>" +
                "<td>"+startTime+"</td>" +
                "<td>"+notifyTime+"</td>" +
                "<td>"+endTime+"</td>" +
                "<td>"+remainingTime+"</td>" +
                "<td><input type='button' onclick='Prolong("+clients[clientId].id+");' value='Продлить'></td>" +
                "</tr>";
        }

        $("#clients").html(tableContent);
    }, 500);
});
