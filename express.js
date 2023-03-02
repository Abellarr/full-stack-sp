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

app.get('/api/npctype/all/chars', (req,res, next)=>{
    console.log(req.method);
    console.log('Request for all chars')
    pool.query('SELECT * FROM npc_char;', (err, result)=>{
        if (err){
            return next(err);
        }
        let rows = result.rows;
        res.status(200).send(rows);
    })
})

app.get('/api/npctype/:id/chars', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    if (Number.isNaN(typeId)){
        return res.status(404).send('Error Not Found')
    } else {
        console.log(`Request for chars with type_id: ${typeId}`)
        pool.query('SELECT * FROM npc_char WHERE type_id = $1;', [typeId], (err, result)=>{
            if (err){
                return next(err);
            }
            let rows = result.rows;
            if (rows[0]) {
                res.status(200).send(rows);
            } else {
                res.status(404).send('Error: Type not found')
            }
        })
    }
})

app.get('/api/npctype/:id/chars/:charid/', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    if (Number.isNaN(typeId) || Number.isNaN(charId)){
        return res.status(404).send('Error Not Found')
    } else {
        console.log(`Request for chars with type_id: ${typeId} and char_id: ${charId}`)
        pool.query('SELECT * FROM npc_char WHERE type_id = $1 AND id = $2;', [typeId, charId], (err, result)=>{
            if (err){
                return next(err);
            }
            let rows = result.rows;
            if (rows[0]) {
                res.status(200).send(rows);
            } else {
                res.status(404).send('Error Not found')
            }
        })
    }
})


app.post('/api/npctype/:id/chars', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    if (Number.isNaN(typeId)){
        return res.status(404).send('Error Not Found')
    }
    const { charName, race, classType, background } = req.body;
    const hp = parseInt(req.body.hitPoints)
    // checks for missing information in request and if the age is a number
    if (!charName || !race || !classType || !hp || !background || Number.isNaN(hp)) {
        console.log('Error: Input incorrect or missing information');
        return res.status(400).send('Error: Input missing or corrected information');
    } else {
        pool.query('INSERT INTO npc_char (char_name, race, class, hit_points, background, type_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [charName, race, classType, hp, background, typeId], (err, result)=>{
            if (err){
                return next(err);
            }
            let charInfo = result.rows[0];
            console.log('Added: ' + charName);
            res.status(200).send(charInfo);
        })
    } 
})



app.delete('/api/npctype/:id/chars/:charid/', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // checks if the path has proper numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)) {
        console.log('Error Not Found');
        return res.status(404).send('Error Not Found');
    } else {
        pool.query('DELETE FROM npc_char WHERE id = $1 RETURNING *;', [charId], (err, result)=>{
            if (err){
                return next(err);
            }
            let delChar = result.rows[0];
            // checks if character is in the database
            if (delChar){
                console.log(delChar);
                res.status(200).send(delChar);
            } else {
                console.log('Character not found');
                res.status(404).send('Error not found');
            }
        })
    }
})

app.use((err,req,res,next)=>{
    console.log('Error sent to middleware')
    res.status(500).send('Internal Error');
})

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
})