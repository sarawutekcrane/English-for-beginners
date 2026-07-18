#!/usr/bin/env python3
"""Phase 8 item 3: build src/data/phoneticConfusions.json, a lookup table
keyed by vocabulary item id -> array of standalone sound-alike distractor
cards for Listening Quiz. Each distractor is a self-contained card (its own
id/word/phonetic/thai) rather than a reference into vocabulary.json, since
confusables don't need to already exist in the active category (per Phase 8
prompt item 3).

Coverage is a curated subset prioritizing items with genuine English
minimal-pair or near-homophone confusions -- not exhaustive across all 300
vocabulary entries, since many (e.g. "Grandmother", "Refrigerator") have no
natural sound-alike. ListeningQuiz falls back to same-category distractors
to fill any remaining option slots.
"""
import json

# id -> [{word, phonetic, thai}, ...] (2-3 confusables each)
CONFUSIONS = {
    # ---- family ----
    "fa-07": [  # Son
        {"word": "Sun", "phonetic": "ซัน", "thai": "ดวงอาทิตย์"},
        {"word": "Song", "phonetic": "ซอง", "thai": "เพลง"},
    ],
    "fa-10": [  # Wife
        {"word": "Five", "phonetic": "ไฟว์", "thai": "ห้า"},
        {"word": "Hive", "phonetic": "ไฮฟ์", "thai": "รังผึ้ง"},
    ],
    # ---- food ----
    "fo-13": [  # Tea
        {"word": "Tree", "phonetic": "ทรี", "thai": "ต้นไม้"},
        {"word": "Three", "phonetic": "ทรี", "thai": "สาม"},
    ],
    "fo-04": [  # Rice
        {"word": "Rise", "phonetic": "ไรส์", "thai": "ลุกขึ้น / สูงขึ้น"},
        {"word": "Nice", "phonetic": "ไนซ์", "thai": "ดี, น่ารัก"},
    ],
    "fo-02": [  # Bread
        {"word": "Bed", "phonetic": "เบด", "thai": "เตียง"},
        {"word": "Red", "phonetic": "เรด", "thai": "สีแดง"},
    ],
    "fo-08": [  # Egg
        {"word": "Leg", "phonetic": "เล็ก", "thai": "ขา"},
        {"word": "Beg", "phonetic": "เบ็ก", "thai": "ขอร้อง"},
    ],
    "fo-09": [  # Fish
        {"word": "Dish", "phonetic": "ดิช", "thai": "จาน"},
        {"word": "Wish", "phonetic": "วิช", "thai": "ความปรารถนา"},
    ],
    "fo-10": [  # Beef
        {"word": "Leaf", "phonetic": "ลีฟ", "thai": "ใบไม้"},
        {"word": "Beach", "phonetic": "บีช", "thai": "ชายหาด"},
    ],
    "fo-07": [  # Milk
        {"word": "Silk", "phonetic": "ซิลค์", "thai": "ผ้าไหม"},
    ],
    # ---- numbers ----
    "nu-03": [  # Three
        {"word": "Tree", "phonetic": "ทรี", "thai": "ต้นไม้"},
        {"word": "Free", "phonetic": "ฟรี", "thai": "ฟรี, ว่าง"},
    ],
    "nu-04": [  # Four
        {"word": "Floor", "phonetic": "ฟลอร์", "thai": "พื้น"},
        {"word": "For", "phonetic": "ฟอร์", "thai": "สำหรับ"},
    ],
    "nu-05": [  # Five
        {"word": "Wife", "phonetic": "ไวฟ์", "thai": "ภรรยา"},
        {"word": "Hive", "phonetic": "ไฮฟ์", "thai": "รังผึ้ง"},
    ],
    "nu-06": [  # Six
        {"word": "Fix", "phonetic": "ฟิกซ์", "thai": "ซ่อม"},
        {"word": "Mix", "phonetic": "มิกซ์", "thai": "ผสม"},
    ],
    "nu-09": [  # Nine
        {"word": "Wine", "phonetic": "ไวน์", "thai": "ไวน์"},
        {"word": "Line", "phonetic": "ไลน์", "thai": "เส้น, แถว"},
    ],
    "nu-10": [  # Ten
        {"word": "Pen", "phonetic": "เพน", "thai": "ปากกา"},
        {"word": "Hen", "phonetic": "เฮน", "thai": "แม่ไก่"},
    ],
    # ---- colors ----
    "co-01": [  # Red
        {"word": "Bed", "phonetic": "เบด", "thai": "เตียง"},
        {"word": "Read", "phonetic": "รีด", "thai": "อ่าน"},
    ],
    "co-05": [  # Blue
        {"word": "Blew", "phonetic": "บลู", "thai": "เป่า (อดีต)"},
        {"word": "Glue", "phonetic": "กลู", "thai": "กาว"},
    ],
    "co-04": [  # Green
        {"word": "Grin", "phonetic": "กริน", "thai": "ยิ้มกว้าง"},
        {"word": "Clean", "phonetic": "คลีน", "thai": "สะอาด"},
    ],
    "co-09": [  # Black
        {"word": "Block", "phonetic": "บล็อค", "thai": "ปิดกั้น, ตึกละแวก"},
        {"word": "Back", "phonetic": "แบ็ค", "thai": "หลัง, ด้านหลัง"},
    ],
    "co-10": [  # White
        {"word": "Wide", "phonetic": "ไวด์", "thai": "กว้าง"},
        {"word": "Write", "phonetic": "ไรท์", "thai": "เขียน"},
    ],
    # ---- daysTime ----
    "dt-14": [  # Night
        {"word": "Light", "phonetic": "ไลท์", "thai": "แสง, เบา"},
        {"word": "Right", "phonetic": "ไรท์", "thai": "ถูกต้อง, ขวา"},
    ],
    "dt-15": [  # Week
        {"word": "Weak", "phonetic": "วีค", "thai": "อ่อนแอ"},
        {"word": "Wick", "phonetic": "วิค", "thai": "ไส้เทียน"},
    ],
    "dt-17": [  # Year
        {"word": "Ear", "phonetic": "เอียร์", "thai": "หู"},
        {"word": "Beer", "phonetic": "เบียร์", "thai": "เบียร์"},
    ],
    "dt-18": [  # Hour
        {"word": "Our", "phonetic": "อาว-เออร์", "thai": "ของเรา"},
    ],
    # ---- weather ----
    "we-06": [  # Hot
        {"word": "Hat", "phonetic": "แฮท", "thai": "หมวก"},
        {"word": "Hut", "phonetic": "ฮัท", "thai": "กระท่อม"},
    ],
    "we-07": [  # Cold
        {"word": "Gold", "phonetic": "โกลด์", "thai": "สีทอง, ทองคำ"},
    ],
    "we-09": [  # Cool
        {"word": "Pool", "phonetic": "พูล", "thai": "สระว่ายน้ำ"},
        {"word": "Fool", "phonetic": "ฟูล", "thai": "คนโง่"},
    ],
    "we-08": [  # Warm
        {"word": "Worm", "phonetic": "เวิร์ม", "thai": "หนอน"},
        {"word": "Farm", "phonetic": "ฟาร์ม", "thai": "ฟาร์ม"},
    ],
    # ---- house ----
    "ho-11": [  # Bed
        {"word": "Led", "phonetic": "เล็ด", "thai": "นำ (อดีต)"},
        {"word": "Fed", "phonetic": "เฟ็ด", "thai": "ให้อาหาร (อดีต)"},
    ],
    "ho-17": [  # Key
        {"word": "Knee", "phonetic": "นี", "thai": "เข่า"},
        {"word": "Sea", "phonetic": "ซี", "thai": "ทะเล"},
    ],
    "ho-07": [  # Door
        {"word": "Store", "phonetic": "สตอร์", "thai": "ร้านค้า"},
        {"word": "Four", "phonetic": "ฟอร์", "thai": "สี่"},
    ],
    "ho-10": [  # Chair
        {"word": "Share", "phonetic": "แชร์", "thai": "แบ่งปัน"},
    ],
    "ho-20": [  # Roof
        {"word": "Proof", "phonetic": "พรูฟ", "thai": "หลักฐาน"},
        {"word": "Root", "phonetic": "รูท", "thai": "ราก"},
    ],
    # ---- clothing ----
    "cl-10": [  # Hat
        {"word": "Hot", "phonetic": "ฮอท", "thai": "ร้อน"},
        {"word": "Hate", "phonetic": "เฮท", "thai": "เกลียด"},
    ],
    "cl-07": [  # Coat
        {"word": "Boat", "phonetic": "โบ๊ท", "thai": "เรือ"},
        {"word": "Goat", "phonetic": "โกท", "thai": "แพะ"},
    ],
    "cl-09": [  # Socks
        {"word": "Box", "phonetic": "บ็อกซ์", "thai": "กล่อง"},
        {"word": "Rocks", "phonetic": "ร็อคส์", "thai": "ก้อนหิน"},
    ],
    "cl-15": [  # Belt
        {"word": "Felt", "phonetic": "เฟลท์", "thai": "รู้สึก (อดีต)"},
        {"word": "Melt", "phonetic": "เมลท์", "thai": "ละลาย"},
    ],
    # ---- bodyHealth ----
    "bo-03": [  # Ear
        {"word": "Year", "phonetic": "เยียร์", "thai": "ปี"},
        {"word": "Beer", "phonetic": "เบียร์", "thai": "เบียร์"},
    ],
    "bo-02": [  # Eye
        {"word": "Pie", "phonetic": "พาย", "thai": "พาย (ขนม)"},
        {"word": "Tie", "phonetic": "ไท", "thai": "เนคไท"},
    ],
    "bo-07": [  # Arm
        {"word": "Farm", "phonetic": "ฟาร์ม", "thai": "ฟาร์ม"},
        {"word": "Harm", "phonetic": "ฮาร์ม", "thai": "อันตราย"},
    ],
    "bo-08": [  # Leg
        {"word": "Egg", "phonetic": "เอ็กก์", "thai": "ไข่"},
        {"word": "Beg", "phonetic": "เบ็ก", "thai": "ขอร้อง"},
    ],
    "bo-11": [  # Back
        {"word": "Black", "phonetic": "แบล็ค", "thai": "สีดำ"},
        {"word": "Pack", "phonetic": "แพ็ค", "thai": "แพ็ค, บรรจุ"},
    ],
    # ---- jobs ----
    "jo-02": [  # Nurse
        {"word": "Purse", "phonetic": "เพิร์ส", "thai": "กระเป๋าสตางค์"},
        {"word": "Curse", "phonetic": "เคิร์ส", "thai": "คำสาป"},
    ],
    # ---- shopping ----
    "sh-07": [  # Store
        {"word": "Door", "phonetic": "ดอร์", "thai": "ประตู"},
        {"word": "Score", "phonetic": "สกอร์", "thai": "คะแนน"},
    ],
    "sh-10": [  # Bag
        {"word": "Back", "phonetic": "แบ็ค", "thai": "หลัง, ด้านหลัง"},
        {"word": "Bug", "phonetic": "บัก", "thai": "แมลง"},
    ],
    "sh-09": [  # Cash
        {"word": "Crash", "phonetic": "แครช", "thai": "ชน, ปะทะ"},
    ],
    # ---- transportation ----
    "tr-14": [  # Ship
        {"word": "Sheep", "phonetic": "ชีพ", "thai": "แกะ"},
        {"word": "Chip", "phonetic": "ชิพ", "thai": "มันฝรั่งทอด/ชิป"},
    ],
    "tr-01": [  # Car
        {"word": "Care", "phonetic": "แคร์", "thai": "ดูแล, ห่วงใย"},
        {"word": "Far", "phonetic": "ฟาร์", "thai": "ไกล"},
    ],
    "tr-02": [  # Bus
        {"word": "Bust", "phonetic": "บัสท์", "thai": "ทลาย, ล้มเหลว"},
        {"word": "Buzz", "phonetic": "บัซซ์", "thai": "เสียงหึ่ง"},
    ],
    "tr-08": [  # Boat
        {"word": "Coat", "phonetic": "โค้ท", "thai": "เสื้อโค้ท"},
        {"word": "Goat", "phonetic": "โกท", "thai": "แพะ"},
    ],
    # ---- feelings ----
    "fe-02": [  # Sad
        {"word": "Said", "phonetic": "เซด", "thai": "พูด (อดีต)"},
        {"word": "Bad", "phonetic": "แบด", "thai": "แย่, ไม่ดี"},
    ],
    "fe-12": [  # Proud
        {"word": "Cloud", "phonetic": "คลาวด์", "thai": "เมฆ"},
        {"word": "Crowd", "phonetic": "คราวด์", "thai": "ฝูงชน"},
    ],
}

if __name__ == "__main__":
    vocab = json.load(open("src/data/vocabulary.json", encoding="utf-8"))
    id_to_word = {}
    for cat, entries in vocab.items():
        for e in entries:
            id_to_word[e["id"]] = e["word"]

    # verify every key exists and print what word it maps to, so id typos
    # (like the "bh-01" placeholder above) get caught before writing the file
    bad = [k for k in CONFUSIONS if k not in id_to_word]
    if bad:
        print("BAD IDS (not in vocabulary.json):", bad)
        raise SystemExit(1)

    print("all keys valid. mapping:")
    for k, v in CONFUSIONS.items():
        print(f"  {k} ({id_to_word[k]}) -> {[c['word'] for c in v]}")

    out = {}
    for parent_id, confusables in CONFUSIONS.items():
        cards = []
        for i, c in enumerate(confusables, start=1):
            cards.append(
                {
                    "id": f"cf-{parent_id}-{i}",
                    "display": c["word"],
                    "audioText": c["word"],
                    "answerText": c["word"],
                    "reading": c["phonetic"],
                    "thai": c["thai"],
                }
            )
        out[parent_id] = cards

    with open("src/data/phoneticConfusions.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"\nwrote src/data/phoneticConfusions.json ({len(out)} vocabulary items covered)")
