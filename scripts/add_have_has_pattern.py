#!/usr/bin/env python3
"""Phase 8 item 6: add the have/has (possession) grammar pattern to
sentencePatterns.json, matching the existing schema and density (6
examples, 10 word-order questions) exactly. Placed at order=2 (right after
present-simple, since it reinforces the same he/she/it agreement rule and
naturally precedes there-is/are which builds on the same "expressing
existence/possession" family of patterns); everything from past-simple
onward is renumbered up by one to make room.

Scope decision (documented in the Phase 8 commit message too): this pattern
covers POSSESSION ONLY ("I have a car"), not have/has as a present-perfect
auxiliary ("I have eaten"). Present perfect requires teaching past
participles and its own time-reference rules (already/yet/ever/just) --
that's a genuinely separate B1 grammar point deserving its own pattern, and
folding it into this one would blow past A2 scope for a single lesson.
"""
import json
import sys

sys.path.insert(0, "scripts")
from gen_thai_phonetics import compose  # noqa: E402

PATH = "src/data/sentencePatterns.json"


def ex(text, thai):
    ph, missing = compose(text)
    assert not missing, f"missing tokens in example {text!r}: {missing}"
    return {"text": text, "phonetic": ph, "thai": thai}


def woq(id_, prompt_thai, chunks_texts, correct_order, thai, explanation):
    ph, missing = compose(" ".join(correct_order))
    assert not missing, f"missing tokens in woq {id_!r}: {missing}"
    chunks = []
    for t in chunks_texts:
        cph, cmissing = compose(t)
        assert not cmissing, f"missing tokens in chunk {t!r} of {id_!r}: {cmissing}"
        chunks.append({"text": t, "phonetic": cph})
    assert sorted(c["text"] for c in chunks) == sorted(correct_order), f"{id_}: chunks != correctOrder"
    return {
        "id": id_,
        "promptThai": prompt_thai,
        "chunks": chunks,
        "correctOrder": correct_order,
        "phonetic": ph,
        "thai": thai,
        "explanation": explanation,
    }


have_has = {
    "id": "have-has",
    "title": "Have / Has",
    "level": "A2",
    "order": 2,
    "structure": "[Subject] + have/has + [Object]",
    "functionWords": [
        {"word": "have", "role": "used with I / you / we / they"},
        {"word": "has", "role": "used with he / she / it (3rd person singular)"},
        {
            "word": "don't have / doesn't have",
            "role": "negative forms -- don't have with I/you/we/they, doesn't have with he/she/it",
        },
        {
            "word": "Do ... have? / Does ... have?",
            "role": "question forms -- Do with I/you/we/they, Does with he/she/it",
        },
    ],
    "examples": [
        ex("I have a car.", "ฉันมีรถ"),
        ex("She has a car.", "เธอมีรถ"),
        ex("They have three dogs.", "พวกเขามีสุนัขสามตัว"),
        ex("He doesn't have a pen.", "เขาไม่มีปากกา"),
        ex("Does she have a dog?", "เธอมีสุนัขไหม"),
        ex("We have a small apartment.", "เรามีอพาร์ตเมนต์เล็กๆ"),
    ],
    "wordOrderQuestions": [
        woq(
            "have-has-1",
            "พูดว่า: ฉันมีรถ",
            ["I", "have", "a car"],
            ["I", "have", "a car"],
            "ฉันมีรถ",
            "'I' ใช้กับ have เสมอ ไม่ใช่ has.",
        ),
        woq(
            "have-has-2",
            "พูดว่า: เธอมีรถ",
            ["She", "has", "a car"],
            ["She", "has", "a car"],
            "เธอมีรถ",
            "he/she/it ต้องใช้ has ไม่ใช่ have -- นี่คือกฎการผันตามประธานเช่นเดียวกับกริยาอื่นในรูป present simple.",
        ),
        woq(
            "have-has-3",
            "พูดว่า: พวกเขามีสุนัขสามตัว",
            ["They", "have", "three dogs"],
            ["They", "have", "three dogs"],
            "พวกเขามีสุนัขสามตัว",
            "they/we/you ใช้ have เหมือนกับ I ไม่ต้องเติม -s หรือเปลี่ยนเป็น has.",
        ),
        woq(
            "have-has-4",
            "พูดว่า: เขามีแล็ปท็อปเครื่องใหม่",
            ["He", "has", "a new laptop"],
            ["He", "has", "a new laptop"],
            "เขามีแล็ปท็อปเครื่องใหม่",
            "'He' เป็นบุรุษที่สามเอกพจน์เหมือน she/it จึงใช้ has.",
        ),
        woq(
            "have-has-5",
            "พูดว่า: เรามีอพาร์ตเมนต์เล็กๆ",
            ["We", "have", "a small apartment"],
            ["We", "have", "a small apartment"],
            "เรามีอพาร์ตเมนต์เล็กๆ",
            "'We' ใช้ have ไม่ใช่ has เช่นเดียวกับ I/you/they.",
        ),
        woq(
            "have-has-6",
            "พูดว่า: ฉันไม่มีปากกา",
            ["I", "don't have", "a pen"],
            ["I", "don't have", "a pen"],
            "ฉันไม่มีปากกา",
            "การปฏิเสธของ have กับ I/you/we/they ใช้ don't have ไม่ใช่ have not หรือ haven't got.",
        ),
        woq(
            "have-has-7",
            "พูดว่า: เธอไม่มีรถ",
            ["She", "doesn't have", "a car"],
            ["She", "doesn't have", "a car"],
            "เธอไม่มีรถ",
            "การปฏิเสธของ has กับ he/she/it ใช้ doesn't have (has เปลี่ยนกลับเป็นรูปเดิม have หลัง doesn't) ไม่ใช่ 'don't has' หรือ 'has not'.",
        ),
        woq(
            "have-has-8",
            "พูดว่า: คุณมีสัตว์เลี้ยงไหม",
            ["Do you have", "a pet"],
            ["Do you have", "a pet"],
            "คุณมีสัตว์เลี้ยงไหม",
            "คำถามกับ I/you/we/they ขึ้นต้นด้วย Do: Do + subject + have + object?",
        ),
        woq(
            "have-has-9",
            "พูดว่า: เขามีงานทำไหม",
            ["Does he have", "a job"],
            ["Does he have", "a job"],
            "เขามีงานทำไหม",
            "คำถามกับ he/she/it ขึ้นต้นด้วย Does แทน Do และ have กลับเป็นรูปเดิม (ไม่ใช่ has) หลัง Does.",
        ),
        woq(
            "have-has-10",
            "พูดว่า: พวกเขาไม่มีเงินเลย",
            ["They", "don't have", "any money"],
            ["They", "don't have", "any money"],
            "พวกเขาไม่มีเงินเลย",
            "'any' มักใช้แทน 'some' ในประโยคปฏิเสธและคำถาม.",
        ),
    ],
}

patterns = json.load(open(PATH, encoding="utf-8"))

# renumber order >= 2 up by one to make room for have-has at order=2
for p in patterns:
    if p["order"] >= 2:
        p["order"] += 1

patterns.append(have_has)
patterns.sort(key=lambda p: p["order"])

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("OK - inserted have-has pattern at order=2, renumbered", len(patterns), "patterns total")
for p in patterns:
    print(f"  {p['order']}. {p['id']} ({p['level']})")
