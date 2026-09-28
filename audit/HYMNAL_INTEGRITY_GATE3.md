# Hymnal Integrity Audit — Gate 3

Branch: `hymnal-integrity-audit-gate3`

Production remains unchanged. PR #2 remains draft and must not be merged without Marc's explicit verification and approval.

## Scope

Full hymnal scan completed across 903 records:
- English: 588 hymns
- Afrikaans: 315 hymns

Confirmed:
- no missing hymn numbers
- no duplicate hymn numbers
- no duplicate IDs

Audit focus:
- malformed hymn structure
- incomplete/corrupted lyric records
- refrain sequencing
- imported publishing/copyright text inside lyric sections
- long-verse clipping risk
- integrity/search logic

## Safe repairs on this branch

- Corrected dataset validation so it validates the actual `sections` structure.
- Corrected lyric-text search so it searches section lines rather than the obsolete `verses` field.
- Moved known publishing/copyright text out of lyric display.
- Projector Mode now measures long sections and reduces lyric size only when required; no silent bottom clipping.
- Projector text re-fits after resize, orientation change and fullscreen change.
- English Hymn 210: removed the empty duplicate Verse 3 section and retained the populated Verse 3.
- English Hymn 414 ("My Lord! What a morning") repaired from the official source supplied by the user:
  Refrain → Verse 1 → Refrain → Verse 2 → Refrain → Verse 3 → Refrain.
- English Hymn 423 ("Steal away") repaired from the official source supplied by the user:
  Refrain → Verse 1 → Refrain → Verse 2 → Refrain → Verse 3 → Refrain.
- Afrikaans Hymn 123 ("In hierdie tyd") repaired from the official source supplied by the user:
  Verse 1 → Refrein → Verse 2 → Refrein → Verse 3 → Refrein.
- English 414 and 423 metadata corrected so source attribution no longer displays "Text: 1".
- Broad refrain normalization completed:
  - English: 181 hymns contain refrains; 173 were already correct and 8 were normalized.
  - Afrikaans: 149 hymns contain refrains; 147 were normalized.
- Language-specific refrain labels corrected:
  - English: `Refrain`
  - Afrikaans: `Refrein`
- Afrikaans Hymn 66 ("Ek gee alles oor") fully repaired:
  Verse 1 → Refrein → Verse 2 → Refrein → Verse 3 → Refrein → Verse 4 → Refrein.
  Verse 2 is present and verified.

## Physical / phone verification already passed

- English Hymn 414
- English Hymn 423
- Afrikaans Hymn 123
- English Hymn 210 structure
- Afrikaans Hymn 66 structure/content
- projector long-verse fitting
- normal phone long-verse display
- projector controls from previous build
- blank screen
- next / previous
- swipe
- exit
- state preservation
- landscape fullscreen

## Remaining unresolved integrity candidates

Do not alter wording without authoritative source verification.

- English Hymn 90: repeated-ending candidate retained for source verification.
- Afrikaans Hymn 59 ("Waarmee, Heer, kan ek U lowe?"): stored refrain currently ends with duplicated `eer. eer.`
- Afrikaans Hymn 72 ("Genade vir my"): stored refrain currently ends with duplicated `my. my.`
- Afrikaans Hymn 121 ("Gods dade is volmaak"): stored refrain currently ends with duplicated `jare. jare.`
- Other wording, punctuation and spacing candidates where intentional repetition cannot yet be ruled out.

## Merge gate

Do not merge to `main` and do not deploy to production until:
1. remaining source-dependent integrity candidates are resolved or explicitly deferred,
2. Gate 3 checks remain green,
3. Marc physically verifies the preview,
4. Marc gives explicit approval to merge/deploy.
