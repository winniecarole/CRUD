import {User} from "./User";


var users: User[] = [];
var usersMapped: Map<string, any>;

//call methode
$(function () {
    $.getJSON("/users", function (data) {
        updateUsersView(data);
        //clearInputs();
    });
});


$("#userForm").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(), // serializes form input
        success: function (newUser) {
            if (newUser != undefined && newUser != null) {
                // users.push(newUser);

                //updateUsersView(newUser);
            }
        }
    });
});
function clearInputs() {
    let nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
    let vornameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("vorname");
    let emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
    let pwdInput: HTMLInputElement = <HTMLInputElement>document.getElementById("pwd");

    nameInput.value = vornameInput.value = emailInput.value = pwdInput.value = '';
}
function updateUsersView(data: Array<any>) {
    var usersTable: HTMLTableElement = <HTMLTableElement>document.getElementById("usersTable");
    usersMapped = new Map<string, any>(
        data.map(x => [x.id.toString(), x])
    );
    data.forEach(function (user: any) {
        var newRow: HTMLTableRowElement = usersTable.insertRow(-1);
        newRow.id = "row-"+user.id;
        var nameCell: HTMLTableCellElement = newRow.insertCell(-1);
        nameCell.innerHTML = "<input type=\"text\" class='tableInput' id=\"name-" + user.id + "\" value=\"" + user.name + "\" disabled required pattern=\"(\\s*[a-zA-Z])+(\\s*[a-zA-Z])*\">";

        var vornameCell: HTMLTableCellElement = newRow.insertCell(-1);
        vornameCell.innerHTML = "<input type=\"text\" class='tableInput' id=\"vorname-" + user.id + "\" value=\"" + user.vorname + "\" disabled required pattern=\"(\\s*[a-zA-Z])+(\\s*[a-zA-Z])*\">";

        var emailCell: HTMLTableCellElement = newRow.insertCell(-1);
        emailCell.innerHTML = "<input type=\"email\" class='tableInput' id=\"email-" + user.id + "\" value=\"" + user.mail + "\" disabled>";

        var modifyBtn: HTMLTableCellElement = newRow.insertCell(-1);
        modifyBtn.innerHTML = "<button onclick=\"changeUser(" + user.id + ")\" id=\"change-" + user.id + "\" class=\"changeBtn\">Ändern</button>";

        var deleteBtn: HTMLTableCellElement = newRow.insertCell(-1);
        deleteBtn.innerHTML = "<button onclick=\"deleteUser(" + user.id + ")\" id=\"delete-" + user.id + "\" class=\"deleteBtn\">Löschen</button>";

    });


}

function changeUser(id: number) {
    var changeBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("change-" + id.toString());

    let nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("name-" + id.toString());
    let vornameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("vorname-" + id.toString());
    let emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById("email-" + id.toString());

    if (!nameInput.checkValidity() || !vornameInput.checkValidity() || !emailInput.checkValidity())
        return;

    var toEnable: boolean = !nameInput.disabled;
    var name: string = nameInput.value = nameInput.value.trim();
    var vorname: string = vornameInput.value = vornameInput.value.trim();
    var email: string = emailInput.value = emailInput.value.trim();

    if (!toEnable) {
        /*nameInput.disabled = toEnable;
        emailInput.disabled = toEnable;
        vornameInput.disabled = toEnable;*/
        changeBtn.style.backgroundColor = "burlywood";
        changeBtn.innerText = "Änderung(en) speichern";
        nameInput.style.backgroundColor = vornameInput.style.backgroundColor = emailInput.style.backgroundColor = "white";
    } else {
        var user: any = usersMapped.get(id.toString());
        var hasAnyChange: boolean = user.name !== name || user.vorname !== vorname || user.mail !== email;

        if (hasAnyChange)
        {
            var response: any = updateUser(id,name, vorname, email);
            if( response == undefined || response== null || response.succeed == undefined || !response.succeed)
            {
                alert("Änderungen für "+name+", "+vorname+"," + email+" konnten nicht im Server gespeichert werden.\nMessage : "+response.message);

                return;
            }
            else
            {
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

function updateUser(id: number, name: string, vorname: string, email: string) {
    var response : any;
    $.ajax({
        type: 'POST',
        url: '/update',
        data: {id: id, name: name, vorname: vorname, email: email},
        async: false,
        dataType: 'json',
        success: function( resp ) {
            response = resp;
        }
    });

    return response;
   /* $.post('/update', {name:name,  vorname:vorname, email : email, id: id }, function(response){
        return response;
    });*/
//alert(name + "changed");
}

function deleteUser(id: number) {
    var response : any ;
    if(usersMapped.has(id.toString()))
    {
        $.ajax({
            url: '/user/'+id.toString(),
            type: 'DELETE',
            async: false,
            success: function( resp ) {
                response = resp;
            }
        });
        if(response.succeed)
        {
            usersMapped.delete(id.toString());
            var usersTable: HTMLTableElement = <HTMLTableElement>document.getElementById("usersTable");
            var rowIndex: number = (<HTMLTableRowElement>document.getElementById("row-"+id.toString())).rowIndex;
            usersTable.deleteRow(rowIndex);
        }
        else
        {
            alert("Ein Fehler ist im Server aufgetreten :\n"+response.message);
        }
    }
}

function validateUserData() {
    let nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
    let vornameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("vorname");
    let emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
    let pwdInput: HTMLInputElement = <HTMLInputElement>document.getElementById("pwd");

    nameInput.value = nameInput.value.trim();
    vornameInput.value = vornameInput.value.trim();
    emailInput.value = emailInput.value.trim();
    pwdInput.value = pwdInput.value.trim();
    let pwd: string = pwdInput.value;
    return pwd.length > 4;// at least 4 characters for the password

}