/*
const sqlite3 = require('sqlite3').verbose();
var colors = require('colors');
*/
import { dirname } from "path";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let pathto = __dirname;

let db = new sqlite3.Database(
    `${pathto}/../../twitch_bot_files/users.db`,
    (err) => {
        if (err) {
            console.error(`${err.message}`.red);
        }
        console.log("Connected to the chinook database.".green);
    }
);
db.run(`CREATE TABLE IF NOT EXISTS users (
    UserID text PRIMARY KEY,
    UserName text UNIQUE,
    MessagesSent integer DEFAULT 0,
    Coins integer DEFAULT 0,
    Warnings integer DEFAULT 0
);`);

export { db };
