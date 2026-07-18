#!/usr/bin/env python3
"""Phase 8 item 7: rewrite every wordOrderQuestions[].explanation in
sentencePatterns.json into natural Thai (actual grammar explanations, not
literal translations of the English sentence). have-has's explanations were
already written in Thai when the pattern was authored (item 6) and are left
untouched.
"""
import json

PATH = "src/data/sentencePatterns.json"

TH = {
    # present-simple
    "present-simple-1": "โครงสร้างคือ ประธาน + กริยา(-s) + กรรม + คำบอกเวลา ประโยคที่พูดถึงกิจวัตรหรือความเคยชินจะเรียงตามลำดับ Subject-Verb-Object และคำบอกเวลามักอยู่ท้ายประโยค",
    "present-simple-2": "'She' เป็นประธานบุรุษที่สามเอกพจน์ กริยาจึงต้องเติม -s: play → plays",
    "present-simple-3": "โครงสร้างคือ ประธาน + กริยา(-s) + สถานที่ วลีบอกสถานที่มักวางไว้หลังกริยา",
    "present-simple-4": "'We' ไม่ต้องเติม -s ที่กริยา เพราะกฎเติม -s ใช้กับประธาน he/she/it เท่านั้น",
    "present-simple-5": "โครงสร้างคือ ประธาน + กริยา + กรรม + สถานที่ เป็นรูปแบบ Subject-Verb-Object เดิม เพียงเพิ่มวลีบอกสถานที่ไว้ท้ายประโยค",
    "present-simple-6": "คำบอกเวลาอย่าง 'every night' มักวางไว้ท้ายประโยค",
    "present-simple-7": "'Have' เป็นกริยาอปกติ (irregular) เมื่อใช้กับ he/she/it ต้องเปลี่ยนเป็น 'has' ไม่ใช่เติม -s ตรงๆ เป็น 'haves'",
    "present-simple-8": "'Go' เมื่อใช้กับ he/she/it ต้องเปลี่ยนรูปเป็น 'goes'",
    "present-simple-9": "โครงสร้างคือ ประธาน + กริยา + กรรม + คำบอกลักษณะการกระทำ วางไว้ท้ายประโยค",
    "present-simple-10": "เรียงประโยคแบบ Subject-Verb-Object เช่นเดิม โดยวางวลีบอกเวลา 'every day' ไว้ท้ายประโยค",
    # past-simple
    "past-simple-1": "กริยาปกติ (regular verb) เติม -ed เพื่อทำเป็นรูปอดีต: cook → cooked",
    "past-simple-2": "'Drink' เป็นกริยาอปกติ: drink → drank ไม่ใช่ 'drinked'",
    "past-simple-3": "กริยาที่ลงท้ายด้วยพยัญชนะ + y ต้องเปลี่ยน y เป็น i ก่อนเติม -ed: study → studied",
    "past-simple-4": "'Speak' เป็นกริยาอปกติ: speak → spoke",
    "past-simple-5": "กริยาปกติเติม -ed: listen → listened",
    "past-simple-6": "'Have' เป็นกริยาอปกติ: have → had",
    "past-simple-7": "ประโยคปฏิเสธในอดีตใช้ didn't + กริยารูปพื้นฐาน (base form) ไม่ใช่รูปอดีต",
    "past-simple-8": "กริยาปกติ: work → worked",
    "past-simple-9": "'Read' สะกดเหมือนเดิมในรูปอดีต แต่ออกเสียงเปลี่ยนไปเป็น /rɛd/ (อ่านว่า เรด)",
    "past-simple-10": "'Go' เป็นกริยาอปกติ: go → went",
    # present-continuous
    "present-continuous-1": "Present Continuous = am/is/are + กริยาเติม -ing ประธาน 'I' ใช้กับ 'am' เสมอ",
    "present-continuous-2": "ประธาน he/she/it ใช้ 'is' นำหน้ากริยาเติม -ing",
    "present-continuous-3": "ประธาน we/you/they ใช้ 'are' นำหน้ากริยาเติม -ing",
    "present-continuous-4": "คำบอกเวลา 'now' มักวางไว้ท้ายประโยค",
    "present-continuous-5": "โครงสร้างคือ am/is/are + กริยาเติม -ing + กรรม",
    "present-continuous-6": "Present Continuous = am/is/are + กริยาเติม -ing ประธาน 'He' ใช้กับ 'is'",
    "present-continuous-7": "ประธาน 'They' ใช้ 'are' นำหน้ากริยาเติม -ing",
    "present-continuous-8": "รูปปฏิเสธเติม 'not' หลัง am/is/are: am not, isn't, aren't",
    "present-continuous-9": "'Isn't' คือรูปย่อของ 'is not'",
    "present-continuous-10": "Present Continuous บรรยายเหตุการณ์ที่กำลังเกิดขึ้นตอนนี้ได้ แม้แต่กับกริยาอย่าง 'have' เมื่อใช้ในความหมาย 'ทาน' (have dinner = กำลังทานอาหารเย็นอยู่)",
    # going-to-future
    "going-to-1": "'Going to' + กริยารูปพื้นฐาน แสดงแผนการที่ตัดสินใจไว้ล่วงหน้า: am/is/are going to + verb",
    "going-to-2": "ประธาน he/she/it ใช้ 'is' นำหน้า 'going to'",
    "going-to-3": "ประธาน we/you/they ใช้ 'are' นำหน้า 'going to'",
    "going-to-4": "หลัง 'going to' กริยาหลักต้องอยู่ในรูปพื้นฐานเสมอ: travel ไม่ใช่ travels หรือ traveled",
    "going-to-5": "โครงสร้างคือ ประธาน + is going to + กริยารูปพื้นฐาน + กรรม",
    "going-to-6": "โครงสร้างคือ ประธาน + are going to + กริยารูปพื้นฐาน + กรรม",
    "going-to-7": "คำบอกเวลาอย่าง 'tonight' มักวางไว้ท้ายประโยค",
    "going-to-8": "รูปปฏิเสธเติม 'not' หลัง am/is/are: are not going to",
    "going-to-9": "ประโยคคำถามสลับตำแหน่งประธานกับ 'is/are': Is + ประธาน + going to + กริยา?",
    "going-to-10": "ประธาน 'I' ใช้กับ 'am' เสมอ ก่อน 'going to'",
    # will-future
    "will-future-1": "'Will' + กริยารูปพื้นฐาน ใช้รูปเดียวกันกับทุกประธาน: I will call, she will call, they will call",
    "will-future-2": "'Will' ไม่เปลี่ยนรูปแม้กับประธาน he/she/it ไม่ต้องเติม -s",
    "will-future-3": "โครงสร้างคือ ประธาน + will + กริยารูปพื้นฐาน + คำบอกเวลา",
    "will-future-4": "หลัง 'will' กริยา 'be' คงรูปเป็น 'be' เสมอ ไม่ใช่ 'is' หรือ 'am'",
    "will-future-5": "'Won't' คือรูปย่อของ 'will not' ใช้ทำประโยคอนาคตให้เป็นปฏิเสธ",
    "will-future-6": "ประโยคคำถามกับ 'will' สลับตำแหน่ง: Will + ประธาน + กริยารูปพื้นฐาน?",
    "will-future-7": "'Will' มักใช้แสดงคำสัญญาเกี่ยวกับอนาคต",
    "will-future-8": "คำวิเศษณ์อย่าง 'probably' มักวางไว้ระหว่าง 'will' กับกริยารูปพื้นฐาน",
    "will-future-9": "'Will never' เป็นรูปปฏิเสธที่ใช้เน้นการคาดการณ์อนาคตอย่างหนักแน่น",
    "will-future-10": "'Will' มักใช้พูดถึงเหตุการณ์ในอนาคตที่กำหนดไว้แล้วหรือคาดการณ์ได้ เช่น ตารางเวลา",
    # there-is-are
    "there-is-are-1": "'There is' + คำนามเอกพจน์ ใช้บอกว่ามีสิ่งใดสิ่งหนึ่งอยู่",
    "there-is-are-2": "'There are' ใช้นำหน้าคำนามพหูพจน์ เช่น 'two cats'",
    "there-is-are-3": "คำนามนับไม่ได้อย่าง 'milk' ใช้กับ 'there is' ไม่ใช่ 'there are'",
    "there-is-are-4": "รูปปฏิเสธคือ 'there isn't/aren't' + any + คำนาม",
    "there-is-are-5": "โครงสร้างคือ 'There are' + คำนามพหูพจน์ + วลีบอกสถานที่",
    "there-is-are-6": "ประโยคคำถามกับ 'there is/are' สลับเป็น 'Is/Are there'",
    "there-is-are-7": "'There were' คือรูปอดีต ใช้กับคำนามพหูพจน์",
    "there-is-are-8": "'There wasn't' คือรูปปฏิเสธในอดีต ใช้กับคำนามเอกพจน์หรือนับไม่ได้",
    "there-is-are-9": "'A lot of' ใช้ได้ทั้งกับคำนามนับได้และนับไม่ได้ หลัง 'there are'",
    "there-is-are-10": "'Nothing' มีความหมายปฏิเสธอยู่ในตัวแล้ว ประโยคจึงยังใช้ 'there is' รูปบอกเล่าตามปกติ",
    # can-could-ability
    "can-could-1": "'Can' + กริยารูปพื้นฐาน แสดงความสามารถในปัจจุบัน และ 'can' ไม่เปลี่ยนรูปตามประธาน",
    "can-could-2": "หลัง 'can' ไม่ต้องเติม -s ที่กริยาแม้กับประธาน he/she/it: 'can cook' ไม่ใช่ 'can cooks'",
    "can-could-3": "'Could' คือรูปอดีตของ 'can' ใช้พูดถึงความสามารถในอดีต",
    "can-could-4": "รูปปฏิเสธของ 'can' คือ 'can't' (หรือ 'cannot') ตามด้วยกริยารูปพื้นฐาน",
    "can-could-5": "'Couldn't' คือรูปปฏิเสธในอดีต: could not find",
    "can-could-6": "ประโยคคำถามกับ 'can' สลับตำแหน่ง: Can + ประธาน + กริยารูปพื้นฐาน?",
    "can-could-7": "'Could' ใช้บรรยายความสามารถที่เคยมีในอดีต",
    "can-could-8": "'Can't' + กริยารูปพื้นฐาน ทำให้ประโยคความสามารถเป็นปฏิเสธ",
    "can-could-9": "'Could you' ยังใช้เป็นการขอร้องอย่างสุภาพได้ด้วย ไม่ใช่แค่พูดถึงความสามารถ",
    "can-could-10": "'Can' ยังใช้พูดถึงความเป็นไปได้ในอนาคตได้ ไม่ใช่แค่ความสามารถในปัจจุบัน",
    # comparatives
    "comparatives-1": "คำคุณศัพท์สั้นเติม -er: big → bigger ตามด้วย 'than'",
    "comparatives-2": "คำคุณศัพท์ที่ลงท้ายด้วยพยัญชนะ + y ต้องเปลี่ยน y เป็น i ก่อนเติม -er: happy → happier",
    "comparatives-3": "คำคุณศัพท์ที่ยาวใช้ 'more' แทนการเติม -er: expensive → more expensive",
    "comparatives-4": "'Good' เป็นคำคุณศัพท์อปกติ: good → better ไม่ใช่ 'gooder'",
    "comparatives-5": "โครงสร้าง คำคุณศัพท์ + -er + than ใช้เปรียบเทียบสองสิ่งโดยตรง",
    "comparatives-6": "คำคุณศัพท์สั้นเติม -er: strong → stronger",
    "comparatives-7": "โครงสร้างคือ คำคุณศัพท์ + -er + than + สิ่งที่ถูกนำมาเปรียบเทียบ",
    "comparatives-8": "คำคุณศัพท์ที่ยาวใช้ 'more' แทนการเติม -er: difficult → more difficult",
    "comparatives-9": "คำคุณศัพท์สั้นเติม -er: small → smaller ในกรณีนี้ไม่มีการซ้ำพยัญชนะ เพราะกฎซ้ำพยัญชนะใช้เฉพาะคำที่ลงท้ายด้วยสระเดี่ยว + พยัญชนะเดี่ยว เช่น big → bigger เท่านั้น",
    "comparatives-10": "'Bad' เป็นคำคุณศัพท์อปกติ: bad → worse ไม่ใช่ 'badder'",
    # zero-conditional
    "zero-conditional-1": "Zero conditional: If + present simple, + present simple ทั้งสองประโยคย่อยพูดถึงความจริงทั่วไป",
    "zero-conditional-2": "ทั้งสองส่วนของประโยคใช้ present simple แม้ความหมายจะเป็นเรื่องทั่วไป ไม่ใช่เหตุการณ์ ณ ตอนนี้",
    "zero-conditional-3": "ประโยคเงื่อนไข (if-clause) เป็นปฏิเสธได้เช่นกัน: If + ประธาน + don't/doesn't + กริยารูปพื้นฐาน",
    "zero-conditional-4": "ประโยค zero conditional บรรยายสิ่งที่เป็นจริงเสมอภายใต้เงื่อนไขนั้น",
    "zero-conditional-5": "เครื่องหมายจุลภาค (comma) คั่นระหว่างประโยคเงื่อนไขกับผลลัพธ์ เมื่อ 'if' อยู่ต้นประโยค",
    "zero-conditional-6": "Zero conditional ใช้บรรยายข้อเท็จจริงทางวิทยาศาสตร์: If + present simple, + present simple",
    "zero-conditional-7": "ทั้งสองประโยคย่อยใช้ present simple เพื่อบรรยายความจริงทั่วไป",
    "zero-conditional-8": "ประโยคเงื่อนไขเป็นปฏิเสธได้: If + ประธาน + don't/doesn't + กริยารูปพื้นฐาน",
    "zero-conditional-9": "ประโยค zero conditional เป็นจริงเสมอภายใต้เงื่อนไขนั้น เหมือนข้อเท็จจริงทางวิทยาศาสตร์",
    "zero-conditional-10": "เครื่องหมายจุลภาคคั่นระหว่างประโยคเงื่อนไขกับผลลัพธ์ เมื่อ 'if' อยู่ต้นประโยค",
    # first-conditional
    "first-conditional-1": "First conditional: If + present simple, + ประธาน + will + กริยารูปพื้นฐาน",
    "first-conditional-2": "ประโยคเงื่อนไขใช้ present simple ('study') ไม่ใช่ 'will study' แม้จะพูดถึงอนาคต",
    "first-conditional-3": "ประโยคผลลัพธ์คือ ประธาน + will + กริยารูปพื้นฐาน",
    "first-conditional-4": "โครงสร้างคือ If + present simple + จุลภาค + ประธาน + will + กริยารูปพื้นฐาน + กรรม",
    "first-conditional-5": "ประโยคเงื่อนไขเป็นปฏิเสธได้เช่นกัน โดยใช้ don't/doesn't + กริยารูปพื้นฐาน",
    "first-conditional-6": "First conditional: If + present simple, + ประธาน + will + กริยารูปพื้นฐาน",
    "first-conditional-7": "ประโยคผลลัพธ์ใช้ will + กริยารูปพื้นฐานเสมอ เพื่อบอกผลลัพธ์ที่น่าจะเกิดขึ้นในอนาคต",
    "first-conditional-8": "ประโยคเงื่อนไขเป็นปฏิเสธได้เช่นกัน โดยใช้ doesn't + กริยารูปพื้นฐาน",
    "first-conditional-9": "First conditional พูดถึงแผนการในอนาคตที่มีความเป็นไปได้จริง",
    "first-conditional-10": "First conditional มักใช้บอกทางหรือให้คำแนะนำที่มีผลลัพธ์ที่น่าจะเกิดขึ้นตามมา",
}

patterns = json.load(open(PATH, encoding="utf-8"))
applied = 0
for pat in patterns:
    for q in pat["wordOrderQuestions"]:
        if q["id"] in TH:
            q["explanation"] = TH[q["id"]]
            applied += 1

json.dump(patterns, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"applied {applied} Thai explanations (dict had {len(TH)} entries)")
