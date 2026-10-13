-- When a resident last changed their house (a style from the catalogue, or moving in with a friend), by a private message.
ALTER TABLE residents ADD COLUMN changed INTEGER;
