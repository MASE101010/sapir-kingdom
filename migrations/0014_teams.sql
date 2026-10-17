-- day 5: the two football clubs. team: 'maccabi' or 'hapoel' for the first 20 who asked to play for each; shirt: their number
ALTER TABLE residents ADD COLUMN team TEXT;
ALTER TABLE residents ADD COLUMN shirt INTEGER;
