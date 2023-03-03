const { Pool } = require('pg');
// const DATABASE_URL = process.env.DATABASE_URL;
const pool = require('./connectDB.js');

// const pool = new Pool({
//     connectionString: DATABASE_URL,
//     ...dbConfig,
// });


pool.query(`DROP TABLE IF EXISTS npc_type`, (err, data)=>{
    if (err){
        console.log('Drop NPC Type Table failed')
    }
    pool.query(`CREATE TABLE npc_type (
        id serial PRIMARY KEY,
        npc_type text)`, (err, data)=>{
        if (err){
            console.log('Create NPC Type Table failed');
        } else {
            console.log('Create NPC Type Table successful');
        }
    })
})

pool.query(`DROP TABLE IF EXISTS npc_char`, (err, data)=>{
    if (err){
        console.log('Drop NPC Char Table failed');
    }
    pool.query(`CREATE TABLE npc_char (
        id serial PRIMARY KEY,
        char_name text,
        race varchar(30),
        class varchar(50),
        hit_points integer,
        background text,
        type_id integer,
        FOREIGN KEY (type_id) REFERENCES npc_type(id) ON UPDATE CASCADE)`, (err, data)=>{
            if (err){
                console.log('Create NPC Char Table failed');
            } else {
                console.log('Create NPC Char Table successful');
            }
    })
})


pool.end();