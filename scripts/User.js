"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.User = void 0;
var User = /** @class */ (function () {
    function User(name, vorname, mail, passwort, id) {
        this.name = name;
        this.vorname = vorname;
        this.mail = mail;
        this.password = passwort;
        this.id = id;
    }
    return User;
}());
exports.User = User;
var UserManager = /** @class */ (function (_super) {
    __extends(UserManager, _super);
    function UserManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserManager.prototype.create = function (name, vorname, mail, passwort) {
        var id = (new Date()).getMilliseconds(); //
        var newUser = new User(name, vorname, mail, passwort, id);
        list.push(newUser);
    };
    UserManager.prototype["delete"] = function (user1) {
        list.splice(list.indexOf(user1), 1);
    };
    UserManager.prototype.read = function () {
        for (var j = 0; j < list.length; j++) {
            console.log(list.values);
        }
    };
    UserManager.prototype.update = function (name, vorname, mail, passwort, id) {
        var newUser = new User(name, vorname, mail, passwort, id);
        for (var j = 0; j < list.length; j++) {
            if (id == list[j].id) {
                list[j] = newUser;
            }
        }
    };
    return UserManager;
}(User));
var list;
