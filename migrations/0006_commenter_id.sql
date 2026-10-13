-- The commenter's Instagram id, so a comment can be checked at once: someone who already follows (and Instagram lets us
-- see it) gets the house straight away, without waiting for a private message.
ALTER TABLE comments ADD COLUMN uid TEXT;
