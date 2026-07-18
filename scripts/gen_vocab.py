import json


def e(id_, word, phonetic, thai, icon, level, alt=None, value=None, hex_=None):
    entry = {"id": id_, "word": word, "phonetic": phonetic, "thai": thai, "icon": icon, "level": level}
    if alt:
        entry["altScript"] = alt
    if value is not None:
        entry["value"] = value
    if hex_ is not None:
        entry["hex"] = hex_
    return entry


vocabulary = {}

# ---------- greetings (6 existing + 14 new = 20) ----------
vocabulary["greetings"] = [
    e("gr-01", "Hello", "/həˈloʊ/", "สวัสดี", "hello-wave", "A2",
      alt=[{"text": "HEL", "reading": "Hel"}, {"text": "lo"}]),
    e("gr-02", "Good morning", "/ɡʊd ˈmɔːrnɪŋ/", "สวัสดีตอนเช้า", "sunrise", "A2"),
    e("gr-03", "Good evening", "/ɡʊd ˈiːvnɪŋ/", "สวัสดีตอนเย็น", "sunset", "A2"),
    e("gr-04", "Thank you", "/θæŋk juː/", "ขอบคุณ", "thanks-heart", "A2",
      alt=[{"text": "THANK", "reading": "Thank"}, {"text": " you"}]),
    e("gr-05", "Goodbye", "/ˌɡʊdˈbaɪ/", "ลาก่อน", "wave-goodbye", "A2",
      alt=[{"text": "Good"}, {"text": "BYE", "reading": "bye"}]),
    e("gr-06", "Please", "/pliːz/", "กรุณา", "please-hands", "A2"),
    e("gr-07", "Good afternoon", "/ɡʊd ˌæftərˈnuːn/", "สวัสดีตอนบ่าย", "sunrise", "A2"),
    e("gr-08", "Good night", "/ɡʊd naɪt/", "ราตรีสวัสดิ์", "moon-sleep", "A2"),
    e("gr-09", "How are you?", "/haʊ ɑːr juː/", "สบายดีไหม", "question-face", "A2"),
    e("gr-10", "I'm fine, thank you.", "/aɪm faɪn, θæŋk juː/", "ฉันสบายดี ขอบคุณ", "happy-face", "A2"),
    e("gr-11", "Nice to meet you.", "/naɪs tə miːt juː/", "ยินดีที่ได้รู้จัก", "handshake", "A2"),
    e("gr-12", "See you later.", "/siː juː ˈleɪtər/", "แล้วเจอกันใหม่", "see-you-later", "A2"),
    e("gr-13", "Excuse me.", "/ɪkˈskjuːz miː/", "ขอโทษครับ", "excuse-me-leave", "A2"),
    e("gr-14", "I'm sorry.", "/aɪm ˈsɒri/", "ฉันขอโทษ", "sorry-sweat", "A2"),
    e("gr-15", "You're welcome.", "/jʊr ˈwɛlkəm/", "ยินดีต้อนรับ", "youre-welcome", "A2"),
    e("gr-16", "What's your name?", "/wʊts jɔːr neɪm/", "คุณชื่ออะไร", "question-face", "A2"),
    e("gr-17", "My name is Sarah.", "/maɪ neɪm ɪz ˈsɛrə/", "ฉันชื่อซาร่า", "hello-wave", "A2"),
    e("gr-18", "Where are you from?", "/wɛr ɑːr juː frʌm/", "คุณมาจากไหน", "question-face", "B1"),
    e("gr-19", "I don't understand.", "/aɪ doʊnt ˌʌndərˈstænd/", "ฉันไม่เข้าใจ", "sad-bow", "B1"),
    e("gr-20", "Can you repeat that, please?", "/kæn juː rɪˈpiːt ðæt, pliːz/", "ช่วยพูดอีกครั้งได้ไหม", "please-hands", "B1"),
]

# ---------- family (6 existing + 14 new = 20) ----------
vocabulary["family"] = [
    e("fa-01", "Mother", "/ˈmʌðər/", "แม่", "family-mother", "A2"),
    e("fa-02", "Father", "/ˈfɑːðər/", "พ่อ", "family-father", "A2"),
    e("fa-03", "Sister", "/ˈsɪstər/", "พี่สาว หรือ น้องสาว", "family-sister", "A2"),
    e("fa-04", "Brother", "/ˈbrʌðər/", "พี่ชาย หรือ น้องชาย", "family-brother", "A2"),
    e("fa-05", "Grandmother", "/ˈɡrænˌmʌðər/", "ย่า หรือ ยาย", "family-grandmother", "B1"),
    e("fa-06", "Grandfather", "/ˈɡrænˌfɑːðər/", "ปู่ หรือ ตา", "family-grandfather", "B1"),
    e("fa-07", "Son", "/sʌn/", "ลูกชาย", "family-son", "A2"),
    e("fa-08", "Daughter", "/ˈdɔːtər/", "ลูกสาว", "family-daughter", "A2"),
    e("fa-09", "Husband", "/ˈhʌzbənd/", "สามี", "family-husband", "A2"),
    e("fa-10", "Wife", "/waɪf/", "ภรรยา", "family-wife", "A2"),
    e("fa-11", "Aunt", "/ænt/", "ป้า น้า หรือ อา (ฝ่ายหญิง)", "family-aunt", "B1"),
    e("fa-12", "Uncle", "/ˈʌŋkəl/", "ลุง น้า หรือ อา (ฝ่ายชาย)", "family-uncle", "B1"),
    e("fa-13", "Cousin", "/ˈkʌzən/", "ลูกพี่ลูกน้อง", "family-cousin", "B1"),
    e("fa-14", "Niece", "/niːs/", "หลานสาว", "family-niece", "B1"),
    e("fa-15", "Nephew", "/ˈnɛfjuː/", "หลานชาย", "family-nephew", "B1"),
    e("fa-16", "Baby", "/ˈbeɪbi/", "ทารก", "family-baby", "A2"),
    e("fa-17", "Parents", "/ˈpɛrənts/", "พ่อแม่", "family-parents", "A2"),
    e("fa-18", "Children", "/ˈtʃɪldrən/", "ลูกๆ หรือ เด็กๆ", "family-children", "A2"),
    e("fa-19", "Grandparents", "/ˈɡrænˌpɛrənts/", "ปู่ย่าตายาย", "family-grandparents", "B1"),
    e("fa-20", "Grandchild", "/ˈɡrænˌtʃaɪld/", "หลาน", "family-grandchild", "B1"),
]

# ---------- food (6 existing + 14 new = 20) ----------
vocabulary["food"] = [
    e("fo-01", "Apple", "/ˈæpəl/", "แอปเปิ้ล", "food-apple", "A2"),
    e("fo-02", "Bread", "/brɛd/", "ขนมปัง", "food-bread", "A2"),
    e("fo-03", "Water", "/ˈwɔːtər/", "น้ำ", "food-water", "A2"),
    e("fo-04", "Rice", "/raɪs/", "ข้าว", "food-rice", "A2"),
    e("fo-05", "Chicken", "/ˈtʃɪkɪn/", "ไก่", "food-chicken", "A2"),
    e("fo-06", "Coffee", "/ˈkɒfi/", "กาแฟ", "food-coffee", "A2"),
    e("fo-07", "Milk", "/mɪlk/", "นม", "food-milk", "A2"),
    e("fo-08", "Egg", "/ɛɡ/", "ไข่", "food-egg", "A2"),
    e("fo-09", "Fish", "/fɪʃ/", "ปลา", "food-fish", "A2"),
    e("fo-10", "Beef", "/biːf/", "เนื้อวัว", "food-beef", "A2"),
    e("fo-11", "Vegetable", "/ˈvɛdʒtəbəl/", "ผัก", "food-vegetable", "A2"),
    e("fo-12", "Fruit", "/fruːt/", "ผลไม้", "food-fruit", "A2"),
    e("fo-13", "Tea", "/tiː/", "ชา", "food-tea", "A2"),
    e("fo-14", "Juice", "/dʒuːs/", "น้ำผลไม้", "food-juice", "A2"),
    e("fo-15", "Soup", "/suːp/", "ซุป", "food-soup", "B1"),
    e("fo-16", "Salad", "/ˈsæləd/", "สลัด", "food-salad", "B1"),
    e("fo-17", "Noodles", "/ˈnuːdəlz/", "ก๋วยเตี๋ยว", "food-noodles", "B1"),
    e("fo-18", "Cheese", "/tʃiːz/", "ชีส", "food-cheese", "B1"),
    e("fo-19", "Butter", "/ˈbʌtər/", "เนย", "food-butter", "B1"),
    e("fo-20", "Sugar", "/ˈʃʊɡər/", "น้ำตาล", "food-sugar", "B1"),
]

# ---------- numbers (generic NumberIllustration, no per-entry icon art) ----------
NUMBER_WORDS = [
    ("One", "/wʌn/", "หนึ่ง"), ("Two", "/tuː/", "สอง"), ("Three", "/θriː/", "สาม"),
    ("Four", "/fɔːr/", "สี่"), ("Five", "/faɪv/", "ห้า"), ("Six", "/sɪks/", "หก"),
    ("Seven", "/ˈsɛvən/", "เจ็ด"), ("Eight", "/eɪt/", "แปด"), ("Nine", "/naɪn/", "เก้า"),
    ("Ten", "/tɛn/", "สิบ"), ("Eleven", "/ɪˈlɛvən/", "สิบเอ็ด"), ("Twelve", "/twɛlv/", "สิบสอง"),
    ("Thirteen", "/ˌθɜːrˈtiːn/", "สิบสาม"), ("Fourteen", "/ˌfɔːrˈtiːn/", "สิบสี่"),
    ("Fifteen", "/ˌfɪfˈtiːn/", "สิบห้า"), ("Sixteen", "/ˌsɪksˈtiːn/", "สิบหก"),
    ("Seventeen", "/ˌsɛvənˈtiːn/", "สิบเจ็ด"), ("Eighteen", "/ˌeɪˈtiːn/", "สิบแปด"),
    ("Nineteen", "/ˌnaɪnˈtiːn/", "สิบเก้า"), ("Twenty", "/ˈtwɛnti/", "ยี่สิบ"),
]
vocabulary["numbers"] = [
    e(f"nu-{i+1:02d}", w, p, t, "number", "A2" if i < 15 else "B1", value=i + 1)
    for i, (w, p, t) in enumerate(NUMBER_WORDS)
]

# ---------- colors (generic ColorIllustration, no per-entry icon art) ----------
COLOR_WORDS = [
    ("Red", "/rɛd/", "สีแดง", "#F45C5C"), ("Orange", "/ˈɒrɪndʒ/", "สีส้ม", "#FFA552"),
    ("Yellow", "/ˈjɛloʊ/", "สีเหลือง", "#FFD166"), ("Green", "/ɡriːn/", "สีเขียว", "#7BCF9E"),
    ("Blue", "/bluː/", "สีฟ้า", "#4C8DF0"), ("Purple", "/ˈpɜːrpəl/", "สีม่วง", "#C9A0F5"),
    ("Pink", "/pɪŋk/", "สีชมพู", "#FF9EC7"), ("Brown", "/braʊn/", "สีน้ำตาล", "#A2704C"),
    ("Black", "/blæk/", "สีดำ", "#3A3A3A"), ("White", "/waɪt/", "สีขาว", "#FDFDFD"),
    ("Gray", "/ɡreɪ/", "สีเทา", "#A9A9A9"), ("Gold", "/ɡoʊld/", "สีทอง", "#F6D34C"),
    ("Silver", "/ˈsɪlvər/", "สีเงิน", "#C7C7C7"), ("Light blue", "/laɪt bluː/", "สีฟ้าอ่อน", "#8FCFFF"),
    ("Dark green", "/dɑːrk ɡriːn/", "สีเขียวเข้ม", "#2E7D4F"), ("Turquoise", "/ˈtɜːrkwɔɪz/", "สีเขียวอมฟ้า", "#4FD1C5"),
    ("Beige", "/beɪʒ/", "สีเบจ", "#E8DCC0"), ("Navy blue", "/ˈneɪvi bluː/", "สีกรมท่า", "#1F3B73"),
    ("Maroon", "/məˈruːn/", "สีแดงเลือดหมู", "#7A1F2B"), ("Lime green", "/laɪm ɡriːn/", "สีเขียวมะนาว", "#A8E063"),
]
vocabulary["colors"] = [
    e(f"co-{i+1:02d}", w, p, t, "color", "A2" if i < 11 else "B1", hex_=h)
    for i, (w, p, t, h) in enumerate(COLOR_WORDS)
]

# ---------- daysTime ----------
vocabulary["daysTime"] = [
    e("dt-01", "Monday", "/ˈmʌndeɪ/", "วันจันทร์", "dayTime-monday", "A2"),
    e("dt-02", "Tuesday", "/ˈtuːzdeɪ/", "วันอังคาร", "dayTime-tuesday", "A2"),
    e("dt-03", "Wednesday", "/ˈwɛnzdeɪ/", "วันพุธ", "dayTime-wednesday", "A2"),
    e("dt-04", "Thursday", "/ˈθɜːrzdeɪ/", "วันพฤหัสบดี", "dayTime-thursday", "A2"),
    e("dt-05", "Friday", "/ˈfraɪdeɪ/", "วันศุกร์", "dayTime-friday", "A2"),
    e("dt-06", "Saturday", "/ˈsætərdeɪ/", "วันเสาร์", "dayTime-saturday", "A2"),
    e("dt-07", "Sunday", "/ˈsʌndeɪ/", "วันอาทิตย์", "dayTime-sunday", "A2"),
    e("dt-08", "Today", "/təˈdeɪ/", "วันนี้", "dayTime-today", "A2"),
    e("dt-09", "Tomorrow", "/təˈmɒroʊ/", "พรุ่งนี้", "dayTime-tomorrow", "A2"),
    e("dt-10", "Yesterday", "/ˈjɛstərdeɪ/", "เมื่อวาน", "dayTime-yesterday", "A2"),
    e("dt-11", "Morning", "/ˈmɔːrnɪŋ/", "ตอนเช้า", "dayTime-morning", "A2"),
    e("dt-12", "Afternoon", "/ˌæftərˈnuːn/", "ตอนบ่าย", "dayTime-afternoon", "A2"),
    e("dt-13", "Evening", "/ˈiːvnɪŋ/", "ตอนเย็น", "dayTime-evening", "A2"),
    e("dt-14", "Night", "/naɪt/", "กลางคืน", "dayTime-night", "A2"),
    e("dt-15", "Week", "/wiːk/", "สัปดาห์", "dayTime-week", "A2"),
    e("dt-16", "Month", "/mʌnθ/", "เดือน", "dayTime-month", "A2"),
    e("dt-17", "Year", "/jɪr/", "ปี", "dayTime-year", "A2"),
    e("dt-18", "Hour", "/ˈaʊər/", "ชั่วโมง", "dayTime-hour", "B1"),
    e("dt-19", "Minute", "/ˈmɪnɪt/", "นาที", "dayTime-minute", "B1"),
    e("dt-20", "Weekend", "/ˈwiːkɛnd/", "วันหยุดสุดสัปดาห์", "dayTime-weekend", "B1"),
]

# ---------- weather ----------
vocabulary["weather"] = [
    e("we-01", "Sunny", "/ˈsʌni/", "แดดจัด", "weather-sunny", "A2"),
    e("we-02", "Rainy", "/ˈreɪni/", "ฝนตก", "weather-rainy", "A2"),
    e("we-03", "Cloudy", "/ˈklaʊdi/", "มีเมฆมาก", "weather-cloudy", "A2"),
    e("we-04", "Windy", "/ˈwɪndi/", "ลมแรง", "weather-windy", "A2"),
    e("we-05", "Snowy", "/ˈsnoʊi/", "หิมะตก", "weather-snowy", "A2"),
    e("we-06", "Hot", "/hɒt/", "ร้อน", "weather-hot", "A2"),
    e("we-07", "Cold", "/koʊld/", "หนาว", "weather-cold", "A2"),
    e("we-08", "Warm", "/wɔːrm/", "อบอุ่น", "weather-warm", "A2"),
    e("we-09", "Cool", "/kuːl/", "เย็นสบาย", "weather-cool", "A2"),
    e("we-10", "Rainbow", "/ˈreɪnboʊ/", "รุ้งกินน้ำ", "weather-rainbow", "A2"),
    e("we-11", "Umbrella", "/ʌmˈbrɛlə/", "ร่ม", "weather-umbrella", "A2"),
    e("we-12", "Spring", "/sprɪŋ/", "ฤดูใบไม้ผลิ", "weather-spring", "A2"),
    e("we-13", "Summer", "/ˈsʌmər/", "ฤดูร้อน", "weather-summer", "A2"),
    e("we-14", "Autumn", "/ˈɔːtəm/", "ฤดูใบไม้ร่วง", "weather-autumn", "A2"),
    e("we-15", "Winter", "/ˈwɪntər/", "ฤดูหนาว", "weather-winter", "A2"),
    e("we-16", "Foggy", "/ˈfɒɡi/", "มีหมอก", "weather-foggy", "B1"),
    e("we-17", "Stormy", "/ˈstɔːrmi/", "มีพายุ", "weather-stormy", "B1"),
    e("we-18", "Humid", "/ˈhjuːmɪd/", "ชื้น", "weather-humid", "B1"),
    e("we-19", "Thunder", "/ˈθʌndər/", "ฟ้าร้อง", "weather-thunder", "B1"),
    e("we-20", "Lightning", "/ˈlaɪtnɪŋ/", "ฟ้าแลบ", "weather-lightning", "B1"),
]

# ---------- house ----------
vocabulary["house"] = [
    e("ho-01", "House", "/haʊs/", "บ้าน", "house-house", "A2"),
    e("ho-02", "Room", "/ruːm/", "ห้อง", "house-room", "A2"),
    e("ho-03", "Kitchen", "/ˈkɪtʃɪn/", "ห้องครัว", "house-kitchen", "A2"),
    e("ho-04", "Bedroom", "/ˈbɛdruːm/", "ห้องนอน", "house-bedroom", "A2"),
    e("ho-05", "Bathroom", "/ˈbæθruːm/", "ห้องน้ำ", "house-bathroom", "A2"),
    e("ho-06", "Living room", "/ˈlɪvɪŋ ruːm/", "ห้องนั่งเล่น", "house-livingroom", "A2"),
    e("ho-07", "Door", "/dɔːr/", "ประตู", "house-door", "A2"),
    e("ho-08", "Window", "/ˈwɪndoʊ/", "หน้าต่าง", "house-window", "A2"),
    e("ho-09", "Table", "/ˈteɪbəl/", "โต๊ะ", "house-table", "A2"),
    e("ho-10", "Chair", "/tʃɛr/", "เก้าอี้", "house-chair", "A2"),
    e("ho-11", "Bed", "/bɛd/", "เตียง", "house-bed", "A2"),
    e("ho-12", "Sofa", "/ˈsoʊfə/", "โซฟา", "house-sofa", "A2"),
    e("ho-13", "Television", "/ˈtɛlɪˌvɪʒən/", "โทรทัศน์", "house-tv", "A2"),
    e("ho-14", "Lamp", "/læmp/", "โคมไฟ", "house-lamp", "A2"),
    e("ho-15", "Mirror", "/ˈmɪrər/", "กระจก", "house-mirror", "A2"),
    e("ho-16", "Garden", "/ˈɡɑːrdən/", "สวน", "house-garden", "A2"),
    e("ho-17", "Key", "/kiː/", "กุญแจ", "house-key", "A2"),
    e("ho-18", "Refrigerator", "/rɪˈfrɪdʒəreɪtər/", "ตู้เย็น", "house-fridge", "B1"),
    e("ho-19", "Shelf", "/ʃɛlf/", "ชั้นวางของ", "house-shelf", "B1"),
    e("ho-20", "Roof", "/ruːf/", "หลังคา", "house-roof", "B1"),
]

# ---------- clothing ----------
vocabulary["clothing"] = [
    e("cl-01", "Shirt", "/ʃɜːrt/", "เสื้อเชิ้ต", "clothing-shirt", "A2"),
    e("cl-02", "T-shirt", "/ˈtiːʃɜːrt/", "เสื้อยืด", "clothing-tshirt", "A2"),
    e("cl-03", "Pants", "/pænts/", "กางเกง", "clothing-pants", "A2"),
    e("cl-04", "Dress", "/drɛs/", "ชุดเดรส", "clothing-dress", "A2"),
    e("cl-05", "Skirt", "/skɜːrt/", "กระโปรง", "clothing-skirt", "A2"),
    e("cl-06", "Jacket", "/ˈdʒækɪt/", "แจ็คเก็ต", "clothing-jacket", "A2"),
    e("cl-07", "Coat", "/koʊt/", "เสื้อโค้ท", "clothing-coat", "A2"),
    e("cl-08", "Shoes", "/ʃuːz/", "รองเท้า", "clothing-shoes", "A2"),
    e("cl-09", "Socks", "/sɒks/", "ถุงเท้า", "clothing-socks", "A2"),
    e("cl-10", "Hat", "/hæt/", "หมวก", "clothing-hat", "A2"),
    e("cl-11", "Jeans", "/dʒiːnz/", "กางเกงยีนส์", "clothing-jeans", "A2"),
    e("cl-12", "Shorts", "/ʃɔːrts/", "กางเกงขาสั้น", "clothing-shorts", "A2"),
    e("cl-13", "Gloves", "/ɡlʌvz/", "ถุงมือ", "clothing-gloves", "B1"),
    e("cl-14", "Scarf", "/skɑːrf/", "ผ้าพันคอ", "clothing-scarf", "B1"),
    e("cl-15", "Belt", "/bɛlt/", "เข็มขัด", "clothing-belt", "B1"),
    e("cl-16", "Sweater", "/ˈswɛtər/", "เสื้อสเวตเตอร์", "clothing-sweater", "B1"),
    e("cl-17", "Underwear", "/ˈʌndərwɛr/", "ชุดชั้นใน", "clothing-underwear", "B1"),
    e("cl-18", "Boots", "/buːts/", "รองเท้าบูท", "clothing-boots", "B1"),
    e("cl-19", "Sunglasses", "/ˈsʌnˌɡlæsɪz/", "แว่นกันแดด", "clothing-sunglasses", "B1"),
    e("cl-20", "Pajamas", "/pəˈdʒɑːməz/", "ชุดนอน", "clothing-pajamas", "B1"),
]

# ---------- bodyHealth ----------
vocabulary["bodyHealth"] = [
    e("bo-01", "Head", "/hɛd/", "ศีรษะ", "body-head", "A2"),
    e("bo-02", "Eye", "/aɪ/", "ตา", "body-eye", "A2"),
    e("bo-03", "Ear", "/ɪr/", "หู", "body-ear", "A2"),
    e("bo-04", "Nose", "/noʊz/", "จมูก", "body-nose", "A2"),
    e("bo-05", "Mouth", "/maʊθ/", "ปาก", "body-mouth", "A2"),
    e("bo-06", "Hand", "/hænd/", "มือ", "body-hand", "A2"),
    e("bo-07", "Arm", "/ɑːrm/", "แขน", "body-arm", "A2"),
    e("bo-08", "Leg", "/lɛɡ/", "ขา", "body-leg", "A2"),
    e("bo-09", "Foot", "/fʊt/", "เท้า", "body-foot", "A2"),
    e("bo-10", "Stomach", "/ˈstʌmək/", "ท้อง", "body-stomach", "A2"),
    e("bo-11", "Back", "/bæk/", "หลัง", "body-back", "A2"),
    e("bo-12", "Tooth", "/tuːθ/", "ฟัน", "body-tooth", "A2"),
    e("bo-13", "Hair", "/hɛr/", "ผม", "body-hair", "A2"),
    e("bo-14", "Finger", "/ˈfɪŋɡər/", "นิ้วมือ", "body-finger", "A2"),
    e("bo-15", "Doctor", "/ˈdɒktər/", "หมอ", "body-doctor", "A2"),
    e("bo-16", "Hospital", "/ˈhɒspɪtəl/", "โรงพยาบาล", "body-hospital", "A2"),
    e("bo-17", "Sick", "/sɪk/", "ป่วย", "body-sick", "A2"),
    e("bo-18", "Heart", "/hɑːrt/", "หัวใจ", "body-heart", "B1"),
    e("bo-19", "Medicine", "/ˈmɛdsɪn/", "ยา", "body-medicine", "B1"),
    e("bo-20", "Healthy", "/ˈhɛlθi/", "สุขภาพดี", "body-healthy", "B1"),
]

# ---------- jobs ----------
vocabulary["jobs"] = [
    e("jo-01", "Teacher", "/ˈtiːtʃər/", "ครู", "job-teacher", "A2"),
    e("jo-02", "Nurse", "/nɜːrs/", "พยาบาล", "job-nurse", "A2"),
    e("jo-03", "Police officer", "/pəˈliːs ˈɒfɪsər/", "ตำรวจ", "job-police", "A2"),
    e("jo-04", "Chef", "/ʃɛf/", "พ่อครัว", "job-chef", "A2"),
    e("jo-05", "Farmer", "/ˈfɑːrmər/", "ชาวนา", "job-farmer", "A2"),
    e("jo-06", "Driver", "/ˈdraɪvər/", "คนขับรถ", "job-driver", "A2"),
    e("jo-07", "Artist", "/ˈɑːrtɪst/", "ศิลปิน", "job-artist", "A2"),
    e("jo-08", "Musician", "/mjuˈzɪʃən/", "นักดนตรี", "job-musician", "A2"),
    e("jo-09", "Writer", "/ˈraɪtər/", "นักเขียน", "job-writer", "A2"),
    e("jo-10", "Student", "/ˈstuːdənt/", "นักเรียน", "job-student", "A2"),
    e("jo-11", "Waiter", "/ˈweɪtər/", "พนักงานเสิร์ฟ", "job-waiter", "A2"),
    e("jo-12", "Cashier", "/kæˈʃɪr/", "พนักงานเก็บเงิน", "job-cashier", "A2"),
    e("jo-13", "Firefighter", "/ˈfaɪərˌfaɪtər/", "นักดับเพลิง", "job-firefighter", "A2"),
    e("jo-14", "Engineer", "/ˌɛndʒɪˈnɪr/", "วิศวกร", "job-engineer", "B1"),
    e("jo-15", "Lawyer", "/ˈlɔɪər/", "ทนายความ", "job-lawyer", "B1"),
    e("jo-16", "Manager", "/ˈmænɪdʒər/", "ผู้จัดการ", "job-manager", "B1"),
    e("jo-17", "Pilot", "/ˈpaɪlət/", "นักบิน", "job-pilot", "B1"),
    e("jo-18", "Scientist", "/ˈsaɪəntɪst/", "นักวิทยาศาสตร์", "job-scientist", "B1"),
    e("jo-19", "Dentist", "/ˈdɛntɪst/", "ทันตแพทย์", "job-dentist", "B1"),
    e("jo-20", "Accountant", "/əˈkaʊntənt/", "นักบัญชี", "job-accountant", "B1"),
]

# ---------- shopping ----------
vocabulary["shopping"] = [
    e("sh-01", "Money", "/ˈmʌni/", "เงิน", "shop-money", "A2"),
    e("sh-02", "Price", "/praɪs/", "ราคา", "shop-price", "A2"),
    e("sh-03", "Cheap", "/tʃiːp/", "ถูก", "shop-cheap", "A2"),
    e("sh-04", "Expensive", "/ɪkˈspɛnsɪv/", "แพง", "shop-expensive", "A2"),
    e("sh-05", "Buy", "/baɪ/", "ซื้อ", "shop-buy", "A2"),
    e("sh-06", "Sell", "/sɛl/", "ขาย", "shop-sell", "A2"),
    e("sh-07", "Store", "/stɔːr/", "ร้านค้า", "shop-store", "A2"),
    e("sh-08", "Market", "/ˈmɑːrkɪt/", "ตลาด", "shop-market", "A2"),
    e("sh-09", "Cash", "/kæʃ/", "เงินสด", "shop-cash", "A2"),
    e("sh-10", "Bag", "/bæɡ/", "กระเป๋า", "shop-bag", "A2"),
    e("sh-11", "Size", "/saɪz/", "ขนาด", "shop-size", "A2"),
    e("sh-12", "Change", "/tʃeɪndʒ/", "เงินทอน", "shop-change", "A2"),
    e("sh-13", "Sale", "/seɪl/", "ลดราคา", "shop-sale", "A2"),
    e("sh-14", "Customer", "/ˈkʌstəmər/", "ลูกค้า", "shop-customer", "A2"),
    e("sh-15", "Shopping cart", "/ˈʃɒpɪŋ kɑːrt/", "รถเข็นช้อปปิ้ง", "shop-cart", "A2"),
    e("sh-16", "Wallet", "/ˈwɒlɪt/", "กระเป๋าสตางค์", "shop-wallet", "A2"),
    e("sh-17", "Receipt", "/rɪˈsiːt/", "ใบเสร็จ", "shop-receipt", "B1"),
    e("sh-18", "Discount", "/ˈdɪskaʊnt/", "ส่วนลด", "shop-discount", "B1"),
    e("sh-19", "Credit card", "/ˈkrɛdɪt kɑːrd/", "บัตรเครดิต", "shop-creditcard", "B1"),
    e("sh-20", "Coupon", "/ˈkuːpɒn/", "คูปอง", "shop-coupon", "B1"),
]

# ---------- transportation ----------
vocabulary["transportation"] = [
    e("tr-01", "Car", "/kɑːr/", "รถยนต์", "transport-car", "A2"),
    e("tr-02", "Bus", "/bʌs/", "รถบัส", "transport-bus", "A2"),
    e("tr-03", "Train", "/treɪn/", "รถไฟ", "transport-train", "A2"),
    e("tr-04", "Airplane", "/ˈɛrpleɪn/", "เครื่องบิน", "transport-airplane", "A2"),
    e("tr-05", "Bicycle", "/ˈbaɪsɪkəl/", "จักรยาน", "transport-bicycle", "A2"),
    e("tr-06", "Motorcycle", "/ˈmoʊtərˌsaɪkəl/", "มอเตอร์ไซค์", "transport-motorcycle", "A2"),
    e("tr-07", "Taxi", "/ˈtæksi/", "แท็กซี่", "transport-taxi", "A2"),
    e("tr-08", "Boat", "/boʊt/", "เรือ", "transport-boat", "A2"),
    e("tr-09", "Road", "/roʊd/", "ถนน", "transport-road", "A2"),
    e("tr-10", "Ticket", "/ˈtɪkɪt/", "ตั๋ว", "transport-ticket", "A2"),
    e("tr-11", "Station", "/ˈsteɪʃən/", "สถานี", "transport-station", "A2"),
    e("tr-12", "Airport", "/ˈɛrpɔːrt/", "สนามบิน", "transport-airport", "A2"),
    e("tr-13", "Subway", "/ˈsʌbweɪ/", "รถไฟใต้ดิน", "transport-subway", "B1"),
    e("tr-14", "Ship", "/ʃɪp/", "เรือเดินทะเล", "transport-ship", "B1"),
    e("tr-15", "Traffic", "/ˈtræfɪk/", "การจราจร", "transport-traffic", "B1"),
    e("tr-16", "Passenger", "/ˈpæsɪndʒər/", "ผู้โดยสาร", "transport-passenger", "B1"),
    e("tr-17", "Traffic light", "/ˈtræfɪk laɪt/", "สัญญาณไฟจราจร", "transport-trafficlight", "B1"),
    e("tr-18", "Parking", "/ˈpɑːrkɪŋ/", "ที่จอดรถ", "transport-parking", "B1"),
    e("tr-19", "Highway", "/ˈhaɪweɪ/", "ทางหลวง", "transport-highway", "B1"),
    e("tr-20", "Seatbelt", "/ˈsiːtbɛlt/", "เข็มขัดนิรภัย", "transport-seatbelt", "B1"),
]

# ---------- hobbies ----------
vocabulary["hobbies"] = [
    e("hb-01", "Reading", "/ˈriːdɪŋ/", "การอ่านหนังสือ", "hobby-reading", "A2"),
    e("hb-02", "Swimming", "/ˈswɪmɪŋ/", "การว่ายน้ำ", "hobby-swimming", "A2"),
    e("hb-03", "Running", "/ˈrʌnɪŋ/", "การวิ่ง", "hobby-running", "A2"),
    e("hb-04", "Dancing", "/ˈdænsɪŋ/", "การเต้นรำ", "hobby-dancing", "A2"),
    e("hb-05", "Singing", "/ˈsɪŋɪŋ/", "การร้องเพลง", "hobby-singing", "A2"),
    e("hb-06", "Painting", "/ˈpeɪntɪŋ/", "การวาดภาพสี", "hobby-painting", "A2"),
    e("hb-07", "Fishing", "/ˈfɪʃɪŋ/", "การตกปลา", "hobby-fishing", "A2"),
    e("hb-08", "Gaming", "/ˈɡeɪmɪŋ/", "การเล่นเกม", "hobby-gaming", "A2"),
    e("hb-09", "Traveling", "/ˈtrævəlɪŋ/", "การท่องเที่ยว", "hobby-traveling", "A2"),
    e("hb-10", "Drawing", "/ˈdrɔːɪŋ/", "การวาดเส้น", "hobby-drawing", "A2"),
    e("hb-11", "Playing football", "/ˈpleɪɪŋ ˈfʊtbɔːl/", "การเล่นฟุตบอล", "hobby-football", "A2"),
    e("hb-12", "Playing guitar", "/ˈpleɪɪŋ ɡɪˈtɑːr/", "การเล่นกีตาร์", "hobby-guitar", "A2"),
    e("hb-13", "Watching movies", "/ˈwɒtʃɪŋ ˈmuːviz/", "การดูหนัง", "hobby-movies", "A2"),
    e("hb-14", "Photography", "/fəˈtɒɡrəfi/", "การถ่ายภาพ", "hobby-photography", "B1"),
    e("hb-15", "Gardening", "/ˈɡɑːrdənɪŋ/", "การทำสวน", "hobby-gardening", "B1"),
    e("hb-16", "Hiking", "/ˈhaɪkɪŋ/", "การเดินป่า", "hobby-hiking", "B1"),
    e("hb-17", "Yoga", "/ˈjoʊɡə/", "โยคะ", "hobby-yoga", "B1"),
    e("hb-18", "Camping", "/ˈkæmpɪŋ/", "การตั้งแคมป์", "hobby-camping", "B1"),
    e("hb-19", "Cycling", "/ˈsaɪklɪŋ/", "การปั่นจักรยาน", "hobby-cycling", "B1"),
    e("hb-20", "Knitting", "/ˈnɪtɪŋ/", "การถักไหมพรม", "hobby-knitting", "B1"),
]

# ---------- feelings ----------
vocabulary["feelings"] = [
    e("fe-01", "Happy", "/ˈhæpi/", "มีความสุข", "feeling-happy", "A2"),
    e("fe-02", "Sad", "/sæd/", "เศร้า", "feeling-sad", "A2"),
    e("fe-03", "Angry", "/ˈæŋɡri/", "โกรธ", "feeling-angry", "A2"),
    e("fe-04", "Excited", "/ɪkˈsaɪtɪd/", "ตื่นเต้น", "feeling-excited", "A2"),
    e("fe-05", "Nervous", "/ˈnɜːrvəs/", "กังวล", "feeling-nervous", "A2"),
    e("fe-06", "Tired", "/ˈtaɪərd/", "เหนื่อย", "feeling-tired", "A2"),
    e("fe-07", "Bored", "/bɔːrd/", "เบื่อ", "feeling-bored", "A2"),
    e("fe-08", "Surprised", "/sərˈpraɪzd/", "ประหลาดใจ", "feeling-surprised", "A2"),
    e("fe-09", "Scared", "/skɛrd/", "กลัว", "feeling-scared", "A2"),
    e("fe-10", "Relaxed", "/rɪˈlækst/", "ผ่อนคลาย", "feeling-relaxed", "A2"),
    e("fe-11", "Confused", "/kənˈfjuːzd/", "สับสน", "feeling-confused", "B1"),
    e("fe-12", "Proud", "/praʊd/", "ภูมิใจ", "feeling-proud", "B1"),
    e("fe-13", "Embarrassed", "/ɪmˈbærəst/", "อาย", "feeling-embarrassed", "B1"),
    e("fe-14", "Worried", "/ˈwɜːrid/", "เป็นห่วง", "feeling-worried", "B1"),
    e("fe-15", "Confident", "/ˈkɒnfɪdənt/", "มั่นใจ", "feeling-confident", "B1"),
    e("fe-16", "Jealous", "/ˈdʒɛləs/", "อิจฉา", "feeling-jealous", "B1"),
    e("fe-17", "Lonely", "/ˈloʊnli/", "เหงา", "feeling-lonely", "B1"),
    e("fe-18", "Grateful", "/ˈɡreɪtfəl/", "ซาบซึ้งใจ", "feeling-grateful", "B1"),
    e("fe-19", "Disappointed", "/ˌdɪsəˈpɔɪntɪd/", "ผิดหวัง", "feeling-disappointed", "B1"),
    e("fe-20", "Curious", "/ˈkjʊəriəs/", "อยากรู้อยากเห็น", "feeling-curious", "B1"),
]

with open("src/data/vocabulary.json", "w", encoding="utf-8") as f:
    json.dump(vocabulary, f, ensure_ascii=False, indent=2)
    f.write("\n")

total = sum(len(v) for v in vocabulary.values())
print("categories:", len(vocabulary))
for k, v in vocabulary.items():
    print(" ", k, len(v))
print("TOTAL:", total)
