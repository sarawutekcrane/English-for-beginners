#!/usr/bin/env python3
"""Phase 11 follow-up: expand isDistractor verb-form-chunk coverage beyond
Phase 11's 5 illustrative verb families (have/has, go family, do/does,
can/could, eat/ate/eating -- all left untouched here) to every other
multi-form verb actually used in sentencePatterns.json: every regular verb
in verbs.json that appears as a standalone single-word chunk in a
word-order question with distractors=[], plus the "be" family
(be/am/is/are/was/were), plus the there-is/are/was/were fused-phrase
family (the there-is-are pattern's own core lesson), plus the can't/
couldn't negative-modal pair Phase 11 didn't reach. Not shipped -- one-off
data-authoring script.

Deliberately skipped, and why:
- will/would, should, must, shall: grepped the full examples+WOQ corpus,
  none of these ever appear in more than one form (would/should/must/shall
  don't appear AT ALL) -- no real grammatical contrast exists to test.
- Fused multi-word chunks (e.g. "don't have", "isn't going to", "Do you
  have", "am not"): consistent with Phase 11's own precedent (have-has-6..
  10 were left untouched for exactly this reason) -- these aren't cleanly
  swappable without restructuring the chunk itself, and Phase 11 never
  attempted it either.
- Verbs not present in verbs.json (run, call, help, travel, visit, start,
  buy, sing, find, drive, forget, arrive, marry, meet): no authored
  conjugation data exists to build a distractor set from.
"""
import json

PATH = "src/data/sentencePatterns.json"

verbs_list = json.load(open("src/data/verbs.json", encoding="utf-8"))
VERBS = {v["id"]: v for v in verbs_list}

FIELDS = ["dict", "present", "past", "presentParticiple"]


def verb_family_distractors(verb_id, correct_field):
    """All other conjugated forms of this verb (text+phonetic), skipping
    any whose text is identical to the correct form's text (e.g. read's
    dict and past forms are both spelled "read")."""
    v = VERBS[verb_id]
    correct_text = v[correct_field] if correct_field == "dict" else v["forms"][correct_field]
    out = []
    seen = {correct_text.lower()}
    for f in FIELDS:
        text = v["dict"] if f == "dict" else v["forms"][f]
        if text.lower() in seen:
            continue
        seen.add(text.lower())
        phon = v["phonetic"]["dict"] if f == "dict" else v["phonetic"][f]
        out.append({"text": text, "phonetic": phon, "isDistractor": True})
    return out


# (pattern_id, woq_id) -> (verb_id, correct_field)
REGULAR_VERB_TARGETS = {
    ("present-simple", "present-simple-2"): ("play", "present"),
    ("present-simple", "present-simple-3"): ("work", "present"),
    ("present-simple", "present-simple-4"): ("drink", "dict"),
    ("present-simple", "present-simple-5"): ("study", "dict"),
    ("present-simple", "present-simple-6"): ("read", "dict"),
    ("present-simple", "present-simple-9"): ("cook", "dict"),
    ("present-simple", "present-simple-10"): ("listen", "dict"),
    ("past-simple", "past-simple-1"): ("cook", "past"),
    ("past-simple", "past-simple-2"): ("drink", "past"),
    ("past-simple", "past-simple-3"): ("study", "past"),
    ("past-simple", "past-simple-4"): ("speak", "past"),
    ("past-simple", "past-simple-5"): ("listen", "past"),
    ("past-simple", "past-simple-6"): ("have", "past"),
    ("past-simple", "past-simple-8"): ("work", "past"),
    ("past-simple", "past-simple-9"): ("read", "past"),
    ("present-continuous", "present-continuous-1"): ("read", "presentParticiple"),
    ("present-continuous", "present-continuous-2"): ("cook", "presentParticiple"),
    ("present-continuous", "present-continuous-3"): ("drink", "presentParticiple"),
    ("present-continuous", "present-continuous-4"): ("play", "presentParticiple"),
    ("present-continuous", "present-continuous-5"): ("write", "presentParticiple"),
    ("present-continuous", "present-continuous-7"): ("study", "presentParticiple"),
    ("present-continuous", "present-continuous-10"): ("have", "presentParticiple"),
    ("going-to-future", "going-to-2"): ("play", "dict"),
    ("going-to-future", "going-to-3"): ("watch", "dict"),
    ("going-to-future", "going-to-7"): ("cook", "dict"),
    ("can-could-ability", "can-could-6"): ("speak", "dict"),
}

BE = {"be": "บี", "am": "แอม", "is": "อิส", "are": "อาร์", "was": "วอส", "were": "เวอร์"}


def be_chunks(words):
    return [{"text": w, "phonetic": BE[w], "isDistractor": True} for w in words]


# Present-tense be-agreement (am/is/are), scoped to present tense only --
# these patterns don't teach was/were, so introducing them would test an
# untaught tense (same caution as the Phase 8 there-is-are scope fix).
BE_PRESENT_TARGETS = {
    ("present-continuous", "present-continuous-1"): ["is", "are"],  # am
    ("present-continuous", "present-continuous-2"): ["am", "are"],  # is
    ("present-continuous", "present-continuous-3"): ["am", "is"],  # are
    ("present-continuous", "present-continuous-4"): ["am", "is"],  # are
    ("present-continuous", "present-continuous-5"): ["am", "are"],  # is
    ("present-continuous", "present-continuous-6"): ["am", "are"],  # is
    ("present-continuous", "present-continuous-7"): ["am", "is"],  # are
    ("present-continuous", "present-continuous-10"): ["am", "is"],  # are
    ("comparatives", "comparatives-1"): ["am", "are"],  # is
    ("comparatives", "comparatives-2"): ["am", "are"],  # is
    ("comparatives", "comparatives-3"): ["am", "are"],  # is
    ("comparatives", "comparatives-4"): ["am", "are"],  # is
    ("comparatives", "comparatives-5"): ["am", "are"],  # is
    ("comparatives", "comparatives-6"): ["am", "are"],  # is
    ("comparatives", "comparatives-7"): ["am", "are"],  # is
    ("comparatives", "comparatives-9"): ["am", "are"],  # is
    ("comparatives", "comparatives-10"): ["am", "are"],  # is
}

# was/were agreement + present-tense-crossing (comparatives mixes tenses
# across its examples, unlike present-continuous, so "is" is a genuine
# contrast here too)
BE_PAST_TARGETS = {
    ("comparatives", "comparatives-8"): ["is", "were"],  # was
}

# Base form "be" required directly after a modal (will/won't) -- tests
# "don't conjugate after a modal", a real, common beginner mistake.
BE_AFTER_MODAL_TARGETS = {
    ("will-future", "will-future-4"): ["am", "is", "are"],
    ("will-future", "will-future-5"): ["am", "is", "are"],
    ("will-future", "will-future-8"): ["am", "is", "are"],
    ("first-conditional", "first-conditional-5"): ["am", "is", "are"],
}

# Negative-be single-word contraction agreement (only "isn't" appears as
# its own standalone chunk elsewhere in the data -- "am not"/"There isn't"/
# "There wasn't" are all fused multi-word chunks, skipped per precedent).
BE_NEGATIVE_TARGETS = {
    ("present-continuous", "present-continuous-9"): ("aren't", "อาร์-เนินท์"),  # isn't
}

# can't/couldn't -- same modal family Phase 11 covered for the affirmative
# forms (can-could-1,2,3,7), but the negative single-word chunks were left
# untouched.
CANT_COULDNT_TARGETS = {
    ("can-could-ability", "can-could-4"): ("couldn't", "คุด-เดินท์"),  # can't
    ("can-could-ability", "can-could-5"): ("can't", "แคนท์"),  # couldn't
    ("can-could-ability", "can-could-8"): ("couldn't", "คุด-เดินท์"),  # can't
}

# there-is/are/was/were fused-phrase family -- this pattern's own
# functionWords already teach all 4 forms as the central lesson, so full
# 4-member coverage (matching Phase 11's go-family scale) is directly
# on-topic, not tangential. Fused negatives (there-is-are-4, -8) skipped
# per the same fused-chunk precedent as everywhere else.
THERE_FAMILY = {
    "There is": "แดร์ อิส", "There are": "แดร์ อาร์",
    "There was": "แดร์ วอส", "There were": "แดร์ เวอร์",
    "Is there": "อิส แดร์", "Are there": "อาร์ แดร์",
    "Was there": "วอส แดร์", "Were there": "เวอร์ แดร์",
}
THERE_DECLARATIVE_TARGETS = {
    ("there-is-are", "there-is-are-1"): ["There are", "There was", "There were"],  # There is
    ("there-is-are", "there-is-are-2"): ["There is", "There was", "There were"],  # There are
    ("there-is-are", "there-is-are-3"): ["There are", "There was", "There were"],  # There is
    ("there-is-are", "there-is-are-5"): ["There is", "There was", "There were"],  # There are
    ("there-is-are", "there-is-are-7"): ["There is", "There are", "There was"],  # There were
    ("there-is-are", "there-is-are-9"): ["There is", "There was", "There were"],  # There are
    ("there-is-are", "there-is-are-10"): ["There are", "There was", "There were"],  # There is
}
THERE_QUESTION_TARGETS = {
    ("there-is-are", "there-is-are-6"): ["Are there", "Was there", "Were there"],  # Is there
}


def add_chunks(q, new_chunks, key):
    existing_texts = {c["text"].lower() for c in q["chunks"]}
    for c in new_chunks:
        if c["text"].lower() in existing_texts:
            raise SystemExit(f"{key}: distractor {c['text']!r} already present -- would collide")
        existing_texts.add(c["text"].lower())
        q["chunks"].append(c)


patterns = json.load(open(PATH, encoding="utf-8"))
report = []

for pat in patterns:
    for q in pat.get("wordOrderQuestions", []):
        key = (pat["id"], q["id"])
        added_labels = []

        if key in REGULAR_VERB_TARGETS:
            verb_id, field = REGULAR_VERB_TARGETS[key]
            chunks = verb_family_distractors(verb_id, field)
            add_chunks(q, chunks, key)
            added_labels.append(f"{verb_id}:{[c['text'] for c in chunks]}")

        if key in BE_PRESENT_TARGETS:
            chunks = be_chunks(BE_PRESENT_TARGETS[key])
            add_chunks(q, chunks, key)
            added_labels.append(f"be-present:{BE_PRESENT_TARGETS[key]}")

        if key in BE_PAST_TARGETS:
            chunks = be_chunks(BE_PAST_TARGETS[key])
            add_chunks(q, chunks, key)
            added_labels.append(f"be-past:{BE_PAST_TARGETS[key]}")

        if key in BE_AFTER_MODAL_TARGETS:
            chunks = be_chunks(BE_AFTER_MODAL_TARGETS[key])
            add_chunks(q, chunks, key)
            added_labels.append(f"be-after-modal:{BE_AFTER_MODAL_TARGETS[key]}")

        if key in BE_NEGATIVE_TARGETS:
            text, phon = BE_NEGATIVE_TARGETS[key]
            chunks = [{"text": text, "phonetic": phon, "isDistractor": True}]
            add_chunks(q, chunks, key)
            added_labels.append(f"be-negative:{text}")

        if key in CANT_COULDNT_TARGETS:
            text, phon = CANT_COULDNT_TARGETS[key]
            chunks = [{"text": text, "phonetic": phon, "isDistractor": True}]
            add_chunks(q, chunks, key)
            added_labels.append(f"modal-negative:{text}")

        if key in THERE_DECLARATIVE_TARGETS or key in THERE_QUESTION_TARGETS:
            forms = THERE_DECLARATIVE_TARGETS.get(key) or THERE_QUESTION_TARGETS.get(key)
            chunks = [{"text": f, "phonetic": THERE_FAMILY[f], "isDistractor": True} for f in forms]
            add_chunks(q, chunks, key)
            added_labels.append(f"there-family:{forms}")

        if added_labels:
            report.append((pat["id"], q["id"], added_labels))

all_targets = (
    set(REGULAR_VERB_TARGETS) | set(BE_PRESENT_TARGETS) | set(BE_PAST_TARGETS)
    | set(BE_AFTER_MODAL_TARGETS) | set(BE_NEGATIVE_TARGETS) | set(CANT_COULDNT_TARGETS)
    | set(THERE_DECLARATIVE_TARGETS) | set(THERE_QUESTION_TARGETS)
)
touched = {(p, q) for p, q, _ in report}
missing = all_targets - touched
if missing:
    raise SystemExit(f"Never found these target WOQs: {missing}")

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(PATH, "a", encoding="utf-8").write("\n")

print(f"Updated {len(report)} word-order questions:")
for pid, qid, labels in report:
    print(f"  {pid} / {qid}: {' | '.join(labels)}")
