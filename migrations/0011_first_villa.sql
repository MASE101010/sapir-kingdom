-- The first gold key winner moves into the golden villa (style 8).
UPDATE residents SET home = 8, changed = CAST(strftime('%s', 'now') AS INTEGER) * 1000 WHERE u = 'eiladhaim10_';
