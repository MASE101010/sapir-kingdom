-- The king answers every comment, not only the ones that built a house: the residents' comments not answered yet get one.
UPDATE comments SET house = 3 WHERE (house IS NULL OR house = 2) AND replied IS NULL AND u != 'sapirkingdom' AND (media IS NULL OR media != '18101994863037503');
