# Chat and comment capture  (deadline: before {{CLOSES}})

Anthropic's move does NOT carry chats or comments. They stay in the old tool
and are deleted some time after it closes on {{CLOSES}}. No AI can export them.
The only durable copy is what each chat writes into the project before then.

## 1. Close every open chat (THE record)
Open each chat listed in `UNCLOSED-CHATS.md` and send:
`{{CLOSE_PHRASE}}`
- Pass: {{CLOSE_PASS}}.
- Stop: if a chat will not open, mark its title "lost" in `UNCLOSED-CHATS.md`.

## 2. Comments
`COMMENTS.md` (next to this file) is the comment dump made during the
migration. Nothing more to do.

## 3. Account export (best effort)
1. On a computer, or a phone browser with "Request Desktop Website" — the
   Claude phone app has no export: claude.ai → your initials (bottom-left) →
   Settings → Privacy → **Export data** → Export. No button on a Team plan =
   only the owner can export; skip it.
2. Download it from the email within 24 hours; the link expires.
3. Search the zip for a chat title.
   - Pass: found → keep the zip with the backups.
   - Stop: not found → that export does not cover design chats; step 1 is the only record.

## 4. Re-run the migration
After all the closes, say "migrate the project to …" again so the backup zip
holds the final record. Do this BEFORE any official Move to Claude; after the
move the project is read-only.
