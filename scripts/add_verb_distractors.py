#!/usr/bin/env python3
"""Phase 11 item 2: add wrong-verb-form isDistractor chunks to the existing
word-order questions that center on one of the 5 requested verb families
(have/has, go family, do/does, can/could, eat family), plus one new
have-has question to cover do/does (no existing WOQ has "Do"/"Does" as a
standalone swappable chunk -- have-has-8/9 fuse it into a phrase chunk like
"Do you have"). Not shipped -- one-off data-authoring script."""
import json

PATH = "src/data/sentencePatterns.json"

PHON = {
    "have": "แฮฟ", "has": "แฮส",
    "go": "โก", "goes": "โกส์", "going": "โก-อิ่ง", "went": "เวนท์",
    "do": "ดู", "does": "ดัส",
    "eat": "อีท", "eating": "อีท-ทิ่ง", "ate": "เอท",
    "can": "แคน", "could": "คุด",
}

# (pattern_id, woq_id) -> list of distractor word forms to add
ADDITIONS = {
    ("present-simple", "present-simple-1"): ["ate", "eating"],
    ("present-simple", "present-simple-7"): ["have"],
    ("present-simple", "present-simple-8"): ["go", "going", "went"],
    ("have-has", "have-has-1"): ["has"],
    ("have-has", "have-has-2"): ["have"],
    ("have-has", "have-has-3"): ["has"],
    ("have-has", "have-has-4"): ["have"],
    ("have-has", "have-has-5"): ["has"],
    ("past-simple", "past-simple-7"): ["ate", "eating"],
    ("past-simple", "past-simple-10"): ["go", "goes", "going"],
    ("going-to-future", "going-to-1"): ["ate", "eating"],
    ("can-could-ability", "can-could-1"): ["could"],
    ("can-could-ability", "can-could-2"): ["could"],
    ("can-could-ability", "can-could-3"): ["can"],
    ("can-could-ability", "can-could-7"): ["can"],
}

NEW_HAVE_HAS_WOQ = {
    "id": "have-has-11",
    "promptThai": "พูดว่า: เธอมีรถหรือเปล่า",
    "chunks": [
        {"text": "Does", "phonetic": PHON["does"]},
        {"text": "she", "phonetic": "ชี"},
        {"text": "have", "phonetic": PHON["have"]},
        {"text": "a car", "phonetic": "อะ คาร์"},
        {"text": "Do", "phonetic": PHON["do"], "isDistractor": True},
    ],
    "correctOrder": ["Does", "she", "have", "a car"],
    "phonetic": "ดัส ชี แฮฟ อะ คาร์",
    "thai": "เธอมีรถหรือเปล่า",
    "explanation": "คำถามกับ she (he/she/it) ต้องขึ้นต้นด้วย Does ไม่ใช่ Do -- Do ใช้กับประธาน I/you/we/they เท่านั้น",
}

patterns = json.load(open(PATH, encoding="utf-8"))

applied = []
for pat in patterns:
    for q in pat.get("wordOrderQuestions", []):
        key = (pat["id"], q["id"])
        if key in ADDITIONS:
            existing_texts = {c["text"].lower() for c in q["chunks"]}
            for form in ADDITIONS[key]:
                if form in existing_texts:
                    raise SystemExit(f"{key}: distractor {form!r} already present as a chunk -- would collide")
                q["chunks"].append({"text": form, "phonetic": PHON[form], "isDistractor": True})
            applied.append((pat["id"], q["id"], ADDITIONS[key]))
    if pat["id"] == "have-has":
        pat["wordOrderQuestions"].append(NEW_HAVE_HAS_WOQ)
        applied.append(("have-has", "have-has-11 (NEW)", ["Do"]))

missing = set(ADDITIONS.keys()) - {(p, q) for p, q, _ in applied}
if missing:
    raise SystemExit(f"Never found these target WOQs: {missing}")

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(PATH, "a", encoding="utf-8").write("\n")

print(f"Applied distractors to {len(applied)} word-order questions:")
for pid, qid, forms in applied:
    print(f"  {pid} / {qid}: +{forms}")
