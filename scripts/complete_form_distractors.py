#!/usr/bin/env python3
"""Follow-up to Phase 11's verb-form-distractor mechanic: completes distractor
coverage for every word-order question that has a multi-form word family but
was left with an incomplete distractor set (fewer than "all other forms of
the family" present as isDistractor:true chunks). No mechanism changes --
same schema Phase 11 established, this is a data-only completeness pass.

Full audit (see the accompanying summary for the complete per-pattern
report) found gaps in 5 of the 11 patterns:
- present-simple: 2 questions missing a form
- have-has: 5 questions missing 2 forms each (had/having)
- past-simple: 1 question missing a form
- present-continuous: 2 questions missing their verb-family entirely
- going-to-future: 1 question missing a form
- comparatives: 7 questions missing their adjective-family entirely

will-future, there-is-are, can-could-ability, zero-conditional, and
first-conditional were all found already complete or not-applicable
(no available conjugation/adjective data for the words involved, or the
relevant chunk is a fused multi-word phrase per the established
fused-chunk precedent) -- untouched by this script.
"""
import json

PATH = "src/data/sentencePatterns.json"

VERB_PHON = {
    "eats": "อีทส์",
    "have": "แฮฟ", "had": "แฮด", "having": "แฮฟ-วิ่ง",
    "watch": "วอช", "watches": "วอช-เชส", "watched": "วอชท์",
    "listen": "ลิส-เซิ่น", "listens": "ลิส-เซินส์", "listened": "ลิส-เซินด์",
}

ADJ_PHON = {
    "big": "บิก", "biggest": "บิก-เกสท์",
    "happy": "แฮพ-พี", "happiest": "แฮพ-พี้-เอสท์",
    "expensive": "เอ็ก-สเปน-ซิฟ", "most expensive": "โมสท์ เอ็ก-สเปน-ซิฟ",
    "good": "กู๊ด", "best": "เบสท์",
    "difficult": "ดิฟ-ฟิ-คัลท์", "most difficult": "โมสท์ ดิฟ-ฟิ-คัลท์",
    "small": "สมอล", "smallest": "สมอล-เลสท์",
    "bad": "แบด", "worst": "เวิร์สท์",
}

# (pattern_id, woq_id) -> list of missing distractor word-forms to add
ADDITIONS = {
    ("present-simple", "present-simple-1"): ("verb", ["eats"]),
    ("present-simple", "present-simple-7"): ("verb", ["had", "having"]),
    ("have-has", "have-has-1"): ("verb", ["had", "having"]),
    ("have-has", "have-has-2"): ("verb", ["had", "having"]),
    ("have-has", "have-has-3"): ("verb", ["had", "having"]),
    ("have-has", "have-has-4"): ("verb", ["had", "having"]),
    ("have-has", "have-has-5"): ("verb", ["had", "having"]),
    ("past-simple", "past-simple-7"): ("verb", ["eats"]),
    ("present-continuous", "present-continuous-8"): ("verb", ["watch", "watches", "watched"]),
    ("present-continuous", "present-continuous-9"): ("verb", ["listen", "listens", "listened"]),
    ("going-to-future", "going-to-1"): ("verb", ["eats"]),
    ("comparatives", "comparatives-1"): ("adj", ["big", "biggest"]),
    ("comparatives", "comparatives-2"): ("adj", ["happy", "happiest"]),
    ("comparatives", "comparatives-3"): ("adj", ["expensive", "most expensive"]),
    ("comparatives", "comparatives-4"): ("adj", ["good", "best"]),
    ("comparatives", "comparatives-8"): ("adj", ["difficult", "most difficult"]),
    ("comparatives", "comparatives-9"): ("adj", ["small", "smallest"]),
    ("comparatives", "comparatives-10"): ("adj", ["bad", "worst"]),
}


def phon(kind, word):
    table = VERB_PHON if kind == "verb" else ADJ_PHON
    return table[word]


patterns = json.load(open(PATH, encoding="utf-8"))
report = []

for pat in patterns:
    for q in pat.get("wordOrderQuestions", []):
        key = (pat["id"], q["id"])
        if key not in ADDITIONS:
            continue
        kind, forms = ADDITIONS[key]
        existing_texts = {c["text"].lower() for c in q["chunks"]}
        added = []
        for w in forms:
            if w.lower() in existing_texts:
                raise SystemExit(f"{key}: {w!r} already present as a chunk -- would collide")
            q["chunks"].append({"text": w, "phonetic": phon(kind, w), "isDistractor": True})
            existing_texts.add(w.lower())
            added.append(w)
        report.append((pat["id"], q["id"], added))

missing = set(ADDITIONS.keys()) - {(p, q) for p, q, _ in report}
if missing:
    raise SystemExit(f"Never found these target WOQs: {missing}")

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(PATH, "a", encoding="utf-8").write("\n")

print(f"Completed distractor coverage for {len(report)} word-order questions:")
total_chunks = 0
for pid, qid, added in report:
    print(f"  {pid} / {qid}: +{added}")
    total_chunks += len(added)
print(f"\nTotal new distractor chunks added: {total_chunks}")
