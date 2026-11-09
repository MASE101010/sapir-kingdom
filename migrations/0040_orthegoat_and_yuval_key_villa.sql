-- day 27: the box office's architect, orthegoat, and the gold key, yuval_aharoni27 (no citizen joined on day 26, so drawn
-- among the citizens without a key, (26*7919)%n), move into the golden villa.
UPDATE residents SET home = 8, changed = 1794243906081 WHERE u IN ('orthegoat', 'yuval_aharoni27');
