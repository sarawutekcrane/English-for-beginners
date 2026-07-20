#!/usr/bin/env python3
"""Phase: adds 10 B2-level entries to every existing vocabulary category
(160 entries total across 16 categories, including safety_officer), plus a
new 30-entry office_communication category (Part 1a + 1b). Follows the
exact existing per-category schema (id prefix, field set) -- verified by
reading vocabulary.json's current entries before writing this script.
Icons are reused from each category's EXISTING icon set wherever the
concept overlaps (the Phase 9 "icon-grouping" approach, applied here for
the first time to categories that previously had a 1:1 word:icon ratio) --
numbers/colors use the existing generic NumberIllustration/ColorIllustration
mechanism (value/hex) with no new icon code at all. office_communication is
a genuinely new category, so it gets a small new set of grouped icons
(office.jsx, added separately)."""
import json

PATH = "src/data/vocabulary.json"

# (word, phonetic, thai, icon, extra_fields_dict)
B2_ADDITIONS = {
    "greetings": [
        ("Long time no see!", "ลอง ไทม์ โน ซี", "ไม่เจอกันนานเลยนะ", "see-you-later"),
        ("Take care of yourself.", "เทค แคร์ ออฟ ยัวร์เซลฟ์", "ดูแลตัวเองด้วยนะ", "thanks-heart"),
        ("I really appreciate it.", "ไอ เรียล-ลี่ แอพ-พรี-ชี-เอท อิท", "ฉันซาบซึ้งใจมากจริงๆ", "thanks-heart"),
        ("I'm terribly sorry.", "แอม เท-ริ-เบิล-ลี่ ซอร์-รี่", "ฉันขอโทษจริงๆ", "sorry-sweat"),
        ("Could you bear with me for a moment?", "คุด ยู แบร์ วิธ มี ฟอร์ อะ โม-เม้นท์", "ช่วยรอสักครู่ได้ไหมคะ", "please-hands"),
        ("It's been a while.", "อิทส์ บีน อะ ไวล์", "ห่างหายไปนานเลย", "see-you-later"),
        ("I couldn't agree more.", "ไอ คูด-เดิ่นท์ อะ-กรี มอร์", "ฉันเห็นด้วยอย่างยิ่ง", "happy-face"),
        ("I'd rather not say.", "ไอด์ แร-เธอร์ นอท เซ", "ฉันขอไม่พูดดีกว่า", "question-face"),
        ("Let's catch up sometime.", "เล็ทส์ แคทช์ อัพ ซัม-ไทม์", "ไว้มาอัพเดทชีวิตกันนะ", "see-you-later"),
        ("I apologize for the inconvenience.", "ไอ อะ-พอล-โล-ไจส์ ฟอร์ ดิ อิน-คอน-วี-เนียนซ์", "ฉันขออภัยในความไม่สะดวก", "sorry-sweat"),
    ],
    "family": [
        ("Stepfather", "สแท็พ-ฟา-เธอร์", "พ่อเลี้ยง", "family-father"),
        ("Stepmother", "สแท็พ-มา-เธอร์", "แม่เลี้ยง", "family-mother"),
        ("In-laws", "อิน-ลอส์", "ญาติฝ่ายคู่สมรส", "family-parents"),
        ("Sibling", "ซิบ-ลิ่ง", "พี่น้อง", "family-brother"),
        ("Twins", "ทวินส์", "ฝาแฝด", "family-children"),
        ("Widow", "วิด-โด", "แม่ม่าย", "family-mother"),
        ("Widower", "วิด-โด-เออร์", "พ่อม่าย", "family-father"),
        ("Fiancé", "ฟี-ยอน-เซ", "คู่หมั้น (ฝ่ายชาย)", "family-husband"),
        ("Fiancée", "ฟี-ยอน-เซ", "คู่หมั้น (ฝ่ายหญิง)", "family-wife"),
        ("Extended family", "เอ็กซ์-เทน-ดิด แฟ-มิ-ลี่", "ครอบครัวขยาย", "family-grandparents"),
    ],
    "food": [
        ("Garlic", "การ์-ลิค", "กระเทียม", "food-vegetable"),
        ("Onion", "อัน-เยิ่น", "หัวหอม", "food-vegetable"),
        ("Seasoning", "ซี-ซั่น-นิ่ง", "เครื่องปรุงรส", "food-sugar"),
        ("Broth", "บรอธ", "น้ำซุป", "food-soup"),
        ("Appetizer", "แอพ-พิ-ไท-เซอร์", "อาหารเรียกน้ำย่อย", "food-salad"),
        ("Leftovers", "เลฟท์-โอ-เวอร์ส", "อาหารที่เหลือ", "food-rice"),
        ("Cuisine", "ควิ-ซีน", "อาหารประจำชาติ/สไตล์การทำอาหาร", "food-noodles"),
        ("Nutritious", "นู-ทริช-เชิส", "มีคุณค่าทางโภชนาการ", "food-fruit"),
        ("Beverage", "เบฟ-เวอ-ริจ", "เครื่องดื่ม", "food-juice"),
        ("Ingredient", "อิน-กรี-เดี้ยนท์", "ส่วนผสม", "food-egg"),
    ],
    "numbers": [
        ("Thirty", "เธอร์-ที", "สามสิบ", "number", {"value": 30}),
        ("Forty", "ฟอร์-ที", "สี่สิบ", "number", {"value": 40}),
        ("Fifty", "ฟิฟ-ที", "ห้าสิบ", "number", {"value": 50}),
        ("Sixty", "ซิก-ที", "หกสิบ", "number", {"value": 60}),
        ("Seventy", "เซฟ-เวิน-ที", "เจ็ดสิบ", "number", {"value": 70}),
        ("Eighty", "เอ-ที", "แปดสิบ", "number", {"value": 80}),
        ("Ninety", "ไนน์-ที", "เก้าสิบ", "number", {"value": 90}),
        ("Hundred", "ฮัน-เดรด", "หนึ่งร้อย", "number", {"value": 100}),
        ("Thousand", "เธา-แซนด์", "หนึ่งพัน", "number", {"value": 1000}),
        ("Dozen", "ดัซ-เซ่น", "โหล (สิบสองชิ้น)", "number", {"value": 12}),
    ],
    "colors": [
        ("Teal", "ทีล", "สีเขียวอมฟ้า", "color", {"hex": "#2A9D8F"}),
        ("Coral", "คอ-รัล", "สีส้มปะการัง", "color", {"hex": "#FF7F6B"}),
        ("Lavender", "แลฟ-เวน-เดอร์", "สีม่วงลาเวนเดอร์", "color", {"hex": "#C8A2E0"}),
        ("Charcoal", "ชาร์-โคล", "สีเทาถ่าน", "color", {"hex": "#4A4A4A"}),
        ("Crimson", "คริม-ซัน", "สีแดงเข้ม", "color", {"hex": "#B03052"}),
        ("Mustard", "มัส-ทาร์ด", "สีเหลืองมัสตาร์ด", "color", {"hex": "#E1AD3A"}),
        ("Mint", "มินท์", "สีเขียวมิ้นท์", "color", {"hex": "#98D8C8"}),
        ("Peach", "พีช", "สีส้มพีช", "color", {"hex": "#FFCBA4"}),
        ("Indigo", "อิน-ดิ-โก", "สีน้ำเงินคราม", "color", {"hex": "#5B4E9E"}),
        ("Olive", "ออล-ลิฟ", "สีเขียวมะกอก", "color", {"hex": "#7C7C3A"}),
    ],
    "daysTime": [
        ("Decade", "เด-เคด", "ทศวรรษ (สิบปี)", "dayTime-year"),
        ("Century", "เซน-ชู-รี่", "ศตวรรษ (ร้อยปี)", "dayTime-year"),
        ("Deadline", "เด้ด-ไลน์", "เส้นตาย/กำหนดส่ง", "dayTime-today"),
        ("Punctual", "พังค์-ชวล", "ตรงต่อเวลา", "dayTime-hour"),
        ("Overdue", "โอ-เวอร์-ดิว", "เลยกำหนด", "dayTime-today"),
        ("Fortnight", "ฟอร์ท-ไนท์", "สองสัปดาห์", "dayTime-week"),
        ("Simultaneously", "ไซ-มัล-เท-เนียส-ลี่", "พร้อมกัน/ในเวลาเดียวกัน", "dayTime-minute"),
        ("Interval", "อิน-เทอร์-วัล", "ช่วงเวลา/ช่วงพัก", "dayTime-hour"),
        ("Eventually", "อิ-เวน-ชวล-ลี่", "ในที่สุด", "dayTime-tomorrow"),
        ("Beforehand", "บิ-ฟอร์-แฮนด์", "ล่วงหน้า", "dayTime-yesterday"),
    ],
    "weather": [
        ("Drizzle", "ดริซ-เซิล", "ฝนตกปรอยๆ", "weather-rainy"),
        ("Overcast", "โอ-เวอร์-คาสท์", "ท้องฟ้ามืดครึ้ม", "weather-cloudy"),
        ("Heatwave", "ฮีท-เวฟ", "คลื่นความร้อน", "weather-hot"),
        ("Blizzard", "บลิซ-ซาร์ด", "พายุหิมะ", "weather-snowy"),
        ("Drought", "เดราท์", "ภัยแล้ง", "weather-hot"),
        ("Forecast", "ฟอร์-คาสท์", "การพยากรณ์อากาศ", "weather-sunny"),
        ("Gale", "เกล", "ลมพายุแรง", "weather-windy"),
        ("Muggy", "มัก-กี้", "อบอ้าว/ร้อนชื้น", "weather-humid"),
        ("Frost", "ฟรอสท์", "น้ำค้างแข็ง", "weather-cold"),
        ("Breeze", "บรีซ", "ลมโชยเย็นๆ", "weather-cool"),
    ],
    "house": [
        ("Balcony", "แบล-โค-นี่", "ระเบียง", "house-window"),
        ("Staircase", "สแตร์-เคส", "บันได", "house-door"),
        ("Basement", "เบส-เมนท์", "ห้องใต้ดิน", "house-room"),
        ("Attic", "แอท-ทิค", "ห้องใต้หลังคา", "house-roof"),
        ("Furniture", "เฟอร์-นิ-เจอร์", "เฟอร์นิเจอร์", "house-sofa"),
        ("Renovate", "เร-โน-เวท", "ปรับปรุง/รีโนเวท", "house-house"),
        ("Landlord", "แลนด์-ลอร์ด", "เจ้าของบ้านเช่า", "house-key"),
        ("Tenant", "เท-แนนท์", "ผู้เช่า", "house-key"),
        ("Appliance", "อะ-พลาย-แอนซ์", "เครื่องใช้ไฟฟ้า", "house-fridge"),
        ("Spacious", "สเป-เชิส", "กว้างขวาง", "house-livingroom"),
    ],
    "clothing": [
        ("Formal wear", "ฟอร์-มัล แวร์", "ชุดทางการ", "clothing-shirt"),
        ("Casual wear", "แคช-ชวล แวร์", "ชุดลำลอง", "clothing-tshirt"),
        ("Tailored", "เท-เลอร์ด", "ตัดเย็บพอดีตัว", "clothing-jacket"),
        ("Accessory", "แอค-เซส-ซอ-รี่", "เครื่องประดับ", "clothing-scarf"),
        ("Outfit", "เอ้าท์-ฟิท", "ชุดแต่งกาย", "clothing-dress"),
        ("Fabric", "แฟบ-ริค", "ผ้า/เนื้อผ้า", "clothing-sweater"),
        ("Wardrobe", "วอร์ด-โรบ", "ตู้เสื้อผ้า/ชุดเสื้อผ้าทั้งหมด", "clothing-jeans"),
        ("Fashionable", "แฟช-ชั่น-เนเบิล", "ทันสมัย/เก๋", "clothing-hat"),
        ("Wrinkled", "ริง-เคิลด์", "ยับ/ย่น", "clothing-shirt"),
        ("Loose-fitting", "ลูส ฟิท-ติ้ง", "หลวม/ไม่รัดรูป", "clothing-shorts"),
    ],
    "bodyHealth": [
        ("Immune system", "อิม-มูน ซิส-เต็ม", "ระบบภูมิคุ้มกัน", "body-healthy"),
        ("Symptom", "ซิมพ์-เทิม", "อาการ", "body-sick"),
        ("Diagnosis", "ได-แอก-โน-ซิส", "การวินิจฉัยโรค", "body-doctor"),
        ("Prescription", "พรี-สคริพ-ชั่น", "ใบสั่งยา", "body-medicine"),
        ("Chronic", "ครอน-นิค", "เรื้อรัง", "body-sick"),
        ("Recover", "รี-คัฟ-เวอร์", "ฟื้นตัว/หายป่วย", "body-healthy"),
        ("Exhausted", "เอ็ก-ซอส-ทิด", "อ่อนเพลียมาก", "body-sick"),
        ("Nutrition", "นู-ทริช-ชั่น", "โภชนาการ", "body-healthy"),
        ("Allergic", "อะ-เลอร์-จิค", "แพ้", "body-sick"),
        ("Physical therapy", "ฟิ-สิ-เคิล แธ-เร-พี่", "กายภาพบำบัด", "body-hospital"),
    ],
    "jobs": [
        ("Entrepreneur", "อ็อน-เทร-พรี-เนอร์", "ผู้ประกอบการ", "job-manager"),
        ("Freelancer", "ฟรี-แลน-เซอร์", "ฟรีแลนซ์", "job-writer"),
        ("Colleague", "คอล-ลีก", "เพื่อนร่วมงาน", "job-manager"),
        ("Supervisor", "ซู-เพอร์-ไว-เซอร์", "หัวหน้างาน", "job-manager"),
        ("Resign", "รี-ไซน์", "ลาออก", "job-writer"),
        ("Promotion", "โพร-โม-ชั่น", "การเลื่อนตำแหน่ง", "job-manager"),
        ("Internship", "อิน-เทิร์น-ชิพ", "การฝึกงาน", "job-student"),
        ("Qualification", "ควอ-ลิ-ฟิ-เค-ชั่น", "คุณสมบัติ", "job-scientist"),
        ("Occupation", "ออค-คิว-เพ-ชั่น", "อาชีพ", "job-engineer"),
        ("Workforce", "เวิร์ค-ฟอร์ส", "กำลังแรงงาน", "job-manager"),
    ],
    "shopping": [
        ("Refund", "รี-ฟันด์", "การคืนเงิน", "shop-cash"),
        ("Warranty", "วอ-รัน-ที่", "การรับประกัน", "shop-receipt"),
        ("Bargain", "บาร์-เกน", "การต่อรองราคา/ของราคาถูก", "shop-discount"),
        ("Installment", "อิน-สทอล-เม้นท์", "การผ่อนชำระ", "shop-creditcard"),
        ("Retailer", "รี-เทล-เลอร์", "ผู้ค้าปลีก", "shop-store"),
        ("Wholesale", "โฮล-เซล", "ขายส่ง", "shop-market"),
        ("Inventory", "อิน-เวน-โท-รี่", "สินค้าคงคลัง", "shop-cart"),
        ("Transaction", "แทรน-แซค-ชั่น", "ธุรกรรม", "shop-creditcard"),
        ("Overpriced", "โอ-เวอร์-ไพรซ์ด", "ราคาแพงเกินไป", "shop-expensive"),
        ("Affordable", "อะ-ฟอร์-ดา-เบิล", "ราคาที่จ่ายไหว", "shop-cheap"),
    ],
    "transportation": [
        ("Commute", "คอม-มิวท์", "เดินทางไป-กลับที่ทำงาน", "transport-car"),
        ("Congestion", "คอน-เจส-ชั่น", "การจราจรติดขัด", "transport-traffic"),
        ("Detour", "ดี-ทัวร์", "ทางอ้อม", "transport-road"),
        ("Pedestrian", "พิ-เดส-เทรียน", "คนเดินเท้า", "transport-passenger"),
        ("Vehicle", "วี-ฮิ-เคิล", "ยานพาหนะ", "transport-car"),
        ("Fare", "แฟร์", "ค่าโดยสาร", "transport-ticket"),
        ("Terminal", "เทอร์-มิ-นัล", "สถานีปลายทาง", "transport-station"),
        ("Departure", "ดี-พาร์-เชอร์", "การออกเดินทาง", "transport-airport"),
        ("Punctuality", "พังค์-ชวล-อะ-ตี้", "ความตรงต่อเวลา", "transport-trafficlight"),
        ("Roundabout", "เราน์ด-อะ-เบาท์", "วงเวียน", "transport-highway"),
    ],
    "hobbies": [
        ("Enthusiast", "เอน-ธู-ซี-แอสท์", "ผู้ที่หลงใหล/แฟนตัวยง", "hobby-reading"),
        ("Leisure", "เล-เชอร์", "เวลาว่าง/การพักผ่อน", "hobby-reading"),
        ("Meditation", "เม-ดิ-เท-ชั่น", "การทำสมาธิ", "hobby-yoga"),
        ("Collecting", "คอล-เล็ค-ติ้ง", "การสะสม", "hobby-photography"),
        ("Craft", "คราฟท์", "งานฝีมือ", "hobby-knitting"),
        ("Recreational", "เร็ค-รี-เอ-ชั่น-แนล", "เพื่อการพักผ่อนหย่อนใจ", "hobby-camping"),
        ("Sculpting", "สคัลพ์-ติ้ง", "การปั้น/แกะสลัก", "hobby-painting"),
        ("Volunteer", "วอ-ลัน-เทียร์", "อาสาสมัคร", "hobby-gardening"),
        ("Competitive", "คอม-เพ-ทิ-ทิฟ", "ที่มีการแข่งขัน", "hobby-running"),
        ("Skillful", "สกิล-ฟูล", "มีทักษะ/ชำนาญ", "hobby-guitar"),
    ],
    "feelings": [
        ("Overwhelmed", "โอ-เวอร์-เวล์มด", "รู้สึกท่วมท้น/รับมือไม่ไหว", "feeling-nervous"),
        ("Ambivalent", "แอม-บิฟ-วะ-เลนท์", "รู้สึกสองจิตสองใจ", "feeling-confused"),
        ("Resentful", "รี-เซนท์-ฟูล", "รู้สึกไม่พอใจ/แค้นเคือง", "feeling-angry"),
        ("Melancholy", "เมล-แลน-คอล-ลี่", "เศร้าสร้อย/หม่นหมอง", "feeling-sad"),
        ("Content", "คอน-เทนท์", "พึงพอใจ", "feeling-relaxed"),
        ("Apprehensive", "แอพ-พรี-เฮน-ซิฟ", "วิตกกังวล/หวาดหวั่น", "feeling-worried"),
        ("Euphoric", "ยู-ฟอ-ริค", "รู้สึกปีติยินดีอย่างมาก", "feeling-excited"),
        ("Indifferent", "อิน-ดิฟ-เฟอ-เรินท์", "เฉยเมย/ไม่สนใจ", "feeling-bored"),
        ("Homesick", "โฮม-ซิค", "คิดถึงบ้าน", "feeling-lonely"),
        ("Optimistic", "ออพ-ทิ-มิส-ทิค", "มองโลกในแง่ดี", "feeling-confident"),
    ],
    "safety_officer": [
        ("Contingency plan", "คอน-ทิน-เจน-ซี่ แพลน", "แผนฉุกเฉินสำรอง", "sf-emergency", {"partOfSpeech": "n"}),
        ("Root cause analysis", "รูท คอส อะ-แนล-ลิ-ซิส", "การวิเคราะห์หาสาเหตุที่แท้จริง", "sf-hazard", {"partOfSpeech": "n"}),
        ("Compliance", "คอม-ไพล-เอิ้นซ์", "การปฏิบัติตามกฎระเบียบ", "sf-checkup", {"partOfSpeech": "n"}),
        ("Negligence", "เนก-ลิ-เจินซ์", "ความประมาทเลินเล่อ", "sf-hazard", {"partOfSpeech": "n"}),
        ("Mitigation", "มิ-ทิ-เก-ชั่น", "การบรรเทา/ลดความรุนแรง", "sf-firstaid", {"partOfSpeech": "n"}),
        ("Occupational hazard", "อ็อค-คิว-เพ-ชั่น-แนล แฮ-เซิร์ด", "อันตรายจากการทำงาน", "sf-hazard", {"partOfSpeech": "n"}),
        ("Incident report", "อิน-ซิ-เดินท์ รี-พอร์ท", "รายงานเหตุการณ์", "sf-checkup", {"partOfSpeech": "n"}),
        ("Liability", "ไล-อะ-บิล-ลิ-ตี้", "ความรับผิดชอบทางกฎหมาย", "sf-critical", {"partOfSpeech": "n"}),
        ("Ventilation", "เวน-ทิ-เล-ชั่น", "การระบายอากาศ", "sf-wellbeing", {"partOfSpeech": "n"}),
        ("Rehabilitation", "รี-ฮะ-บิล-ลิ-เท-ชั่น", "การฟื้นฟูสมรรถภาพ", "sf-recovery", {"partOfSpeech": "n"}),
    ],
}

PREFIX = {
    "greetings": "gr", "family": "fa", "food": "fo", "numbers": "nu", "colors": "co",
    "daysTime": "dt", "weather": "we", "house": "ho", "clothing": "cl", "bodyHealth": "bo",
    "jobs": "jo", "shopping": "sh", "transportation": "tr", "hobbies": "hb",
    "feelings": "fe", "safety_officer": "sf",
}

OFFICE_COMMUNICATION = [
    # (word, phonetic, thai, icon, level, extra)
    ("Meeting", "มี-ทิ่ง", "การประชุม", "office-meeting", "B1", {}),
    ("Agenda", "อะ-เจน-ดา", "วาระการประชุม", "office-meeting", "B2", {}),
    ("Schedule", "สเก็ด-จูล", "กำหนดเวลา/จัดตาราง", "office-calendar", "B1", {"partOfSpeech": "v"}),
    ("Reschedule", "รี-สเก็ด-จูล", "เลื่อนนัด/จัดตารางใหม่", "office-calendar", "B2", {"partOfSpeech": "v"}),
    ("Deadline", "เด้ด-ไลน์", "เส้นตาย/กำหนดส่งงาน", "office-deadline", "B1", {}),
    ("Postpone", "โพส-โพน", "เลื่อนออกไป", "office-calendar", "B2", {"partOfSpeech": "v"}),
    ("Email", "อี-เมล", "อีเมล", "office-email", "B1", {}),
    ("Attachment", "อะ-แทช-เมินท์", "ไฟล์แนบ", "office-email", "B1", {}),
    ("Forward", "ฟอร์-เวิร์ด", "ส่งต่อ", "office-email", "B1", {"partOfSpeech": "v"}),
    ("CC (carbon copy)", "ซี-ซี", "สำเนาถึง", "office-email", "B2", {}),
    ("Feedback", "ฟีด-แบ็ค", "ข้อเสนอแนะ", "office-feedback", "B1", {}),
    ("Constructive", "คอน-สตรัค-ทิฟ", "เชิงสร้างสรรค์", "office-feedback", "B2", {}),
    ("Collaborate", "คอล-แลบ-โบ-เรท", "ร่วมมือ/ทำงานร่วมกัน", "office-handshake", "B2", {"partOfSpeech": "v"}),
    ("Colleague", "คอล-ลีก", "เพื่อนร่วมงาน", "office-handshake", "B1", {}),
    ("Deadline extension", "เด้ด-ไลน์ เอ็ก-สเทน-ชั่น", "การขยายเวลาส่งงาน", "office-deadline", "B2", {}),
    ("Report", "รี-พอร์ท", "รายงาน", "office-document", "B1", {}),
    ("Draft", "แดรฟท์", "ร่างเอกสาร", "office-document", "B2", {}),
    ("Proofread", "พรูฟ-รีด", "ตรวจทานแก้ไข", "office-document", "B2", {"partOfSpeech": "v"}),
    ("Status update", "สเต-ทัส อัพ-เดท", "รายงานความคืบหน้า", "office-document", "B2", {}),
    ("Request", "รี-เควสท์", "ขอร้อง/ร้องขอ", "office-meeting", "B1", {"partOfSpeech": "v"}),
    ("Approval", "อะ-พรู-เวิล", "การอนุมัติ", "office-document", "B2", {}),
    ("Follow up", "ฟอล-โลว์ อัพ", "ติดตามผล", "office-email", "B2", {}),
    ("Conference call", "คอน-เฟอ-เรินซ์ คอล", "การประชุมทางโทรศัพท์", "office-phone", "B2", {}),
    ("Voicemail", "วอยซ์-เมล", "ข้อความเสียง", "office-phone", "B1", {}),
    ("Small talk", "สมอล ทอล์ค", "การพูดคุยทั่วไป", "office-handshake", "B1", {}),
    ("Onboarding", "ออน-บอร์ด-ดิ่ง", "กระบวนการปฐมนิเทศพนักงานใหม่", "office-handshake", "B2", {}),
    ("Time off", "ไทม์ ออฟ", "การลาหยุด", "office-calendar", "B1", {}),
    ("Overtime", "โอ-เวอร์-ไทม์", "การทำงานล่วงเวลา", "office-calendar", "B1", {}),
    ("Punctual", "พังค์-ชวล", "ตรงต่อเวลา", "office-meeting", "B1", {}),
    ("Workload", "เวิร์ค-โหลด", "ปริมาณงาน", "office-document", "B2", {}),
]

with open(PATH, encoding="utf-8") as f:
    vocab = json.load(f)

report = []
for cat, entries in B2_ADDITIONS.items():
    if cat not in vocab:
        raise SystemExit(f"Category {cat!r} not found in vocabulary.json")
    prefix = PREFIX[cat]
    existing_words = {e["word"].lower() for e in vocab[cat]}
    start_n = len(vocab[cat]) + 1
    added = []
    for i, entry in enumerate(entries):
        word, phonetic, thai, icon = entry[0], entry[1], entry[2], entry[3]
        extra = entry[4] if len(entry) > 4 else {}
        if word.lower() in existing_words:
            raise SystemExit(f"{cat}: {word!r} already exists -- would duplicate")
        new_id = f"{prefix}-{start_n + i:02d}"
        new_entry = {"id": new_id, "word": word, "phonetic": phonetic, "thai": thai, "icon": icon, "level": "B2"}
        new_entry.update(extra)
        vocab[cat].append(new_entry)
        added.append(word)
    report.append((cat, len(added), added))

# Part 1b: new office_communication category
oc_entries = []
for i, (word, phonetic, thai, icon, level, extra) in enumerate(OFFICE_COMMUNICATION, start=1):
    e = {"id": f"oc-{i:02d}", "word": word, "phonetic": phonetic, "thai": thai, "icon": icon, "level": level}
    e.update(extra)
    oc_entries.append(e)
vocab["office_communication"] = oc_entries

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(vocab, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"Added B2 entries to {len(report)} categories:")
for cat, n, words in report:
    print(f"  {cat}: +{n} -> {', '.join(words)}")
print(f"\nNew category office_communication: {len(oc_entries)} entries")
print(f"\nTotal vocabulary entries now: {sum(len(v) for v in vocab.values())}")
