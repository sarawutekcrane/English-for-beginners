#!/usr/bin/env python3
"""Generate the 13 new conversation topics and merge with the 2 existing ones."""
import json

PATH = "src/data/conversations.json"


def sysline(text, phonetic, thai):
    return {"text": text, "phonetic": phonetic, "thai": thai}


def opt(text, phonetic, thai, correct, next_=None):
    o = {"text": text, "phonetic": phonetic, "thai": thai, "correct": correct}
    if next_:
        o["next"] = next_
    return o


def topic(id_, title, emoji, n1, n2a, n2b, n3, n4a, n4b):
    return {
        "id": id_,
        "title": title,
        "emoji": emoji,
        "start": "n1",
        "nodes": {"n1": n1, "n2a": n2a, "n2b": n2b, "n3": n3, "n4a": n4a, "n4b": n4b},
    }


new_topics = []

# 1. Checking into a hotel
new_topics.append(topic(
    "hotel-checkin", "Checking into a hotel", "🏨",
    n1=dict(system=sysline("Good evening! Do you have a reservation?",
                           "/ɡʊd ˈiːvnɪŋ! duː juː hæv ə ˌrɛzərˈveɪʃən/",
                           "สวัสดีตอนเย็นค่ะ คุณจองห้องไว้ไหมคะ"),
            options=[
                opt("Yes, I have a reservation under Smith.", "/jɛs, aɪ hæv ə ˌrɛzərˈveɪʃən ˈʌndər smɪθ/", "ค่ะ ฉันจองไว้ในชื่อสมิธ", True, "n2a"),
                opt("No, I don't have a reservation.", "/noʊ, aɪ doʊnt hæv ə ˌrɛzərˈveɪʃən/", "ไม่ค่ะ ฉันไม่ได้จองไว้", True, "n2b"),
                opt("The room is very clean.", "/ðə ruːm ɪz ˈvɛri kliːn/", "ห้องนี้สะอาดมากค่ะ", False),
            ]),
    n2a=dict(system=sysline("Great, may I see your passport, please?",
                             "/ɡreɪt, meɪ aɪ siː jʊər ˈpæspɔːrt, pliːz/",
                             "ได้เลยค่ะ ขอดูพาสปอร์ตหน่อยได้ไหมคะ"),
              options=[
                  opt("Here you are.", "/hɪr juː ɑːr/", "นี่ค่ะ", True, "n3"),
                  opt("Sure, one moment.", "/ʃʊr, wʌn ˈmoʊmənt/", "ได้ค่ะ รอสักครู่นะคะ", True, "n3"),
                  opt("I don't have a car.", "/aɪ doʊnt hæv ə kɑːr/", "ฉันไม่มีรถค่ะ", False),
              ]),
    n2b=dict(system=sysline("That's okay, we have rooms available. How many nights?",
                             "/ðæts ˈoʊkeɪ, wiː hæv ruːmz əˈveɪləbəl. haʊ ˈmɛni naɪts/",
                             "ไม่เป็นไรค่ะ เรามีห้องว่าง จะพักกี่คืนคะ"),
              options=[
                  opt("Two nights, please.", "/tuː naɪts, pliːz/", "สองคืนค่ะ", True, "n3"),
                  opt("Just one night.", "/dʒʌst wʌn naɪt/", "แค่คืนเดียวค่ะ", True, "n3"),
                  opt("I like the beach.", "/aɪ laɪk ðə biːtʃ/", "ฉันชอบชายหาดค่ะ", False),
              ]),
    n3=dict(system=sysline("Would you like a room with a city view or a sea view?",
                            "/wʊd juː laɪk ə ruːm wɪð ə ˈsɪti vjuː ɔːr ə siː vjuː/",
                            "อยากได้ห้องวิวเมืองหรือวิวทะเลคะ"),
             options=[
                 opt("City view, please.", "/ˈsɪti vjuː, pliːz/", "วิวเมืองค่ะ", True, "n4a"),
                 opt("Sea view, please.", "/siː vjuː, pliːz/", "วิวทะเลค่ะ", True, "n4b"),
                 opt("I don't eat seafood.", "/aɪ doʊnt iːt ˈsiːfuːd/", "ฉันไม่ทานอาหารทะเลค่ะ", False),
             ]),
    n4a=dict(system=sysline("Perfect. Here's your key card, room 305 on the third floor.",
                             "/ˈpɜːrfɪkt. hɪrz jʊər kiː kɑːrd, ruːm θriː oʊ faɪv ɒn ðə θɜːrd flɔːr/",
                             "เยี่ยมเลยค่ะ นี่คีย์การ์ด ห้อง 305 ชั้นสามค่ะ"),
              options=[
                  opt("Thank you very much.", "/θæŋk juː ˈvɛri mʌtʃ/", "ขอบคุณมากค่ะ", True),
                  opt("What time is breakfast?", "/wʌt taɪm ɪz ˈbrɛkfəst/", "อาหารเช้าเสิร์ฟกี่โมงคะ", True),
                  opt("I love pizza.", "/aɪ lʌv ˈpiːtsə/", "ฉันชอบพิซซ่าค่ะ", False),
              ]),
    n4b=dict(system=sysline("Perfect. Here's your key card, room 512 on the fifth floor.",
                             "/ˈpɜːrfɪkt. hɪrz jʊər kiː kɑːrd, ruːm faɪv wʌn tuː ɒn ðə fɪfθ flɔːr/",
                             "เยี่ยมเลยค่ะ นี่คีย์การ์ด ห้อง 512 ชั้นห้าค่ะ"),
              options=[
                  opt("Thank you so much.", "/θæŋk juː soʊ mʌtʃ/", "ขอบคุณมากๆ ค่ะ", True),
                  opt("Is there free Wi-Fi?", "/ɪz ðɛr friː ˈwaɪfaɪ/", "มีไวไฟฟรีไหมคะ", True),
                  opt("I don't like coffee.", "/aɪ doʊnt laɪk ˈkɒfi/", "ฉันไม่ชอบกาแฟค่ะ", False),
              ]),
))

# 2. Shopping for clothes
new_topics.append(topic(
    "clothes-shopping", "Shopping for clothes", "👕",
    n1=dict(system=sysline("Hi! Can I help you find anything?",
                            "/haɪ! kæn aɪ hɛlp juː faɪnd ˈɛniθɪŋ/",
                            "สวัสดีค่ะ ให้ช่วยหาอะไรไหมคะ"),
             options=[
                 opt("Yes, I'm looking for a jacket.", "/jɛs, aɪm ˈlʊkɪŋ fɔːr ə ˈdʒækɪt/", "ค่ะ ฉันกำลังหาแจ็คเก็ตอยู่", True, "n2a"),
                 opt("Yes, I need a pair of shoes.", "/jɛs, aɪ niːd ə pɛr əv ʃuːz/", "ค่ะ ฉันต้องการรองเท้าสักคู่", True, "n2b"),
                 opt("The weather is nice today.", "/ðə ˈwɛðər ɪz naɪs təˈdeɪ/", "วันนี้อากาศดีนะคะ", False),
             ]),
    n2a=dict(system=sysline("Sure, what size do you wear?",
                             "/ʃʊr, wʌt saɪz duː juː wɛr/",
                             "ได้ค่ะ คุณใส่ไซซ์อะไรคะ"),
              options=[
                  opt("I wear a medium.", "/aɪ wɛr ə ˈmiːdiəm/", "ฉันใส่ไซซ์กลางค่ะ", True, "n3"),
                  opt("I wear a large.", "/aɪ wɛr ə lɑːrdʒ/", "ฉันใส่ไซซ์ใหญ่ค่ะ", True, "n3"),
                  opt("I don't like the color blue.", "/aɪ doʊnt laɪk ðə ˈkʌlər bluː/", "ฉันไม่ชอบสีฟ้าค่ะ", False),
              ]),
    n2b=dict(system=sysline("Okay, what size shoe do you need?",
                             "/ˈoʊkeɪ, wʌt saɪz ʃuː duː juː niːd/",
                             "โอเคค่ะ รองเท้าไซซ์อะไรคะ"),
              options=[
                  opt("Size 40, please.", "/saɪz ˈfɔːrti, pliːz/", "ไซซ์ 40 ค่ะ", True, "n3"),
                  opt("I'm not sure, can I try one on?", "/aɪm nɒt ʃʊr, kæn aɪ traɪ wʌn ɒn/", "ฉันไม่แน่ใจค่ะ ขอลองสวมได้ไหมคะ", True, "n3"),
                  opt("I don't wear hats.", "/aɪ doʊnt wɛr hæts/", "ฉันไม่ใส่หมวกค่ะ", False),
              ]),
    n3=dict(system=sysline("Here you go. Would you like to try it on?",
                            "/hɪr juː ɡoʊ. wʊd juː laɪk tuː traɪ ɪt ɒn/",
                            "นี่ค่ะ อยากลองสวมดูไหมคะ"),
             options=[
                 opt("Yes, where's the fitting room?", "/jɛs, wɛrz ðə ˈfɪtɪŋ ruːm/", "ค่ะ ห้องลองอยู่ตรงไหนคะ", True, "n4a"),
                 opt("No, I'll just buy it.", "/noʊ, aɪl dʒʌst baɪ ɪt/", "ไม่ค่ะ ฉันจะซื้อเลย", True, "n4b"),
                 opt("I don't have any money.", "/aɪ doʊnt hæv ˈɛni ˈmʌni/", "ฉันไม่มีเงินเลยค่ะ", False),
             ]),
    n4a=dict(system=sysline("It's right over there, on the left.",
                             "/ɪts raɪt ˈoʊvər ðɛr, ɒn ðə lɛft/",
                             "อยู่ตรงนั้นเลยค่ะ ทางซ้าย"),
              options=[
                  opt("Thanks, I'll go take a look.", "/θæŋks, aɪl ɡoʊ teɪk ə lʊk/", "ขอบคุณค่ะ ฉันจะไปลองดู", True),
                  opt("It fits perfectly!", "/ɪt fɪts ˈpɜːrfɪktli/", "พอดีเป๊ะเลยค่ะ", True),
                  opt("I don't have a car.", "/aɪ doʊnt hæv ə kɑːr/", "ฉันไม่มีรถค่ะ", False),
              ]),
    n4b=dict(system=sysline("Great choice! You can pay at the counter.",
                             "/ɡreɪt tʃɔɪs! juː kæn peɪ æt ðə ˈkaʊntər/",
                             "เลือกได้ดีค่ะ จ่ายเงินที่เคาน์เตอร์ได้เลยค่ะ"),
              options=[
                  opt("Do you accept credit cards?", "/duː juː əkˈsɛpt ˈkrɛdɪt kɑːrdz/", "รับบัตรเครดิตไหมคะ", True),
                  opt("Thank you, have a nice day.", "/θæŋk juː, hæv ə naɪs deɪ/", "ขอบคุณค่ะ ขอให้มีความสุขนะคะ", True),
                  opt("I don't like shopping.", "/aɪ doʊnt laɪk ˈʃɒpɪŋ/", "ฉันไม่ชอบช้อปปิ้งค่ะ", False),
              ]),
))

# 3. Visiting the doctor
new_topics.append(topic(
    "doctor-visit", "Visiting the doctor", "🩺",
    n1=dict(system=sysline("Good morning. What's the problem today?",
                            "/ɡʊd ˈmɔːrnɪŋ. wʌts ðə ˈprɒbləm təˈdeɪ/",
                            "สวัสดีตอนเช้าค่ะ วันนี้มีปัญหาอะไรคะ"),
             options=[
                 opt("I have a headache.", "/aɪ hæv ə ˈhɛdeɪk/", "ฉันปวดหัวค่ะ", True, "n2a"),
                 opt("I have a fever.", "/aɪ hæv ə ˈfiːvər/", "ฉันมีไข้ค่ะ", True, "n2b"),
                 opt("I like vegetables.", "/aɪ laɪk ˈvɛdʒtəbəlz/", "ฉันชอบผักค่ะ", False),
             ]),
    n2a=dict(system=sysline("I see. How long have you had the headache?",
                             "/aɪ siː. haʊ lɒŋ hæv juː hæd ðə ˈhɛdeɪk/",
                             "เข้าใจแล้วค่ะ ปวดหัวมานานแค่ไหนแล้วคะ"),
              options=[
                  opt("Since yesterday.", "/sɪns ˈjɛstərdeɪ/", "ตั้งแต่เมื่อวานค่ะ", True, "n3"),
                  opt("For two days.", "/fɔːr tuː deɪz/", "สองวันแล้วค่ะ", True, "n3"),
                  opt("I don't drink coffee.", "/aɪ doʊnt drɪŋk ˈkɒfi/", "ฉันไม่ดื่มกาแฟค่ะ", False),
              ]),
    n2b=dict(system=sysline("Okay. Do you have a cough as well?",
                             "/ˈoʊkeɪ. duː juː hæv ə kɒf æz wɛl/",
                             "โอเคค่ะ มีอาการไอด้วยไหมคะ"),
              options=[
                  opt("Yes, a little.", "/jɛs, ə ˈlɪtəl/", "ค่ะ นิดหน่อย", True, "n3"),
                  opt("No, just the fever.", "/noʊ, dʒʌst ðə ˈfiːvər/", "ไม่มีค่ะ มีแค่ไข้", True, "n3"),
                  opt("I play tennis every week.", "/aɪ pleɪ ˈtɛnɪs ˈɛvri wiːk/", "ฉันเล่นเทนนิสทุกสัปดาห์ค่ะ", False),
              ]),
    n3=dict(system=sysline("Let me check your temperature. Please sit here.",
                            "/lɛt miː tʃɛk jʊər ˌtɛmprəˈtʃʊr. pliːz sɪt hɪr/",
                            "ขอวัดอุณหภูมิก่อนนะคะ นั่งตรงนี้ค่ะ"),
             options=[
                 opt("Okay, thank you, doctor.", "/ˈoʊkeɪ, θæŋk juː, ˈdɒktər/", "ค่ะ ขอบคุณค่ะคุณหมอ", True, "n4a"),
                 opt("Is it serious?", "/ɪz ɪt ˈsɪəriəs/", "อาการหนักไหมคะ", True, "n4b"),
                 opt("I love ice cream.", "/aɪ lʌv aɪs kriːm/", "ฉันชอบไอศกรีมค่ะ", False),
             ]),
    n4a=dict(system=sysline("It's nothing serious. Just rest and drink plenty of water.",
                             "/ɪts ˈnʌθɪŋ ˈsɪəriəs. dʒʌst rɛst ænd drɪŋk ˈplɛnti əv ˈwɔːtər/",
                             "ไม่มีอะไรร้ายแรงค่ะ พักผ่อนและดื่มน้ำเยอะๆ นะคะ"),
              options=[
                  opt("Thank you, I will.", "/θæŋk juː, aɪ wɪl/", "ขอบคุณค่ะ ฉันจะทำตามนะคะ", True),
                  opt("Do I need any medicine?", "/duː aɪ niːd ˈɛni ˈmɛdsən/", "ฉันต้องกินยาไหมคะ", True),
                  opt("See you next year.", "/siː juː nɛkst jɪr/", "แล้วเจอกันปีหน้านะคะ", False),
              ]),
    n4b=dict(system=sysline("Don't worry, it's mild. I'll give you some medicine.",
                             "/doʊnt ˈwʌri, ɪts maɪld. aɪl ɡɪv juː sʌm ˈmɛdsən/",
                             "ไม่ต้องห่วงค่ะ อาการไม่หนัก ฉันจะให้ยาไปทานนะคะ"),
              options=[
                  opt("Thank you very much, doctor.", "/θæŋk juː ˈvɛri mʌtʃ, ˈdɒktər/", "ขอบคุณมากค่ะคุณหมอ", True),
                  opt("How many times a day?", "/haʊ ˈmɛni taɪmz ə deɪ/", "วันละกี่ครั้งคะ", True),
                  opt("I want to go swimming.", "/aɪ wɒnt tuː ɡoʊ ˈswɪmɪŋ/", "ฉันอยากไปว่ายน้ำค่ะ", False),
              ]),
))

# 4. Making a phone call
new_topics.append(topic(
    "phone-call", "Making a phone call", "📞",
    n1=dict(system=sysline("Hello, this is Green Cafe. How can I help you?",
                            "/həˈloʊ, ðɪs ɪz ɡriːn kæˈfeɪ. haʊ kæn aɪ hɛlp juː/",
                            "สวัสดีค่ะ ร้านกรีนคาเฟ่ค่ะ มีอะไรให้ช่วยไหมคะ"),
             options=[
                 opt("Hi, I'd like to make a reservation.", "/haɪ, aɪd laɪk tuː meɪk ə ˌrɛzərˈveɪʃən/", "สวัสดีค่ะ อยากจะจองโต๊ะค่ะ", True, "n2a"),
                 opt("Hi, are you open now?", "/haɪ, ɑːr juː ˈoʊpən naʊ/", "สวัสดีค่ะ ตอนนี้เปิดอยู่ไหมคะ", True, "n2b"),
                 opt("I lost my keys.", "/aɪ lɒst maɪ kiːz/", "ฉันทำกุญแจหายค่ะ", False),
             ]),
    n2a=dict(system=sysline("Sure, for how many people and what time?",
                             "/ʃʊr, fɔːr haʊ ˈmɛni ˈpiːpəl ænd wʌt taɪm/",
                             "ได้ค่ะ กี่ท่านและกี่โมงคะ"),
              options=[
                  opt("Four people, at seven o'clock.", "/fɔːr ˈpiːpəl, æt ˈsɛvən əˈklɒk/", "สี่ท่านค่ะ เวลาหนึ่งทุ่มค่ะ", True, "n3"),
                  opt("Two people, at eight o'clock.", "/tuː ˈpiːpəl, æt eɪt əˈklɒk/", "สองท่านค่ะ เวลาสองทุ่มค่ะ", True, "n3"),
                  opt("I don't have a phone.", "/aɪ doʊnt hæv ə foʊn/", "ฉันไม่มีโทรศัพท์ค่ะ", False),
              ]),
    n2b=dict(system=sysline("Yes, we're open until ten tonight.",
                             "/jɛs, wɪr ˈoʊpən ənˈtɪl tɛn təˈnaɪt/",
                             "ค่ะ เราเปิดถึงสี่ทุ่มคืนนี้ค่ะ"),
              options=[
                  opt("Great, can I book a table too?", "/ɡreɪt, kæn aɪ bʊk ə ˈteɪbəl tuː/", "ดีเลยค่ะ ขอจองโต๊ะด้วยได้ไหมคะ", True, "n3"),
                  opt("Perfect, thank you.", "/ˈpɜːrfɪkt, θæŋk juː/", "เยี่ยมเลยค่ะ ขอบคุณค่ะ", True, "n3"),
                  opt("It's raining outside.", "/ɪts ˈreɪnɪŋ aʊtˈsaɪd/", "ข้างนอกฝนตกค่ะ", False),
              ]),
    n3=dict(system=sysline("May I have your name and phone number, please?",
                            "/meɪ aɪ hæv jʊər neɪm ænd foʊn ˈnʌmbər, pliːz/",
                            "ขอชื่อและเบอร์โทรศัพท์ด้วยได้ไหมคะ"),
             options=[
                 opt("My name is Anna, and my number is 0812345678.", "/maɪ neɪm ɪz ˈænə, ænd maɪ ˈnʌmbər ɪz oʊ eɪt wʌn tuː θriː fɔːr faɪv sɪks ˈsɛvən eɪt/", "ชื่อแอนนาค่ะ เบอร์โทร 0812345678", True, "n4a"),
                 opt("Can I give you my email instead?", "/kæn aɪ ɡɪv juː maɪ ˈiːmeɪl ɪnˈstɛd/", "ให้อีเมลแทนได้ไหมคะ", True, "n4b"),
                 opt("I don't have a name.", "/aɪ doʊnt hæv ə neɪm/", "ฉันไม่มีชื่อค่ะ", False),
             ]),
    n4a=dict(system=sysline("Perfect, your table is booked. See you soon!",
                             "/ˈpɜːrfɪkt, jʊər ˈteɪbəl ɪz bʊkt. siː juː suːn/",
                             "เรียบร้อยค่ะ จองโต๊ะให้แล้ว แล้วเจอกันนะคะ"),
              options=[
                  opt("Thank you, see you then.", "/θæŋk juː, siː juː ðɛn/", "ขอบคุณค่ะ แล้วเจอกันค่ะ", True),
                  opt("Can I cancel later if needed?", "/kæn aɪ ˈkænsəl ˈleɪtər ɪf ˈniːdɪd/", "ถ้าจำเป็นขอยกเลิกทีหลังได้ไหมคะ", True),
                  opt("I love football.", "/aɪ lʌv ˈfʊtbɔːl/", "ฉันชอบฟุตบอลค่ะ", False),
              ]),
    n4b=dict(system=sysline("That's fine, but a phone number is easier for us.",
                             "/ðæts faɪn, bʌt ə foʊn ˈnʌmbər ɪz ˈiːziər fɔːr ʌs/",
                             "ได้ค่ะ แต่เบอร์โทรจะสะดวกกว่าค่ะ"),
              options=[
                  opt("Okay, my number is 0898765432.", "/ˈoʊkeɪ, maɪ ˈnʌmbər ɪz oʊ eɪt naɪn eɪt ˈsɛvən sɪks faɪv fɔːr θriː tuː/", "โอเคค่ะ เบอร์ 0898765432", True),
                  opt("Sure, I understand.", "/ʃʊr, aɪ ˌʌndərˈstænd/", "ได้ค่ะ เข้าใจแล้วค่ะ", True),
                  opt("I don't like phones.", "/aɪ doʊnt laɪk foʊnz/", "ฉันไม่ชอบโทรศัพท์ค่ะ", False),
              ]),
))

# 5. Meeting someone new
new_topics.append(topic(
    "new-friend", "Meeting someone new", "🤝",
    n1=dict(system=sysline("Hi, I don't think we've met. I'm Tom.",
                            "/haɪ, aɪ doʊnt θɪŋk wiːv mɛt. aɪm tɒm/",
                            "สวัสดีค่ะ เราคงยังไม่เคยเจอกันนะ ผมชื่อทอมครับ"),
             options=[
                 opt("Nice to meet you, I'm Mai.", "/naɪs tuː miːt juː, aɪm maɪ/", "ยินดีที่ได้รู้จักค่ะ ฉันชื่อใหม่ค่ะ", True, "n2a"),
                 opt("Hi Tom, I'm Nick.", "/haɪ tɒm, aɪm nɪk/", "สวัสดีทอม ผมชื่อนิคครับ", True, "n2b"),
                 opt("The bus is late again.", "/ðə bʌs ɪz leɪt əˈɡɛn/", "รถเมล์มาสายอีกแล้ว", False),
             ]),
    n2a=dict(system=sysline("Nice to meet you too, Mai! Where are you from?",
                             "/naɪs tuː miːt juː tuː, maɪ! wɛr ɑːr juː frɒm/",
                             "ยินดีที่ได้รู้จักเหมือนกันค่ะ คุณมาจากไหนคะ"),
              options=[
                  opt("I'm from Thailand.", "/aɪm frɒm ˈtaɪlænd/", "ฉันมาจากประเทศไทยค่ะ", True, "n3"),
                  opt("I'm from Chiang Mai.", "/aɪm frɒm tʃiˈæŋ maɪ/", "ฉันมาจากเชียงใหม่ค่ะ", True, "n3"),
                  opt("I don't have a passport.", "/aɪ doʊnt hæv ə ˈpæspɔːrt/", "ฉันไม่มีพาสปอร์ตค่ะ", False),
              ]),
    n2b=dict(system=sysline("Nice to meet you, Nick! What do you do?",
                             "/naɪs tuː miːt juː, nɪk! wʌt duː juː duː/",
                             "ยินดีที่ได้รู้จักครับ นิคทำงานอะไรครับ"),
              options=[
                  opt("I'm a student.", "/aɪm ə ˈstuːdənt/", "ผมเป็นนักเรียนครับ", True, "n3"),
                  opt("I work as an engineer.", "/aɪ wɜːrk æz æn ˌɛndʒɪˈnɪr/", "ผมทำงานเป็นวิศวกรครับ", True, "n3"),
                  opt("I don't like my job.", "/aɪ doʊnt laɪk maɪ dʒɒb/", "ผมไม่ชอบงานของผมครับ", False),
              ]),
    n3=dict(system=sysline("That's great! What do you like to do in your free time?",
                            "/ðæts ɡreɪt! wʌt duː juː laɪk tuː duː ɪn jʊər friː taɪm/",
                            "เยี่ยมเลยครับ! เวลาว่างชอบทำอะไรครับ"),
             options=[
                 opt("I like reading books.", "/aɪ laɪk ˈriːdɪŋ bʊks/", "ฉันชอบอ่านหนังสือค่ะ", True, "n4a"),
                 opt("I like playing sports.", "/aɪ laɪk ˈpleɪɪŋ spɔːrts/", "ฉันชอบเล่นกีฬาค่ะ", True, "n4b"),
                 opt("I don't have free time.", "/aɪ doʊnt hæv friː taɪm/", "ฉันไม่มีเวลาว่างเลยค่ะ", False),
             ]),
    n4a=dict(system=sysline("Me too! Do you have a favorite author?",
                             "/miː tuː! duː juː hæv ə ˈfeɪvərɪt ˈɔːθər/",
                             "ผมก็เหมือนกันครับ! มีนักเขียนคนโปรดไหมครับ"),
              options=[
                  opt("Yes, I really like mystery novels.", "/jɛs, aɪ ˈrɪli laɪk ˈmɪstəri ˈnɒvəlz/", "มีค่ะ ฉันชอบนิยายสืบสวนมากค่ะ", True),
                  opt("Not really, I read all kinds of books.", "/nɒt ˈrɪli, aɪ riːd ɔːl kaɪndz əv bʊks/", "ไม่แน่ใจค่ะ ฉันอ่านหนังสือทุกประเภทค่ะ", True),
                  opt("I can't swim.", "/aɪ kænt swɪm/", "ฉันว่ายน้ำไม่เป็นค่ะ", False),
              ]),
    n4b=dict(system=sysline("Cool! Which sport do you play?",
                             "/kuːl! wɪtʃ spɔːrt duː juː pleɪ/",
                             "เจ๋งเลยครับ! เล่นกีฬาอะไรครับ"),
              options=[
                  opt("I play badminton every weekend.", "/aɪ pleɪ ˈbædmɪntən ˈɛvri ˈwiːkɛnd/", "ฉันเล่นแบดมินตันทุกสุดสัปดาห์ค่ะ", True),
                  opt("I usually go running.", "/aɪ ˈjuːʒuəli ɡoʊ ˈrʌnɪŋ/", "ปกติฉันไปวิ่งค่ะ", True),
                  opt("I don't own a phone.", "/aɪ doʊnt oʊn ə foʊn/", "ฉันไม่มีโทรศัพท์ค่ะ", False),
              ]),
))

# 6. At the airport
new_topics.append(topic(
    "airport-checkin", "At the airport", "✈️",
    n1=dict(system=sysline("Good morning. May I see your passport and ticket?",
                            "/ɡʊd ˈmɔːrnɪŋ. meɪ aɪ siː jʊər ˈpæspɔːrt ænd ˈtɪkɪt/",
                            "สวัสดีตอนเช้าค่ะ ขอดูพาสปอร์ตกับตั๋วด้วยค่ะ"),
             options=[
                 opt("Here they are.", "/hɪr ðeɪ ɑːr/", "นี่ค่ะ", True, "n2a"),
                 opt("I have an e-ticket on my phone.", "/aɪ hæv æn iː ˈtɪkɪt ɒn maɪ foʊn/", "ฉันมีตั๋วอิเล็กทรอนิกส์ในโทรศัพท์ค่ะ", True, "n2b"),
                 opt("I don't like flying.", "/aɪ doʊnt laɪk ˈflaɪɪŋ/", "ฉันไม่ชอบขึ้นเครื่องบินค่ะ", False),
             ]),
    n2a=dict(system=sysline("Thank you. Do you have any luggage to check in?",
                             "/θæŋk juː. duː juː hæv ˈɛni ˈlʌɡɪdʒ tuː tʃɛk ɪn/",
                             "ขอบคุณค่ะ มีกระเป๋าจะโหลดไหมคะ"),
              options=[
                  opt("Yes, one suitcase.", "/jɛs, wʌn ˈsuːtkeɪs/", "มีค่ะ กระเป๋าใบเดียว", True, "n3"),
                  opt("No, just this carry-on.", "/noʊ, dʒʌst ðɪs ˈkæri ɒn/", "ไม่มีค่ะ มีแค่กระเป๋าถือใบนี้", True, "n3"),
                  opt("I forgot my ticket.", "/aɪ fərˈɡɒt maɪ ˈtɪkɪt/", "ฉันลืมตั๋วค่ะ", False),
              ]),
    n2b=dict(system=sysline("That's fine. Is this your first time flying with us?",
                             "/ðæts faɪn. ɪz ðɪs jʊər fɜːrst taɪm ˈflaɪɪŋ wɪð ʌs/",
                             "ได้ค่ะ นี่เป็นครั้งแรกที่บินกับเราไหมคะ"),
              options=[
                  opt("Yes, it's my first time.", "/jɛs, ɪts maɪ fɜːrst taɪm/", "ค่ะ เป็นครั้งแรกค่ะ", True, "n3"),
                  opt("No, I've flown with you before.", "/noʊ, aɪv floʊn wɪð juː bɪˈfɔːr/", "ไม่ค่ะ ฉันเคยบินกับคุณมาก่อนแล้ว", True, "n3"),
                  opt("I don't like the food here.", "/aɪ doʊnt laɪk ðə fuːd hɪr/", "ฉันไม่ชอบอาหารที่นี่ค่ะ", False),
              ]),
    n3=dict(system=sysline("Would you prefer a window seat or an aisle seat?",
                            "/wʊd juː prɪˈfɜːr ə ˈwɪndoʊ siːt ɔːr æn aɪl siːt/",
                            "อยากได้ที่นั่งริมหน้าต่างหรือริมทางเดินคะ"),
             options=[
                 opt("A window seat, please.", "/ə ˈwɪndoʊ siːt, pliːz/", "ริมหน้าต่างค่ะ", True, "n4a"),
                 opt("An aisle seat, please.", "/æn aɪl siːt, pliːz/", "ริมทางเดินค่ะ", True, "n4b"),
                 opt("I don't like flying at night.", "/aɪ doʊnt laɪk ˈflaɪɪŋ æt naɪt/", "ฉันไม่ชอบบินตอนกลางคืนค่ะ", False),
             ]),
    n4a=dict(system=sysline("Great, here's your boarding pass. Gate B12, boarding at 3pm.",
                             "/ɡreɪt, hɪrz jʊər ˈbɔːrdɪŋ pæs. ɡeɪt biː twɛlv, ˈbɔːrdɪŋ æt θriː piː ɛm/",
                             "เรียบร้อยค่ะ นี่บอร์ดดิ้งพาส ประตู B12 ขึ้นเครื่องบ่ายสามโมงค่ะ"),
              options=[
                  opt("Thank you very much.", "/θæŋk juː ˈvɛri mʌtʃ/", "ขอบคุณมากค่ะ", True),
                  opt("Where is gate B12?", "/wɛr ɪz ɡeɪt biː twɛlv/", "ประตู B12 อยู่ตรงไหนคะ", True),
                  opt("I lost my wallet.", "/aɪ lɒst maɪ ˈwɒlɪt/", "ฉันทำกระเป๋าเงินหายค่ะ", False),
              ]),
    n4b=dict(system=sysline("Great, here's your boarding pass. Gate A5, boarding at 3pm.",
                             "/ɡreɪt, hɪrz jʊər ˈbɔːrdɪŋ pæs. ɡeɪt eɪ faɪv, ˈbɔːrdɪŋ æt θriː piː ɛm/",
                             "เรียบร้อยค่ะ นี่บอร์ดดิ้งพาส ประตู A5 ขึ้นเครื่องบ่ายสามโมงค่ะ"),
              options=[
                  opt("Thank you so much.", "/θæŋk juː soʊ mʌtʃ/", "ขอบคุณมากๆ ค่ะ", True),
                  opt("How do I get to gate A5?", "/haʊ duː aɪ ɡɛt tuː ɡeɪt eɪ faɪv/", "ไปประตู A5 ยังไงคะ", True),
                  opt("I like window shopping.", "/aɪ laɪk ˈwɪndoʊ ˈʃɒpɪŋ/", "ฉันชอบดูของตามร้านค่ะ", False),
              ]),
))

# 7. Talking about weekend plans
new_topics.append(topic(
    "weekend-plans", "Talking about weekend plans", "📅",
    n1=dict(system=sysline("Do you have any plans for the weekend?",
                            "/duː juː hæv ˈɛni plænz fɔːr ðə ˈwiːkɛnd/",
                            "สุดสัปดาห์นี้มีแผนอะไรไหม"),
             options=[
                 opt("Yes, I'm going to visit my parents.", "/jɛs, aɪm ˈɡoʊɪŋ tuː ˈvɪzɪt maɪ ˈpɛrənts/", "มีค่ะ ฉันจะไปเยี่ยมพ่อแม่", True, "n2a"),
                 opt("Not yet, do you have any ideas?", "/nɒt jɛt, duː juː hæv ˈɛni aɪˈdɪəz/", "ยังไม่มีเลยค่ะ มีไอเดียอะไรไหม", True, "n2b"),
                 opt("I finished my homework yesterday.", "/aɪ ˈfɪnɪʃt maɪ ˈhoʊmwɜːrk ˈjɛstərdeɪ/", "ฉันทำการบ้านเสร็จเมื่อวานแล้ว", False),
             ]),
    n2a=dict(system=sysline("That sounds nice. Do they live far from here?",
                             "/ðæt saʊndz naɪs. duː ðeɪ lɪv fɑːr frɒm hɪr/",
                             "ฟังดูดีจังเลย บ้านเขาอยู่ไกลจากที่นี่ไหม"),
              options=[
                  opt("Not too far, about an hour away.", "/nɒt tuː fɑːr, əˈbaʊt æn ˈaʊər əˈweɪ/", "ไม่ไกลมากค่ะ ประมาณชั่วโมงเดียว", True, "n3"),
                  opt("Yes, it takes a whole day.", "/jɛs, ɪt teɪks ə hoʊl deɪ/", "ไกลค่ะ ใช้เวลาทั้งวันเลย", True, "n3"),
                  opt("I don't have any parents.", "/aɪ doʊnt hæv ˈɛni ˈpɛrənts/", "ฉันไม่มีพ่อแม่ค่ะ", False),
              ]),
    n2b=dict(system=sysline("How about going to the beach or watching a movie?",
                             "/haʊ əˈbaʊt ˈɡoʊɪŋ tuː ðə biːtʃ ɔːr ˈwɒtʃɪŋ ə ˈmuːvi/",
                             "ไปทะเลหรือไปดูหนังดีไหม"),
              options=[
                  opt("The beach sounds great!", "/ðə biːtʃ saʊndz ɡreɪt/", "ทะเลฟังดูดีเลยค่ะ!", True, "n3"),
                  opt("Let's watch a movie instead.", "/lɛts wɒtʃ ə ˈmuːvi ɪnˈstɛd/", "ไปดูหนังกันดีกว่าค่ะ", True, "n3"),
                  opt("I don't like the ocean.", "/aɪ doʊnt laɪk ðə ˈoʊʃən/", "ฉันไม่ชอบทะเลค่ะ", False),
              ]),
    n3=dict(system=sysline("Sounds fun! What time should we meet?",
                            "/saʊndz fʌn! wʌt taɪm ʃʊd wiː miːt/",
                            "ฟังดูสนุกเลย! เจอกันกี่โมงดี"),
             options=[
                 opt("Let's meet at ten in the morning.", "/lɛts miːt æt tɛn ɪn ðə ˈmɔːrnɪŋ/", "เจอกันสิบโมงเช้าดีไหม", True, "n4a"),
                 opt("How about two in the afternoon?", "/haʊ əˈbaʊt tuː ɪn ðə ˌæftərˈnuːn/", "บ่ายสองโมงดีไหม", True, "n4b"),
                 opt("I don't have a watch.", "/aɪ doʊnt hæv ə wɒtʃ/", "ฉันไม่มีนาฬิกาค่ะ", False),
             ]),
    n4a=dict(system=sysline("Perfect, ten it is! See you then.",
                             "/ˈpɜːrfɪkt, tɛn ɪt ɪz! siː juː ðɛn/",
                             "เยี่ยม สิบโมงเลยนะ! แล้วเจอกัน"),
              options=[
                  opt("See you then!", "/siː juː ðɛn/", "แล้วเจอกันนะคะ!", True),
                  opt("I can't wait!", "/aɪ kænt weɪt/", "รอไม่ไหวแล้วค่ะ!", True),
                  opt("I have to work tomorrow.", "/aɪ hæv tuː wɜːrk təˈmɒroʊ/", "พรุ่งนี้ฉันต้องทำงานค่ะ", False),
              ]),
    n4b=dict(system=sysline("Perfect, two o'clock works for me too!",
                             "/ˈpɜːrfɪkt, tuː əˈklɒk wɜːrks fɔːr miː tuː/",
                             "เยี่ยม บ่ายสองก็สะดวกกับฉันด้วย!"),
              options=[
                  opt("Great, see you soon.", "/ɡreɪt, siː juː suːn/", "เยี่ยมเลยค่ะ แล้วเจอกันนะ", True),
                  opt("I'll text you the address.", "/aɪl tɛkst juː ðiː əˈdrɛs/", "ฉันจะส่งที่อยู่ไปให้ทางข้อความนะ", True),
                  opt("It's my birthday today.", "/ɪts maɪ ˈbɜːrθdeɪ təˈdeɪ/", "วันนี้เป็นวันเกิดของฉันค่ะ", False),
              ]),
))

# 8. Taking a taxi
new_topics.append(topic(
    "taxi-ride", "Taking a taxi", "🚕",
    n1=dict(system=sysline("Hello! Where would you like to go?",
                            "/həˈloʊ! wɛr wʊd juː laɪk tuː ɡoʊ/",
                            "สวัสดีครับ จะไปที่ไหนครับ"),
             options=[
                 opt("To the airport, please.", "/tuː ðiː ˈɛrpɔːrt, pliːz/", "ไปสนามบินค่ะ", True, "n2a"),
                 opt("To the city center, please.", "/tuː ðə ˈsɪti ˈsɛntər, pliːz/", "ไปใจกลางเมืองค่ะ", True, "n2b"),
                 opt("I don't have any luggage.", "/aɪ doʊnt hæv ˈɛni ˈlʌɡɪdʒ/", "ฉันไม่มีกระเป๋าเลยค่ะ", False),
             ]),
    n2a=dict(system=sysline("Sure, that will take about thirty minutes.",
                             "/ʃʊr, ðæt wɪl teɪk əˈbaʊt ˈθɜːrti ˈmɪnɪts/",
                             "ได้ครับ ใช้เวลาประมาณสามสิบนาทีครับ"),
              options=[
                  opt("That's fine, thank you.", "/ðæts faɪn, θæŋk juː/", "ได้ค่ะ ขอบคุณค่ะ", True, "n3"),
                  opt("Can we go faster? My flight is soon.", "/kæn wiː ɡoʊ ˈfæstər? maɪ flaɪt ɪz suːn/", "ไปเร็วขึ้นได้ไหมคะ เที่ยวบินฉันจะออกแล้ว", True, "n3"),
                  opt("I don't like airplanes.", "/aɪ doʊnt laɪk ˈɛrpleɪnz/", "ฉันไม่ชอบเครื่องบินค่ะ", False),
              ]),
    n2b=dict(system=sysline("No problem, it's about fifteen minutes from here.",
                             "/noʊ ˈprɒbləm, ɪts əˈbaʊt ˈfɪftiːn ˈmɪnɪts frɒm hɪr/",
                             "ไม่มีปัญหาครับ จากที่นี่ประมาณสิบห้านาทีครับ"),
              options=[
                  opt("Great, thanks.", "/ɡreɪt, θæŋks/", "เยี่ยมเลยค่ะ ขอบคุณค่ะ", True, "n3"),
                  opt("Can you turn on the AC, please?", "/kæn juː tɜːrn ɒn ðiː eɪ siː, pliːz/", "เปิดแอร์ได้ไหมคะ", True, "n3"),
                  opt("I love spicy food.", "/aɪ lʌv ˈspaɪsi fuːd/", "ฉันชอบอาหารเผ็ดค่ะ", False),
              ]),
    n3=dict(system=sysline("Of course. Would you like to pay by cash or card?",
                            "/əv kɔːrs. wʊd juː laɪk tuː peɪ baɪ kæʃ ɔːr kɑːrd/",
                            "ได้ครับ จะจ่ายด้วยเงินสดหรือบัตรครับ"),
             options=[
                 opt("By cash, please.", "/baɪ kæʃ, pliːz/", "จ่ายเงินสดค่ะ", True, "n4a"),
                 opt("By card, please.", "/baɪ kɑːrd, pliːz/", "จ่ายด้วยบัตรค่ะ", True, "n4b"),
                 opt("I don't have any bags.", "/aɪ doʊnt hæv ˈɛni bæɡz/", "ฉันไม่มีกระเป๋าค่ะ", False),
             ]),
    n4a=dict(system=sysline("No problem. Here we are, that will be 250 baht.",
                             "/noʊ ˈprɒbləm. hɪr wiː ɑːr, ðæt wɪl biː tuː ˈhʌndrəd fɪfti bɑːt/",
                             "ไม่มีปัญหาครับ ถึงแล้วครับ ค่าโดยสาร 250 บาทครับ"),
              options=[
                  opt("Here you go, keep the change.", "/hɪr juː ɡoʊ, kiːp ðə tʃeɪndʒ/", "นี่ค่ะ ไม่ต้องทอนค่ะ", True),
                  opt("Thank you for the ride.", "/θæŋk juː fɔːr ðə raɪd/", "ขอบคุณที่ส่งนะคะ", True),
                  opt("I don't like taxis.", "/aɪ doʊnt laɪk ˈtæksiz/", "ฉันไม่ชอบแท็กซี่ค่ะ", False),
              ]),
    n4b=dict(system=sysline("No problem. Here we are, please tap your card here.",
                             "/noʊ ˈprɒbləm. hɪr wiː ɑːr, pliːz tæp jʊər kɑːrd hɪr/",
                             "ไม่มีปัญหาครับ ถึงแล้วครับ แตะบัตรตรงนี้ได้เลยครับ"),
              options=[
                  opt("Thank you very much.", "/θæŋk juː ˈvɛri mʌtʃ/", "ขอบคุณมากค่ะ", True),
                  opt("Can I get a receipt?", "/kæn aɪ ɡɛt ə rɪˈsiːt/", "ขอใบเสร็จได้ไหมคะ", True),
                  opt("I forgot my umbrella.", "/aɪ fərˈɡɒt maɪ ʌmˈbrɛlə/", "ฉันลืมร่มค่ะ", False),
              ]),
))

# 9. At the bank
new_topics.append(topic(
    "bank-visit", "At the bank", "🏦",
    n1=dict(system=sysline("Good afternoon. How can I help you today?",
                            "/ɡʊd ˌæftərˈnuːn. haʊ kæn aɪ hɛlp juː təˈdeɪ/",
                            "สวัสดีตอนบ่ายค่ะ วันนี้มีอะไรให้ช่วยคะ"),
             options=[
                 opt("I'd like to open a new account.", "/aɪd laɪk tuː ˈoʊpən ə njuː əˈkaʊnt/", "ฉันอยากเปิดบัญชีใหม่ค่ะ", True, "n2a"),
                 opt("I'd like to withdraw some money.", "/aɪd laɪk tuː wɪðˈdrɔː sʌm ˈmʌni/", "ฉันอยากถอนเงินค่ะ", True, "n2b"),
                 opt("I like this song.", "/aɪ laɪk ðɪs sɒŋ/", "ฉันชอบเพลงนี้ค่ะ", False),
             ]),
    n2a=dict(system=sysline("Sure! Do you have your ID card with you?",
                             "/ʃʊr! duː juː hæv jʊər aɪ diː kɑːrd wɪð juː/",
                             "ได้ค่ะ มีบัตรประชาชนติดตัวไหมคะ"),
              options=[
                  opt("Yes, here it is.", "/jɛs, hɪr ɪt ɪz/", "มีค่ะ นี่ค่ะ", True, "n3"),
                  opt("Yes, and my passport too.", "/jɛs, ænd maɪ ˈpæspɔːrt tuː/", "มีค่ะ และมีพาสปอร์ตด้วยค่ะ", True, "n3"),
                  opt("I don't have any documents.", "/aɪ doʊnt hæv ˈɛni ˈdɒkjəmənts/", "ฉันไม่มีเอกสารเลยค่ะ", False),
              ]),
    n2b=dict(system=sysline("Okay, how much would you like to withdraw?",
                             "/ˈoʊkeɪ, haʊ mʌtʃ wʊd juː laɪk tuː wɪðˈdrɔː/",
                             "ได้ค่ะ อยากถอนเท่าไหร่คะ"),
              options=[
                  opt("Two thousand baht, please.", "/tuː ˈθaʊzənd bɑːt, pliːz/", "สองพันบาทค่ะ", True, "n3"),
                  opt("Five thousand baht, please.", "/faɪv ˈθaʊzənd bɑːt, pliːz/", "ห้าพันบาทค่ะ", True, "n3"),
                  opt("I don't have a bank account.", "/aɪ doʊnt hæv ə bæŋk əˈkaʊnt/", "ฉันไม่มีบัญชีธนาคารค่ะ", False),
              ]),
    n3=dict(system=sysline("Great, please fill out this form and sign here.",
                            "/ɡreɪt, pliːz fɪl aʊt ðɪs fɔːrm ænd saɪn hɪr/",
                            "ได้ค่ะ กรุณากรอกแบบฟอร์มนี้และเซ็นชื่อตรงนี้ค่ะ"),
             options=[
                 opt("Okay, one moment please.", "/ˈoʊkeɪ, wʌn ˈmoʊmənt pliːz/", "ค่ะ รอสักครู่นะคะ", True, "n4a"),
                 opt("Can you help me fill it out?", "/kæn juː hɛlp miː fɪl ɪt aʊt/", "ช่วยกรอกให้หน่อยได้ไหมคะ", True, "n4b"),
                 opt("I don't have a pen.", "/aɪ doʊnt hæv ə pɛn/", "ฉันไม่มีปากกาค่ะ", False),
             ]),
    n4a=dict(system=sysline("Take your time. Just bring it back when you're done.",
                             "/teɪk jʊər taɪm. dʒʌst brɪŋ ɪt bæk wɛn jʊr dʌn/",
                             "ค่อยๆ ทำนะคะ เสร็จแล้วเอามาคืนได้เลยค่ะ"),
              options=[
                  opt("Thank you, I'm done now.", "/θæŋk juː, aɪm dʌn naʊ/", "ขอบคุณค่ะ เสร็จแล้วค่ะ", True),
                  opt("I have a question about this part.", "/aɪ hæv ə ˈkwɛstʃən əˈbaʊt ðɪs pɑːrt/", "ฉันมีคำถามเกี่ยวกับส่วนนี้ค่ะ", True),
                  opt("I love traveling.", "/aɪ lʌv ˈtrævəlɪŋ/", "ฉันชอบท่องเที่ยวค่ะ", False),
              ]),
    n4b=dict(system=sysline("Of course, let me show you what to write.",
                             "/əv kɔːrs, lɛt miː ʃoʊ juː wʌt tuː raɪt/",
                             "ได้ค่ะ ให้ดิฉันช่วยแนะนำวิธีกรอกนะคะ"),
              options=[
                  opt("Thank you so much for your help.", "/θæŋk juː soʊ mʌtʃ fɔːr jʊər hɛlp/", "ขอบคุณมากๆ ที่ช่วยนะคะ", True),
                  opt("What should I write here?", "/wʌt ʃʊd aɪ raɪt hɪr/", "ตรงนี้ต้องเขียนอะไรคะ", True),
                  opt("I don't like paperwork.", "/aɪ doʊnt laɪk ˈpeɪpərwɜːrk/", "ฉันไม่ชอบงานเอกสารค่ะ", False),
              ]),
))

# 10. Talking about the weather
new_topics.append(topic(
    "weather-smalltalk", "Talking about the weather", "☀️",
    n1=dict(system=sysline("It's so hot today, isn't it?",
                            "/ɪts soʊ hɒt təˈdeɪ, ˈɪzənt ɪt/",
                            "วันนี้ร้อนมากเลยนะคะ ใช่ไหม"),
             options=[
                 opt("Yes, it's really hot!", "/jɛs, ɪts ˈrɪli hɒt/", "ค่ะ ร้อนมากจริงๆ", True, "n2a"),
                 opt("Actually, I think it's quite cool.", "/ˈæktʃuəli, aɪ θɪŋk ɪts kwaɪt kuːl/", "จริงๆ ฉันว่าค่อนข้างเย็นนะคะ", True, "n2b"),
                 opt("I don't like coffee.", "/aɪ doʊnt laɪk ˈkɒfi/", "ฉันไม่ชอบกาแฟค่ะ", False),
             ]),
    n2a=dict(system=sysline("I heard it might rain later. Did you bring an umbrella?",
                             "/aɪ hɜːrd ɪt maɪt reɪn ˈleɪtər. dɪd juː brɪŋ æn ʌmˈbrɛlə/",
                             "ได้ยินว่าเดี๋ยวฝนอาจจะตกนะคะ พกร่มมาไหมคะ"),
              options=[
                  opt("Yes, I always carry one.", "/jɛs, aɪ ˈɔːlweɪz ˈkæri wʌn/", "มีค่ะ ฉันพกติดตัวตลอด", True, "n3"),
                  opt("No, I forgot it at home.", "/noʊ, aɪ fərˈɡɒt ɪt æt hoʊm/", "ไม่มีค่ะ ลืมไว้ที่บ้าน", True, "n3"),
                  opt("I love snow.", "/aɪ lʌv snoʊ/", "ฉันชอบหิมะค่ะ", False),
              ]),
    n2b=dict(system=sysline("Really? I guess the wind is helping today.",
                             "/ˈrɪli? aɪ ɡɛs ðə wɪnd ɪz ˈhɛlpɪŋ təˈdeɪ/",
                             "จริงเหรอคะ คงเป็นเพราะลมพัดวันนี้"),
              options=[
                  opt("Yes, the breeze feels nice.", "/jɛs, ðə briːz fiːlz naɪs/", "ค่ะ ลมเย็นสบายดีค่ะ", True, "n3"),
                  opt("Maybe, or I'm just used to the heat.", "/ˈmeɪbi, ɔːr aɪm dʒʌst juːzd tuː ðə hiːt/", "อาจจะ หรือฉันชินกับความร้อนแล้วค่ะ", True, "n3"),
                  opt("I don't like winter.", "/aɪ doʊnt laɪk ˈwɪntər/", "ฉันไม่ชอบฤดูหนาวค่ะ", False),
              ]),
    n3=dict(system=sysline("What's the weather usually like in your hometown?",
                            "/wʌts ðə ˈwɛðər ˈjuːʒuəli laɪk ɪn jʊər ˈhoʊmtaʊn/",
                            "ที่บ้านเกิดของคุณอากาศมักจะเป็นยังไงคะ"),
             options=[
                 opt("It's usually sunny and warm.", "/ɪts ˈjuːʒuəli ˈsʌni ænd wɔːrm/", "ปกติจะแดดดีและอบอุ่นค่ะ", True, "n4a"),
                 opt("It's often rainy in summer.", "/ɪts ˈɒfən ˈreɪni ɪn ˈsʌmər/", "หน้าร้อนฝนตกบ่อยค่ะ", True, "n4b"),
                 opt("I don't remember my hometown.", "/aɪ doʊnt rɪˈmɛmbər maɪ ˈhoʊmtaʊn/", "ฉันจำบ้านเกิดตัวเองไม่ได้ค่ะ", False),
             ]),
    n4a=dict(system=sysline("That sounds lovely. I'd like to visit someday.",
                             "/ðæt saʊndz ˈlʌvli. aɪd laɪk tuː ˈvɪzɪt ˈsʌmdeɪ/",
                             "ฟังดูดีจังเลยค่ะ อยากไปเที่ยวสักวันเลย"),
              options=[
                  opt("You should! It's beautiful in December.", "/juː ʃʊd! ɪts ˈbjuːtəfəl ɪn dɪˈsɛmbər/", "ควรไปเลยค่ะ! เดือนธันวาคมสวยมากค่ะ", True),
                  opt("I'll show you some photos.", "/aɪl ʃoʊ juː sʌm ˈfoʊtoʊz/", "เดี๋ยวฉันจะให้ดูรูปนะคะ", True),
                  opt("I don't have any photos.", "/aɪ doʊnt hæv ˈɛni ˈfoʊtoʊz/", "ฉันไม่มีรูปเลยค่ะ", False),
              ]),
    n4b=dict(system=sysline("I see, so it's best to visit in winter then.",
                             "/aɪ siː, soʊ ɪts bɛst tuː ˈvɪzɪt ɪn ˈwɪntər ðɛn/",
                             "เข้าใจแล้วค่ะ งั้นควรไปเที่ยวหน้าหนาวดีกว่า"),
              options=[
                  opt("Exactly, the weather is perfect then.", "/ɪɡˈzæktli, ðə ˈwɛðər ɪz ˈpɜːrfɪkt ðɛn/", "ใช่เลยค่ะ อากาศดีมากช่วงนั้น", True),
                  opt("Yes, and it's not too crowded.", "/jɛs, ænd ɪts nɒt tuː ˈkraʊdɪd/", "ค่ะ แล้วก็คนไม่เยอะด้วยค่ะ", True),
                  opt("I don't like crowds.", "/aɪ doʊnt laɪk kraʊdz/", "ฉันไม่ชอบที่คนเยอะค่ะ", False),
              ]),
))

# 11. Inviting a friend to a party
new_topics.append(topic(
    "birthday-invite", "Inviting a friend to a party", "🎉",
    n1=dict(system=sysline("Hey! I'm having a birthday party on Saturday. Can you come?",
                            "/heɪ! aɪm ˈhævɪŋ ə ˈbɜːrθdeɪ ˈpɑːrti ɒn ˈsætərdeɪ. kæn juː kʌm/",
                            "เฮ้! ฉันจะจัดปาร์ตี้วันเกิดวันเสาร์นี้ มาได้ไหม"),
             options=[
                 opt("Of course! What time?", "/əv kɔːrs! wʌt taɪm/", "ได้สิ! กี่โมงคะ", True, "n2a"),
                 opt("I'd love to! Can I bring a friend?", "/aɪd lʌv tuː! kæn aɪ brɪŋ ə frɛnd/", "อยากไปมากเลย! พาเพื่อนไปด้วยได้ไหม", True, "n2b"),
                 opt("I don't like parties.", "/aɪ doʊnt laɪk ˈpɑːrtiz/", "ฉันไม่ชอบปาร์ตี้ค่ะ", False),
             ]),
    n2a=dict(system=sysline("It starts at seven in the evening, at my house.",
                             "/ɪt stɑːrts æt ˈsɛvən ɪn ðiː ˈiːvnɪŋ, æt maɪ haʊs/",
                             "เริ่มหนึ่งทุ่มที่บ้านฉันนะ"),
              options=[
                  opt("Great, I'll be there!", "/ɡreɪt, aɪl biː ðɛr/", "เยี่ยม ฉันจะไปนะ!", True, "n3"),
                  opt("Should I bring anything?", "/ʃʊd aɪ brɪŋ ˈɛniθɪŋ/", "ต้องเอาอะไรไปด้วยไหม", True, "n3"),
                  opt("I don't have your address.", "/aɪ doʊnt hæv jʊər əˈdrɛs/", "ฉันไม่มีที่อยู่บ้านเธอเลย", False),
              ]),
    n2b=dict(system=sysline("Sure, the more the merrier!",
                             "/ʃʊr, ðə mɔːr ðə ˈmɛriər/",
                             "ได้สิ ยิ่งเยอะยิ่งสนุก!"),
              options=[
                  opt("Awesome, thank you!", "/ˈɔːsəm, θæŋk juː/", "เจ๋งเลย ขอบคุณนะ!", True, "n3"),
                  opt("What time should we arrive?", "/wʌt taɪm ʃʊd wiː əˈraɪv/", "ควรไปถึงกี่โมงดี", True, "n3"),
                  opt("I don't have any friends.", "/aɪ doʊnt hæv ˈɛni frɛndz/", "ฉันไม่มีเพื่อนเลย", False),
              ]),
    n3=dict(system=sysline("Just bring yourself, that's all I need!",
                            "/dʒʌst brɪŋ jɔːrˈsɛlf, ðæts ɔːl aɪ niːd/",
                            "แค่มาตัวเปล่าก็พอ แค่นั้นแหละที่อยากได้!"),
             options=[
                 opt("Okay, see you Saturday!", "/ˈoʊkeɪ, siː juː ˈsætərdeɪ/", "โอเค แล้วเจอกันวันเสาร์นะ!", True, "n4a"),
                 opt("Actually, I'll bring a cake.", "/ˈæktʃuəli, aɪl brɪŋ ə keɪk/", "จริงๆ ฉันจะเอาเค้กไปด้วยนะ", True, "n4b"),
                 opt("I have to work on Saturday.", "/aɪ hæv tuː wɜːrk ɒn ˈsætərdeɪ/", "วันเสาร์ฉันต้องทำงาน", False),
             ]),
    n4a=dict(system=sysline("Perfect, I can't wait to see you!",
                             "/ˈpɜːrfɪkt, aɪ kænt weɪt tuː siː juː/",
                             "เยี่ยมเลย รอเจอเธออยู่นะ!"),
              options=[
                  opt("Me too, see you then!", "/miː tuː, siː juː ðɛn/", "เหมือนกันเลย แล้วเจอกันนะ!", True),
                  opt("Happy early birthday!", "/ˈhæpi ˈɜːrli ˈbɜːrθdeɪ/", "สุขสันต์วันเกิดล่วงหน้านะ!", True),
                  opt("I need to buy new shoes.", "/aɪ niːd tuː baɪ njuː ʃuːz/", "ฉันต้องไปซื้อรองเท้าใหม่", False),
              ]),
    n4b=dict(system=sysline("Wow, thank you! That's so kind of you.",
                             "/waʊ, θæŋk juː! ðæts soʊ kaɪnd əv juː/",
                             "ว้าว ขอบคุณนะ! ใจดีมากเลย"),
              options=[
                  opt("No problem, see you soon!", "/noʊ ˈprɒbləm, siː juː suːn/", "ไม่เป็นไรเลย แล้วเจอกันนะ!", True),
                  opt("What flavor do you like?", "/wʌt ˈfleɪvər duː juː laɪk/", "ชอบรสอะไรล่ะ?", True),
                  opt("I don't know how to bake.", "/aɪ doʊnt noʊ haʊ tuː beɪk/", "ฉันทำเบเกอรี่ไม่เป็นเลย", False),
              ]),
))

# 12. Asking for help (lost item)
new_topics.append(topic(
    "lost-item", "Asking for help (lost item)", "🔍",
    n1=dict(system=sysline("Excuse me, can I help you find something?",
                            "/ɪkˈskjuːz miː, kæn aɪ hɛlp juː faɪnd ˈsʌmθɪŋ/",
                            "ขอโทษค่ะ ให้ช่วยหาอะไรไหมคะ"),
             options=[
                 opt("Yes, I lost my phone.", "/jɛs, aɪ lɒst maɪ foʊn/", "ค่ะ ฉันทำโทรศัพท์หายค่ะ", True, "n2a"),
                 opt("Yes, I can't find my bag.", "/jɛs, aɪ kænt faɪnd maɪ bæɡ/", "ค่ะ ฉันหากระเป๋าไม่เจอค่ะ", True, "n2b"),
                 opt("No, I'm just looking around.", "/noʊ, aɪm dʒʌst ˈlʊkɪŋ əˈraʊnd/", "ไม่ค่ะ แค่เดินดูเฉยๆ ค่ะ", False),
             ]),
    n2a=dict(system=sysline("Oh no. Where did you last have it?",
                             "/oʊ noʊ. wɛr dɪd juː læst hæv ɪt/",
                             "โอ้ไม่นะคะ ครั้งสุดท้ายที่มีอยู่คือที่ไหนคะ"),
              options=[
                  opt("I think I left it on the train.", "/aɪ θɪŋk aɪ lɛft ɪt ɒn ðə treɪn/", "ฉันคิดว่าลืมไว้บนรถไฟค่ะ", True, "n3"),
                  opt("Maybe at the coffee shop.", "/ˈmeɪbi æt ðə ˈkɒfi ʃɒp/", "อาจจะที่ร้านกาแฟค่ะ", True, "n3"),
                  opt("I never had a phone.", "/aɪ ˈnɛvər hæd ə foʊn/", "ฉันไม่เคยมีโทรศัพท์เลยค่ะ", False),
              ]),
    n2b=dict(system=sysline("Don't worry. What does your bag look like?",
                             "/doʊnt ˈwʌri. wʌt dʌz jʊər bæɡ lʊk laɪk/",
                             "ไม่ต้องกังวลค่ะ กระเป๋าของคุณหน้าตาเป็นยังไงคะ"),
              options=[
                  opt("It's a small black backpack.", "/ɪts ə smɔːl blæk ˈbækpæk/", "เป็นกระเป๋าเป้สีดำใบเล็กค่ะ", True, "n3"),
                  opt("It's a brown leather bag.", "/ɪts ə braʊn ˈlɛðər bæɡ/", "เป็นกระเป๋าหนังสีน้ำตาลค่ะ", True, "n3"),
                  opt("I don't own a bag.", "/aɪ doʊnt oʊn ə bæɡ/", "ฉันไม่มีกระเป๋าค่ะ", False),
              ]),
    n3=dict(system=sysline("Okay, let me check with our lost and found office.",
                            "/ˈoʊkeɪ, lɛt miː tʃɛk wɪð ˈaʊər lɒst ænd faʊnd ˈɒfɪs/",
                            "ได้ค่ะ ขอฉันไปเช็กที่แผนกของหายก่อนนะคะ"),
             options=[
                 opt("Thank you, I'll wait here.", "/θæŋk juː, aɪl weɪt hɪr/", "ขอบคุณค่ะ ฉันจะรอตรงนี้", True, "n4a"),
                 opt("Can I come with you?", "/kæn aɪ kʌm wɪð juː/", "ขอไปด้วยได้ไหมคะ", True, "n4b"),
                 opt("I have to catch my flight now.", "/aɪ hæv tuː kætʃ maɪ flaɪt naʊ/", "ตอนนี้ฉันต้องไปขึ้นเครื่องแล้วค่ะ", False),
             ]),
    n4a=dict(system=sysline("Good news, we found it! Here you go.",
                             "/ɡʊd njuːz, wiː faʊnd ɪt! hɪr juː ɡoʊ/",
                             "ข่าวดีค่ะ เราเจอแล้ว! นี่ค่ะ"),
              options=[
                  opt("Thank you so much!", "/θæŋk juː soʊ mʌtʃ/", "ขอบคุณมากๆ เลยค่ะ!", True),
                  opt("I'm so relieved.", "/aɪm soʊ rɪˈliːvd/", "โล่งใจมากเลยค่ะ", True),
                  opt("I don't need it anymore.", "/aɪ doʊnt niːd ɪt ˌɛniˈmɔːr/", "ฉันไม่ต้องการมันแล้วค่ะ", False),
              ]),
    n4b=dict(system=sysline("Of course, follow me this way.",
                             "/əv kɔːrs, ˈfɒloʊ miː ðɪs weɪ/",
                             "ได้ค่ะ ตามฉันมาทางนี้เลยค่ะ"),
              options=[
                  opt("Thank you for your help.", "/θæŋk juː fɔːr jʊər hɛlp/", "ขอบคุณที่ช่วยเหลือนะคะ", True),
                  opt("I really appreciate it.", "/aɪ ˈrɪli əˈpriːʃiˌeɪt ɪt/", "ฉันซาบซึ้งใจมากเลยค่ะ", True),
                  opt("I don't like walking.", "/aɪ doʊnt laɪk ˈwɔːkɪŋ/", "ฉันไม่ชอบเดินค่ะ", False),
              ]),
))

# 13. In the classroom
new_topics.append(topic(
    "classroom", "In the classroom", "🏫",
    n1=dict(system=sysline("Good morning class. Is everyone here today?",
                            "/ɡʊd ˈmɔːrnɪŋ klæs. ɪz ˈɛvriwʌn hɪr təˈdeɪ/",
                            "สวัสดีตอนเช้าค่ะนักเรียน วันนี้มากันครบไหมคะ"),
             options=[
                 opt("Yes, everyone is here.", "/jɛs, ˈɛvriwʌn ɪz hɪr/", "ครับ มากันครบแล้วครับ", True, "n2a"),
                 opt("No, two students are absent.", "/noʊ, tuː ˈstuːdənts ɑːr ˈæbsənt/", "ไม่ครบครับ มีนักเรียนขาดสองคน", True, "n2b"),
                 opt("I forgot my lunch.", "/aɪ fərˈɡɒt maɪ lʌntʃ/", "ผมลืมเอาข้าวกลางวันมาครับ", False),
             ]),
    n2a=dict(system=sysline("Great, please open your books to page ten.",
                             "/ɡreɪt, pliːz ˈoʊpən jʊər bʊks tuː peɪdʒ tɛn/",
                             "ดีมากค่ะ เปิดหนังสือไปหน้าสิบนะคะ"),
              options=[
                  opt("Okay, one moment.", "/ˈoʊkeɪ, wʌn ˈmoʊmənt/", "ครับ รอสักครู่นะครับ", True, "n3"),
                  opt("I don't have my book today.", "/aɪ doʊnt hæv maɪ bʊk təˈdeɪ/", "วันนี้ผมไม่มีหนังสือครับ", True, "n3"),
                  opt("I like math class.", "/aɪ laɪk mæθ klæs/", "ผมชอบวิชาคณิตศาสตร์ครับ", False),
              ]),
    n2b=dict(system=sysline("I see. Does anyone know why they're absent?",
                             "/aɪ siː. dʌz ˈɛniwʌn noʊ waɪ ðɛr ˈæbsənt/",
                             "เข้าใจแล้วค่ะ มีใครรู้ไหมคะว่าทำไมถึงขาด"),
              options=[
                  opt("I think they are sick.", "/aɪ θɪŋk ðeɪ ɑːr sɪk/", "ผมคิดว่าพวกเขาป่วยครับ", True, "n3"),
                  opt("No, I don't know.", "/noʊ, aɪ doʊnt noʊ/", "ไม่ครับ ผมไม่ทราบครับ", True, "n3"),
                  opt("I love my classmates.", "/aɪ lʌv maɪ ˈklæsmeɪts/", "ผมรักเพื่อนร่วมชั้นครับ", False),
              ]),
    n3=dict(system=sysline("Alright. Can someone read the first paragraph aloud?",
                            "/ɔːlˈraɪt. kæn ˈsʌmwʌn riːd ðə fɜːrst ˈpærəɡræf əˈlaʊd/",
                            "โอเคค่ะ มีใครอ่านย่อหน้าแรกดังๆ ให้ฟังได้ไหมคะ"),
             options=[
                 opt("I can read it.", "/aɪ kæn riːd ɪt/", "ผมอ่านได้ครับ", True, "n4a"),
                 opt("Can we read it together?", "/kæn wiː riːd ɪt təˈɡɛðər/", "อ่านพร้อมกันได้ไหมครับ", True, "n4b"),
                 opt("I don't like reading.", "/aɪ doʊnt laɪk ˈriːdɪŋ/", "ผมไม่ชอบอ่านหนังสือครับ", False),
             ]),
    n4a=dict(system=sysline("Great, please go ahead.",
                             "/ɡreɪt, pliːz ɡoʊ əˈhɛd/",
                             "ดีมากค่ะ เชิญอ่านได้เลยค่ะ"),
              options=[
                  opt("Okay, here I go.", "/ˈoʊkeɪ, hɪr aɪ ɡoʊ/", "ครับ เริ่มเลยนะครับ", True),
                  opt("Thank you for the chance.", "/θæŋk juː fɔːr ðə tʃæns/", "ขอบคุณที่ให้โอกาสครับ", True),
                  opt("I need a new pencil.", "/aɪ niːd ə njuː ˈpɛnsəl/", "ผมต้องการดินสอใหม่ครับ", False),
              ]),
    n4b=dict(system=sysline("Sure, that's a good idea. Everyone, follow along.",
                             "/ʃʊr, ðæts ə ɡʊd aɪˈdɪə. ˈɛvriwʌn, ˈfɒloʊ əˈlɒŋ/",
                             "ได้ค่ะ ความคิดดีมากค่ะ ทุกคนอ่านตามนะคะ"),
              options=[
                  opt("Okay, let's start.", "/ˈoʊkeɪ, lɛts stɑːrt/", "ครับ เริ่มกันเลย", True),
                  opt("This is fun!", "/ðɪs ɪz fʌn/", "สนุกจังเลยครับ!", True),
                  opt("I want to go home.", "/aɪ wɒnt tuː ɡoʊ hoʊm/", "ผมอยากกลับบ้านครับ", False),
              ]),
))

with open(PATH, "r", encoding="utf-8") as f:
    existing = json.load(f)

merged = existing + new_topics

# --- validation ---
assert len(merged) == 15, f"expected 15 topics, got {len(merged)}"
total_nodes = 0
for t in merged:
    nodes = t["nodes"]
    total_nodes += len(nodes)
    assert t["start"] in nodes, f"{t['id']}: start node missing"
    reachable = set()
    stack = [t["start"]]
    while stack:
        nid = stack.pop()
        if nid in reachable:
            continue
        reachable.add(nid)
        for o in nodes[nid]["options"]:
            if o.get("correct") is False:
                assert "next" not in o, f"{t['id']}/{nid}: incorrect option has next"
            nxt = o.get("next")
            if nxt:
                assert nxt in nodes, f"{t['id']}/{nid}: dangling next -> {nxt}"
                stack.append(nxt)
    assert reachable == set(nodes.keys()), f"{t['id']}: unreachable nodes {set(nodes.keys()) - reachable}"
    if t in new_topics:
        branch_points = sum(1 for nid, n in nodes.items() if len({o.get('next') for o in n['options'] if o.get('next')}) >= 2)
        assert branch_points >= 1, f"{t['id']}: no genuine branch point"

print(f"OK - {len(merged)} topics, {total_nodes} nodes total")

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)
