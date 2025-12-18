import pg from "pg";
import { DB_SETTINGS } from "./config.js";

export const db = new pg.Pool(DB_SETTINGS);
