-- Every commenter gets a house; citizen = 1 for those Instagram showed us follow (they wrote to us in private).
ALTER TABLE residents ADD COLUMN citizen INTEGER;
UPDATE residents SET citizen = 1 WHERE src = 'follow' OR u IN ('michaelsapir', 'yuvalgaba', 'aribiran1');
