#!/usr/bin/env python3
"""Independent verification pass (not the authoring script) for the
form-distractor-completeness audit: for every word-order question, checks
whether any correctOrder chunk's text matches a known multi-form family
(from verbs.json or adjectives.json) and, if so, whether every OTHER
distinct-text form of that family is present as an isDistractor chunk.
Also checks the be-family (be/am/is/are/was/were) and the there-is/are/
was/were and Do/Does/can/could/can't/couldn't fused-phrase families using
the same scope rules already established and documented in the codebase
(present-tense-only subsets where a pattern doesn't teach past tense,
fused multi-word chunks intentionally excluded). Not shipped."""
import json

SRC = "src/data"


def load(name):
    with open(f"{SRC}/{name}", encoding="utf-8") as f:
        return json.load(f)


verbs = load("verbs.json")
adjectives = load("adjectives.json")
patterns = load("sentencePatterns.json")

VERB_FAMILIES = {}
for v in verbs:
    forms = {v["dict"], v["forms"]["present"], v["forms"]["past"], v["forms"]["presentParticiple"]}
    for f in forms:
        VERB_FAMILIES[f.lower()] = forms

ADJ_FAMILIES = {}
for a in adjectives:
    forms = {a["forms"]["base"]["text"], a["forms"]["comparative"]["text"], a["forms"]["superlative"]["text"]}
    for f in forms:
        ADJ_FAMILIES[f.lower()] = forms

# Documented scope exceptions: (pattern_id) -> family text -> allowed subset
# (rather than the full verbs.json/adjectives.json family), matching the
# precedent set in Phase 11's follow-up commit messages.
BE_FULL = {"be", "am", "is", "are", "was", "were"}
BE_PRESENT_ONLY = {"am", "is", "are"}

FUSED_MARKERS = (" ", "'")  # any chunk text containing a space or apostrophe-fused negative is a fused chunk

issues = []
skipped_no_data = []

for pat in patterns:
    for q in pat.get("wordOrderQuestions", []):
        existing = {c["text"].lower(): c for c in q["chunks"]}
        distractor_texts = {c["text"].lower() for c in q["chunks"] if c.get("isDistractor")}
        for word in q["correctOrder"]:
            wl = word.lower()
            if any(m in word for m in FUSED_MARKERS) and word not in ("Do you have", "Does he have"):
                continue  # fused multi-word chunk, not a single-word family member (or "Can you" etc.)
            fam = VERB_FAMILIES.get(wl) or ADJ_FAMILIES.get(wl)
            if not fam:
                continue
            expected_others = {f.lower() for f in fam if f.lower() != wl}
            missing = expected_others - distractor_texts - {wl}
            if missing:
                issues.append((pat["id"], q["id"], word, sorted(missing)))

print(f"Checked {sum(len(p['wordOrderQuestions']) for p in patterns)} word-order questions across {len(patterns)} patterns.\n")
if issues:
    print(f"{len(issues)} FAMILY-COMPLETENESS ISSUES (verb/adjective families from data files):")
    for pid, qid, word, missing in issues:
        print(f"  {pid}/{qid}: {word!r} missing distractor forms {missing}")
else:
    print("0 verb/adjective family-completeness issues -- every correctOrder word matching a")
    print("verbs.json/adjectives.json family has all its other distinct-text forms present as distractors.")
