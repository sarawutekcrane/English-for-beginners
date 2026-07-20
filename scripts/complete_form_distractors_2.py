#!/usr/bin/env python3
"""Second pass, informed by check_form_distractor_completeness.py's
independent verification: fixes 3 real gaps that verify script's naive
"any correctOrder word matching a verbs.json family" heuristic surfaced
and manual review confirmed as genuine (not false positives):

- can-could-1 ('play') and can-could-2 ('cook'): base-form-after-modal
  verb slots that never got their verb-family distractors, even though
  the structurally identical can-could-6 ('speak' after "Can you") DID
  get this treatment in the Phase 11 follow-up -- a real inconsistency,
  now fixed to match.
- have-has-11 ('have' after "Does she"): tests that the verb stays base
  form after "Does", the same "don't conjugate after a fixed auxiliary"
  point already tested elsewhere (e.g. "be" after "will"). Added has/had/
  having.

Deliberately NOT added (also flagged by the checker, reviewed and
rejected as a false positive): have-has-11's 'Does' matched against the
do-verb-family (do/does/did/doing) too, since do/does is also a regular
verb in verbs.json. But here "Does" is a QUESTION-FORM AUXILIARY, not the
main verb "to do" -- 'did'/'doing' belong to a different grammatical role
(main-verb do, past tense) that this present-tense-only, have/has-scoped
pattern never teaches. Adding them would introduce an untaught concept,
not test a real in-scope confusion, so left alone (the existing Do/Does
2-member auxiliary-family distractor from Phase 11 stays as the complete
set for that slot)."""
import json

PATH = "src/data/sentencePatterns.json"

PHON = {
    "has": "แฮส", "had": "แฮด", "having": "แฮฟ-วิ่ง",
    "plays": "เพลย์ส", "played": "เพลย์ด", "playing": "เพลย์-อิ่ง",
    "cooks": "คุคส์", "cooked": "คุคท์", "cooking": "คุค-กิ้ง",
}

ADDITIONS = {
    ("have-has", "have-has-11"): ["has", "had", "having"],
    ("can-could-ability", "can-could-1"): ["plays", "played", "playing"],
    ("can-could-ability", "can-could-2"): ["cooks", "cooked", "cooking"],
}

patterns = json.load(open(PATH, encoding="utf-8"))
report = []

for pat in patterns:
    for q in pat.get("wordOrderQuestions", []):
        key = (pat["id"], q["id"])
        if key not in ADDITIONS:
            continue
        existing_texts = {c["text"].lower() for c in q["chunks"]}
        added = []
        for w in ADDITIONS[key]:
            if w.lower() in existing_texts:
                raise SystemExit(f"{key}: {w!r} already present -- would collide")
            q["chunks"].append({"text": w, "phonetic": PHON[w], "isDistractor": True})
            existing_texts.add(w.lower())
            added.append(w)
        report.append((pat["id"], q["id"], added))

missing = set(ADDITIONS.keys()) - {(p, q) for p, q, _ in report}
if missing:
    raise SystemExit(f"Never found: {missing}")

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(PATH, "a", encoding="utf-8").write("\n")

print(f"Second pass: completed {len(report)} more word-order questions:")
for pid, qid, added in report:
    print(f"  {pid} / {qid}: +{added}")
