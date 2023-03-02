const express = require('express');
const app = express();
const fs = require('fs');
const { Pool } = require('pg')
const port = 3000;
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'npcchar',
    password: 'dnd5e',
    port: 5432,
})





app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
})