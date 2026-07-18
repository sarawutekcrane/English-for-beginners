#!/usr/bin/env python3
"""Applies the Thai-transliteration dictionary from gen_thai_phonetics.py to
every 'phonetic' field across all 5 data files. Field NAME stays 'phonetic'
in the JSON schema; only the VALUE changes from IPA to Thai-script
transliteration. Run gen_thai_phonetics.py's missing-word check clean before
running this.
"""
import json
import sys

sys.path.insert(0, "scripts")
from gen_thai_phonetics import compose  # noqa: E402

ALL_MISSING = set()


def th(text):
    result, missing = compose(text)
    ALL_MISSING.update(missing)
    return result


# ---------- vocabulary.json ----------
path = "src/data/vocabulary.json"
vocab = json.load(open(path, encoding="utf-8"))
for cat, entries in vocab.items():
    for e in entries:
        e["phonetic"] = th(e["word"])
json.dump(vocab, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------- verbs.json ----------
path = "src/data/verbs.json"
verbs = json.load(open(path, encoding="utf-8"))
for v in verbs:
    new_phonetic = {"dict": th(v["dict"])}
    for form_name, val in v["forms"].items():
        new_phonetic[form_name] = th(val)
    v["phonetic"] = new_phonetic
json.dump(verbs, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------- adjectives.json ----------
path = "src/data/adjectives.json"
adjs = json.load(open(path, encoding="utf-8"))
for a in adjs:
    for form_name, f in a["forms"].items():
        f["phonetic"] = th(f["text"])
json.dump(adjs, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------- conversations.json ----------
path = "src/data/conversations.json"
conv = json.load(open(path, encoding="utf-8"))
for t in conv:
    for nid, n in t["nodes"].items():
        n["system"]["phonetic"] = th(n["system"]["text"])
        for o in n["options"]:
            o["phonetic"] = th(o["text"])
json.dump(conv, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------- sentencePatterns.json ----------
path = "src/data/sentencePatterns.json"
pat = json.load(open(path, encoding="utf-8"))
for p in pat:
    for ex in p["examples"]:
        ex["phonetic"] = th(ex["text"])
    for q in p["wordOrderQuestions"]:
        # question-level phonetic (of the assembled correct sentence)
        q["phonetic"] = th(" ".join(q["correctOrder"]))
        for c in q["chunks"]:
            c["phonetic"] = th(c["text"])
json.dump(pat, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

if ALL_MISSING:
    print(f"MISSING {len(ALL_MISSING)} tokens (placeholders written as [token]):")
    print(sorted(ALL_MISSING))
else:
    print("OK - no missing tokens, all phonetic fields rewritten to Thai transliteration.")
