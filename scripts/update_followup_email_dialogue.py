#!/usr/bin/env python3
"""Updates the two follow-up-email dialogue lines that used the exact verb
forms of the two vocabulary entries just replaced (Attachment -> Confidential,
Forward -> Circulate), so the topic still naturally reinforces the current
office_communication vocabulary set. The topic's premise (following up on an
email) still legitimately uses the ordinary word "email" elsewhere -- that's
just common English, not the removed flashcard entry, so those lines are
left as-is."""
import json

PATH = "src/data/conversations.json"

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

t = next(t for t in data if t["id"] == "follow-up-email")

EDITS = {
    ("n2a", "I will attach the document again, just in case."): dict(
        text="I will mark the document as confidential, just in case.",
        phonetic="/aɪ wɪl mɑːrk ðə ˈdɒkjʊmənt æz ˌkɒnfɪˈdɛnʃl, dʒʌst ɪn keɪs/",
        thai="ฉันจะทำเครื่องหมายเอกสารเป็นความลับเผื่อไว้ค่ะ",
    ),
    ("n3a", "I will forward their reply to you too."): dict(
        text="I will circulate their reply to the team too.",
        phonetic="/aɪ wɪl ˈsɜːrkjəleɪt ðɛr rɪˈplaɪ tuː ðə tiːm tuː/",
        thai="ฉันจะส่งเวียนคำตอบให้ทีมด้วยค่ะ",
    ),
}

applied = []
for (nid, old_text), new_fields in EDITS.items():
    node = t["nodes"][nid]
    opt = next(o for o in node["options"] if o["text"] == old_text)
    opt.update(new_fields)
    applied.append((nid, old_text, new_fields["text"]))

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("Updated follow-up-email dialogue lines:")
for nid, old, new in applied:
    print(f"  [{nid}] \"{old}\" -> \"{new}\"")
