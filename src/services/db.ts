import { DataSource } from "typeorm";
import fs from "fs";

// get the json from ormconfig.json
const config = JSON.parse(fs.readFileSync("./ormconfig.json", "utf8"));

export const db = new DataSource(config);
