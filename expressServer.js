const express = require('express');
const app = express();
const fs = require('fs');
const { Pool } = require('pg');
const cors = require('cors');
const port = 3000;
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'npcchar',
    password: 'dnd5e',
    port: 5432,
})

// GET request: Returns info to client for all characters regardless of type
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

// GET request: Returns info to client for all characters with a specific type (/npctype/:id/)
app.get('/api/npctype/:id/chars', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    // Checks to see if the (/:id) is a valid number
    if (Number.isNaN(typeId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    } else {
        console.log(`Request for chars with type_id: ${typeId}`)
        pool.query('SELECT * FROM npc_char WHERE type_id = $1;', [typeId], (err, result)=>{
            if (err){
                return next(err);
            }
            let chars = result.rows;
            // Checks if any chars are returned before responding
            if (chars[0]) {
                res.status(200).send(chars);
            } else {
                res.status(404).send('Error: Type not found')
            }
        })
    }
})

// GET request: Returns info to client for a specific character (/chars/:charid/) with a specific type (/npctype/:id/)
app.get('/api/npctype/:id/chars/:charid/', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    } else {
        console.log(`Request for chars with type_id: ${typeId} and char_id: ${charId}`)
        pool.query('SELECT * FROM npc_char WHERE type_id = $1 AND id = $2;', [typeId, charId], (err, result)=>{
            if (err){
                return next(err);
            }
            let char = result.rows;
            // Checks if any chars are returned before responding
            if (char[0]) {
                res.status(200).send(char);
            } else {
                res.status(404).send('Error Not found')
            }
        })
    }
})

// POST request: Takes in request body and creates an entry into npc_char table with associated key from npc_type table (/:id/)
app.post('/api/npctype/:id/chars', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    // Checks to see if the (/:id) is a valid number
    if (Number.isNaN(typeId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    }
    const { charName, race, classType, background } = req.body;
    const hp = parseInt(req.body.hitPoints)
    // checks for missing information in request and if the hitPoints block is a number
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

// PATCH request: Takes in request body and modifies an entry in the npc_char table (/chars/:charid/)
app.patch('/api/npctype/:id/chars/:charid/', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    }
    const { charName, race, classType, background, hitPoints, npcType } = req.body;
    // Checks if the character exists in the table
    pool.query('SELECT * FROM npc_char WHERE id = $1 AND type_id = $2', [charId, typeId], (err, result)=>{
        let info = result.rows[0];
        if (err){
            next(err);
        }
        // If the information exists in the request body, will update the database at that location

        // Checks if hit points and type_id are valid numbers
        if (hitPoints !== undefined && Number.isNaN(parseInt(hitPoints))){
            console.log('Error Invalid Input1');
            return res.status(400).send('Error Invalid Input');
        } else if (npcType !== undefined && Number.isNaN(parseInt(npcType))){
            console.log('Error Invalid Input2');
            return res.status(400).send('Error Invalid Input');
        } else if (info){
            // Returns notification if character is successfully updated
            let hp = parseInt(hitPoints);
            let type = parseInt(npcType)
            if (charName){
                pool.query('UPDATE npc_char SET char_name = $1 WHERE id = $2;', [charName, charId], (err, result)=>{
                    console.log(`Character name updated: ${charName}`);
                });
            }
            if (race){
                pool.query('UPDATE npc_char SET race = $1 WHERE id = $2;', [race, charId], (err, result)=>{
                    console.log(`Character race updated: ${race}`);
                });
            }
            if (classType){
                pool.query('UPDATE npc_char SET class = $1 WHERE id = $2;', [classType, charId], (err, result)=>{
                    console.log(`Character class updated: ${classType}`);
                });
            }
            if (background){
                pool.query('UPDATE npc_char SET background = $1 WHERE id = $2;', [background, charId], (err, result)=>{
                    console.log(`Character background updated: ${background}`);
                });
            }
            if (hp){
                pool.query('UPDATE npc_char SET hit_points = $1 WHERE id = $2;', [hp, charId], (err, result)=>{
                    console.log(`Character hit points updated: ${hp}`);
                });
            }
            if (type){
                pool.query('UPDATE npc_char SET type_id = $1 WHERE id = $2;', [type, charId], (err, result)=>{
                    console.log(`Character npc type updated: ${type}`);
                });
            }
            return res.status(200).send('Character Updated');
        } else {
            // Returns not found if the (/:id/) or (/:charid/) don't match up
            console.log('Error Not Found');
            return res.status(404).send('Error Not Found');
        }
    });  
})

// DELETE request: Deletes a character (/:charid/) from the database and responds to client with deleted info
app.delete('/api/npctype/:id/chars/:charid/', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)) {
        console.log('Error Invalid Path Name');
        return res.status(404).send('Error Invalid Path Name');
    } else {
        pool.query('DELETE FROM npc_char WHERE id = $1 RETURNING *;', [charId], (err, result)=>{
            if (err){
                return next(err);
            }
            let delChar = result.rows[0];
            // Checks if character was in the database and responds
            if (delChar){
                console.log(delChar);
                res.status(200).send(delChar);
            } else {
                console.log('Character not found');
                res.status(404).send('Error Not Found');
            }
        })
    }
})

// Generic error handling for any internal next() errors encountered.
app.use((err,req,res,next)=>{
    console.log('Error sent to middleware')
    res.status(500).send('Internal Error');
})

// Sets my server to listen to the port variable, which is currently 3000
app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
})