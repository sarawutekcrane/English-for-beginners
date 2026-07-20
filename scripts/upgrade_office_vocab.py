#!/usr/bin/env python3
"""Upgrades the office_communication vocabulary category's difficulty per
user feedback: the mail-related cluster (Email/Attachment/Forward/CC) was
too basic -- generic email vocabulary a learner already knows well from
everyday English, adding little value in a professional-register category.

Full-list audit (not just the flagged cluster) found the other 26 entries
already sit at a reasonable B1/B2 bar (Meeting/Schedule/Report/Colleague
etc. are kept as necessary anchor nouns their more advanced neighbors
build on -- e.g. Agenda/Reschedule/Draft/Constructive -- not "basic filler").
Only the 4-word email cluster gets replaced; the category is then expanded
by 10 more B1/B2 entries to reach 40 words total.
"""
import json

PATH = "src/data/vocabulary.json"

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

oc = data["office_communication"]
by_id = {e["id"]: e for e in oc}

# ---- Replace the 4 flagged too-basic entries in place (same id slots) ----
REPLACEMENTS = {
    "oc-07": dict(  # was: Email
        word="Correspondence",
        phonetic="คอร์-เรส-พอน-เดินซ์",
        thai="จดหมายโต้ตอบ/การติดต่อสื่อสารเป็นลายลักษณ์อักษร",
        icon="office-email",
        level="B2",
    ),
    "oc-08": dict(  # was: Attachment
        word="Confidential",
        phonetic="คอน-ฟิ-เดน-เชิล",
        thai="เป็นความลับ",
        icon="office-document",
        level="B2",
    ),
    "oc-09": dict(  # was: Forward
        word="Circulate",
        phonetic="เซอร์-คิว-เลท",
        thai="ส่งเวียนให้ทุกคนรับทราบ",
        icon="office-document",
        level="B2",
        partOfSpeech="v",
    ),
    "oc-10": dict(  # was: CC (carbon copy)
        word="Liaise",
        phonetic="ลี-เอซ",
        thai="ประสานงานติดต่อ",
        icon="office-handshake",
        level="B2",
        partOfSpeech="v",
    ),
}

removed_words = {}
for oid, new_fields in REPLACEMENTS.items():
    entry = by_id[oid]
    removed_words[oid] = entry["word"]
    entry.pop("partOfSpeech", None)
    entry.update(new_fields)

# ---- Add 10 new entries to reach 40 total ----
NEW_ENTRIES = [
    dict(
        id="oc-31", word="Stakeholder", phonetic="สเตค-โฮล-เดอร์",
        thai="ผู้มีส่วนได้ส่วนเสีย", icon="office-meeting", level="B2",
    ),
    dict(
        id="oc-32", word="Delegate", phonetic="เดล-ลิ-เกท",
        thai="มอบหมายงาน", icon="office-handshake", level="B2",
        partOfSpeech="v",
    ),
    dict(
        id="oc-33", word="Prioritize", phonetic="ไพร-ออ-ริ-ไทซ์",
        thai="จัดลำดับความสำคัญ", icon="office-deadline", level="B1",
        partOfSpeech="v",
    ),
    dict(
        id="oc-34", word="Escalate", phonetic="เอส-คะ-เลท",
        thai="ส่งต่อปัญหาให้ผู้เกี่ยวข้องระดับสูงขึ้น", icon="office-feedback",
        level="B2", partOfSpeech="v",
    ),
    dict(
        id="oc-35", word="Consensus", phonetic="คอน-เซน-ซัส",
        thai="ความเห็นพ้องต้องกัน", icon="office-handshake", level="B2",
    ),
    dict(
        id="oc-36", word="Touch base", phonetic="ทัช เบส",
        thai="พูดคุยปรับความเข้าใจกันสั้นๆ", icon="office-phone", level="B2",
    ),
    dict(
        id="oc-37", word="Turnaround time", phonetic="เทิร์น-อะ-ราวด์ ไทม์",
        thai="ระยะเวลาดำเนินการให้แล้วเสร็จ", icon="office-deadline", level="B2",
    ),
    dict(
        id="oc-38", word="Proactive", phonetic="โพร-แอค-ทิฟ",
        thai="เชิงรุก/กระตือรือร้นล่วงหน้า", icon="office-target", level="B1",
    ),
    dict(
        id="oc-39", word="Networking", phonetic="เน็ท-เวิร์ค-กิ้ง",
        thai="การสร้างเครือข่ายในการทำงาน", icon="office-meeting", level="B1",
    ),
    dict(
        id="oc-40", word="Brief", phonetic="บรีฟ",
        thai="ชี้แจง/สรุปข้อมูลให้ทราบ", icon="office-meeting", level="B2",
        partOfSpeech="v",
    ),
]

existing_ids = {e["id"] for e in oc}
for e in NEW_ENTRIES:
    if e["id"] in existing_ids:
        raise SystemExit(f"id collision: {e['id']}")
oc.extend(NEW_ENTRIES)

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("Replaced 4 flagged too-basic entries:")
for oid, old_word in removed_words.items():
    print(f"  {oid}: {old_word} -> {by_id[oid]['word']}")
print(f"\nAdded {len(NEW_ENTRIES)} new entries: {[e['word'] for e in NEW_ENTRIES]}")
print(f"\noffice_communication total entries now: {len(oc)}")
