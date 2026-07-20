#!/usr/bin/env python3
"""Part 3: 10 new Office Communication conversation topics, each built
around one grammar pattern from sentencePatterns.json (assigned below,
verified against the actual current pattern list rather than assumed).
Same branching schema as existing topics: a genuine branch point (2 correct
paths from the opening node, both leading to independently-reachable
terminal nodes), incorrect options never carry `next`, shared
MISUNDERSTANDING retry line handled by the app itself (not per-topic data).
"""
import json

PATH = "src/data/conversations.json"

# id -> grammar pattern id it's built around (for the commit/summary only;
# no new schema field added, since no existing topic carries one either --
# the pattern is reinforced through the actual dialogue text itself).
PATTERN_MAP = {
    "schedule-meeting": "can-could-ability",
    "request-time-off": "going-to-future",
    "give-status-update": "present-continuous",
    "ask-colleague-help": "have-has",
    "respond-to-feedback": "past-simple",
    "clarify-deadline": "first-conditional",
    "coworker-smalltalk": "present-simple",
    "report-problem-manager": "zero-conditional",
    "follow-up-email": "will-future",
    "welcome-new-colleague": "there-is-are",
}


def line(text, phonetic, thai):
    return {"text": text, "phonetic": phonetic, "thai": thai}


def opt(text, phonetic, thai, correct, next_=None):
    o = {"text": text, "phonetic": phonetic, "thai": thai, "correct": correct}
    if next_:
        o["next"] = next_
    return o


TOPICS = [
    {
        "id": "schedule-meeting",
        "title": "การนัดหมายประชุม",
        "emoji": "📅",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Hi, do you have a minute? I'd like to schedule our project meeting.",
                    "ไฮ ดู ยู แฮฟ อะ มิ-นิท ไอด์ ไลค์ ทู สเก็ด-จูล เอาร์ พรอ-เจ็คท์ มี-ทิ่ง",
                    "สวัสดีค่ะ มีเวลาสักครู่ไหม ฉันอยากนัดประชุมโปรเจกต์ของเรา",
                ),
                "options": [
                    opt("Sure, could we meet on Thursday morning?", "ชัวร์ คุด วี มีท ออน เธิร์ส-เดย์ มอร์-นิ่ง", "ได้ค่ะ เราประชุมวันพฤหัสฯ ตอนเช้าได้ไหม", True, "n2a"),
                    opt("Could we move it to 3pm instead?", "คุด วี มูฟ อิท ทู ธรี พีเอ็ม อิน-สเทด", "ขอเลื่อนเป็นบ่ายสามแทนได้ไหมคะ", True, "n2b"),
                    opt("I already had lunch, thanks.", "ไอ ออล-เร-ดี้ แฮด ลันช์ แธงค์ส", "ฉันทานข้าวเที่ยงไปแล้วค่ะ ขอบคุณ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Thursday morning works. Could you also invite the design team?",
                    "เธิร์ส-เดย์ มอร์-นิ่ง เวิร์คส์ คุด ยู ออล-โซ อิน-ไวท์ เดอะ ดี-ไซน์ ทีม",
                    "เช้าวันพฤหัสฯ ได้ค่ะ ช่วยเชิญทีมดีไซน์เข้ามาด้วยได้ไหม",
                ),
                "options": [
                    opt("Sure, I'll send them the invite now.", "ชัวร์ ไอล์ เซนด์ เดม ดิ อิน-ไวท์ นาว", "ได้ค่ะ ฉันจะส่งคำเชิญให้พวกเขาตอนนี้เลย", True, "n3a"),
                    opt("Could you send them the invite instead?", "คุด ยู เซนด์ เดม ดิ อิน-ไวท์ อิน-สเทด", "ช่วยส่งคำเชิญให้พวกเขาแทนได้ไหมคะ", True, "n3a"),
                    opt("The office is on the fifth floor.", "ดิ ออฟ-ฟิส อิส ออน เดอะ ฟิฟธ์ ฟลอร์", "ออฟฟิศอยู่ชั้นห้าค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Great, everything's set for Thursday. Thanks for arranging this!",
                    "เกรท เอฟ-ริ-ธิ่ง อีส เซ็ท ฟอร์ เธิร์ส-เดย์ แธงค์ส ฟอร์ อะ-เรน-จิ่ง ดิส",
                    "เยี่ยมเลยค่ะ ทุกอย่างพร้อมสำหรับวันพฤหัสฯ ขอบคุณที่จัดการเรื่องนี้นะ",
                ),
                "options": [
                    opt("No problem, see you there.", "โน พรอบ-เล็ม ซี ยู แดร์", "ไม่เป็นไรค่ะ แล้วเจอกันนะ", True),
                    opt("Could you confirm the meeting room too?", "คุด ยู คอน-เฟิร์ม เดอะ มี-ทิ่ง รูม ทู", "ช่วยยืนยันห้องประชุมด้วยได้ไหมคะ", True),
                    opt("I love pizza on Fridays.", "ไอ ลัฟ พิซ-ซ่า ออน ไฟร-เดย์ส", "ฉันชอบกินพิซซ่าทุกวันศุกร์", False),
                ],
            },
            "n2b": {
                "system": line(
                    "3pm works for me too. Could you book the small meeting room?",
                    "ธรี พีเอ็ม เวิร์คส์ ฟอร์ มี ทู คุด ยู บุ๊ค เดอะ สมอล มี-ทิ่ง รูม",
                    "บ่ายสามฉันก็สะดวกค่ะ ช่วยจองห้องประชุมเล็กให้ด้วยได้ไหม",
                ),
                "options": [
                    opt("Sure, I'll book it right away.", "ชัวร์ ไอล์ บุ๊ค อิท ไรท์ อะ-เวย์", "ได้เลยค่ะ ฉันจะจองให้ทันที", True, "n3b"),
                    opt("Could the design team book it instead?", "คุด เดอะ ดี-ไซน์ ทีม บุ๊ค อิท อิน-สเทด", "ให้ทีมดีไซน์จองแทนได้ไหมคะ", True, "n3b"),
                    opt("I forgot my umbrella today.", "ไอ ฟอร์-กอท มาย อัม-เบรล-ล่า ทู-เดย์", "วันนี้ฉันลืมเอาร่มมาค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "Perfect, the room is booked for 3pm on Thursday.",
                    "เพอร์-เฟ็คท์ เดอะ รูม อีส บุ๊คท์ ฟอร์ ธรี พีเอ็ม ออน เธิร์ส-เดย์",
                    "เยี่ยมเลยค่ะ ห้องประชุมจองไว้แล้วสำหรับบ่ายสามวันพฤหัสฯ",
                ),
                "options": [
                    opt("Thanks, see you then.", "แธงค์ส ซี ยู เดน", "ขอบคุณค่ะ แล้วเจอกันนะ", True),
                    opt("Could we also share the agenda beforehand?", "คุด วี ออล-โซ แชร์ ดิ อะ-เจน-ดา บิ-ฟอร์-แฮนด์", "ขอวาระการประชุมล่วงหน้าด้วยได้ไหมคะ", True),
                    opt("My computer is very old.", "มาย คอม-พิว-เทอร์ อีส เว-รี่ โอลด์", "คอมพิวเตอร์ของฉันเก่ามากเลยค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "request-time-off",
        "title": "การขอลาหยุดงาน",
        "emoji": "🏖️",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Hi, what can I do for you?",
                    "ไฮ วอท แคน ไอ ดู ฟอร์ ยู",
                    "สวัสดีค่ะ มีอะไรให้ช่วยไหม",
                ),
                "options": [
                    opt("I'm going to take next Monday off, if that's okay.", "แอม โก-อิ่ง ทู เทค เน็กซท์ มัน-เดย์ ออฟ อิฟ แดทส์ โอ-เค", "ฉันจะขอลาหยุดวันจันทร์หน้าค่ะ ถ้าโอเค", True, "n2a"),
                    opt("I'm going to need a week off for a family trip.", "แอม โก-อิ่ง ทู นีด อะ วีค ออฟ ฟอร์ อะ แฟ-มิ-ลี่ ทริพ", "ฉันจะขอลาหนึ่งสัปดาห์เพื่อไปเที่ยวกับครอบครัวค่ะ", True, "n2b"),
                    opt("I really like the new coffee machine.", "ไอ เรียล-ลี่ ไลค์ เดอะ นิว คอฟ-ฟี่ มะ-ชีน", "ฉันชอบเครื่องชงกาแฟใหม่มากเลยค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "That should be fine. Are you going to finish your report before then?",
                    "แดท ชุด บี ไฟน์ อาร์ ยู โก-อิ่ง ทู ฟิ-นิช ยัวร์ รี-พอร์ท บิ-ฟอร์ เดน",
                    "น่าจะได้ค่ะ คุณจะทำรายงานเสร็จก่อนหน้านั้นไหม",
                ),
                "options": [
                    opt("Yes, I'm going to finish it by Friday.", "เยส แอม โก-อิ่ง ทู ฟิ-นิช อิท บาย ไฟร-เดย์", "ค่ะ ฉันจะทำเสร็จภายในวันศุกร์", True, "n3a"),
                    opt("I'm going to ask my colleague to help finish it.", "แอม โก-อิ่ง ทู อาสค์ มาย คอล-ลีก ทู เฮลพ์ ฟิ-นิช อิท", "ฉันจะขอให้เพื่อนร่วมงานช่วยทำให้เสร็จค่ะ", True, "n3a"),
                    opt("The weather looks nice today.", "เดอะ เว-เธอร์ ลุคส์ ไนซ์ ทู-เดย์", "วันนี้อากาศดูดีนะคะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Great, I'll approve your day off then.",
                    "เกรท ไอล์ อะ-พรูฟ ยัวร์ เดย์ ออฟ เดน",
                    "เยี่ยมเลยค่ะ งั้นฉันจะอนุมัติวันลาให้",
                ),
                "options": [
                    opt("Thank you so much!", "แธงค์ ยู โซ มัช", "ขอบคุณมากเลยค่ะ", True),
                    opt("I'm going to submit the leave form today.", "แอม โก-อิ่ง ทู ซับ-มิท เดอะ ลีฟ ฟอร์ม ทู-เดย์", "ฉันจะส่งใบลาให้วันนี้เลยค่ะ", True),
                    opt("My favorite color is blue.", "มาย เฟ-เวอ-ริท คัล-เลอร์ อีส บลู", "สีโปรดของฉันคือสีฟ้าค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "A week is a bit long. Are you going to be reachable by email?",
                    "อะ วีค อีส อะ บิท ลอง อาร์ ยู โก-อิ่ง ทู บี รี-ชะ-เบิล บาย อี-เมล",
                    "หนึ่งสัปดาห์นานสักหน่อยนะคะ คุณจะติดต่อทางอีเมลได้ไหม",
                ),
                "options": [
                    opt("Yes, I'm going to check my email once a day.", "เยส แอม โก-อิ่ง ทู เช็ค มาย อี-เมล วันซ์ อะ เดย์", "ได้ค่ะ ฉันจะเช็คอีเมลวันละครั้ง", True, "n3b"),
                    opt("I'm going to hand everything over to my colleague first.", "แอม โก-อิ่ง ทู แฮนด์ เอฟ-ริ-ธิ่ง โอ-เวอร์ ทู มาย คอล-ลีก เฟิร์สท์", "ฉันจะส่งมอบงานให้เพื่อนร่วมงานก่อนค่ะ", True, "n3b"),
                    opt("I don't have a car.", "ไอ โด้นท์ แฮฟ อะ คาร์", "ฉันไม่มีรถค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "Sounds good. Enjoy your trip!",
                    "เซาน์ดส์ กู๊ด เอน-จอย ยัวร์ ทริพ",
                    "ฟังดูดีค่ะ ขอให้เที่ยวให้สนุกนะ",
                ),
                "options": [
                    opt("Thank you, I will!", "แธงค์ ยู ไอ วิล", "ขอบคุณค่ะ จะไปให้สนุกเลย", True),
                    opt("I'm going to bring you a souvenir.", "แอม โก-อิ่ง ทู บริง ยู อะ ซู-เวอ-เนียร์", "ฉันจะซื้อของฝากมาให้ด้วยนะคะ", True),
                    opt("The printer is out of paper.", "เดอะ พริน-เทอร์ อีส เอาท์ ออฟ เพ-เพอร์", "เครื่องพิมพ์กระดาษหมดค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "give-status-update",
        "title": "การรายงานความคืบหน้างาน",
        "emoji": "📊",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "How's the project going? Can you give me a quick update?",
                    "ฮาวส์ เดอะ พรอ-เจ็คท์ โก-อิ่ง แคน ยู กิฟ มี อะ ควิค อัพ-เดท",
                    "โปรเจกต์เป็นยังไงบ้างคะ ขออัพเดทสั้นๆ ได้ไหม",
                ),
                "options": [
                    opt("I'm currently working on the report.", "แอม เคอ-เรินท์-ลี่ เวิร์ค-กิ่ง ออน เดอะ รี-พอร์ท", "ตอนนี้ฉันกำลังทำรายงานอยู่ค่ะ", True, "n2a"),
                    opt("I'm still waiting for feedback from the client.", "แอม สทิล เว-ทิ่ง ฟอร์ ฟีด-แบ็ค ฟรอม เดอะ ไคลเอินท์", "ตอนนี้ฉันกำลังรอฟีดแบ็คจากลูกค้าอยู่ค่ะ", True, "n2b"),
                    opt("I usually eat lunch at noon.", "ไอ ยู-ชวล-ลี่ อีท ลันช์ แอท นูน", "ปกติฉันทานข้าวเที่ยงตอนเที่ยงค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Good. Are you facing any problems right now?",
                    "กู๊ด อาร์ ยู เฟ-ซิ่ง เอ-นี่ พรอบ-เล็มส์ ไรท์ นาว",
                    "ดีค่ะ ตอนนี้เจอปัญหาอะไรอยู่ไหม",
                ),
                "options": [
                    opt("No, I'm making good progress.", "โน แอม เม-กิ่ง กู๊ด พรอ-เกรส", "ไม่มีค่ะ ตอนนี้คืบหน้าไปด้วยดี", True, "n3a"),
                    opt("I'm running a bit behind schedule.", "แอม รัน-นิ่ง อะ บิท บิ-ไฮนด์ สเก็ด-จูล", "ตอนนี้ฉันช้ากว่ากำหนดนิดหน่อยค่ะ", True, "n3a"),
                    opt("I really enjoy hiking on weekends.", "ไอ เรียล-ลี่ เอน-จอย ไฮ-กิ่ง ออน วีค-เอนด์ส", "ฉันชอบไปเดินป่าช่วงสุดสัปดาห์ค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Alright, keep me posted. Thanks for the update.",
                    "ออล-ไรท์ คีพ มี โพส-ทิด แธงค์ส ฟอร์ ดิ อัพ-เดท",
                    "โอเคค่ะ อัพเดทให้ทราบเรื่อยๆ นะ ขอบคุณสำหรับข้อมูล",
                ),
                "options": [
                    opt("Sure, I'll let you know tomorrow.", "ชัวร์ ไอล์ เล็ท ยู โนว์ ทู-มอร์-โรว์", "ได้ค่ะ พรุ่งนี้จะแจ้งให้ทราบนะคะ", True),
                    opt("I'm currently drafting the summary too.", "แอม เคอ-เรินท์-ลี่ แดรฟ-ติ่ง เดอะ ซัม-มา-รี่ ทู", "ตอนนี้ฉันกำลังร่างสรุปด้วยค่ะ", True),
                    opt("The coffee here is too strong.", "เดอะ คอฟ-ฟี่ เฮียร์ อีส ทู สตรอง", "กาแฟที่นี่เข้มไปหน่อยค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "I see. Are you doing anything else while you wait?",
                    "ไอ ซี อาร์ ยู ดู-อิ่ง เอ-นี่-ธิ่ง เอลส์ ไวล์ ยู เวท",
                    "เข้าใจแล้วค่ะ ระหว่างรอมีทำอย่างอื่นด้วยไหม",
                ),
                "options": [
                    opt("Yes, I'm preparing the next phase in the meantime.", "เยส แอม พรี-แพ-ริ่ง เดอะ เน็กซท์ เฟส อิน เดอะ มีน-ไทม์", "ค่ะ ระหว่างนี้ฉันกำลังเตรียมเฟสถัดไปอยู่", True, "n3b"),
                    opt("I'm following up with the client every two days.", "แอม ฟอล-โล-อิ่ง อัพ วิธ เดอะ ไคลเอินท์ เอฟ-รี่ ทู เดย์ส", "ฉันกำลังติดตามลูกค้าทุกสองวันค่ะ", True, "n3b"),
                    opt("I forgot to bring my umbrella.", "ไอ ฟอร์-กอท ทู บริง มาย อัม-เบรล-ล่า", "ฉันลืมเอาร่มมาค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "Good thinking. Please update me once you hear back.",
                    "กู๊ด ธิงค์-กิ่ง พลีส อัพ-เดท มี วันซ์ ยู เฮียร์ แบ็ค",
                    "คิดได้ดีค่ะ พอได้คำตอบแล้วช่วยแจ้งฉันด้วยนะ",
                ),
                "options": [
                    opt("Of course, I'll let you know right away.", "ออฟ คอร์ส ไอล์ เล็ท ยู โนว์ ไรท์ อะ-เวย์", "ได้เลยค่ะ พอรู้จะแจ้งทันที", True),
                    opt("I'm also updating the shared document now.", "แอม ออล-โซ อัพ-เด-ทิ่ง เดอะ แชร์ด ด็อค-คิว-เมนท์ นาว", "ตอนนี้ฉันกำลังอัพเดทเอกสารที่แชร์ไว้ด้วยค่ะ", True),
                    opt("I don't like spicy food.", "ไอ โด้นท์ ไลค์ สไป-ซี่ ฟู้ด", "ฉันไม่ชอบอาหารเผ็ดค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "ask-colleague-help",
        "title": "การขอให้เพื่อนร่วมงานช่วยเหลือ",
        "emoji": "🙋",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Hey, you look busy. What's up?",
                    "เฮย์ ยู ลุค บิ-ซี่ วอทส์ อัพ",
                    "เฮ้ ดูยุ่งๆ นะ มีอะไรเหรอ",
                ),
                "options": [
                    opt("Do you have a minute to help me with this file?", "ดู ยู แฮฟ อะ มิ-นิท ทู เฮลพ์ มี วิธ ดิส ไฟล์", "คุณมีเวลาสักครู่ช่วยฉันดูไฟล์นี้ไหม", True, "n2a"),
                    opt("Do you have experience with this software?", "ดู ยู แฮฟ เอ็กซ์-พี-เรียนซ์ วิธ ดิส ซอฟท์-แวร์", "คุณมีประสบการณ์ใช้ซอฟต์แวร์นี้ไหม", True, "n2b"),
                    opt("I have a new phone.", "ไอ แฮฟ อะ นิว โฟน", "ฉันมีโทรศัพท์เครื่องใหม่", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Sure, what seems to be the problem?",
                    "ชัวร์ วอท ซีมส์ ทู บี เดอะ พรอบ-เล็ม",
                    "ได้เลย มีปัญหาอะไรเหรอ",
                ),
                "options": [
                    opt("I don't have the right format for this table.", "ไอ โด้นท์ แฮฟ เดอะ ไรท์ ฟอร์-แมท ฟอร์ ดิส เท-เบิล", "ฉันไม่มีรูปแบบตารางที่ถูกต้องค่ะ", True, "n3a"),
                    opt("I have some numbers that don't match.", "ไอ แฮฟ ซัม นัม-เบอร์ส แดท โด้นท์ แมทช์", "ฉันมีตัวเลขบางส่วนที่ไม่ตรงกันค่ะ", True, "n3a"),
                    opt("I have three cats at home.", "ไอ แฮฟ ธรี แคทส์ แอท โฮม", "ฉันมีแมวสามตัวที่บ้าน", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Ah, I see it now. Let's fix it together.",
                    "อาห์ ไอ ซี อิท นาว เล็ทส์ ฟิกซ์ อิท ทู-เก-เธอร์",
                    "อ๋อ เห็นแล้วค่ะ มาแก้ด้วยกันนะ",
                ),
                "options": [
                    opt("Thank you so much, I really appreciate it.", "แธงค์ ยู โซ มัช ไอ เรียล-ลี่ แอพ-พรี-ชี-เอท อิท", "ขอบคุณมากเลยค่ะ ซาบซึ้งใจจริงๆ", True),
                    opt("Do you have time tomorrow to check it again?", "ดู ยู แฮฟ ไทม์ ทู-มอร์-โรว์ ทู เช็ค อิท อะ-เกน", "พรุ่งนี้มีเวลาช่วยเช็คให้อีกครั้งไหมคะ", True),
                    opt("I have a headache today.", "ไอ แฮฟ อะ เฮด-เอค ทู-เดย์", "วันนี้ฉันปวดหัวค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "Yes, I use it every day. What do you need to know?",
                    "เยส ไอ ยูส อิท เอฟ-ริ เดย์ วอท ดู ยู นีด ทู โนว์",
                    "ค่ะ ฉันใช้ทุกวันเลย อยากรู้อะไรเหรอ",
                ),
                "options": [
                    opt("I don't have access to this feature.", "ไอ โด้นท์ แฮฟ แอค-เซส ทู ดิส ฟี-เชอร์", "ฉันไม่มีสิทธิ์เข้าถึงฟีเจอร์นี้ค่ะ", True, "n3b"),
                    opt("I don't have a clear idea how to export this.", "ไอ โด้นท์ แฮฟ อะ เคลียร์ ไอ-เดีย ฮาว ทู เอ็ก-สปอร์ท ดิส", "ฉันไม่รู้วิธีเอ็กซ์พอร์ตไฟล์นี้ค่ะ", True, "n3b"),
                    opt("I have a meeting at noon.", "ไอ แฮฟ อะ มี-ทิ่ง แอท นูน", "ฉันมีประชุมตอนเที่ยงค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "No problem, let me show you step by step.",
                    "โน พรอบ-เล็ม เล็ท มี โชว์ ยู สเต็พ บาย สเต็พ",
                    "ไม่มีปัญหาเลย เดี๋ยวสอนทีละขั้นตอนนะ",
                ),
                "options": [
                    opt("That would be great, thank you.", "แดท วุด บี เกรท แธงค์ ยู", "ดีเลยค่ะ ขอบคุณมากนะ", True),
                    opt("Do you have a few extra minutes for this?", "ดู ยู แฮฟ อะ ฟิว เอ็กซ์-ทรา มิ-นิทส์ ฟอร์ ดิส", "มีเวลาว่างอีกสักหน่อยไหมคะ", True),
                    opt("I have a big dog at home.", "ไอ แฮฟ อะ บิก ดอก แอท โฮม", "ฉันมีหมาตัวใหญ่ที่บ้านค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "respond-to-feedback",
        "title": "การตอบรับข้อเสนอแนะ",
        "emoji": "💬",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "I reviewed your report. I have some feedback for you.",
                    "ไอ รี-วิว ยัวร์ รี-พอร์ท ไอ แฮฟ ซัม ฟีด-แบ็ค ฟอร์ ยู",
                    "ฉันตรวจรายงานของคุณแล้ว มีข้อเสนอแนะให้นิดหน่อย",
                ),
                "options": [
                    opt("Thanks, I appreciated your comments yesterday too.", "แธงค์ส ไอ แอพ-พรี-ชี-เอ-ทิด ยัวร์ คอม-เมนท์ส เยส-เทอร์-เดย์ ทู", "ขอบคุณค่ะ เมื่อวานฉันก็ซาบซึ้งกับความเห็นของคุณเหมือนกัน", True, "n2a"),
                    opt("Sure, I fixed the numbers you mentioned last week.", "ชัวร์ ไอ ฟิกซ์ด เดอะ นัม-เบอร์ส ยู เมน-ชั่นด์ ลาสท์ วีค", "ได้ค่ะ ฉันแก้ตัวเลขที่คุณพูดถึงเมื่อสัปดาห์ก่อนแล้ว", True, "n2b"),
                    opt("I watched a movie last night.", "ไอ วอทช์ท อะ มู-วี่ ลาสท์ ไนท์", "เมื่อคืนฉันดูหนังมาค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Good. I noticed the summary was a bit unclear.",
                    "กู๊ด ไอ โน-ทิสท์ เดอะ ซัม-มา-รี่ วอส อะ บิท อัน-เคลียร์",
                    "ดีค่ะ ฉันสังเกตว่าส่วนสรุปยังไม่ค่อยชัดเจน",
                ),
                "options": [
                    opt("I wrote it quickly, so I'll revise it today.", "ไอ โรท อิท ควิค-ลี่ โซ ไอล์ รี-ไวส์ อิท ทู-เดย์", "ฉันเขียนเร็วไปหน่อยค่ะ วันนี้จะแก้ไขให้", True, "n3a"),
                    opt("I finished that section last, so I rushed it.", "ไอ ฟิ-นิชท์ แดท เซ็ค-ชั่น ลาสท์ โซ ไอ รัชท์ อิท", "ฉันทำส่วนนั้นเสร็จทีหลัง เลยรีบไปหน่อยค่ะ", True, "n3a"),
                    opt("I like tea more than coffee.", "ไอ ไลค์ ที มอร์ แดน คอฟ-ฟี่", "ฉันชอบชามากกว่ากาแฟค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "That's understandable. Thanks for taking the feedback well.",
                    "แดทส์ อัน-เดอร์-สแทน-ดะ-เบิล แธงค์ส ฟอร์ เท-กิ่ง เดอะ ฟีด-แบ็ค เวล",
                    "เข้าใจได้ค่ะ ขอบคุณที่รับฟังข้อเสนอแนะด้วยดีนะ",
                ),
                "options": [
                    opt("Thank you, I always try to improve.", "แธงค์ ยู ไอ ออล-เวส์ ทราย ทู อิม-พรูฟ", "ขอบคุณค่ะ ฉันพยายามพัฒนาตัวเองเสมอ", True),
                    opt("I finished the revision this afternoon.", "ไอ ฟิ-นิชท์ เดอะ รี-วิ-ชั่น ดิส แอฟ-เทอร์-นูน", "บ่ายนี้ฉันแก้ไขเสร็จแล้วค่ะ", True),
                    opt("I lived in Chiang Mai for two years.", "ไอ ลิฟด์ อิน เชียง ไม ฟอร์ ทู เยียร์ส", "ฉันเคยอยู่เชียงใหม่สองปีค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "Perfect. I also checked the new version this morning.",
                    "เพอร์-เฟ็คท์ ไอ ออล-โซ เช็คท์ เดอะ นิว เวอร์-ชั่น ดิส มอร์-นิ่ง",
                    "เยี่ยมเลยค่ะ เมื่อเช้าฉันก็ตรวจเวอร์ชันใหม่ไปแล้วด้วย",
                ),
                "options": [
                    opt("Great, I double-checked it myself too.", "เกรท ไอ ดับ-เบิล-เช็คท์ อิท มาย-เซลฟ์ ทู", "เยี่ยมค่ะ ฉันก็เช็คซ้ำด้วยตัวเองแล้วเหมือนกัน", True, "n3b"),
                    opt("I asked a colleague to review it as well.", "ไอ อาสค์ท อะ คอล-ลีก ทู รี-วิว อิท แอส เวล", "ฉันให้เพื่อนร่วมงานช่วยตรวจด้วยค่ะ", True, "n3b"),
                    opt("I bought new shoes yesterday.", "ไอ บอท นิว ชูส์ เยส-เทอร์-เดย์", "เมื่อวานฉันซื้อรองเท้าคู่ใหม่มาค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "Excellent work. I'm happy with the changes.",
                    "เอ็ก-เซล-เลินท์ เวิร์ค แอม แฮพ-พี วิธ เดอะ เชนจ์-เจส",
                    "ทำได้ดีมากเลยค่ะ ฉันพอใจกับการแก้ไขนี้",
                ),
                "options": [
                    opt("Thank you, that means a lot.", "แธงค์ ยู แดท มีนส์ อะ ลอท", "ขอบคุณค่ะ มีความหมายกับฉันมากเลย", True),
                    opt("I really learned a lot from your feedback.", "ไอ เรียล-ลี่ เลิร์นด์ อะ ลอท ฟรอม ยัวร์ ฟีด-แบ็ค", "ฉันได้เรียนรู้อะไรเยอะมากจากข้อเสนอแนะของคุณค่ะ", True),
                    opt("I forgot my badge at home.", "ไอ ฟอร์-กอท มาย แบดจ์ แอท โฮม", "ฉันลืมบัตรพนักงานไว้ที่บ้านค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "clarify-deadline",
        "title": "การสอบถามและยืนยันกำหนดส่งงาน",
        "emoji": "⏰",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Just checking, when is this task due?",
                    "จัสท์ เช็ค-กิ่ง เวน อีส ดิส ทาสค์ ดิว",
                    "ขอถามหน่อยค่ะ งานนี้กำหนดส่งเมื่อไหร่",
                ),
                "options": [
                    opt("If you finish it by Friday, that will be perfect.", "อิฟ ยู ฟิ-นิช อิท บาย ไฟร-เดย์ แดท วิล บี เพอร์-เฟ็คท์", "ถ้าคุณทำเสร็จภายในวันศุกร์ก็จะดีมากเลย", True, "n2a"),
                    opt("If it's not urgent, next Monday is fine too.", "อิฟ อิทส์ นอท เออร์-เจนท์ เน็กซท์ มัน-เดย์ อีส ไฟน์ ทู", "ถ้าไม่เร่งด่วน วันจันทร์หน้าก็ได้เหมือนกัน", True, "n2b"),
                    opt("The office plants need more water.", "ดิ ออฟ-ฟิส แพลนท์ส นีด มอร์ วอ-เทอร์", "ต้นไม้ในออฟฟิศต้องการน้ำเพิ่มค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Okay. If I finish it early, I'll send it to you right away.",
                    "โอ-เค อิฟ ไอ ฟิ-นิช อิท เอิร์ล-ลี่ ไอล์ เซนด์ อิท ทู ยู ไรท์ อะ-เวย์",
                    "โอเคค่ะ ถ้าฉันทำเสร็จก่อน จะส่งให้ทันทีเลย",
                ),
                "options": [
                    opt("If you need more time, just let me know.", "อิฟ ยู นีด มอร์ ไทม์ จัสท์ เล็ท มี โนว์", "ถ้าต้องการเวลาเพิ่ม บอกฉันได้เลยนะ", True, "n3a"),
                    opt("If there's any problem, I'll help you right away.", "อิฟ แดร์ส เอ-นี่ พรอบ-เล็ม ไอล์ เฮลพ์ ยู ไรท์ อะ-เวย์", "ถ้ามีปัญหาอะไร ฉันจะช่วยทันทีเลยค่ะ", True, "n3a"),
                    opt("I like the new office chairs.", "ไอ ไลค์ เดอะ นิว ออฟ-ฟิส แชร์ส", "ฉันชอบเก้าอี้ออฟฟิศตัวใหม่ค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Thanks, I'll do my best to meet the deadline.",
                    "แธงค์ส ไอล์ ดู มาย เบสท์ ทู มีท เดอะ เด้ด-ไลน์",
                    "ขอบคุณค่ะ ฉันจะพยายามอย่างเต็มที่ให้ทันกำหนดส่ง",
                ),
                "options": [
                    opt("Great, I trust you.", "เกรท ไอ ทรัสท์ ยู", "เยี่ยมเลยค่ะ ฉันเชื่อใจคุณนะ", True),
                    opt("If anything changes, I'll update you first.", "อิฟ เอ-นี่-ธิ่ง เชนจ์-เจส ไอล์ อัพ-เดท ยู เฟิร์สท์", "ถ้ามีอะไรเปลี่ยนแปลง ฉันจะแจ้งคุณก่อนเลยค่ะ", True),
                    opt("The parking lot is full today.", "เดอะ พาร์-กิ้ง ลอท อีส ฟูล ทู-เดย์", "วันนี้ที่จอดรถเต็มค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "Sounds good. If your plans change, please tell me.",
                    "เซาน์ดส์ กู๊ด อิฟ ยัวร์ แพลนส์ เชนจ์ พลีส เทล มี",
                    "ฟังดูดีค่ะ ถ้าแผนของคุณเปลี่ยน ช่วยบอกฉันด้วยนะ",
                ),
                "options": [
                    opt("If I finish it sooner, I'll let you know.", "อิฟ ไอ ฟิ-นิช อิท ซู-เนอร์ ไอล์ เล็ท ยู โนว์", "ถ้าฉันทำเสร็จเร็วกว่านั้น จะแจ้งให้ทราบค่ะ", True, "n3b"),
                    opt("If Monday isn't enough, I'll ask for one more day.", "อิฟ มัน-เดย์ อิสซึ่นท์ อี-นัฟ ไอล์ อาสค์ ฟอร์ วัน มอร์ เดย์", "ถ้าวันจันทร์ไม่พอ ฉันจะขอเพิ่มอีกหนึ่งวันค่ะ", True, "n3b"),
                    opt("I forgot to lock my desk drawer.", "ไอ ฟอร์-กอท ทู ล็อค มาย เดสค์ ดรอ-เออร์", "ฉันลืมล็อกลิ้นชักโต๊ะทำงานค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "That works for me. Thanks for the clear plan.",
                    "แดท เวิร์คส์ ฟอร์ มี แธงค์ส ฟอร์ เดอะ เคลียร์ แพลน",
                    "โอเคเลยค่ะ ขอบคุณที่วางแผนไว้ชัดเจนนะ",
                ),
                "options": [
                    opt("No problem, thanks for understanding.", "โน พรอบ-เล็ม แธงค์ส ฟอร์ อัน-เดอร์-สแทน-ดิ่ง", "ไม่เป็นไรค่ะ ขอบคุณที่เข้าใจนะ", True),
                    opt("If I need help, I'll ask you first.", "อิฟ ไอ นีด เฮลพ์ ไอล์ อาสค์ ยู เฟิร์สท์", "ถ้าฉันต้องการความช่วยเหลือ จะขอคุณก่อนเลยค่ะ", True),
                    opt("The vending machine is out of order.", "เดอะ เวน-ดิ่ง มะ-ชีน อีส เอาท์ ออฟ ออร์-เดอร์", "ตู้กดเครื่องดื่มเสียค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "coworker-smalltalk",
        "title": "การพูดคุยเล็กๆ น้อยๆ กับเพื่อนร่วมงาน",
        "emoji": "☕",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Good morning! Do you usually get coffee before work?",
                    "กู๊ด มอร์-นิ่ง ดู ยู ยู-ชวล-ลี่ เก็ท คอฟ-ฟี่ บิ-ฟอร์ เวิร์ค",
                    "อรุณสวัสดิ์ค่ะ ปกติคุณซื้อกาแฟก่อนมาทำงานไหม",
                ),
                "options": [
                    opt("Yes, I usually stop by the cafe downstairs.", "เยส ไอ ยู-ชวล-ลี่ สทอพ บาย เดอะ คา-เฟ่ ดาวน์-สแตร์ส", "ค่ะ ปกติฉันแวะร้านกาแฟชั้นล่างก่อนค่ะ", True, "n2a"),
                    opt("I usually make coffee at my desk instead.", "ไอ ยู-ชวล-ลี่ เมค คอฟ-ฟี่ แอท มาย เดสค์ อิน-สเทด", "ปกติฉันชงกาแฟกินที่โต๊ะทำงานแทนค่ะ", True, "n2b"),
                    opt("I don't have a car.", "ไอ โด้นท์ แฮฟ อะ คาร์", "ฉันไม่มีรถค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Nice! What do you usually order there?",
                    "ไนซ์ วอท ดู ยู ยู-ชวล-ลี่ ออร์-เดอร์ แดร์",
                    "ดีจังค่ะ ปกติสั่งอะไรที่ร้านนั้นเหรอ",
                ),
                "options": [
                    opt("I usually order a latte with less sugar.", "ไอ ยู-ชวล-ลี่ ออร์-เดอร์ อะ ลา-เต้ วิธ เลส ชู-การ์", "ปกติฉันสั่งลาเต้หวานน้อยค่ะ", True, "n3a"),
                    opt("I usually try something new every week.", "ไอ ยู-ชวล-ลี่ ทราย ซัม-ธิ่ง นิว เอฟ-ริ วีค", "ปกติฉันลองอะไรใหม่ๆ ทุกสัปดาห์เลยค่ะ", True, "n3a"),
                    opt("I go to the gym every night.", "ไอ โก ทู เดอะ จิม เอฟ-ริ ไนท์", "ฉันไปยิมทุกคืนค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Sounds great, maybe I'll join you sometime.",
                    "เซาน์ดส์ เกรท เมย์บี ไอล์ จอยน์ ยู ซัม-ไทม์",
                    "ฟังดูดีเลยค่ะ ไว้วันหลังขอไปด้วยนะ",
                ),
                "options": [
                    opt("Sure, I usually go around 8am.", "ชัวร์ ไอ ยู-ชวล-ลี่ โก อะ-ราวนด์ เอท เอเอ็ม", "ได้เลยค่ะ ปกติฉันไปประมาณแปดโมงเช้า", True),
                    opt("That would be fun!", "แดท วุด บี ฟัน", "สนุกแน่เลยค่ะ", True),
                    opt("My computer restarted this morning.", "มาย คอม-พิว-เทอร์ รี-สตาร์ท-ทิด ดิส มอร์-นิ่ง", "เมื่อเช้าคอมพิวเตอร์ของฉันรีสตาร์ทค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "That's nice. Does your desk have a coffee maker?",
                    "แดทส์ ไนซ์ ดัส ยัวร์ เดสค์ แฮฟ อะ คอฟ-ฟี่ เม-เคอร์",
                    "ดีจังค่ะ ที่โต๊ะคุณมีเครื่องชงกาแฟด้วยเหรอ",
                ),
                "options": [
                    opt("Yes, I bring a small one from home.", "เยส ไอ บริง อะ สมอล วัน ฟรอม โฮม", "ค่ะ ฉันเอาเครื่องเล็กๆ มาจากบ้านค่ะ", True, "n3b"),
                    opt("I usually just use the pantry instead.", "ไอ ยู-ชวล-ลี่ จัสท์ ยูส เดอะ แพน-ทรี่ อิน-สเทด", "ปกติฉันใช้ห้องครัวออฟฟิศแทนค่ะ", True, "n3b"),
                    opt("I have two brothers.", "ไอ แฮฟ ทู บรา-เธอร์ส", "ฉันมีพี่ชายสองคนค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "That's a good idea, I might try that too.",
                    "แดทส์ อะ กู๊ด ไอ-เดีย ไอ ไมท์ ทราย แดท ทู",
                    "ไอเดียดีเลยค่ะ ฉันอาจจะลองทำแบบนั้นบ้าง",
                ),
                "options": [
                    opt("You should! It's very convenient.", "ยู ชุด อิทส์ เว-รี่ คอน-วี-เนียนท์", "ลองดูเลยค่ะ สะดวกมากเลยนะ", True),
                    opt("I usually clean it every Friday.", "ไอ ยู-ชวล-ลี่ คลีน อิท เอฟ-ริ ไฟร-เดย์", "ปกติฉันทำความสะอาดมันทุกวันศุกร์ค่ะ", True),
                    opt("The elevator is broken today.", "ดิ เอล-ลิ-เว-เทอร์ อีส โบร-เคน ทู-เดย์", "วันนี้ลิฟต์เสียค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "report-problem-manager",
        "title": "การรายงานปัญหาให้หัวหน้าทราบ",
        "emoji": "🚩",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "You wanted to see me? What's going on?",
                    "ยู วอน-ทิด ทู ซี มี วอทส์ โก-อิ่ง ออน",
                    "อยากพบฉันเหรอคะ มีอะไรเหรอ",
                ),
                "options": [
                    opt("If the server overloads, it shuts down automatically.", "อิฟ เดอะ เซิร์ฟ-เวอร์ โอ-เวอร์-โหลดส์ อิท ชัทส์ ดาวน์ ออ-โท-แมท-ทิค-เคิล-ลี่", "ถ้าเซิร์ฟเวอร์โหลดหนักเกินไป มันจะปิดตัวเองอัตโนมัติค่ะ", True, "n2a"),
                    opt("If we don't fix this today, the client will be upset.", "อิฟ วี โด้นท์ ฟิกซ์ ดิส ทู-เดย์ เดอะ ไคลเอินท์ วิล บี อัพ-เซท", "ถ้าเราไม่แก้วันนี้ ลูกค้าจะไม่พอใจแน่ค่ะ", True, "n2b"),
                    opt("I really like this office building.", "ไอ เรียล-ลี่ ไลค์ ดิส ออฟ-ฟิส บิล-ดิ่ง", "ฉันชอบตึกออฟฟิศนี้มากเลยค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "That sounds serious. How often does it happen?",
                    "แดท เซาน์ดส์ ซี-เรียส ฮาว ออฟ-เฟิ่น ดัส อิท แฮพ-เพิ่น",
                    "ฟังดูจริงจังนะคะ เกิดขึ้นบ่อยแค่ไหน",
                ),
                "options": [
                    opt("If too many users log in, it happens every day.", "อิฟ ทู เม-นี่ ยู-เซอร์ส ล็อก อิน อิท แฮพ-เพิ่นส์ เอฟ-ริ เดย์", "ถ้ามีผู้ใช้ล็อกอินเยอะเกินไป มันเกิดขึ้นทุกวันเลยค่ะ", True, "n3a"),
                    opt("If it's peak hours, it happens almost every time.", "อิฟ อิทส์ พีค อาว-เออร์ส อิท แฮพ-เพิ่นส์ ออล-โมสท์ เอฟ-ริ ไทม์", "ถ้าเป็นช่วงชั่วโมงเร่งด่วน แทบจะเกิดขึ้นทุกครั้งเลยค่ะ", True, "n3a"),
                    opt("I had lunch at a new restaurant.", "ไอ แฮด ลันช์ แอท อะ นิว เรส-เทอ-รอนท์", "ฉันไปทานข้าวเที่ยงร้านใหม่มาค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Okay, I'll get the IT team involved right away.",
                    "โอ-เค ไอล์ เก็ท เดอะ ไอ-ที ทีม อิน-วอลฟด์ ไรท์ อะ-เวย์",
                    "โอเคค่ะ ฉันจะให้ทีมไอทีเข้ามาช่วยทันที",
                ),
                "options": [
                    opt("Thank you, I'll monitor it closely too.", "แธงค์ ยู ไอล์ มอน-นิ-เทอร์ อิท โคลส-ลี่ ทู", "ขอบคุณค่ะ ฉันจะคอยติดตามอย่างใกล้ชิดด้วยค่ะ", True),
                    opt("If it happens again, I'll report it immediately.", "อิฟ อิท แฮพ-เพิ่นส์ อะ-เกน ไอล์ รี-พอร์ท อิท อิม-มี-เดียท-ลี่", "ถ้าเกิดขึ้นอีก ฉันจะรายงานทันทีเลยค่ะ", True),
                    opt("I bought a new bag yesterday.", "ไอ บอท อะ นิว แบก เยส-เทอร์-เดย์", "เมื่อวานฉันซื้อกระเป๋าใบใหม่มาค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "I understand. What do you suggest we do?",
                    "ไอ อัน-เดอร์-สแทนด์ วอท ดู ยู ซัก-เจสท์ วี ดู",
                    "เข้าใจแล้วค่ะ คิดว่าเราควรทำยังไงดี",
                ),
                "options": [
                    opt("If we work overtime tonight, we can finish it.", "อิฟ วี เวิร์ค โอ-เวอร์-ไทม์ ทู-ไนท์ วี แคน ฟิ-นิช อิท", "ถ้าเราทำงานล่วงเวลาคืนนี้ เราจะทำเสร็จทันค่ะ", True, "n3b"),
                    opt("If you approve it, I'll ask two colleagues to help.", "อิฟ ยู อะ-พรูฟ อิท ไอล์ อาสค์ ทู คอล-ลีกส์ ทู เฮลพ์", "ถ้าคุณอนุมัติ ฉันจะขอเพื่อนร่วมงานอีกสองคนมาช่วยค่ะ", True, "n3b"),
                    opt("I enjoy watching movies on weekends.", "ไอ เอน-จอย วอทช์-อิ่ง มู-วีส์ ออน วีค-เอนด์ส", "ฉันชอบดูหนังช่วงสุดสัปดาห์ค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "Good plan, let's do that. Thanks for flagging this.",
                    "กู๊ด แพลน เล็ทส์ ดู แดท แธงค์ส ฟอร์ แฟล็ก-กิ่ง ดิส",
                    "แผนดีค่ะ ทำแบบนั้นเลย ขอบคุณที่แจ้งให้ทราบนะ",
                ),
                "options": [
                    opt("No problem, I'll keep you updated.", "โน พรอบ-เล็ม ไอล์ คีพ ยู อัพ-เด-ทิด", "ไม่เป็นไรค่ะ ฉันจะอัพเดทให้ทราบเรื่อยๆ", True),
                    opt("If anything else comes up, I'll let you know.", "อิฟ เอ-นี่-ธิ่ง เอลส์ คัมส์ อัพ ไอล์ เล็ท ยู โนว์", "ถ้ามีอะไรเพิ่มเติม ฉันจะแจ้งให้ทราบค่ะ", True),
                    opt("The vending machine ran out of snacks.", "เดอะ เวน-ดิ่ง มะ-ชีน แรน เอาท์ ออฟ สแนคส์", "ตู้ขายขนมของว่างหมดค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "follow-up-email",
        "title": "การติดตามผลทางอีเมล",
        "emoji": "📧",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Did you get a reply to the email you sent last week?",
                    "ดิด ยู เก็ท อะ รี-พลาย ทู ดิ อี-เมล ยู เซนท์ ลาสท์ วีค",
                    "อีเมลที่ส่งไปเมื่อสัปดาห์ก่อนได้รับคำตอบหรือยังคะ",
                ),
                "options": [
                    opt("Not yet. I will send a follow-up email today.", "นอท เยท ไอ วิล เซนด์ อะ ฟอล-โลว์-อัพ อี-เมล ทู-เดย์", "ยังเลยค่ะ วันนี้ฉันจะส่งอีเมลติดตามไป", True, "n2a"),
                    opt("Not yet. I will call them instead.", "นอท เยท ไอ วิล คอล เดม อิน-สเทด", "ยังเลยค่ะ ฉันจะโทรหาเขาแทนดีกว่า", True, "n2b"),
                    opt("I sent a package last month.", "ไอ เซนท์ อะ แพ็ค-เคจ ลาสท์ มันธ์", "เดือนที่แล้วฉันส่งพัสดุไปค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Good idea. What will you write in the email?",
                    "กู๊ด ไอ-เดีย วอท วิล ยู ไรท์ อิน ดิ อี-เมล",
                    "ไอเดียดีค่ะ จะเขียนอะไรในอีเมลบ้าง",
                ),
                "options": [
                    opt("I will politely ask for an update.", "ไอ วิล โพ-ไลท์-ลี่ อาสค์ ฟอร์ แอน อัพ-เดท", "ฉันจะสอบถามความคืบหน้าอย่างสุภาพค่ะ", True, "n3a"),
                    opt("I will attach the document again, just in case.", "ไอ วิล อะ-แทช เดอะ ด็อค-คิว-เมนท์ อะ-เกน จัสท์ อิน เคส", "ฉันจะแนบเอกสารไปอีกครั้งเผื่อไว้ค่ะ", True, "n3a"),
                    opt("I will buy a new laptop soon.", "ไอ วิล บาย อะ นิว แลป-ทอพ ซูน", "เร็วๆ นี้ฉันจะซื้อโน้ตบุ๊กเครื่องใหม่ค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "Sounds good. Let me know if you hear back.",
                    "เซาน์ดส์ กู๊ด เล็ท มี โนว์ อิฟ ยู เฮียร์ แบ็ค",
                    "ฟังดูดีค่ะ ถ้าได้รับคำตอบแล้วบอกฉันด้วยนะ",
                ),
                "options": [
                    opt("I will, as soon as they reply.", "ไอ วิล แอส ซูน แอส เดย์ รี-พลาย", "ได้ค่ะ พอเขาตอบกลับมาจะแจ้งทันที", True),
                    opt("I will forward their reply to you too.", "ไอ วิล ฟอร์-เวิร์ด แดร์ รี-พลาย ทู ยู ทู", "ฉันจะส่งต่อคำตอบให้คุณด้วยค่ะ", True),
                    opt("I will visit my parents this weekend.", "ไอ วิล วิ-สิท มาย แพ-เรินท์ส ดิส วีค-เอนด์", "สุดสัปดาห์นี้ฉันจะไปหาพ่อแม่ค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "Okay. Do you have their phone number?",
                    "โอ-เค ดู ยู แฮฟ แดร์ โฟน นัม-เบอร์",
                    "โอเคค่ะ คุณมีเบอร์โทรของเขาไหม",
                ),
                "options": [
                    opt("Yes, I will call right after this meeting.", "เยส ไอ วิล คอล ไรท์ อาฟ-เตอร์ ดิส มี-ทิ่ง", "มีค่ะ ฉันจะโทรทันทีหลังประชุมนี้เสร็จ", True, "n3b"),
                    opt("I will ask my manager for it first.", "ไอ วิล อาสค์ มาย แม-เนเจอร์ ฟอร์ อิท เฟิร์สท์", "ฉันจะขอเบอร์จากหัวหน้าก่อนค่ะ", True, "n3b"),
                    opt("I will cook dinner tonight.", "ไอ วิล คุค ดิน-เนอร์ ทู-ไนท์", "คืนนี้ฉันจะทำอาหารเย็นเองค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "Great, please update me after the call.",
                    "เกรท พลีส อัพ-เดท มี อาฟ-เตอร์ เดอะ คอล",
                    "เยี่ยมเลยค่ะ พอโทรเสร็จช่วยอัพเดทฉันด้วยนะ",
                ),
                "options": [
                    opt("I will, right after I hang up.", "ไอ วิล ไรท์ อาฟ-เตอร์ ไอ แฮง อัพ", "ได้ค่ะ พอวางสายจะแจ้งทันทีเลย", True),
                    opt("I will send you a short summary too.", "ไอ วิล เซนด์ ยู อะ ชอร์ท ซัม-มา-รี่ ทู", "ฉันจะส่งสรุปสั้นๆ ให้คุณด้วยค่ะ", True),
                    opt("I will take the bus home today.", "ไอ วิล เทค เดอะ บัส โฮม ทู-เดย์", "วันนี้ฉันจะนั่งรถเมล์กลับบ้านค่ะ", False),
                ],
            },
        },
    },
    {
        "id": "welcome-new-colleague",
        "title": "การต้อนรับพนักงานใหม่",
        "emoji": "🎊",
        "group": "office_communication",
        "start": "n1",
        "nodes": {
            "n1": {
                "system": line(
                    "Welcome to the team! Let me show you around.",
                    "เวล-คัม ทู เดอะ ทีม เล็ท มี โชว์ ยู อะ-ราวนด์",
                    "ยินดีต้อนรับเข้าทีมค่ะ เดี๋ยวฉันพาไปดูรอบๆ นะ",
                ),
                "options": [
                    opt("Thanks! Is there a place to keep my things?", "แธงค์ส อีส แดร์ อะ เพลส ทู คีพ มาย ธิ่งส์", "ขอบคุณค่ะ มีที่เก็บของส่วนตัวไหมคะ", True, "n2a"),
                    opt("Thanks! Is there a manual I should read first?", "แธงค์ส อีส แดร์ อะ แมน-นวล ไอ ชุด รีด เฟิร์สท์", "ขอบคุณค่ะ มีคู่มือที่ควรอ่านก่อนไหมคะ", True, "n2b"),
                    opt("There is a park near my house.", "แดร์ อีส อะ พาร์ค เนียร์ มาย เฮาส์", "มีสวนสาธารณะใกล้บ้านฉันค่ะ", False),
                ],
            },
            "n2a": {
                "system": line(
                    "Yes, there is a locker for every new employee.",
                    "เยส แดร์ อีส อะ ลอค-เกอร์ ฟอร์ เอฟ-ริ นิว เอม-พลอย-อี",
                    "มีค่ะ มีล็อกเกอร์สำหรับพนักงานใหม่ทุกคนเลย",
                ),
                "options": [
                    opt("Great, is there a key I need to keep safe?", "เกรท อีส แดร์ อะ คี ไอ นีด ทู คีพ เซฟ", "เยี่ยมเลยค่ะ มีกุญแจที่ต้องเก็บให้ดีไหม", True, "n3a"),
                    opt("Is there someone I should ask for the code?", "อีส แดร์ ซัม-วัน ไอ ชุด อาสค์ ฟอร์ เดอะ โค้ด", "ต้องถามรหัสจากใครคะ", True, "n3a"),
                    opt("There is a coffee shop across the street.", "แดร์ อีส อะ คอฟ-ฟี่ ช็อพ อะ-ครอส เดอะ สตรีท", "มีร้านกาแฟอยู่ฝั่งตรงข้ามถนนค่ะ", False),
                ],
            },
            "n3a": {
                "system": line(
                    "There is a key, and I'll help you set it up now.",
                    "แดร์ อีส อะ คี แอนด์ ไอล์ เฮลพ์ ยู เซ็ท อิท อัพ นาว",
                    "มีกุญแจค่ะ เดี๋ยวฉันช่วยจัดการให้เลยตอนนี้",
                ),
                "options": [
                    opt("Thank you, that's very kind of you.", "แธงค์ ยู แดทส์ เว-รี่ ไคนด์ ออฟ ยู", "ขอบคุณมากค่ะ ใจดีมากเลย", True),
                    opt("Is there anything else I should know today?", "อีส แดร์ เอ-นี่-ธิ่ง เอลส์ ไอ ชุด โนว์ ทู-เดย์", "มีอะไรอีกที่ควรรู้วันนี้ไหมคะ", True),
                    opt("There are many restaurants downtown.", "แดร์ อาร์ เม-นี่ เรส-เทอ-รอนท์ส ดาวน์-ทาวน์", "มีร้านอาหารเยอะแยะในตัวเมืองค่ะ", False),
                ],
            },
            "n2b": {
                "system": line(
                    "Yes, there is a short handbook I'll send you.",
                    "เยส แดร์ อีส อะ ชอร์ท แฮนด์-บุค ไอล์ เซนด์ ยู",
                    "มีค่ะ มีคู่มือสั้นๆ ที่ฉันจะส่งให้",
                ),
                "options": [
                    opt("Thank you, is there anyone I should meet first?", "แธงค์ ยู อีส แดร์ เอ-นี่-วัน ไอ ชุด มีท เฟิร์สท์", "ขอบคุณค่ะ มีใครที่ควรไปทักทายก่อนไหมคะ", True, "n3b"),
                    opt("Is there a deadline to finish reading it?", "อีส แดร์ อะ เด้ด-ไลน์ ทู ฟิ-นิช รี-ดิ่ง อิท", "มีกำหนดเวลาต้องอ่านให้จบไหมคะ", True, "n3b"),
                    opt("There is a printer on every floor.", "แดร์ อีส อะ พริน-เทอร์ ออน เอฟ-ริ ฟลอร์", "มีเครื่องพิมพ์อยู่ทุกชั้นค่ะ", False),
                ],
            },
            "n3b": {
                "system": line(
                    "There is no rush, take your time to settle in.",
                    "แดร์ อีส โน รัช เทค ยัวร์ ไทม์ ทู เซ็ท-เทิล อิน",
                    "ไม่ต้องรีบค่ะ ค่อยๆ ปรับตัวไปนะ",
                ),
                "options": [
                    opt("Thank you, I really appreciate that.", "แธงค์ ยู ไอ เรียล-ลี่ แอพ-พรี-ชี-เอท แดท", "ขอบคุณมากค่ะ ซาบซึ้งใจจริงๆ", True),
                    opt("Is there a team lunch I could join?", "อีส แดร์ อะ ทีม ลันช์ ไอ คุด จอยน์", "มีมื้อเที่ยงทีมที่ฉันร่วมได้ไหมคะ", True),
                    opt("There is a big storm coming this weekend.", "แดร์ อีส อะ บิก สตอร์ม คัม-มิ่ง ดิส วีค-เอนด์", "สุดสัปดาห์นี้จะมีพายุใหญ่เข้าค่ะ", False),
                ],
            },
        },
    },
]

with open(PATH, encoding="utf-8") as f:
    conversations = json.load(f)

existing_ids = {t["id"] for t in conversations}
added = []
for t in TOPICS:
    if t["id"] in existing_ids:
        raise SystemExit(f"Topic id {t['id']!r} already exists")
    conversations.append(t)
    added.append(t["id"])

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(conversations, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"Added {len(added)} office_communication topics:")
for tid in added:
    print(f"  {tid} -> pattern: {PATTERN_MAP[tid]}")
print(f"\nTotal conversation topics now: {len(conversations)}")
