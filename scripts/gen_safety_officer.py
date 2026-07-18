#!/usr/bin/env python3
"""Phase 9: add the safety_officer vocabulary category (75 entries) to
vocabulary.json. Thai meanings are copied verbatim from the phase spec
(source of truth, not re-translated); phonetic is a fresh Thai-script
transliteration per entry.
"""
import json

PATH = "src/data/vocabulary.json"

# (word, partOfSpeech, thai, phonetic, icon)
ENTRIES = [
    ("Accident", "n", "อุบัติเหตุ", "แอ็ก-ซิ-เดิ้นท์", "sf-hazard"),
    ("Amputation", "n", "การตัดอวัยวะ", "แอม-พิว-เท-ชั่น", "sf-critical"),
    ("Bleeding", "n", "ภาวะเลือดออก", "บลี-ดิ้ง", "sf-critical"),
    ("Blindness", "n", "ภาวะตาบอด", "ไบลนด์-เนส", "sf-critical"),
    ("Bruise", "n", "รอยฟกช้ำ", "บรูซ", "sf-injury"),
    ("Burn", "n/v", "แผลไหม้ / แผลไฟลวก", "เบิร์น", "sf-injury"),
    ("Choking", "n", "ภาวะสำลักหรือทางเดินหายใจอุดกั้น", "โช-กิ้ง", "sf-critical"),
    ("Coma", "n", "ภาวะหมดสติระดับโคม่า", "โค-มา", "sf-critical"),
    ("Contamination", "n", "การปนเปื้อน", "คอน-แท-มิ-เน-ชั่น", "sf-hazard"),
    ("Danger", "n", "อันตราย", "เดน-เจอร์", "sf-hazard"),
    ("Decontamination", "n", "การขจัดการปนเปื้อน", "ดี-คอน-แท-มิ-เน-ชั่น", "sf-hazard"),
    ("Emergency", "n", "เหตุฉุกเฉิน", "อิ-เมอร์-เจน-ซี่", "sf-emergency"),
    ("Emergency exit", "n", "ทางออกฉุกเฉิน", "อิ-เมอร์-เจน-ซี่ เอ็ก-ซิท", "sf-emergency"),
    ("Exposure", "n", "การสัมผัสหรือการได้รับปัจจัยอันตราย", "เอ็ก-สโพ-เชอร์", "sf-hazard"),
    ("Fatal", "adj", "ร้ายแรงถึงชีวิต / ทำให้เสียชีวิต", "เฟ-เทิล", "sf-critical"),
    ("Fracture", "n", "กระดูกหักหรือกระดูกร้าว", "แฟรค-เชอร์", "sf-injury"),
    ("Hazard", "n", "สิ่งคุกคามหรือแหล่งกำเนิดอันตราย", "แฮ-เซิร์ด", "sf-hazard"),
    ("Heart attack", "n", "ภาวะหัวใจวาย", "ฮาร์ท อะ-แทค", "sf-critical"),
    ("Injury", "n", "การบาดเจ็บ", "อิน-จู-รี่", "sf-injury"),
    ("Overdose", "n", "การได้รับยาเกินขนาด", "โอ-เวอร์-โดส", "sf-critical"),
    ("Precaution", "n", "มาตรการป้องกันไว้ก่อน", "พรี-คอ-ชั่น", "sf-hazard"),
    ("Risk", "n", "ความเสี่ยง", "ริสค์", "sf-hazard"),
    ("Safety", "n", "ความปลอดภัย", "เซฟ-ตี้", "sf-hazard"),
    ("Toxic", "adj", "เป็นพิษ", "ทอค-ซิค", "sf-hazard"),
    ("Ambulance", "n", "รถพยาบาล", "แอม-บิว-แลนซ์", "sf-emergency"),
    ("Aid", "n", "การช่วยเหลือ", "เอด", "sf-firstaid"),
    ("Anesthesia", "n", "การระงับความรู้สึก / ยาชา", "แอน-เนส-ธี-เซีย", "sf-medicine"),
    ("Antibiotics", "n", "ยาปฏิชีวนะ", "แอน-ตี้-ไบ-ออ-ติคส์", "sf-medicine"),
    ("Antiseptic", "n", "น้ำยาหรือยาฆ่าเชื้อสำหรับบาดแผล", "แอน-ติ-เซพ-ติค", "sf-firstaid"),
    ("Bandage", "n", "ผ้าพันแผล", "แบน-เดจ", "sf-firstaid"),
    ("Blood pressure", "n", "ความดันโลหิต", "บลัด เพรส-เชอร์", "sf-checkup"),
    ("Check-up", "n", "การตรวจสุขภาพ", "เช็ค-อัพ", "sf-checkup"),
    ("Circulation", "n", "การไหลเวียนโลหิต", "เซอร์-คิว-เล-ชั่น", "sf-symptom"),
    ("CPR", "n", "การช่วยฟื้นคืนชีพ", "ซี-พี-อาร์", "sf-firstaid"),
    ("Crutches", "n", "ไม้ค้ำยัน", "ครัช-เชส", "sf-recovery"),
    ("Dehydration", "n", "ภาวะขาดน้ำ", "ดี-ไฮ-เดร-ชั่น", "sf-symptom"),
    ("Diagnosis", "n", "การวินิจฉัย", "ได-แอ็ก-โน-ซิส", "sf-checkup"),
    ("Disinfect", "v", "ฆ่าเชื้อบนพื้นผิวหรืออุปกรณ์", "ดิส-อิน-เฟ็คท์", "sf-hygiene"),
    ("Dizziness", "n", "อาการเวียนศีรษะ", "ดิส-ซิ-เนส", "sf-symptom"),
    ("Examine", "v", "ตรวจร่างกายหรือตรวจประเมิน", "เอ็ก-แซม-มิน", "sf-checkup"),
    ("Fever", "n", "ภาวะไข้", "ฟี-เวอร์", "sf-symptom"),
    ("First Aid", "n", "การปฐมพยาบาล", "เฟิร์สท์ เอด", "sf-firstaid"),
    ("Inhaler", "n", "ยาสูดพ่นหรืออุปกรณ์พ่นยา", "อิน-เฮ-เลอร์", "sf-medicine"),
    ("Life support", "n", "ระบบหรือเครื่องช่วยพยุงชีวิต", "ไลฟ์ ซัพ-พอร์ท", "sf-firstaid"),
    ("Prescription", "n", "ใบสั่งยาหรือคำสั่งใช้ยา", "พรี-สคริพ-ชั่น", "sf-medicine"),
    ("Recovery", "n", "การฟื้นตัว", "รี-คัฟ-เวอ-รี่", "sf-recovery"),
    ("Resuscitate", "v", "ช่วยให้ฟื้นคืนชีพ", "รี-ซัส-ซิ-เทท", "sf-firstaid"),
    ("Sanitize", "v", "ทำความสะอาดเพื่อลดเชื้อโรค", "แซน-นิ-ไทซ์", "sf-hygiene"),
    ("Treatment", "n", "การรักษา", "ทรีท-เมินท์", "sf-recovery"),
    ("X-ray", "n", "การเอกซเรย์หรือการถ่ายภาพรังสี", "เอ็กซ์-เรย์", "sf-checkup"),
    ("Allergic", "adj", "มีอาการแพ้", "อะ-เลอร์-จิค", "sf-allergy"),
    ("Allergy", "n", "อาการแพ้หรือภาวะภูมิแพ้", "แอล-เลอร์-จี้", "sf-allergy"),
    ("Asthma", "n", "โรคหอบหืด", "แอส-มา", "sf-allergy"),
    ("Chronic", "adj", "เรื้อรัง", "ครอน-นิค", "sf-allergy"),
    ("Condition", "n", "ภาวะสุขภาพหรือสภาวะทางการแพทย์", "คอน-ดิ-ชั่น", "sf-allergy"),
    ("Contagious", "adj", "สามารถติดต่อหรือแพร่เชื้อได้", "คอน-เท-เจียส", "sf-hygiene"),
    ("Disability", "n", "ความพิการหรือข้อจำกัดทางร่างกาย", "ดิส-อะ-บิล-ลิ-ตี้", "sf-recovery"),
    ("Ergonomics", "n", "การยศาสตร์ / การออกแบบงานตามหลักสรีรศาสตร์", "เออร์-โก-นอม-มิคส์", "sf-ppe"),
    ("Exhaustion", "n", "ภาวะอ่อนล้ารุนแรง", "เอ็ก-ซอส-ชั่น", "sf-wellbeing"),
    ("Fatigue", "n", "ความเหนื่อยล้า", "ฟะ-ทีก", "sf-wellbeing"),
    ("Helmet", "n", "หมวกนิรภัย", "เฮล-เม็ท", "sf-ppe"),
    ("Hygiene", "n", "สุขอนามัย", "ไฮ-จีน", "sf-hygiene"),
    ("Immune system", "n", "ระบบภูมิคุ้มกัน", "อิม-มูน ซิส-เท็ม", "sf-wellbeing"),
    ("Immunization", "n", "การสร้างภูมิคุ้มกัน", "อิม-มู-ไน-เซ-ชั่น", "sf-wellbeing"),
    ("Infection", "n", "การติดเชื้อ", "อิน-เฟ็ค-ชั่น", "sf-hygiene"),
    ("Insomnia", "n", "ภาวะนอนไม่หลับ", "อิน-ซอม-เนีย", "sf-symptom"),
    ("Insurance", "n", "การประกันภัยหรือประกันสุขภาพ", "อิน-ชัว-เรินส์", "sf-wellbeing"),
    ("Isolation", "n", "การแยกผู้ป่วยหรือการแยกพื้นที่", "ไอ-โซ-เล-ชั่น", "sf-hygiene"),
    ("Mental health", "n", "สุขภาพจิต", "เมน-เทิล เฮลธ์", "sf-wellbeing"),
    ("Nausea", "n", "อาการคลื่นไส้", "นอ-เซีย", "sf-symptom"),
    ("Preventive care", "n", "การดูแลสุขภาพเชิงป้องกัน", "พรี-เวน-ทิฟ แคร์", "sf-wellbeing"),
    ("Quarantine", "n", "การกักกันโรคหรือการกักตัว", "ควอ-รัน-ทีน", "sf-hygiene"),
    ("Side effects", "n", "ผลข้างเคียง", "ไซด์ เอฟ-เฟ็คท์ส์", "sf-allergy"),
    ("Symptom", "n", "อาการหรืออาการแสดง", "ซิมพ์-ทัม", "sf-allergy"),
    ("Vaccination", "n", "การฉีดวัคซีน", "แวค-ซิ-เน-ชั่น", "sf-wellbeing"),
]

assert len(ENTRIES) == 75, f"expected 75 entries, got {len(ENTRIES)}"

entries = []
for i, (word, pos, thai, phonetic, icon) in enumerate(ENTRIES, start=1):
    entries.append(
        {
            "id": f"sf-{i:02d}",
            "word": word,
            "partOfSpeech": pos,
            "phonetic": phonetic,
            "thai": thai,
            "icon": icon,
            "level": "B1",
            "altScript": [],
        }
    )

vocab = json.load(open(PATH, encoding="utf-8"))
vocab["safety_officer"] = entries
json.dump(vocab, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

icon_counts = {}
for e in entries:
    icon_counts[e["icon"]] = icon_counts.get(e["icon"], 0) + 1
print(f"OK - wrote {len(entries)} safety_officer entries")
print(f"icon groups used: {len(icon_counts)}")
for icon, count in sorted(icon_counts.items()):
    print(f"  {icon}: {count}")
