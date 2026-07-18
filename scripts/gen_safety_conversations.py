#!/usr/bin/env python3
"""Phase 9: add 10 Safety Officer conversation topics to conversations.json."""
import json
import sys

sys.path.insert(0, "scripts")
from gen_thai_phonetics import compose  # noqa: E402

PATH = "src/data/conversations.json"
ALL_MISSING = set()


def th(text):
    ph, missing = compose(text)
    ALL_MISSING.update(missing)
    return ph


def sysline(text, thai):
    return {"text": text, "phonetic": th(text), "thai": thai}


def opt(text, thai, correct, next_=None):
    o = {"text": text, "phonetic": th(text), "thai": thai, "correct": correct}
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

# 1. Reporting a workplace accident to a supervisor
new_topics.append(topic(
    "report-accident", "การรายงานอุบัติเหตุในที่ทำงาน", "🚨",
    n1=dict(system=sysline("What happened? Is anyone injured?", "เกิดอะไรขึ้นคะ มีใครบาดเจ็บไหม"),
             options=[
                 opt("There was an accident near the machine.", "เกิดอุบัติเหตุใกล้เครื่องจักรค่ะ", True, "n2a"),
                 opt("It's just a small hazard, nothing serious.", "แค่มีสิ่งเสี่ยงเล็กน้อย ไม่ร้ายแรงค่ะ", True, "n2b"),
                 opt("I like the new safety helmet.", "ฉันชอบหมวกนิรภัยอันใหม่ค่ะ", False),
             ]),
    n2a=dict(system=sysline("Is the injury serious? Do we need an ambulance?", "บาดเจ็บหนักไหมคะ ต้องเรียกรถพยาบาลไหม"),
              options=[
                  opt("Yes, please call an ambulance now.", "ค่ะ กรุณาเรียกรถพยาบาลตอนนี้เลย", True, "n3"),
                  opt("No, it's just a bruise.", "ไม่ค่ะ แค่รอยฟกช้ำเอง", True, "n3"),
                  opt("The weather is nice today.", "วันนี้อากาศดีค่ะ", False),
              ]),
    n2b=dict(system=sysline("Okay. Please write an accident report anyway.", "โอเคค่ะ แต่ช่วยเขียนรายงานอุบัติเหตุด้วยนะคะ"),
              options=[
                  opt("Sure, I'll fill out the report.", "ได้ค่ะ ฉันจะกรอกรายงานเลย", True, "n3"),
                  opt("I already told the safety officer.", "ฉันบอกเจ้าหน้าที่ความปลอดภัยไปแล้วค่ะ", True, "n3"),
                  opt("I don't like paperwork.", "ฉันไม่ชอบงานเอกสารค่ะ", False),
              ]),
    n3=dict(system=sysline("What caused the accident?", "อะไรเป็นสาเหตุของอุบัติเหตุคะ"),
             options=[
                 opt("The floor was wet, it was a hazard.", "พื้นเปียก เป็นสิ่งเสี่ยงอันตรายค่ะ", True, "n4a"),
                 opt("The machine had no safety guard.", "เครื่องจักรไม่มีเครื่องป้องกันความปลอดภัยค่ะ", True, "n4b"),
                 opt("I forgot my lunch today.", "วันนี้ฉันลืมเอาข้าวกลางวันมาค่ะ", False),
             ]),
    n4a=dict(system=sysline("Thank you. We'll clean the area and add a warning sign.", "ขอบคุณค่ะ เราจะทำความสะอาดพื้นที่และติดป้ายเตือน"),
              options=[
                  opt("Thank you, that sounds good.", "ขอบคุณค่ะ ฟังดูดีเลย", True),
                  opt("Should I write a precaution note too?", "ฉันควรเขียนมาตรการป้องกันเพิ่มด้วยไหมคะ", True),
                  opt("I love spicy food.", "ฉันชอบอาหารเผ็ดค่ะ", False),
              ]),
    n4b=dict(system=sysline("Thank you. We'll fix the safety guard immediately.", "ขอบคุณค่ะ เราจะซ่อมเครื่องป้องกันทันที"),
              options=[
                  opt("Great, thank you for taking action.", "ดีเลยค่ะ ขอบคุณที่จัดการให้", True),
                  opt("Will you check the other machines too?", "จะตรวจเครื่องจักรอื่นด้วยไหมคะ", True),
                  opt("I need a new phone.", "ฉันต้องการโทรศัพท์เครื่องใหม่ค่ะ", False),
              ]),
))

# 2. Asking a coworker about how an injury happened
new_topics.append(topic(
    "ask-coworker-injury", "การถามเพื่อนร่วมงานเรื่องการบาดเจ็บ", "🤕",
    n1=dict(system=sysline("Are you okay? What happened to your arm?", "คุณไม่เป็นไรใช่ไหม แขนเป็นอะไรไปคะ"),
             options=[
                 opt("I have a fracture. I fell down the stairs.", "ฉันกระดูกหัก ตกบันไดมาค่ะ", True, "n2a"),
                 opt("It's just a bruise. I bumped into a shelf.", "แค่รอยฟกช้ำ ฉันชนชั้นวางของค่ะ", True, "n2b"),
                 opt("I finished my report yesterday.", "เมื่อวานฉันทำรายงานเสร็จแล้วค่ะ", False),
             ]),
    n2a=dict(system=sysline("That sounds serious. Did you see a doctor?", "ฟังดูรุนแรงเลยนะคะ ไปหาหมอหรือยัง"),
              options=[
                  opt("Yes, I went to the hospital for an X-ray.", "ไปแล้วค่ะ ไปโรงพยาบาลเพื่อเอกซเรย์", True, "n3"),
                  opt("Not yet, but I will go now.", "ยังค่ะ แต่ฉันจะไปตอนนี้เลย", True, "n3"),
                  opt("I like reading books.", "ฉันชอบอ่านหนังสือค่ะ", False),
              ]),
    n2b=dict(system=sysline("I'm glad it's not too bad. Do you need a bandage?", "ดีใจที่ไม่หนักมากนะคะ ต้องการผ้าพันแผลไหม"),
              options=[
                  opt("Yes, a bandage would help.", "ค่ะ ผ้าพันแผลช่วยได้ค่ะ", True, "n3"),
                  opt("No, I already used antiseptic.", "ไม่ค่ะ ฉันใช้ยาฆ่าเชื้อไปแล้ว", True, "n3"),
                  opt("I don't have any money.", "ฉันไม่มีเงินเลยค่ะ", False),
              ]),
    n3=dict(system=sysline("Please rest and take care of yourself.", "พักผ่อนและดูแลตัวเองด้วยนะคะ"),
             options=[
                 opt("Thank you, I will take a break.", "ขอบคุณค่ะ ฉันจะพักสักหน่อย", True, "n4a"),
                 opt("Should I report this injury to the safety officer?", "ฉันควรรายงานการบาดเจ็บนี้ให้เจ้าหน้าที่ความปลอดภัยไหมคะ", True, "n4b"),
                 opt("Let's go to the party tonight.", "ไปงานปาร์ตี้คืนนี้กันเถอะค่ะ", False),
             ]),
    n4a=dict(system=sysline("Good. Let me know if you need anything.", "ดีค่ะ บอกฉันนะถ้าต้องการอะไร"),
              options=[
                  opt("Thank you, I appreciate it.", "ขอบคุณค่ะ ซาบซึ้งใจมาก", True),
                  opt("I will call you if it gets worse.", "ฉันจะโทรหาถ้าอาการแย่ลงค่ะ", True),
                  opt("I love playing football.", "ฉันชอบเล่นฟุตบอลค่ะ", False),
              ]),
    n4b=dict(system=sysline("Yes, please report it. It helps prevent future accidents.", "ค่ะ ช่วยรายงานด้วยนะ จะช่วยป้องกันอุบัติเหตุในอนาคต"),
              options=[
                  opt("Okay, I'll fill out the form now.", "โอเคค่ะ ฉันจะกรอกแบบฟอร์มตอนนี้เลย", True),
                  opt("Understood, safety first.", "เข้าใจค่ะ ความปลอดภัยต้องมาก่อน", True),
                  opt("I don't like doctors.", "ฉันไม่ชอบหมอค่ะ", False),
              ]),
))

# 3. Reporting a near-miss incident
new_topics.append(topic(
    "near-miss", "การรายงานเหตุการณ์เกือบเกิดอุบัติเหตุ", "⚠️",
    n1=dict(system=sysline("You wanted to report something?", "คุณอยากรายงานอะไรบางอย่างใช่ไหมคะ"),
             options=[
                 opt("Yes, a box almost fell on someone near the shelf.", "ค่ะ มีกล่องเกือบตกใส่คนใกล้ชั้นวางของ", True, "n2a"),
                 opt("Yes, I saw a wire on the floor, it's a trip hazard.", "ค่ะ ฉันเห็นสายไฟบนพื้น เป็นสิ่งเสี่ยงให้สะดุด", True, "n2b"),
                 opt("I want to ask about my salary.", "ฉันอยากถามเรื่องเงินเดือนค่ะ", False),
             ]),
    n2a=dict(system=sysline("That's a serious near miss. Was anyone hurt?", "นั่นเกือบเกิดอุบัติเหตุร้ายแรงเลยนะคะ มีใครบาดเจ็บไหม"),
              options=[
                  opt("No, but it was very close.", "ไม่มีค่ะ แต่เฉียดมากเลย", True, "n3"),
                  opt("No, everyone is safe.", "ไม่มีค่ะ ทุกคนปลอดภัยดี", True, "n3"),
                  opt("Yes, I love that shelf.", "ค่ะ ฉันชอบชั้นวางของอันนั้นมาก", False),
              ]),
    n2b=dict(system=sysline("Thank you for reporting. Where exactly is the wire?", "ขอบคุณที่รายงานนะคะ สายไฟอยู่ตรงไหนแน่ๆ"),
              options=[
                  opt("It's near the emergency exit.", "อยู่ใกล้ทางออกฉุกเฉินค่ะ", True, "n3"),
                  opt("It's next to the machine.", "อยู่ข้างเครื่องจักรค่ะ", True, "n3"),
                  opt("It's my favorite color.", "มันเป็นสีโปรดของฉันค่ะ", False),
              ]),
    n3=dict(system=sysline("We should fix this before it becomes a real accident.", "เราควรแก้ไขก่อนที่จะกลายเป็นอุบัติเหตุจริงนะคะ"),
             options=[
                 opt("Yes, safety first.", "ค่ะ ความปลอดภัยต้องมาก่อน", True, "n4a"),
                 opt("Should we put up a warning sign?", "เราควรติดป้ายเตือนไหมคะ", True, "n4b"),
                 opt("Let's order some coffee.", "สั่งกาแฟกันเถอะค่ะ", False),
             ]),
    n4a=dict(system=sysline("I agree. I'll send someone to fix it today.", "เห็นด้วยค่ะ ฉันจะส่งคนไปแก้ไขวันนี้เลย"),
              options=[
                  opt("Thank you for taking this seriously.", "ขอบคุณที่ให้ความสำคัญกับเรื่องนี้ค่ะ", True),
                  opt("I'll check back tomorrow.", "ฉันจะมาเช็กอีกทีพรุ่งนี้ค่ะ", True),
                  opt("I don't like meetings.", "ฉันไม่ชอบประชุมค่ะ", False),
              ]),
    n4b=dict(system=sysline("Good idea. I'll add a sign right now.", "ความคิดดีค่ะ ฉันจะติดป้ายตอนนี้เลย"),
              options=[
                  opt("That will help prevent an accident.", "จะช่วยป้องกันอุบัติเหตุได้ค่ะ", True),
                  opt("Thank you for your quick action.", "ขอบคุณที่จัดการรวดเร็วค่ะ", True),
                  opt("I need a new laptop.", "ฉันต้องการแล็ปท็อปเครื่องใหม่ค่ะ", False),
              ]),
))

# 4. Asking an employee about symptoms of sudden illness at work
new_topics.append(topic(
    "sudden-illness", "การถามพนักงานเกี่ยวกับอาการป่วยกะทันหัน", "🤒",
    n1=dict(system=sysline("You don't look well. What's wrong?", "คุณดูไม่สบายเลยนะ เป็นอะไรไปคะ"),
             options=[
                 opt("I feel dizzy and nauseous.", "ฉันรู้สึกเวียนศีรษะและคลื่นไส้ค่ะ", True, "n2a"),
                 opt("I have a fever and I feel weak.", "ฉันมีไข้และรู้สึกอ่อนแรงค่ะ", True, "n2b"),
                 opt("I'm just a little tired from work.", "แค่เหนื่อยจากงานนิดหน่อยค่ะ", False),
             ]),
    n2a=dict(system=sysline("Do you have any other symptoms?", "มีอาการอื่นอีกไหมคะ"),
              options=[
                  opt("Yes, I also have a headache.", "ค่ะ ฉันปวดหัวด้วย", True, "n3"),
                  opt("No, just dizziness.", "ไม่มีค่ะ แค่เวียนศีรษะ", True, "n3"),
                  opt("I like my new shoes.", "ฉันชอบรองเท้าคู่ใหม่ค่ะ", False),
              ]),
    n2b=dict(system=sysline("Let's check your temperature.", "มาวัดอุณหภูมิกันก่อนนะคะ"),
              options=[
                  opt("Okay, thank you for checking.", "โอเคค่ะ ขอบคุณที่ช่วยตรวจ", True, "n3"),
                  opt("Should I take some medicine?", "ฉันควรกินยาไหมคะ", True, "n3"),
                  opt("I forgot my umbrella.", "ฉันลืมร่มค่ะ", False),
              ]),
    n3=dict(system=sysline("I think you should rest and see a doctor.", "ฉันคิดว่าคุณควรพักและไปหาหมอนะคะ"),
             options=[
                 opt("Okay, I'll go to the clinic.", "โอเคค่ะ ฉันจะไปคลินิก", True, "n4a"),
                 opt("Can someone call an ambulance if it gets worse?", "ถ้าอาการแย่ลง ให้ใครเรียกรถพยาบาลได้ไหมคะ", True, "n4b"),
                 opt("I want to finish my work first.", "ฉันอยากทำงานให้เสร็จก่อนค่ะ", False),
             ]),
    n4a=dict(system=sysline("Good. Take care of yourself and get some rest.", "ดีค่ะ ดูแลตัวเองและพักผ่อนเยอะๆ นะคะ"),
              options=[
                  opt("Thank you for your concern.", "ขอบคุณที่เป็นห่วงค่ะ", True),
                  opt("I'll let you know how I feel later.", "ฉันจะบอกอาการให้ทราบทีหลังค่ะ", True),
                  opt("I love hiking on weekends.", "ฉันชอบเดินป่าวันหยุดค่ะ", False),
              ]),
    n4b=dict(system=sysline("Of course, we will call one if needed.", "ได้แน่นอนค่ะ เราจะเรียกให้ถ้าจำเป็น"),
              options=[
                  opt("Thank you, that makes me feel safer.", "ขอบคุณค่ะ ทำให้รู้สึกปลอดภัยขึ้น", True),
                  opt("I hope it's nothing serious.", "หวังว่าจะไม่ร้ายแรงนะคะ", True),
                  opt("I don't like hospitals.", "ฉันไม่ชอบโรงพยาบาลค่ะ", False),
              ]),
))

# 5. Explaining an evacuation procedure during an emergency
new_topics.append(topic(
    "evacuation-procedure", "การอธิบายขั้นตอนการอพยพในเหตุฉุกเฉิน", "🏃",
    n1=dict(system=sysline("What should we do if there's an emergency?", "ถ้าเกิดเหตุฉุกเฉิน เราควรทำอย่างไรคะ"),
             options=[
                 opt("First, stay calm and don't panic.", "อย่างแรกคือใจเย็นๆ อย่าตื่นตระหนกค่ะ", True, "n2a"),
                 opt("Walk quickly to the nearest emergency exit.", "เดินเร็วๆ ไปทางออกฉุกเฉินที่ใกล้ที่สุดค่ะ", True, "n2b"),
                 opt("Finish your lunch first.", "ทานข้าวกลางวันให้เสร็จก่อนค่ะ", False),
             ]),
    n2a=dict(system=sysline("Okay, what should we do next?", "โอเคค่ะ แล้วต้องทำอะไรต่อคะ"),
              options=[
                  opt("Follow the evacuation signs to the exit.", "เดินตามป้ายอพยพไปทางออกค่ะ", True, "n3"),
                  opt("Help anyone who needs assistance.", "ช่วยเหลือคนที่ต้องการความช่วยเหลือค่ะ", True, "n3"),
                  opt("Take a photo of the fire.", "ถ่ายรูปไฟไหม้ค่ะ", False),
              ]),
    n2b=dict(system=sysline("Should we use the elevator?", "เราควรใช้ลิฟต์ไหมคะ"),
              options=[
                  opt("No, never use the elevator in an emergency.", "ไม่ควรค่ะ ห้ามใช้ลิฟต์ตอนเกิดเหตุฉุกเฉิน", True, "n3"),
                  opt("No, always use the stairs.", "ไม่ค่ะ ให้ใช้บันไดเสมอ", True, "n3"),
                  opt("Yes, it's faster.", "ค่ะ มันเร็วกว่าค่ะ", False),
              ]),
    n3=dict(system=sysline("Where should we meet after we leave the building?", "หลังออกจากอาคารแล้ว เราควรไปรวมตัวกันที่ไหนคะ"),
             options=[
                 opt("At the assembly point in the parking lot.", "ที่จุดรวมพลในลานจอดรถค่ะ", True, "n4a"),
                 opt("Wait for the safety officer to check everyone.", "รอเจ้าหน้าที่ความปลอดภัยตรวจนับทุกคนค่ะ", True, "n4b"),
                 opt("Go back inside to get your bag.", "กลับเข้าไปหยิบกระเป๋าค่ะ", False),
             ]),
    n4a=dict(system=sysline("Good. That's the correct meeting point.", "ดีค่ะ นั่นคือจุดรวมพลที่ถูกต้อง"),
              options=[
                  opt("Thank you for explaining the procedure.", "ขอบคุณที่อธิบายขั้นตอนค่ะ", True),
                  opt("I feel more prepared now.", "ตอนนี้ฉันรู้สึกพร้อมมากขึ้นค่ะ", True),
                  opt("I want to go back to work now.", "ฉันอยากกลับไปทำงานตอนนี้เลยค่ะ", False),
              ]),
    n4b=dict(system=sysline("Yes, that's very important for everyone's safety.", "ค่ะ นั่นสำคัญมากต่อความปลอดภัยของทุกคน"),
              options=[
                  opt("I understand, safety first.", "เข้าใจค่ะ ความปลอดภัยต้องมาก่อน", True),
                  opt("I will remember this procedure.", "ฉันจะจำขั้นตอนนี้ไว้ค่ะ", True),
                  opt("Let's skip that step next time.", "คราวหน้าข้ามขั้นตอนนี้ไปเถอะค่ะ", False),
              ]),
))

# 6. Instructing a worker on correct PPE use
new_topics.append(topic(
    "ppe-instruction", "การสอนพนักงานใช้อุปกรณ์ป้องกันส่วนบุคคลอย่างถูกต้อง", "🥽",
    n1=dict(system=sysline("You need to wear your helmet before entering this area.", "คุณต้องใส่หมวกนิรภัยก่อนเข้าพื้นที่นี้นะคะ"),
             options=[
                 opt("Okay, I'll put it on now.", "โอเคค่ะ ฉันจะใส่เลยตอนนี้", True, "n2a"),
                 opt("Do I need gloves too?", "ฉันต้องใส่ถุงมือด้วยไหมคะ", True, "n2b"),
                 opt("I don't think it's necessary.", "ฉันคิดว่าไม่จำเป็นค่ะ", False),
             ]),
    n2a=dict(system=sysline("Good. Make sure it fits properly.", "ดีค่ะ ตรวจให้แน่ใจว่าใส่พอดี"),
              options=[
                  opt("It feels a little loose.", "รู้สึกหลวมนิดหน่อยค่ะ", True, "n3"),
                  opt("Yes, it fits well.", "ค่ะ พอดีเลย", True, "n3"),
                  opt("I like the color of the helmet.", "ฉันชอบสีของหมวกค่ะ", False),
              ]),
    n2b=dict(system=sysline("Yes, and safety glasses as well.", "ค่ะ และต้องใส่แว่นนิรภัยด้วย"),
              options=[
                  opt("Okay, I'll wear all of them.", "โอเคค่ะ ฉันจะใส่ทั้งหมดเลย", True, "n3"),
                  opt("Where can I find safety glasses?", "หาแว่นนิรภัยได้ที่ไหนคะ", True, "n3"),
                  opt("I don't like wearing glasses.", "ฉันไม่ชอบใส่แว่นค่ะ", False),
              ]),
    n3=dict(system=sysline("This equipment protects you from injury.", "อุปกรณ์นี้ช่วยปกป้องคุณจากการบาดเจ็บนะคะ"),
             options=[
                 opt("I understand, safety is important.", "เข้าใจค่ะ ความปลอดภัยสำคัญมาก", True, "n4a"),
                 opt("What happens if I don't wear it?", "ถ้าไม่ใส่จะเกิดอะไรขึ้นคะ", True, "n4b"),
                 opt("It looks uncomfortable.", "ดูใส่แล้วไม่สบายเลยค่ะ", False),
             ]),
    n4a=dict(system=sysline("Exactly. Please wear it every time you work here.", "ถูกต้องค่ะ กรุณาใส่ทุกครั้งที่ทำงานที่นี่"),
              options=[
                  opt("I will, thank you for reminding me.", "ฉันจะใส่ค่ะ ขอบคุณที่เตือน", True),
                  opt("I'll check it every morning.", "ฉันจะเช็กทุกเช้าค่ะ", True),
                  opt("I don't have time for that.", "ฉันไม่มีเวลาทำแบบนั้นค่ะ", False),
              ]),
    n4b=dict(system=sysline("You could get seriously injured. It's a big risk.", "คุณอาจบาดเจ็บสาหัสได้ นั่นเป็นความเสี่ยงที่ใหญ่มาก"),
              options=[
                  opt("I understand the danger now.", "ตอนนี้ฉันเข้าใจอันตรายแล้วค่ะ", True),
                  opt("I will always wear my PPE.", "ฉันจะใส่อุปกรณ์ป้องกันเสมอค่ะ", True),
                  opt("That sounds unlikely.", "ฟังดูไม่น่าจะเกิดขึ้นค่ะ", False),
              ]),
))

# 7. Following up on an employee's recovery after treatment
new_topics.append(topic(
    "recovery-followup", "การติดตามอาการฟื้นตัวของพนักงานหลังการรักษา", "💊",
    n1=dict(system=sysline("How are you feeling after your treatment?", "หลังการรักษา คุณรู้สึกเป็นอย่างไรบ้างคะ"),
             options=[
                 opt("Much better, thank you for asking.", "ดีขึ้นมากค่ะ ขอบคุณที่ถาม", True, "n2a"),
                 opt("Still a little tired, but recovering.", "ยังเหนื่อยนิดหน่อย แต่กำลังฟื้นตัวค่ะ", True, "n2b"),
                 opt("I forgot about the treatment.", "ฉันลืมเรื่องการรักษาไปแล้วค่ะ", False),
             ]),
    n2a=dict(system=sysline("That's great news. Are you ready to come back to work?", "ข่าวดีมากค่ะ พร้อมกลับมาทำงานหรือยังคะ"),
              options=[
                  opt("Yes, I feel ready now.", "ค่ะ ตอนนี้ฉันพร้อมแล้ว", True, "n3"),
                  opt("I need a few more days to recover.", "ฉันต้องการเวลาฟื้นตัวอีกสองสามวันค่ะ", True, "n3"),
                  opt("I don't want to work anymore.", "ฉันไม่อยากทำงานอีกแล้วค่ะ", False),
              ]),
    n2b=dict(system=sysline("Take your time. Your health is important.", "ค่อยๆ พักไปนะคะ สุขภาพของคุณสำคัญที่สุด"),
              options=[
                  opt("Thank you for understanding.", "ขอบคุณที่เข้าใจค่ะ", True, "n3"),
                  opt("I hope to be fully recovered soon.", "หวังว่าจะฟื้นตัวเต็มที่เร็วๆ นี้ค่ะ", True, "n3"),
                  opt("Let's talk about something else.", "คุยเรื่องอื่นกันเถอะค่ะ", False),
              ]),
    n3=dict(system=sysline("Do you have any side effects from the medicine?", "มีผลข้างเคียงจากยาไหมคะ"),
             options=[
                 opt("No side effects so far.", "ยังไม่มีผลข้างเคียงเลยค่ะ", True, "n4a"),
                 opt("I feel a little dizzy sometimes.", "บางครั้งฉันรู้สึกเวียนศีรษะนิดหน่อยค่ะ", True, "n4b"),
                 opt("I don't take any medicine.", "ฉันไม่ได้กินยาเลยค่ะ", False),
             ]),
    n4a=dict(system=sysline("Good. Please let us know if anything changes.", "ดีค่ะ ถ้ามีอะไรเปลี่ยนแปลงบอกเราด้วยนะคะ"),
              options=[
                  opt("I will, thank you.", "จะบอกแน่นอนค่ะ ขอบคุณค่ะ", True),
                  opt("I appreciate your support.", "ขอบคุณสำหรับการดูแลนะคะ", True),
                  opt("I don't need any help.", "ฉันไม่ต้องการความช่วยเหลือค่ะ", False),
              ]),
    n4b=dict(system=sysline("Please tell your doctor about that at your next check-up.", "บอกหมอเรื่องนี้ตอนตรวจสุขภาพครั้งหน้าด้วยนะคะ"),
              options=[
                  opt("Okay, I'll mention it.", "โอเคค่ะ ฉันจะบอกหมอค่ะ", True),
                  opt("Thank you for the advice.", "ขอบคุณสำหรับคำแนะนำค่ะ", True),
                  opt("It's probably nothing.", "คงไม่มีอะไรหรอกค่ะ", False),
              ]),
))

# 8. Conducting a basic safety check-up / inspection
new_topics.append(topic(
    "safety-inspection", "การตรวจสอบความปลอดภัยในสถานที่ทำงาน", "🔍",
    n1=dict(system=sysline("I'm here to do the monthly safety check-up. Is that okay?", "ฉันมาตรวจความปลอดภัยประจำเดือนค่ะ สะดวกไหมคะ"),
             options=[
                 opt("Yes, please go ahead.", "ค่ะ เชิญตรวจได้เลยค่ะ", True, "n2a"),
                 opt("Sure, let me show you around.", "ได้ค่ะ ฉันจะพาไปดูรอบๆ", True, "n2b"),
                 opt("I'm too busy right now.", "ตอนนี้ฉันยุ่งมากค่ะ", False),
             ]),
    n2a=dict(system=sysline("Let's start with the emergency exits.", "เริ่มจากทางออกฉุกเฉินก่อนนะคะ"),
              options=[
                  opt("This way, they are clearly marked.", "ทางนี้ค่ะ มีป้ายบอกชัดเจน", True, "n3"),
                  opt("All exits are unlocked and clear.", "ทางออกทุกทางไม่ล็อกและไม่มีสิ่งกีดขวางค่ะ", True, "n3"),
                  opt("I don't know where they are.", "ฉันไม่รู้ว่าอยู่ที่ไหนค่ะ", False),
              ]),
    n2b=dict(system=sysline("Let's check the fire extinguishers first.", "มาตรวจถังดับเพลิงก่อนนะคะ"),
              options=[
                  opt("They were checked last month.", "ตรวจไปแล้วเมื่อเดือนที่แล้วค่ะ", True, "n3"),
                  opt("This one needs to be replaced.", "อันนี้ต้องเปลี่ยนใหม่ค่ะ", True, "n3"),
                  opt("We don't have any extinguishers.", "เราไม่มีถังดับเพลิงเลยค่ะ", False),
              ]),
    n3=dict(system=sysline("I noticed a few hazards. Can we discuss them?", "ฉันสังเกตเห็นสิ่งเสี่ยงบางอย่าง คุยกันได้ไหมคะ"),
             options=[
                 opt("Yes, please tell me what you found.", "ได้ค่ะ บอกได้เลยว่าเจออะไรบ้าง", True, "n4a"),
                 opt("Is it something dangerous?", "เป็นอะไรที่อันตรายไหมคะ", True, "n4b"),
                 opt("I don't want to hear about it.", "ฉันไม่อยากฟังเรื่องนี้ค่ะ", False),
             ]),
    n4a=dict(system=sysline("There are some wires on the floor near the exit.", "มีสายไฟอยู่บนพื้นใกล้ทางออกค่ะ"),
              options=[
                  opt("I'll get someone to fix that today.", "ฉันจะให้คนมาแก้ไขวันนี้เลยค่ะ", True),
                  opt("Thank you for pointing that out.", "ขอบคุณที่ชี้ให้เห็นค่ะ", True),
                  opt("That's not a big problem.", "นั่นไม่ใช่ปัญหาใหญ่ค่ะ", False),
              ]),
    n4b=dict(system=sysline("It could cause someone to trip and fall.", "มันอาจทำให้มีคนสะดุดล้มได้ค่ะ"),
              options=[
                  opt("I understand, we'll fix it right away.", "เข้าใจค่ะ เราจะแก้ไขทันที", True),
                  opt("Thank you for the warning.", "ขอบคุณสำหรับคำเตือนค่ะ", True),
                  opt("I'm sure it's fine.", "ฉันมั่นใจว่าไม่เป็นไรค่ะ", False),
              ]),
))

# 9. Explaining a hazard/risk to a new employee (safety briefing)
new_topics.append(topic(
    "safety-briefing-new-employee", "การอธิบายความเสี่ยงให้พนักงานใหม่ฟัง (ปฐมนิเทศความปลอดภัย)", "📋",
    n1=dict(system=sysline("Welcome! Before you start, let's talk about safety.", "ยินดีต้อนรับค่ะ ก่อนเริ่มงาน มาคุยเรื่องความปลอดภัยกันก่อนนะคะ"),
             options=[
                 opt("Okay, I'm ready to listen.", "โอเคค่ะ พร้อมฟังแล้วค่ะ", True, "n2a"),
                 opt("What are the main hazards here?", "สิ่งเสี่ยงหลักๆ ที่นี่มีอะไรบ้างคะ", True, "n2b"),
                 opt("Can we do this later?", "ทำเรื่องนี้ทีหลังได้ไหมคะ", False),
             ]),
    n2a=dict(system=sysline("This factory has some risks you should know about.", "โรงงานนี้มีความเสี่ยงบางอย่างที่คุณควรรู้ไว้"),
              options=[
                  opt("What kind of risks?", "ความเสี่ยงแบบไหนคะ", True, "n3"),
                  opt("I want to learn how to stay safe.", "ฉันอยากเรียนรู้วิธีดูแลความปลอดภัยค่ะ", True, "n3"),
                  opt("I already know everything.", "ฉันรู้ทุกอย่างอยู่แล้วค่ะ", False),
              ]),
    n2b=dict(system=sysline("The main hazards are the machines and chemicals.", "สิ่งเสี่ยงหลักคือเครื่องจักรและสารเคมีค่ะ"),
              options=[
                  opt("I'll be careful around them.", "ฉันจะระมัดระวังเวลาอยู่ใกล้ๆ ค่ะ", True, "n3"),
                  opt("Should I wear protective equipment?", "ฉันควรใส่อุปกรณ์ป้องกันไหมคะ", True, "n3"),
                  opt("That doesn't sound dangerous.", "ฟังดูไม่อันตรายเลยค่ะ", False),
              ]),
    n3=dict(system=sysline("Always wear your helmet and gloves in this area.", "ใส่หมวกนิรภัยและถุงมือเสมอเมื่ออยู่ในพื้นที่นี้นะคะ"),
             options=[
                 opt("I understand, I'll wear them every day.", "เข้าใจค่ะ ฉันจะใส่ทุกวัน", True, "n4a"),
                 opt("Where do I find the safety equipment?", "หาอุปกรณ์ความปลอดภัยได้ที่ไหนคะ", True, "n4b"),
                 opt("I don't think I need them.", "ฉันคิดว่าไม่จำเป็นค่ะ", False),
             ]),
    n4a=dict(system=sysline("Great. Safety is everyone's responsibility here.", "ดีเลยค่ะ ความปลอดภัยเป็นความรับผิดชอบของทุกคนที่นี่"),
              options=[
                  opt("I'll do my part to stay safe.", "ฉันจะทำหน้าที่ของตัวเองเพื่อความปลอดภัยค่ะ", True),
                  opt("Thank you for the training.", "ขอบคุณสำหรับการอบรมค่ะ", True),
                  opt("This job sounds boring.", "งานนี้ฟังดูน่าเบื่อค่ะ", False),
              ]),
    n4b=dict(system=sysline("It's in the locker room, near the entrance.", "อยู่ในห้องล็อกเกอร์ ใกล้ทางเข้าค่ะ"),
              options=[
                  opt("Thank you, I'll go get it now.", "ขอบคุณค่ะ ฉันจะไปเอาเลย", True),
                  opt("I appreciate you showing me.", "ขอบคุณที่พาไปดูนะคะ", True),
                  opt("I'll get it next week.", "ฉันจะไปเอาอาทิตย์หน้าค่ะ", False),
              ]),
))

# 10. Coordinating with an ambulance/first-aid responder during an emergency
new_topics.append(topic(
    "coordinate-ambulance", "การประสานงานกับหน่วยปฐมพยาบาลหรือรถพยาบาลในเหตุฉุกเฉิน", "🚑",
    n1=dict(system=sysline("This is the ambulance service. What's the emergency?", "นี่คือหน่วยรถพยาบาลค่ะ เหตุฉุกเฉินคืออะไรคะ"),
             options=[
                 opt("We have an employee with a serious injury.", "พนักงานของเรามีบาดเจ็บสาหัสค่ะ", True, "n2a"),
                 opt("Someone is having a heart attack.", "มีคนหัวใจวายค่ะ", True, "n2b"),
                 opt("We need someone to fix a light.", "เราต้องการคนมาซ่อมไฟค่ะ", False),
             ]),
    n2a=dict(system=sysline("Is the person conscious? Are they breathing?", "คนคนนั้นยังมีสติไหมคะ หายใจอยู่ไหม"),
              options=[
                  opt("Yes, they are conscious and breathing.", "ค่ะ ยังมีสติและหายใจอยู่", True, "n3"),
                  opt("No, they are unconscious.", "ไม่ค่ะ หมดสติไปแล้ว", True, "n3"),
                  opt("I'm not sure what that means.", "ฉันไม่แน่ใจว่าหมายความว่าอะไรค่ะ", False),
              ]),
    n2b=dict(system=sysline("We are sending an ambulance immediately. Is someone doing CPR?", "เรากำลังส่งรถพยาบาลไปทันทีค่ะ มีใครทำ CPR อยู่ไหม"),
              options=[
                  opt("Yes, our first aid officer is doing CPR now.", "ค่ะ เจ้าหน้าที่ปฐมพยาบาลกำลังทำ CPR อยู่", True, "n3"),
                  opt("Not yet, but we will start now.", "ยังค่ะ แต่เราจะเริ่มตอนนี้เลย", True, "n3"),
                  opt("We don't know how to do that.", "เราไม่รู้วิธีทำค่ะ", False),
              ]),
    n3=dict(system=sysline("Good. Please stay on the line and keep the area clear.", "ดีค่ะ กรุณาอย่าวางสาย และเคลียร์พื้นที่ให้โล่งด้วยนะคะ"),
             options=[
                 opt("Okay, we'll keep the area clear.", "โอเคค่ะ เราจะเคลียร์พื้นที่ให้", True, "n4a"),
                 opt("How many minutes until you arrive?", "อีกกี่นาทีจะมาถึงคะ", True, "n4b"),
                 opt("We're going to leave now.", "เราจะไปแล้วนะคะ", False),
             ]),
    n4a=dict(system=sysline("The ambulance will arrive in about five minutes.", "รถพยาบาลจะมาถึงในอีกประมาณห้านาทีค่ะ"),
              options=[
                  opt("Thank you, we'll be waiting.", "ขอบคุณค่ะ เราจะรอค่ะ", True),
                  opt("We'll meet you at the entrance.", "เราจะไปรอที่ทางเข้าค่ะ", True),
                  opt("That's too slow.", "ช้าเกินไปค่ะ", False),
              ]),
    n4b=dict(system=sysline("About five minutes. Please stay calm.", "ประมาณห้านาทีค่ะ ใจเย็นๆ นะคะ"),
              options=[
                  opt("Thank you, we will stay calm.", "ขอบคุณค่ะ เราจะใจเย็นๆ", True),
                  opt("We appreciate your quick response.", "ขอบคุณที่ตอบสนองรวดเร็วค่ะ", True),
                  opt("Please hurry up.", "รีบมาด่วนเลยนะคะ", False),
              ]),
))

with open(PATH, "r", encoding="utf-8") as f:
    existing = json.load(f)

merged = existing + new_topics

assert len(merged) == 25, f"expected 25 topics, got {len(merged)}"
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

if ALL_MISSING:
    print(f"MISSING {len(ALL_MISSING)} tokens:")
    print(sorted(ALL_MISSING))
    raise SystemExit(1)

print(f"OK - {len(merged)} topics, {total_nodes} nodes total")

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)
