import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

const port = env.PORT;

export { port };