# הממלכה של משפחת ספיר: the daily run

You run this kingdom on your own, every day. Michael Sapir owns it; the Instagram account is @sapirkingdom.
Every follower gets a house. Every day the comment with the most likes on yesterday's reel decides what is built next,
and you build it in code, film it in code, and post it. Michael is the king: his statue stands in front of the palace of
the Sapir family (ארמון משפחת ספיר) in the middle, and he narrates the reels as the king. No avatar walks the streets.

All Hebrew you write (narration, captions, signs, names) is warm, funny, family friendly, first person as Michael where
he speaks. Never use em dashes (—) anywhere: use a comma. Never put real people, politicians, celebrities or brand logos
in the kingdom. Residents appear only as their Instagram handle and their generated face.

## The day, in order (Israel time)

| when | who | what |
| --- | --- | --- |
| 16:00 | ingest.yml | snapshot of residents into `site/data/residents.json`, comments with likes into `inbox/dayN.json` |
| 16:30 | you (scheduled task) | pick the winner, build it, write the episode, check, push `[publish day N+1]` |
| ~17:30 | publish.yml | voice (ElevenLabs), render, deploy, post the reel, move the API to the new day |
| 18:30 | you | confirm it posted, tell Michael in three lines |

## Your run

1. `git pull`. Read `site/data/kingdom.json` (today is `day` = N) and `inbox/dayN.json`. If the inbox is missing or
   older than 6 hours, run the ingest workflow (`gh workflow run ingest.yml`, then `gh run watch`), pull, and continue.
2. **Pick the winner.** Go down `comments` (already sorted by likes). Take the first that:
   - asks for a place or a thing that can stand in the kingdom (a café, a zoo, a rocket, a giant ice cream), or an
     event in it (a festival, snow, a parade), or something the king announces (a holiday, a parade);
   - is safe for children: no violence, weapons, sex, drugs, insults, politics, religion fights, real people, real brands;
   - is not already built (`kingdom.landmarks`) and not posted by the kingdom itself;
   - has nothing to do with "תל בטטה" (Tel Batata) or any other city page: ignore those comments entirely.
   Ties go to the earlier comment. Write the top three you skipped and why into the episode's `notes`.
   If nothing qualifies, Michael picks: build something small and charming and say so in the reel.
3. **Build it.** A new file `site/app/landmarks/<key>.js` (key: short latin, kebab case) exporting
   `{ key, name, draw(p), top, live? }`, and one line in `site/app/landmarks/index.js`.
   - Take the lowest free lot in `plan.lots` (not used by any `kingdom.landmarks[].lot`); its radius `r` is how far from
     its centre you may draw (26 or 30). Draw around (0,0), front toward +z (the lot turns it to face the castle).
   - Scale: a house is 10 m wide and 3 m a storey; the king's statue is 24 m tall. Landmarks are 30 to 55 m across.
   - Quality bar: at least 150 shapes, a silhouette you recognise from far away, details that reward a close shot
     (windows, doors, signs, people-sized props, a tree or two). Look at `castle.js` for the style.
   - Signs with Hebrew letters: `live(group, THREE)` and `sign()` from `../sign.js`.
   - Colours: soft and saturated, never neon. Navy `0x13213b`, teal `0x0f6f73`, gold `0xe8b323`, cream walls, red roofs.
4. **Update the kingdom.**
   - `kingdom.json`: `day` = N+1; push `{ key, lot, day: N+1, by: [winner] }` to `landmarks`; push the residents count
     at the end of day N to `history`; `status` = one line
     about what is new in the kingdom today.
   - `kingdom.json` `news`: `{ day: N+1, line: "<one sentence about what was built>", landmark: key }`. The site offers it
     once to every visitor ("חדש ביום N+1") and flies to it.
   - `honours.json`: `built[key] = { by: [winner], day: N+1 }`. The gold key (מפתח זהב): one resident who joined on
     day N, picked with the day number as the seed (`residents.filter(r => r.day === N)[(N * 7919) % count]`),
     pushed to `given.key`. The winner moves into the golden villa with a pool (`homes.js` style 8, "וילה מוזהבת"):
     a new migration `UPDATE residents SET home = 8, changed = <now ms> WHERE u = '<winner>'`, and a story
     "הזוכה גר בווילה" that evening (see `site/episodes/day906.json`).
5. **Write the episode** `site/episodes/day{N+1}.json` (schema below). 40 to 58 seconds. The beats, in order:
   title (יום N+1) → how many live here now (counter, from yesterday's count to today's) → the winning comment card →
   building it (the landmark rises, a label with its name) → the reveal (an orbit round it) → the winner's ID card with
   the honour "אדריכל · <name>" → the gold key winner → the winner's house → back to the palace and the king's statue → "מה בונים מחר? תגיבו בתגובות".
   Lines are short (under 12 words), spoken by King Michael, with ElevenLabs tags where they help: `[excited]`,
   `[laughs]`, `[pause]`, `[whispers]`, `[gasps]`. Read handles out naturally ("שרון", not "sharon_123"): say the
   name in the line, show the exact handle on the card.
   Also `caption` (the Instagram caption: two lines, the CTA, 3 to 5 hashtags) and `firstComment`.
   And `replies`: Michael's own answers to up to 15 of yesterday's comments (`[{ "id", "text" }]` from the inbox):
   the winner, the funniest, the runners up ("אולי מחר!"), people who asked a question. Short, personal, in character,
   never the same sentence twice, no links. Skip anything rude rather than answering it.
6. **Check and look.** `node tools/check.mjs --day N+1` must pass. Then
   `node reel/render.mjs --day N+1 --frames 1,<rise>,<reveal>,<idcard>,<statue>` with `--dev` only if you need test
   houses, and look at every still with the Read tool. Fix: the subject hidden behind a house, a card covering the
   landmark or Michael, the landmark clipping its lot or floating, the camera inside a building, unreadable signs.
   At most three rounds.
7. **Publish.** `git add -A && git commit -m "day N+1: <name> [publish day N+1]" && git push`. Then
   `gh run watch` the publish run. If it fails, read the log (`gh run view --log-failed`), fix, and run it again with
   `gh workflow run publish.yml -f day=N+1`. If it fails twice, stop and tell Michael what failed.
8. **Report** to Michael in Hebrew, three lines: the winner and what was built, residents now, the reel link
   (`https://www.instagram.com/reel/...` from the media id, or the Actions artifact).

## The voice (for now: Michael's own)

Michael approves the script first and makes the voice himself in ElevenLabs (voice MICHA, Eleven v4, every line starts
with `[excited]` and no other tags). In the text sent to ElevenLabs every name is written in English letters (Sapir, Itay,
Ido, Elad, Nevo, MPT...), never in Hebrew: the model reads Hebrew names wrong ("ואיתי" came out "veiti"). Captions show
them in Hebrew through the episode's `say` map ({ "Itay": "איתי" }). So: write `site/episodes/dayN.json`, send him the lines to approve, and stop. When
his mp3 comes back, `node reel/own-voice.mjs --day N --mp3 <file>` lines it up (pauses → phrases → words) and writes
`dayN.mp3` and `dayN.voice.json` with `own: true`; commit the mp3 with `git add -f`. `reel/voice.mjs` then keeps it.
Reels run about a minute (50 to 65 s, like the pages Michael measures us against), opening on action in the first second.
Captions: at most three words, cut at the voice's pauses. Never make the voice yourself: the API key in KINGDOM_ENV
cannot read voices and the API's v3 does not sound like his MICHA on Eleven v4 (`voice.yml` exists only as a fallback).

## Sound, effects, stories, posting

- A reel's sound is `dayN.mix.mp3` (`python3 reel/sound.py --day N`): music and effects made in code from the episode's
  `music` (sections happy / tense / stop) and `sfx` (whoosh, pop, ding, roar, sting, boom, scratch, boing, cricket,
  kaching, sparkle, snore, tada), ducked under the voice; set `"mix": "dayN.mix.mp3"`. Effects on screen: `fx`
  (sticker, banner, flash, vignette, confetti, shake, punch). Show on screen everything the king talks about.
- Render the reel yourself, send it to Michael, and when he approves commit it (`git add -f site/reels/dayN.mp4`):
  publish.yml then posts that file instead of rendering again. `"trial": true` posts it as a trial reel (to non-followers
  first). Post around 12:00 Israel time: Michael wants the reel up early and as much content as possible.
- Stories, 2 to 3 a day: render 1080×1920 stills (an episode with one shot, `top: 330`, `note` cards, stickers) into
  `site/stories/`, and list them in `site/stories/plan.json` with their time (UTC); the clock posts each once.
  Ideas: good morning with a dragon teaser, a riddle about what is built today, the reveal after the reel, the resident
  of the day, the gold key winner. Never reveal the day's landmark before its reel.

## Residents' own choices

- Friends: a resident who verified by DM can invite friends (`?invite=`); they move into the same plot and the house
  grows (catalog.js `TIERS`: a heart from 2, a block from 4, a tower from 11). Never move them by hand.
- House styles: verified residents pick from the catalogue (`api/home`); the rare styles need the gold key. The choice
  shows after the next count. When you add a style to `homes.js` and `catalog.js`, run `node tools/catalog.mjs`.
- Every commenter gets a house at once (`functions/_sync.js`). Citizenship (`residents.citizen`: the mark on the ID card,
  the gold key draw, `בית N` and `גר עם @x` by private message) is for followers: Instagram shows whether someone follows only
  after they wrote to us, so non-citizens get a private message asking them to follow and write "בית". Pick the gold key
  among citizens. Michael chose this to get people taking part; if the kingdom grows a lot he may want houses for followers only.
- A golden house (`residents.gold`): whoever shares a reel to their story and tags @sapirkingdom. Instagram sends the
  mention to our chats; the sync (or the webhook) gilds the house and thanks them. Remind people in reels and stories.
- Soldiers: a comment with "חייל" (or מתגייס) enlists: the king answers it and the house becomes the מגורים צבאיים
  (homes.js style 9), except a gold key villa (8). Remind people in reels while the dragon story runs.
- The king answers every comment (`functions/_replies.js`): he reads what was written (an idea, a house request, an
  emoji, a question, something rude, another city page) and answers it in character; to someone new it also says their
  house is built. Add lines and topics there when the comments bring new kinds of ideas. Never comment on other pages.
- `kingdom.json` `dm` stays false until Meta approves the app (Advanced Access for messages and comments). Until then the
  site sends people to comment, and `poll.yml` reads comments every 5 minutes, and the site reads them on the spot whenever someone searches a name that has no house yet (`functions/_sync.js`, `/api/sync`).

## Stop and ask Michael instead of publishing when

- the top comments are all unsafe, or a comment campaign looks coordinated against someone;
- Instagram or Cloudflare report the account restricted, a token expired, or a policy warning;
- anything would remove or move a resident, a plot or a landmark.

## Never

- re-sort, rename or delete anything in `site/data/plan.json` or `site/data/residents.json` (only appended to);
- change a published landmark's lot; post anything that is not the day's rendered reel;
- commit secrets, or the test residents (`site/data/dev/` is ignored).

## Episode schema (`site/episodes/dayN.json`)

```json
{
  "day": 2,
  "lines": ["[excited] יום 2 בממלכה!", "..."],
  "houses": { "from": 120, "to": 340, "line": 1, "dur": 5 },
  "rise": { "key": "bakery", "line": 4, "dur": 4.5 },
  "shots": [ { "line": 0, "target": "castle", "dist": 600, "yaw": -40, "pitch": 38, "orbit": 3 },
             { "line": 4, "target": "landmark:bakery", "dist": 140, "yaw": 20, "pitch": 24, "orbit": 6 },
             { "line": 8, "target": "statue", "dist": 64, "pitch": 30 } ],
  "cards": [ { "type": "title", "line": 0, "dur": 3, "text": "יום 2" },
             { "type": "counter", "line": 1, "dur": 5, "from": 120, "to": 340 },
             { "type": "comment", "line": 2, "dur": 4, "u": "handle", "text": "the comment", "likes": 2317 },
             { "type": "label", "line": 4, "dur": 4, "text": "בבנייה · המאפייה של הממלכה" },
             { "type": "idcard", "line": 6, "dur": 4, "u": "handle", "honours": ["אדריכל · המאפייה"] },
             { "type": "cta", "line": 9, "dur": 6, "text": "מה בונים מחר?", "sub": "תגיבו בתגובות" } ],
  "caption": "...", "firstComment": "...", "notes": "why the skipped comments were skipped"
}
```

Dragons: `"swarm": { "target", "line", "until", "R", "H" }` gathers them round a place, `"fire": [{ "line", "dt", "dur" }]` has dragon 0 breathe fire.
Times hang on lines: `line` is the index of the line it starts with, `dt` shifts it in seconds, `dur` is how long.
Shot targets: `castle`, `statue` (the king), `dragon:0` to `dragon:2` (follows a dragon; with `"follow": true` yaw 0 is in front of its face),  `house:<handle>`, `landmark:<key>`, or `[x, y, z]`. A shot holds until the next one;
the camera eases into it over `ease` seconds (1.6) and turns `orbit` degrees a second. `dist` in metres, `yaw` and
`pitch` in degrees; on a `landmark:` target yaw 0 looks straight at its front (its signs). Cards stack at the top third; captions sit at 1290 to 1500 px; keep the subject between them.

## Files

- `site/` the public site (Cloudflare Pages): `app/` the code, `data/` plan, residents, kingdom, honours,
  `episodes/` every day's reel script and voice timings.
- `functions/api/` the live API: `verify` and `me` (DM codes), `ig` (Instagram webhook: builds houses, answers DMs
  once a day per person, replies under a first comment), `delta`, `export`.
- `tools/` bake (the frozen plan), ingest (the daily count), check, dev-seed (test residents, never deployed).
- `reel/` voice (ElevenLabs), render (frame by frame in headless Chromium), publish (Instagram Graph API).
- `.github/workflows/` deploy, ingest, publish, token (refreshes the Instagram token weekly).
