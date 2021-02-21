"use strict";
exports.__esModule = true;
var users = [];
var usersMapped;
//prend le json qu on a mit dans le fichier sa enregistredans data creer par jquerry
$(function () {
    $.getJSON("/users", function (data) {
        updateUsersView(data);
        //clearInputs();
    });
});
// si je touche ume variable qui a le id userform si je clique decu sa vient dans la fonction $ pourvrecuperer la variable et il poste un new user
$("#userForm").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (newUser) {
            if (newUser != undefined && newUser != null) {
                // users.push(newUser);
                //updateUsersView(newUser);
            }
        }
    });
});
function clearInputs() {
    var nameInput = document.getElementById("name");
    var vornameInput = document.getElementById("vorname");
    var emailInput = document.getElementById("email");
    var pwdInput = document.getElementById("pwd");
    nameInput.value = vornameInput.value = emailInput.value = pwdInput.value = '';
}
function updateUsersView(data) {
    var usersTable = document.getElementById("usersTable");
    usersMapped = new Map(data.map(function (x) { return [x.id.toString(), x]; }));
    data.forEach(function (user) {
        var newRow = usersTable.insertRow(-1);
        newRow.id = "row-" + user.id;
        var nameCell = newRow.insertCell(-1);
        nameCell.innerHTML = "<input type=\"text\" class='tableInput' id=\"name-" + user.id + "\" value=\"" + user.name + "\" disabled required pattern=\"(\\s*[a-zA-Z])+(\\s*[a-zA-Z])*\">";
        var vornameCell = newRow.insertCell(-1);
        vornameCell.innerHTML = "<input type=\"text\" class='tableInput' id=\"vorname-" + user.id + "\" value=\"" + user.vorname + "\" disabled required pattern=\"(\\s*[a-zA-Z])+(\\s*[a-zA-Z])*\">";
        var emailCell = newRow.insertCell(-1);
        emailCell.innerHTML = "<input type=\"email\" class='tableInput' id=\"email-" + user.id + "\" value=\"" + user.mail + "\" disabled>";
        var modifyBtn = newRow.insertCell(-1);
        modifyBtn.innerHTML = "<button onclick=\"changeUser(" + user.id + ")\" id=\"change-" + user.id + "\" class=\"changeBtn\">Ändern</button>";
        var deleteBtn = newRow.insertCell(-1);
        deleteBtn.innerHTML = "<button onclick=\"deleteUser(" + user.id + ")\" id=\"delete-" + user.id + "\" class=\"deleteBtn\">Löschen</button>";
    });
}

function changeUser(id) {
    var changeBtn = document.getElementById("change-" + id.toString());
    var nameInput = document.getElementById("name-" + id.toString());
    var vornameInput = document.getElementById("vorname-" + id.toString());
    var emailInput = document.getElementById("email-" + id.toString());
    if (!nameInput.checkValidity() || !vornameInput.checkValidity() || !emailInput.checkValidity())
        return;
    var toEnable = !nameInput.disabled;
    var name = nameInput.value = nameInput.value.trim();
    var vorname = vornameInput.value = vornameInput.value.trim();
    var email = emailInput.value = emailInput.value.trim();
    if (!toEnable) {
        /*nameInput.disabled = toEnable;
        emailInput.disabled = toEnable;
        vornameInput.disabled = toEnable;*/
        changeBtn.style.backgroundColor = "burlywood";
        changeBtn.innerText = "Änderung(en) speichern";
        nameInput.style.backgroundColor = vornameInput.style.backgroundColor = emailInput.style.backgroundColor = "white";
    }
    else {
        var user = usersMapped.get(id.toString());
        var hasAnyChange = user.name !== name || user.vorname !== vorname || user.mail !== email;
        if (hasAnyChange) {
            var response = updateUser(id, name, vorname, email);
            if (response == undefined || response == null || response.succeed == undefined || !response.succeed) {
                alert("Änderungen für " + name + ", " + vorname + "," + email + " konnten nicht im Server gespeichert werden.\nMessage : " + response.message);
                return;
            }
            else {
                user.name = name;
                user.vorname = vorname;
                user.mail = email;
                usersMapped.set(user.toString(), user);
            }
        }
        changeBtn.style.backgroundColor = "forestgreen";
        changeBtn.innerText = "Ändern";
        nameInput.style.backgroundColor = vornameInput.style.backgroundColor = emailInput.style.backgroundColor = "transparent";
    }
    nameInput.disabled = toEnable;
    emailInput.disabled = toEnable;
    vornameInput.disabled = toEnable;
}

function updateUser(id, name, vorname, email) {
    var response;
    $.ajax({
        type: 'POST',
        url: '/update',
        data: { id: id, name: name, vorname: vorname, email: email },
        async: false,
        dataType: 'json',
        success: function (resp) {
            response = resp;
        }
    });
    return response;
    /* $.post('/update', {name:name,  vorname:vorname, email : email, id: id }, function(response){
         return response;
     });*/
    //alert(name + "changed");
}
function deleteUser(id) {
    var response;
    if (usersMapped.has(id.toString())) {
        $.ajax({
            url: '/user/' + id.toString(),
            type: 'DELETE',
            async: false,
            success: function (resp) {
                response = resp;
            }
        });
        if (response.succeed) {
            usersMapped["delete"](id.toString());
            var usersTable = document.getElementById("usersTable");
            var rowIndex = document.getElementById("row-" + id.toString()).rowIndex;
            usersTable.deleteRow(rowIndex);
        }
        else {
            alert("Ein Fehler ist im Server aufgetreten :\n" + response.message);
        }
    }
}
function validateUserData() {
    var nameInput = document.getElementById("name");
    var vornameInput = document.getElementById("vorname");
    var emailInput = document.getElementById("email");
    var pwdInput = document.getElementById("pwd");
    nameInput.value = nameInput.value.trim();
    vornameInput.value = vornameInput.value.trim();
    emailInput.value = emailInput.value.trim();
    pwdInput.value = pwdInput.value.trim();
    var pwd = pwdInput.value;
    return pwd.length > 4; // at least 4 characters for the password
}
