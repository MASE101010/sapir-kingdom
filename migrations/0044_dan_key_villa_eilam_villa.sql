-- day 31: the gold key, dan_haimovich_ (the only resident who joined on day 30 is not a citizen yet, so drawn among the
-- citizens without a key, (30*7919)%n), and eilam.lev99, the aviary's architect, move into the golden villa.
UPDATE residents SET home = 8, changed = 1794589636081 WHERE u = 'dan_haimovich_';
UPDATE residents SET home = 8, changed = 1794589636081 WHERE u = 'eilam.lev99';
