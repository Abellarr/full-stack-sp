const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const pool = require('./connectDB.js');

pool.query(`DROP TABLE IF EXISTS npc_type;`, (err, data)=>{
    if (err){
        console.log('Drop NPC Type Table failed')
    } else {
        pool.query('CREATE TABLE npc_type (id SERIAL PRIMARY KEY, npc_type TEXT);', (err, data)=>{
            if (err){
                console.log('Create NPC Type Table failed');
            } else {
                console.log('Create NPC Type Table successful')
            }
         });
     }
})

pool.query(`DROP TABLE IF EXISTS npc_char;`, (err, data)=>{
    if (err){
        console.log('Drop NPC Char Table failed');
    } else {
        pool.query(`CREATE TABLE npc_char (
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
                    console.log('Create NPC Char Table failed');
                } else {
                    console.log('Create NPC Char Table successful');
                }
        })
    }
})


pool.end();