import express from "express";
import { port } from "./configs";
import { routeAccounts } from "./routes";
import cookieParser from "cookie-parser";

class App{
    app : express.Application;
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));
        this.app.use(cookieParser());  
        this.app.use("/api", routeAccounts);
        this.app.listen(port, () => console.log(`Servidor rodando em http://192.168.15.15:${port}`));
    }
}

const app = new App();

