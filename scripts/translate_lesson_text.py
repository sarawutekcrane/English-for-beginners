#!/usr/bin/env python3
"""Phase 10 item 3: translate sentencePatterns.json's functionWords[].role and
timeNote fields into natural Thai. These are lesson-view teaching text, a
different field from the word-order-question `explanation` field Phase 8
already translated. Not shipped -- one-off data-authoring script."""
import json
import re

PATH = "src/data/sentencePatterns.json"

# Keyed by pattern id -> {english role text: Thai translation}
ROLE_TH = {
    "present-simple": {
        "the person or thing doing the action":
            "ประธานของประโยค คือคนหรือสิ่งที่ทำกริยานั้น",
        "added to the verb when the subject is he/she/it":
            "เติมท้ายกริยา เมื่อประธานเป็น he/she/it (บุรุษที่ 3 เอกพจน์)",
        "common time words used with this pattern":
            "คำบอกเวลาที่มักใช้กับโครงสร้างนี้",
    },
    "have-has": {
        "used with I / you / we / they": "ใช้กับประธาน I / you / we / they",
        "used with he / she / it (3rd person singular)":
            "ใช้กับประธาน he / she / it (บุรุษที่ 3 เอกพจน์)",
        "negative forms -- don't have with I/you/we/they, doesn't have with he/she/it":
            "รูปปฏิเสธ -- ใช้ don't have กับ I/you/we/they และ doesn't have กับ he/she/it",
        "question forms -- Do with I/you/we/they, Does with he/she/it":
            "รูปคำถาม -- ใช้ Do กับ I/you/we/they และ Does กับ he/she/it",
    },
    "past-simple": {
        "common past time words used with this pattern":
            "คำบอกเวลาในอดีตที่มักใช้กับโครงสร้างนี้",
        "added to regular verbs to form the past tense":
            "เติมท้ายกริยาปกติ (regular verb) เพื่อทำเป็นรูปอดีต",
        "used to make past tense sentences negative":
            "ใช้ทำประโยคอดีตให้เป็นรูปปฏิเสธ",
    },
    "present-continuous": {
        "the 'be' verb, matched to the subject (I am, he/she/it is, you/we/they are)":
            "กริยา 'be' ที่ผันตามประธาน (I am, he/she/it is, you/we/they are)",
        "added to the main verb to show an action in progress":
            "เติมท้ายกริยาหลัก เพื่อแสดงว่ากำลังทำอยู่",
        "common time words used with this pattern":
            "คำบอกเวลาที่มักใช้กับโครงสร้างนี้",
    },
    "going-to-future": {
        "shows a plan or intention decided before now":
            "แสดงแผนหรือความตั้งใจที่ตัดสินใจไว้ก่อนแล้ว",
        "the main verb stays in its plain dictionary form after 'going to'":
            "กริยาหลักอยู่ในรูปพื้นฐาน (dictionary form) หลังคำว่า 'going to'",
    },
    "will-future": {
        "shows a decision made now, a prediction, or a promise about the future -- same form for every subject":
            "แสดงการตัดสินใจ ณ ตอนนี้ การคาดการณ์ หรือคำสัญญาเกี่ยวกับอนาคต -- รูปเดียวกันทุกประธาน",
        "the short negative form of 'will not'":
            "รูปย่อปฏิเสธของ 'will not'",
    },
    "there-is-are": {
        "used before a singular or uncountable noun":
            "ใช้นำหน้าคำนามเอกพจน์หรือคำนามนับไม่ได้",
        "used before a plural noun": "ใช้นำหน้าคำนามพหูพจน์",
        "common words used with 'there is/are' to introduce the noun":
            "คำที่มักใช้คู่กับ 'there is/are' เพื่อนำหน้าคำนาม",
        "past tense, used before a singular or uncountable noun":
            "รูปอดีต ใช้นำหน้าคำนามเอกพจน์หรือคำนามนับไม่ได้",
        "past tense, used before a plural noun":
            "รูปอดีต ใช้นำหน้าคำนามพหูพจน์",
    },
    "can-could-ability": {
        "shows ability in the present -- same form for every subject":
            "แสดงความสามารถในปัจจุบัน -- รูปเดียวกันทุกประธาน",
        "shows ability in the past": "แสดงความสามารถในอดีต",
        "the negative forms": "รูปปฏิเสธ",
    },
    "comparatives": {
        "added to the adjective to compare two things":
            "เติมท้ายคำคุณศัพท์ เพื่อเปรียบเทียบสิ่งสองสิ่ง",
        "connects the two things being compared":
            "เชื่อมสิ่งสองสิ่งที่กำลังเปรียบเทียบกัน",
    },
    "zero-conditional": {
        "introduces the condition": "นำหน้าประโยคเงื่อนไข",
        "zero conditional always uses present simple in both parts -- no future tense":
            "Zero Conditional ใช้ Present Simple ทั้งสองประโยคเสมอ -- ไม่ใช้รูปอนาคต",
    },
    "first-conditional": {
        "introduces a possible future condition":
            "นำหน้าเงื่อนไขที่อาจเกิดขึ้นในอนาคต",
        "the if-clause uses present simple, even though it talks about the future":
            "ประโยคเงื่อนไข (if-clause) ใช้ Present Simple แม้จะพูดถึงอนาคตก็ตาม",
        "the result clause uses 'will' for the likely future outcome":
            "ประโยคผลลัพธ์ใช้ 'will' สำหรับผลที่น่าจะเกิดขึ้นในอนาคต",
    },
}

TIMENOTE_TH = {
    "present-simple":
        "Present Simple ใช้พูดถึงสิ่งที่ทำเป็นประจำ กิจวัตร หรือความจริงทั่วไป ไม่ใช่สิ่งที่กำลังเกิดขึ้นตอนนี้",
    "past-simple":
        "Past Simple ใช้พูดถึงเหตุการณ์ที่จบไปแล้วในอดีต ณ ช่วงเวลาใดเวลาหนึ่งที่ระบุชัดเจน",
    "present-continuous":
        "Present Continuous ใช้พูดถึงสิ่งที่กำลังเกิดขึ้นตอนนี้ หรือสถานการณ์ชั่วคราวในช่วงเวลาปัจจุบัน",
    "going-to-future":
        "ใช้ 'going to' กับแผนหรือความตั้งใจที่ตัดสินใจไว้ล่วงหน้า หรือการคาดการณ์จากสิ่งที่เห็นอยู่ตอนนี้",
    "will-future":
        "ใช้ 'will' กับการตัดสินใจแบบฉับพลัน คำสัญญา การเสนอตัว และการคาดการณ์ที่ไม่มีหลักฐานชัดเจน",
    "there-is-are":
        "'There is/are' บอกว่ามีสิ่งใดสิ่งหนึ่งอยู่ -- ไม่ได้บรรยายการกระทำ",
    "can-could-ability":
        "'Can' ใช้กับความสามารถในปัจจุบัน ส่วน 'could' ใช้กับความสามารถในอดีต -- ทั้งสองคำไม่เปลี่ยนรูปตาม he/she/it",
    "zero-conditional":
        "ใช้ Zero Conditional กับข้อเท็จจริงและสิ่งที่เป็นจริงเสมอ เช่น ข้อเท็จจริงทางวิทยาศาสตร์หรือความจริงทั่วไป",
    "first-conditional":
        "ใช้ First Conditional กับสถานการณ์ที่เป็นไปได้จริงในอนาคต -- ไม่ใช่สิ่งที่เป็นไปไม่ได้หรือเป็นเพียงจินตนาการ",
}

patterns = json.load(open(PATH, encoding="utf-8"))

applied = 0
missing = []
for pat in patterns:
    pid = pat["id"]
    role_map = ROLE_TH.get(pid, {})
    for fw in pat.get("functionWords", []):
        role = fw["role"]
        if role in role_map:
            fw["role"] = role_map[role]
            applied += 1
        else:
            missing.append((pid, "role", role))
    if "timeNote" in pat:
        if pid in TIMENOTE_TH:
            pat["timeNote"] = TIMENOTE_TH[pid]
            applied += 1
        else:
            missing.append((pid, "timeNote", pat["timeNote"]))

if missing:
    print(f"{len(missing)} MISSING translations:")
    for m in missing:
        print(" ", m)
    raise SystemExit(1)

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(PATH, "a", encoding="utf-8").write("\n")
print(f"Applied {applied} translations across {len(patterns)} patterns.")

# Verify: every role and timeNote is now fully Thai-script (no leftover ASCII
# letters other than allowed markers like 'I', 'he/she/it', which are English
# grammar terms deliberately kept inline -- so instead verify at least one
# Thai character is present, matching the app's existing validation style).
THAI_RE = re.compile(r"[฀-๿]")
bad = []
for pat in patterns:
    for fw in pat.get("functionWords", []):
        if not THAI_RE.search(fw["role"]):
            bad.append((pat["id"], "role", fw["role"]))
    if "timeNote" in pat and not THAI_RE.search(pat["timeNote"]):
        bad.append((pat["id"], "timeNote", pat["timeNote"]))
if bad:
    print(f"\n{len(bad)} fields still have NO Thai script:")
    for b in bad:
        print(" ", b)
    raise SystemExit(1)
print("All functionWords[].role and timeNote fields contain Thai script.")
