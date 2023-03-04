DROP TABLE IF EXISTS npc_type;
DROP TABLE IF EXISTS npc_char;

CREATE TABLE npc_type (
    id SERIAL PRIMARY KEY,
    npc_type TEXT
);


CREATE TABLE  npc_char (
    id SERIAL PRIMARY KEY,
    char_name TEXT,
    race VARCHAR(30),
    class VARCHAR(50),
    hit_points INTEGER,
    background TEXT,
    type_id INTEGER,
    CONSTRAINT FK_npc_char FOREIGN KEY (type_id) REFERENCES npc_type(id) ON UPDATE CASCADE
);
