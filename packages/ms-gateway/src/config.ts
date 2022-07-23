import "dotenv/config";
import { cleanEnv, port } from "envalid";

export const { API_PORT } = cleanEnv(process.env, {
	API_PORT: port(),
});
