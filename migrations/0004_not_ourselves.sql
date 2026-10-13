-- The kingdom's own account was taken for a resident by mistake (its first comment). Nobody else lived here yet,
-- so house 1 starts again from the beginning.
DELETE FROM residents WHERE u = 'sapirkingdom';
UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(n), 0) FROM residents) WHERE name = 'residents';
