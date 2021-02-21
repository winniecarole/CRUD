//Importieren des Express-Paketes, was vorher über die package.json als Abhängigkeit angegeben wurde
import * as express  from "express";
import * as path from "path";
import {User} from './scripts/User'

var usersMapped: Map<number, User>  = new Map<number, User>();
let usercounter: number = 0;



// @ts-ignore
const router: express.Express = express();


router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.use(express.static(path.join(__dirname, 'css')));
router.use(express.static(path.join(__dirname, 'scripts')));
router.use(express.static(path.join(__dirname, 'views')));


router.listen(5796, () => {
    console.log("Server auf http://localhost:5796/ gestartet");


});

var idCounter: number = 0;





router.get("/", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "views/index.html");
});

router.get("/css/style.css", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/css/style.css");
});
router.get("/scripts/script.js", (req: express.Request, res: express.Response) => {
    res.status(200);
    res.sendFile(__dirname + "/scripts/script.js");
});

router.post("/user", (req: express.Request, res: express.Response) => {
    res.status(200);
    var name: string = req.body.name;
    var vorname: string = req.body.vorname;
    var email: string = req.body.email;
    var pwd: string = req.body.pwd;
    var newUser: User ;
    if (name !== undefined && vorname !== undefined && email !== undefined && pwd !== undefined )
    {
        name = name.trim();
        vorname = vorname.trim();
        email = email.trim();
        pwd = pwd.trim();

        if( name !=="" && vorname !=="" && email !== "" && pwd !== "")
        {

            newUser = new User(name, vorname, email, pwd, ++idCounter);
            usersMapped.set(newUser.id,newUser);
        }
        else
        {
            res.json({succeed : false, message: "Ein oder mehrere erwarteten Felder nicht befüllt"});
            return;
        }
    }
    else
    {
        res.json({succeed : false, message: "Ein oder mehrere erwarteten Felder nicht befüllt"});
        return;
    }
    res.redirect("/");
});

router.delete("/user/:id", (req: express.Request, res: express.Response) => {
    res.status(200);
    const id : number = Number(req.params.id);
    if (id !== undefined && usersMapped.has(id))
    {
        usersMapped.delete(id);
        res.json({succeed : true, message:"Benutzer gelöscht"});
        return ;
    }
    res.json({succeed : false, message:"Id nicht korrekt oder Benutzer nicht vorhanden"});
});

router.post("/update", (req: express.Request, res: express.Response) => {
    res.status(200);
    var name: string = req.body.name;
    var vorname: string = req.body.vorname;
    var email: string = req.body.email;
    var id : number = Number(req.body.id);
    if (name !== undefined && vorname !== undefined && email !== undefined && id !== undefined)
    {
        name = name.trim();
        vorname = vorname.trim();
        email = email.trim();

        if( name !=="" && vorname !=="" && email !== "" ) {
            var modifiedUser: User = <User>usersMapped.get(id);
            modifiedUser.name = name;
            modifiedUser.vorname = vorname;
            modifiedUser.mail = email;
            usersMapped.set(id, modifiedUser);
            res.json({succeed: true, message: "Benutzer geändert"});
            return;
        }

    }
    res.json({succeed : false, message:"Ein oder mehrere Felder sind leer"});
});

router.get("/users", (req: express.Request, res: express.Response) => {

    res.status(200);
    res.json(Array.from(usersMapped.values()));
});

router.get("/user/:id", (req: express.Request, res: express.Response) => {
    res.status(200);
    const id : number = Number(req.params.id);

    if (id !== undefined && usersMapped.has(id))
    {
       res.json({succeed: true, data:usersMapped.get(id)});
    }
    res.json({succeed : false, message:"Id nicht korrekt oder Benutzer nicht vorhanden"});
});