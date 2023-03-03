const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const pool = require('./connectDB.js');

pool.query(`CREATE TABLE IF NOT EXISTS npc_type (
    id SERIAL PRIMARY KEY,
    npc_type TEXT);`, 
    (err, data)=>{
        if (err){
            console.log('NPC Type Table failed')
        } else {
            console.log(data);
            pool.query(`CREATE TABLE IF NOT EXISTS npc_char (
                id SERIAL PRIMARY KEY,
                char_name TEXT,
                race VARCHAR(30),
                class VARCHAR(50),
                hit_points INTEGER,
                background TEXT,
                type_id INTEGER,
                CONSTRAINT FK_npc_char FOREIGN KEY (type_id) REFERENCES npc_type(id) ON UPDATE CASCADE);`,
                (err, data)=>{
                    if (err){
                        console.log('NPC Character Table failed');
                    } else {
                        console.log(data);
                    }
                })
        }
    })

pool.end();