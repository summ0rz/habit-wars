CREATE TYPE cadence_enum AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    cadence cadence_enum NOT NULL,
    frequency INTEGER NOT NULL
); 