-- day 11: the royal wall (הכותל המלכותי). A comment "המשאלה שלי היא..." puts a note on the wall; ok: 1 on the wall
-- (shown once its writer is a citizen), 0 waits for the daily run to look at it, -1 not shown (rude, a link, another city)
CREATE TABLE IF NOT EXISTS wishes (id TEXT PRIMARY KEY, u TEXT NOT NULL, text TEXT NOT NULL, at INTEGER NOT NULL, ok INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS wishes_ok ON wishes (ok, at);
