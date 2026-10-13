-- Citizenship is for followers. A new commenter gets a private message (dm: 1 sent, negative: failed tries) asking them to
-- follow and answer; their answer lets Instagram tell us whether they follow, and only then is the house built.
-- comments.house: 0 waiting for the follow, 1 the house was built (an answer under the comment is due).
ALTER TABLE comments ADD COLUMN dm INTEGER;
