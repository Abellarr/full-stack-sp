

CREATE TABLE IF NOT EXISTS npc_type (
    id SERIAL PRIMARY KEY,
    npc_type TEXT
);


CREATE TABLE IF NOT EXISTS npc_char (
    id SERIAL PRIMARY KEY,
    char_name TEXT,
    race VARCHAR(30),
    class VARCHAR(50),
    hit_points INTEGER,
    background TEXT,
    type_id INTEGER,
    CONSTRAINT FK_npc_char FOREIGN KEY (type_id) REFERENCES npc_type(id) ON UPDATE CASCADE
);
