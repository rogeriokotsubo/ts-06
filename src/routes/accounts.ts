import { Router } from "express";
import dotenv from "dotenv";
import { getUUID, login, update } from "../controllers";

dotenv.config();
const routeAccounts = Router();

// Accounts
routeAccounts.post("/accounts", getUUID);
routeAccounts.post("/accounts/login",login);
routeAccounts.patch("/accounts",update);

export { routeAccounts };  
