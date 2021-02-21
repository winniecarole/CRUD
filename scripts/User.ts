

export class  User{
    name:string;
    mail:string;
    vorname:string;
    password:string;
    id:number;
    constructor(name: string,vorname:string,mail:string,passwort:string,id:number) {
        this.name = name;
        this.vorname = vorname;
        this.mail=mail;
        this.password=passwort;
        this.id=id;
    }

}

class UserManager extends User{

    create(name: string,vorname:string,mail:string,passwort:string){
        var id=(new Date()).getMilliseconds();//
        var newUser=new User(name,vorname,mail,passwort,id);
        list.push(newUser);


    }

    delete(user1: User){

                list.splice(list.indexOf(user1), 1);




    }

    read(){
        for(var j=0;j<list.length;j++ ){
            console.log(list.values);
        }
    }

    update(name: string,vorname:string,mail:string,passwort:string,id:number){
        var newUser=new User(name,vorname,mail,passwort,id);
        for(let j=0;j<list.length;j++){
            if(id==list[j].id){
                list[j]=newUser;
            }
        }



    }

}
let list: Array<User> ;



