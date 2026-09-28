# Hymnal Integrity Audit — Gate 3

Branch: `hymnal-integrity-audit-gate3`

Production remains unchanged.

## Safe repairs on this branch

- Corrected dataset validation so it validates the actual `sections` structure.
- Corrected lyric-text search so it searches section lines rather than the obsolete `verses` field.
- Added reversible runtime sanitation for known trailing publication metadata so it is not displayed as hymn lyrics.
- English Hymn 210: removes the empty duplicate Verse 3 section and retains the populated Verse 3.
- Afrikaans Hymn 66: separates the explicit refrain block from Verse 1 without inventing a missing Verse 2.
- Projector Mode now measures long sections and reduces the lyric size only when required; if an exceptional section still cannot fit, it no longer silently clips the remaining words.
- Projector text is re-fitted after resize, orientation change and fullscreen change.

## Not changed without authoritative source verification

- English Hymns 414 and 423: incomplete stored lyric text.
- Afrikaans Hymn 123: corrupted/incomplete stored lyric text.
- Repeated-ending candidates including English 90 and Afrikaans 59, 72 and 121.
- Other wording, punctuation and spacing candidates where intentional repetition cannot yet be ruled out.

## Merge gate

Do not merge until build/type checks and physical long-verse projector tests pass.
