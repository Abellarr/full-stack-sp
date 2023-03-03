const { Pool } = require('pg');
const pool = require('./connectDB.js');

pool.query('SELECT COUNT(*) FROM npc_type;', (err, data)=>{
    if (err){
        console.log('Seed failed start');
    }
    if (data.rows[0].count == 0){
        pool.query(`INSERT INTO npc_type (npc_type) VALUES ('Combat'), ('Commoner'), ('Nobility'), ('Big Bad Boss'), ('Quest Contact'), ('Patron');`, (err, data)=>{
            if (err){
                console.log('NPC Type Table failed')
            } else {
                console.log(data);
                pool.query('SELECT COUNT(*) FROM npc_char;', (err, data)=>{
                    if (err){
                        console.log('Seed failed second');
                    }
                    if (data.rows[0].count == 0){
                        pool.query(`INSERT INTO npc_char (char_name, race, class, hit_points, background, type_id) VALUES 
                            ('Beldrath', 'Half-Elf', 'Paladin', 125, 'Urban Bounty Hunter', 1),
                            ('Minthrad', 'Human', 'Arch-Wizard', 200, 'Sage', 6),
                            ('Minerva', 'Halfling', 'Tavern Hostess', 10, 'Outlander', 2),
                            ('Terath', 'Half-Orc', 'Innkeeper', 10, 'Urchin', 2),
                            ('Chard', 'Human', 'Shopkeeper', 10, 'Soldier', 2),
                            ('Byorg', 'Human', 'Barbarian', 175, 'Outlander', 1),
                            ('Valerea', 'Elf', 'Sorceror', 50, 'Charlatan', 1),
                            ('Mordrand', 'Dwarf', 'Cleric', 125, 'Acolyte', 1),
                            ('Chauncey', 'Human', 'Mayor', 10, 'Noble', 3),
                            ('Lord Farci', 'Human', 'Duke of Wellingshire', 10, 'Noble', 3),
                            ('Vendril', 'Lich', 'Arch-Lich Wizard', 500, 'Demigod', 4),
                            ('Gnarthon', 'Ogre', 'Fighter', 160, 'Soldier', 4),
                            ('Reginald', 'Halfling', 'Rogue', 60, 'Harper Agent', 5),
                            ('Calenor', 'Half-Elf', 'Cleric', 75, 'Acolyte', 5),
                            ('Balgethron', 'Drow Elf', 'Wizard', 175, 'Red Wizard', 6);`, (err, data)=>{
                            if (err){
                                console.log('NPC Character Table failed');
                            } else {
                                console.log(data);
                            }
                        })
                    }
                })
            }
        })
    }
})


pool.end();