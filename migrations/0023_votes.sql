-- day 11: the royal elections. A comment with a candidate's name is that resident's vote (residents.vote: the candidate's
-- key); a later comment with another name changes it; citizens' votes are the ones counted on the board
ALTER TABLE residents ADD COLUMN vote TEXT;
