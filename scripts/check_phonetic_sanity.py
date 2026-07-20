#!/usr/bin/env python3
"""Phase 10 sanity-check heuristic for Thai phonetic transliterations.

Not a shipped script -- a throwaway audit tool. For every English word found
across the 5 data files, extracts the word's initial English sound class
(th-voiceless, th-voiced, h, v, w, r, l, s/z, f) and checks whether the
paired Thai phonetic's first *real* consonant (after stripping any leading
Thai vowel sign, since เ/แ/โ/ใ/ไ are written before the consonant they
follow phonetically) is plausible for that sound class. Flags anything
implausible for manual review. This is a heuristic, not a proof -- it will
have false positives (loanword conventions, established exceptions like
"three" -> "ทรี") and it can't catch wrong-but-plausible-consonant errors
(e.g. a right-family but wrong-specific consonant). It exists to catch
gross mismatches like the reported have->"แสฟ" (ส instead of ฮ) pattern.
"""
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "src", "data")

LEADING_VOWELS = "เแโใไ"

# English initial-sound class -> plausible Thai leading consonants.
SOUND_CLASSES = [
    (re.compile(r"^th"), "th-cluster", set("ธทด")),
    (re.compile(r"^sh"), "sh", set("ช")),
    (re.compile(r"^wr"), "wr(silent-w)", set("ร")),
    (re.compile(r"^wh"), "wh", set("ว")),
    (re.compile(r"^h"), "h", set("ฮห")),
    (re.compile(r"^v"), "v", set("วฟ")),
    (re.compile(r"^w"), "w", set("ว")),
    (re.compile(r"^r"), "r", set("ร")),
    (re.compile(r"^l"), "l", set("ล")),
    (re.compile(r"^f"), "f", set("ฟ")),
    (re.compile(r"^s"), "s", set("สซ")),
    (re.compile(r"^z"), "z", set("ซ")),
]

# Established loanword/convention exceptions and known silent-letter words:
# word -> always OK regardless of the heuristic (avoids flagging
# known-correct idiomatic renderings or genuinely silent initial letters).
EXCEPTIONS = {
    "three", "thai", "thailand",  # established th-cluster loanword spellings
    "hour", "hours", "honest", "honor",  # silent initial h
    "sugar", "sure",  # irregular s -> /sh/ sound, correctly rendered with ช
}


def leading_consonant(thai):
    thai = thai.strip()
    if not thai:
        return None
    i = 0
    if thai[0] in LEADING_VOWELS:
        i = 1
    return thai[i] if i < len(thai) else None


def classify(word):
    w = word.lower()
    if w in EXCEPTIONS:
        return None
    for pattern, label, allowed in SOUND_CLASSES:
        if pattern.match(w):
            return label, allowed
    return None


def check_pair(english, thai, where, flagged):
    if not english or not thai:
        return
    result = classify(english)
    if result is None:
        return
    label, allowed = result
    cons = leading_consonant(thai)
    if cons is None or cons not in allowed:
        flagged.append((where, english, thai, label, sorted(allowed), cons))


TOKEN_RE = re.compile(r"[A-Za-z]+(?:'[A-Za-z]+)?")


def first_token(text):
    m = TOKEN_RE.search(text or "")
    return m.group(0) if m else None


def first_thai_chunk(thai):
    return (thai or "").strip().split()[0] if (thai or "").strip() else ""


def load(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return json.load(f)


flagged = []

# ---------- vocabulary.json ----------
vocab = load("vocabulary.json")
for cat, entries in vocab.items():
    for e in entries:
        w = first_token(e.get("word", ""))
        check_pair(w, first_thai_chunk(e.get("phonetic", "")), f"vocabulary/{cat}/{e.get('id')}", flagged)

# ---------- verbs.json ----------
verbs = load("verbs.json")
for v in verbs:
    check_pair(first_token(v.get("dict", "")), first_thai_chunk(v.get("phonetic", {}).get("dict", "")), f"verbs/{v.get('id')}/dict", flagged)
    for form_name, plain in v.get("forms", {}).items():
        ph = v.get("phonetic", {}).get(form_name, "")
        check_pair(first_token(plain), first_thai_chunk(ph), f"verbs/{v.get('id')}/{form_name}", flagged)

# ---------- adjectives.json ----------
adjectives = load("adjectives.json")
for a in adjectives:
    for form_name, form in a.get("forms", {}).items():
        check_pair(first_token(form.get("text", "")), first_thai_chunk(form.get("phonetic", "")), f"adjectives/{a.get('id')}/{form_name}", flagged)

# ---------- sentencePatterns.json ----------
patterns = load("sentencePatterns.json")
for p in patterns:
    for ex in p.get("examples", []):
        check_pair(first_token(ex.get("text", "")), first_thai_chunk(ex.get("phonetic", "")), f"patterns/{p.get('id')}/example", flagged)
    for q in p.get("wordOrderQuestions", []):
        for c in q.get("chunks", []):
            check_pair(first_token(c.get("text", "")), first_thai_chunk(c.get("phonetic", "")), f"patterns/{p.get('id')}/{q.get('id')}/chunk", flagged)

# ---------- conversations.json ----------
conversations = load("conversations.json")
for t in conversations:
    for nid, node in t["nodes"].items():
        sysx = node.get("system", {})
        check_pair(first_token(sysx.get("text", "")), first_thai_chunk(sysx.get("phonetic", "")), f"conversations/{t['id']}/{nid}/system", flagged)
        for o in node.get("options", []):
            check_pair(first_token(o.get("text", "")), first_thai_chunk(o.get("phonetic", "")), f"conversations/{t['id']}/{nid}/option", flagged)

print(f"Checked {sum(1 for _ in [1])} data files. Flagged {len(flagged)} entries:\n")
seen_words = {}
for where, english, thai, label, allowed, cons in flagged:
    key = (english.lower(), thai)
    seen_words.setdefault(key, []).append(where)

for (english, thai), locations in sorted(seen_words.items()):
    print(f"  {english!r} -> {thai!r}  ({len(locations)}x, e.g. {locations[0]})")

print(f"\n{len(seen_words)} distinct (word, phonetic) pairs flagged, {len(flagged)} total occurrences.")
