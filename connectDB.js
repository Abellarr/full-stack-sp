const { Pool } = require('pg');

const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1';
const POSTGRES_DB = process.env.POSTGRES_DB || 'npcchar';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'dnd5e';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const DATABASE_URL = process.env.DATABASE_URL;

const dbConfig = {
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432,
};

let pool;
if (DATABASE_URL){
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    pool = new Pool(dbConfig);
}

module.exports = pool;