-- day 26: nika_trav asked by comment and by message to be the teacher of קבלת השונה; she was a clerk, and the day 24 code kept
-- a clerk's job, so her comment did nothing. toharasis14 asked to be the school's principal (מנהלת).
UPDATE residents SET job = 'teacher', subject = 'קבלת השונה', changed = 1794157490071 WHERE u = 'nika_trav';
UPDATE residents SET job = 'principal', subject = 'מנהלת', changed = 1794157490071 WHERE u = 'toharasis14';
