CREATE TYPE cadence_enum AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE "Habits" (
    "id" SERIAL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "UserID" INTEGER NOT NULL,
    "Cadence" cadence_enum NOT NULL,
    "Frequency" INTEGER NOT NULL
); 