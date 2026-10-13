-- The site reads its own comments (functions/_sync.js): which comment gave a new house, and whether it was answered.
ALTER TABLE comments ADD COLUMN house INTEGER;
ALTER TABLE comments ADD COLUMN replied INTEGER;
