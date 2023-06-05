CREATE TABLE human 
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    diskSpace INTEGER NOT NULL DEFAULT(15),
    usedSpace INTEGER NOT NULL DEFAULT(0),
    avatar VARCHAR(255),
    isActivated BOOLEAN DEFAULT(false),
    activationLink VARCHAR(255) NOT NULL
);

CREATE TABLE file 
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    accessLink VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    human_id INTEGER,
    parent_id INTEGER,
    FOREIGN KEY (human_id) REFERENCES human (id),
    FOREIGN KEY (parent_id) REFERENCES file (id)
);

CREATE TABLE token
(
    id SERIAL PRIMARY KEY,
    refreshToken VARCHAR(255) NOT NULL,
    human_id INTEGER,
    FOREIGN KEY (human_id) REFERENCES human (id)
);