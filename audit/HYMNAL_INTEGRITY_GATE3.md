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

## Source-verified repairs completed from user-supplied text edition

- English Hymn 90 ("I will never cease to love You"):
  - removed the duplicated final `me.` from the refrain,
  - normalized section numbering to Verse 1 → Refrain → Verse 2 → Refrain → Verse 3 → Refrain.
- Afrikaans Hymn 59 ("Waarmee, Heer, kan ek U lowe?"):
  - removed the duplicated final `eer.` from the refrain,
  - normalized section numbering to Verse 1 → Refrein → Verse 2 → Refrein → Verse 3 → Refrein.
- Afrikaans Hymn 72 ("Genade vir my"):
  - removed the duplicated final `my.` from the refrain,
  - normalized section numbering to Verse 1 → Refrein → Verse 2 → Refrein → Verse 3 → Refrein.
- Afrikaans Hymn 121 ("Gods dade is volmaak"):
  - removed the duplicated final `jare.` from the refrain,
  - normalized section numbering to Verse 1 → Refrein → Verse 2 → Refrein → Verse 3 → Refrein.

## Hymn 66 source note

The user-supplied Afrikaans text edition omits Verse 2 and jumps from Verse 1 to Verse 3.
An earlier official music-source image supplied by the user contains Verse 2 in full, and that verse has already been physically verified in the PWA.
Therefore Verse 2 remains in the Gate 3 dataset. The text-edition omission is documented as a source discrepancy, not treated as evidence to delete the verse.

## Remaining unresolved integrity candidates

- Other wording, punctuation and spacing candidates where intentional repetition cannot yet be ruled out.
- No further wording changes should be made without authoritative source verification.

## Gate 3 closeout audit — 2026-09-28

Closeout verification completed against the current Gate 3 branch.

Confirmed:
- 588 English hymns and 315 Afrikaans hymns.
- No missing hymn numbers.
- No duplicate hymn numbers.
- No duplicate hymn IDs.
- `src/data` and `public` hymn datasets match for both languages.
- Runtime display scan: no empty sections remain visible.
- Runtime display scan: no known publishing/copyright metadata remains inside lyric display.
- All English refrain labels are `Refrain`.
- All Afrikaans refrain labels are `Refrein`.
- English Hymn 90 physically verified PASS.
- Afrikaans Hymn 59 physically verified PASS.
- Afrikaans Hymn 72 physically verified PASS.
- Afrikaans Hymn 121 physically verified PASS.
- Netlify PR #2 deploy preview is green on the current branch head.

Additional closeout repair:
- Afrikaans Hymns 29, 100 and 307 still exposed publishing metadata at runtime because broad refrain normalization shifted section positions.
- The metadata cleanup references were corrected to the new section positions.
- A full runtime re-scan confirms no known publishing/copyright metadata remains visible in lyric sections.

Final source-dependent exception resolved:
- Afrikaans Hymn 30 ("Ware vreugde gee die Heer") verified from the official text edition supplied by the user.
- Correct sequence:
  Verse 1 → Refrein → Verse 2 → Refrein → Verse 3 → Refrein.
- The Verse 3 refrain intentionally ends with the repeated phrase:
  `Sy naam sal ek bely en vereer sy liefdesmag, sy liefdesmag.`
- Both `src/data` and `public` Afrikaans datasets were repaired to match the authoritative source.

## Merge gate

Do not merge to `main` and do not deploy to production until:
1. Gate 3 checks remain green,
2. Marc physically verifies the latest preview,
3. Marc gives explicit approval to merge/deploy.
