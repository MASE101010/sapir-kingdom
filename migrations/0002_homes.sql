-- Plots stop being n - 1: a resident invited by a friend moves into the friend's house (the house grows).
-- home: the house style the resident chose from the catalogue. host: who invited them.
ALTER TABLE residents ADD COLUMN plot INTEGER;
ALTER TABLE residents ADD COLUMN host TEXT;
ALTER TABLE residents ADD COLUMN home INTEGER;
UPDATE residents SET plot = n - 1 WHERE plot IS NULL;
ALTER TABLE codes ADD COLUMN host TEXT;
