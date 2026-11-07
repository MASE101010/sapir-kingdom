-- day 24: the school's architect, eladshwar, and the gold key, eyal124676 (no citizen joined on day 23, so drawn among the 160
-- citizens without a key, (23*7919)%160, the rule of days 19 and 20), move into the golden villa.
UPDATE residents SET home = 8, changed = 1793984750937 WHERE u IN ('eladshwar', 'eyal124676');
