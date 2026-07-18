#!/usr/bin/env python3
"""Throwaway data-integrity validator for Phase 6 content. Not shipped."""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "src")

failures = []


def fail(msg):
    failures.append(msg)


def load(name):
    with open(os.path.join(SRC, "data", name), encoding="utf-8") as f:
        return json.load(f)


def check_altscript(segments, plain, where):
    if not segments:
        return
    joined = "".join(s.get("reading", s.get("text", "")) for s in segments)
    if joined != plain:
        fail(f"altScript mismatch in {where}: {joined!r} != {plain!r}")


# ---------- vocabulary.json ----------
vocab = load("vocabulary.json")
icon_keys_used = set()
total_vocab = 0
for cat_id, entries in vocab.items():
    for e in entries:
        total_vocab += 1
        where = f"vocabulary/{cat_id}/{e.get('id')}"
        if e.get("icon") not in ("number", "color"):
            icon_keys_used.add(e.get("icon"))
        if not e.get("thai", "").strip():
            fail(f"empty thai in {where}")
        if "altScript" in e and e["altScript"]:
            check_altscript(e["altScript"], e.get("word", e.get("text", "")), where)
        if cat_id == "safety_officer" and not e.get("partOfSpeech", "").strip():
            fail(f"missing partOfSpeech in {where}")

# cross-check icon keys against dispatcher files
illus_dir = os.path.join(SRC, "illustrations")
defined_keys = set()
for fname in os.listdir(illus_dir):
    if not fname.endswith(".jsx"):
        continue
    with open(os.path.join(illus_dir, fname), encoding="utf-8") as f:
        content = f.read()
    import re

    for m in re.finditer(r'(?:"([a-zA-Z0-9-]+)"|([a-zA-Z0-9_]+)):\s*\(id\)\s*=>', content):
        defined_keys.add(m.group(1) or m.group(2))

missing_icons = icon_keys_used - defined_keys
if missing_icons:
    fail(f"vocabulary icons missing dispatcher entries: {sorted(missing_icons)}")

# ---------- verbs.json ----------
verbs = load("verbs.json")
for v in verbs:
    where = f"verbs/{v.get('id')}"
    if not v.get("meaningThai", v.get("thai", "")).strip():
        fail(f"empty thai in {where}")
    if v.get("altScript", {}).get("dict"):
        check_altscript(v["altScript"]["dict"], v.get("dict", ""), f"{where}/dict")
    for form_name, plain in v.get("forms", {}).items():
        segs = v.get("altScript", {}).get(form_name)
        if segs:
            check_altscript(segs, plain, f"{where}/{form_name}")

# ---------- adjectives.json ----------
adjectives = load("adjectives.json")
for a in adjectives:
    where = f"adjectives/{a.get('id')}"
    if not a.get("meaningThai", a.get("thai", "")).strip():
        fail(f"empty thai in {where}")
    for form_name, form in a.get("forms", {}).items():
        if form.get("altScript"):
            check_altscript(form["altScript"], form.get("text", ""), f"{where}/{form_name}")

# ---------- sentencePatterns.json ----------
patterns = load("sentencePatterns.json")
for p in patterns:
    where = f"patterns/{p.get('id')}"
    for ex in p.get("examples", []):
        if not ex.get("thai", "").strip():
            fail(f"empty thai in {where} example {ex.get('text')}")
    for q in p.get("wordOrderQuestions", []):
        chunk_texts = sorted(c["text"] for c in q["chunks"])
        order_texts = sorted(q["correctOrder"])
        if chunk_texts != order_texts:
            fail(f"WOQ mismatch in {where}/{q['id']}: {chunk_texts} vs {order_texts}")
        if not q.get("thai", "").strip():
            fail(f"empty thai in {where}/{q['id']}")

# ---------- conversations.json ----------
conversations = load("conversations.json")
for t in conversations:
    where = f"conversations/{t['id']}"
    nodes = t["nodes"]
    if t["start"] not in nodes:
        fail(f"{where}: missing start node {t['start']}")
        continue
    reachable = set()
    stack = [t["start"]]
    while stack:
        nid = stack.pop()
        if nid in reachable:
            continue
        reachable.add(nid)
        node = nodes[nid]
        if not node["system"].get("thai", "").strip():
            fail(f"{where}/{nid}: empty system thai")
        for o in node["options"]:
            if not o.get("thai", "").strip():
                fail(f"{where}/{nid}: empty option thai ({o.get('text')})")
            if o.get("correct") is False and "next" in o:
                fail(f"{where}/{nid}: incorrect option has next ({o.get('text')})")
            nxt = o.get("next")
            if nxt:
                if nxt not in nodes:
                    fail(f"{where}/{nid}: dangling next -> {nxt}")
                else:
                    stack.append(nxt)
            if "altScript" in o and o["altScript"]:
                check_altscript(o["altScript"], o["text"], f"{where}/{nid}/{o['text']}")
    unreachable = set(nodes.keys()) - reachable
    if unreachable:
        fail(f"{where}: unreachable nodes {unreachable}")

# ---------- summary ----------
print(f"vocabulary: {len(vocab)} categories, {total_vocab} entries")
print(f"verbs: {len(verbs)}")
print(f"adjectives: {len(adjectives)}")
print(f"patterns: {len(patterns)}, examples: {sum(len(p['examples']) for p in patterns)}, "
      f"WOQ: {sum(len(p['wordOrderQuestions']) for p in patterns)}")
print(f"conversations: {len(conversations)} topics, "
      f"{sum(len(t['nodes']) for t in conversations)} nodes")

if failures:
    print(f"\n{len(failures)} FAILURES:")
    for f_ in failures:
        print(" -", f_)
    raise SystemExit(1)
print("\nALL CHECKS PASSED")
