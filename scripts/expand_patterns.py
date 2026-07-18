import json


def ex(text, phonetic, thai):
    return {"text": text, "phonetic": phonetic, "thai": thai}


def chunk(text):
    return {"text": text}


def woq(id_, promptThai, chunks_texts, correctOrder, phonetic, thai, explanation):
    return {
        "id": id_,
        "promptThai": promptThai,
        "chunks": [chunk(t) for t in chunks_texts],
        "correctOrder": correctOrder,
        "phonetic": phonetic,
        "thai": thai,
        "explanation": explanation,
    }


with open("src/data/sentencePatterns.json", encoding="utf-8") as f:
    patterns = json.load(f)

by_id = {p["id"]: p for p in patterns}

# ---------- present-continuous ----------
p = by_id["present-continuous"]
p["examples"] += [
    ex("He is playing football in the park.", "/hiː ɪz ˈpleɪɪŋ ˈfʊtbɔːl ɪn ðə pɑːrk/", "เขากำลังเล่นฟุตบอลอยู่ที่สวนสาธารณะ"),
    ex("I am not sleeping right now.", "/aɪ æm nɒt ˈsliːpɪŋ raɪt naʊ/", "ตอนนี้ฉันไม่ได้นอนหลับอยู่"),
]
p["wordOrderQuestions"] += [
    woq("present-continuous-6", "พูดว่า: เขากำลังวิ่งไปป้ายรถบัส", ["to the bus stop", "He", "is", "running"],
        ["He", "is", "running", "to the bus stop"], "/hiː ɪz ˈrʌnɪŋ tuː ðə bʌs stɒp/", "เขากำลังวิ่งไปป้ายรถบัส",
        "Present Continuous = am/is/are + verb-ing. 'He' takes 'is'."),
    woq("present-continuous-7", "พูดว่า: พวกเขากำลังอ่านหนังสืออยู่ที่ห้องสมุด", ["in the library", "They", "are", "studying"],
        ["They", "are", "studying", "in the library"], "/ðeɪ ɑːr ˈstʌdiɪŋ ɪn ðə ˈlaɪbrɛri/", "พวกเขากำลังอ่านหนังสืออยู่ที่ห้องสมุด",
        "'They' takes 'are' before the -ing verb."),
    woq("present-continuous-8", "พูดว่า: ฉันไม่ได้กำลังดูทีวีอยู่", ["TV", "I", "am not", "watching"],
        ["I", "am not", "watching", "TV"], "/aɪ æm nɒt ˈwɒtʃɪŋ tiːˈviː/", "ฉันไม่ได้กำลังดูทีวีอยู่",
        "The negative form adds 'not' after am/is/are: am not, isn't, aren't."),
    woq("present-continuous-9", "พูดว่า: เธอไม่ได้กำลังฟังเพลงอยู่", ["to music", "She", "isn't", "listening"],
        ["She", "isn't", "listening", "to music"], "/ʃiː ˈɪzənt ˈlɪsənɪŋ tuː ˈmjuːzɪk/", "เธอไม่ได้กำลังฟังเพลงอยู่",
        "'Isn't' is the short negative form of 'is not'."),
    woq("present-continuous-10", "พูดว่า: เรากำลังทานอาหารเย็นด้วยกันอยู่", ["together", "We", "are", "having", "dinner"],
        ["We", "are", "having", "dinner", "together"], "/wiː ɑːr ˈhævɪŋ ˈdɪnər təˈɡɛðər/", "เรากำลังทานอาหารเย็นด้วยกันอยู่",
        "Present Continuous can describe an action happening right now, even for verbs like 'have' meaning 'eat'."),
]

# ---------- going-to-future ----------
p = by_id["going-to-future"]
p["examples"] += [
    ex("We are not going to travel this year.", "/wiː ɑːr nɒt ˈɡoʊɪŋ tuː ˈtrævəl ðɪs jɪr/", "ปีนี้เราจะไม่เดินทาง"),
    ex("Is she going to call you tonight?", "/ɪz ʃiː ˈɡoʊɪŋ tuː kɔːl juː təˈnaɪt/", "คืนนี้เธอจะโทรหาคุณไหม"),
]
p["wordOrderQuestions"] += [
    woq("going-to-6", "พูดว่า: เราจะไปเยี่ยมประเทศญี่ปุ่น", ["Japan", "We", "are going to", "visit"],
        ["We", "are going to", "visit", "Japan"], "/wiː ɑːr ˈɡoʊɪŋ tuː ˈvɪzɪt dʒəˈpæn/", "เราจะไปเยี่ยมประเทศญี่ปุ่น",
        "Subject + are going to + base verb + object."),
    woq("going-to-7", "พูดว่า: คืนนี้เธอจะทำพาสต้า", ["tonight", "She", "is going to", "cook", "pasta"],
        ["She", "is going to", "cook", "pasta", "tonight"], "/ʃiː ɪz ˈɡoʊɪŋ tuː kʊk ˈpæstə təˈnaɪt/", "คืนนี้เธอจะทำพาสต้า",
        "Time expressions like 'tonight' usually come at the end of the sentence."),
    woq("going-to-8", "พูดว่า: พวกเขาจะไม่มา", ["come", "They", "are not going to"],
        ["They", "are not going to", "come"], "/ðeɪ ɑːr nɒt ˈɡoʊɪŋ tuː kʌm/", "พวกเขาจะไม่มา",
        "The negative form adds 'not' after am/is/are: are not going to."),
    woq("going-to-9", "พูดว่า: เขาจะซื้อรถคันใหม่ไหม", ["a new car", "Is he going to", "buy"],
        ["Is he going to", "buy", "a new car"], "/ɪz hiː ˈɡoʊɪŋ tuː baɪ ə njuː kɑːr/", "เขาจะซื้อรถคันใหม่ไหม",
        "Questions invert the subject and 'is/are': Is + subject + going to + verb?"),
    woq("going-to-10", "พูดว่า: ฉันจะเริ่มงานใหม่", ["a new job", "I", "am going to", "start"],
        ["I", "am going to", "start", "a new job"], "/aɪ æm ˈɡoʊɪŋ tuː stɑːrt ə njuː dʒɒb/", "ฉันจะเริ่มงานใหม่",
        "'I' always takes 'am' before 'going to'."),
]

# ---------- will-future ----------
p = by_id["will-future"]
p["examples"] += [
    ex("Will you help me with this?", "/wɪl juː hɛlp miː wɪð ðɪs/", "คุณจะช่วยฉันเรื่องนี้ไหม"),
    ex("I think it will be sunny tomorrow.", "/aɪ θɪŋk ɪt wɪl biː ˈsʌni təˈmɒroʊ/", "ฉันคิดว่าพรุ่งนี้อากาศจะแจ่มใส"),
]
p["wordOrderQuestions"] += [
    woq("will-future-6", "พูดว่า: คุณจะแต่งงานกับฉันไหม", ["me", "Will you", "marry"],
        ["Will you", "marry", "me"], "/wɪl juː ˈmæri miː/", "คุณจะแต่งงานกับฉันไหม",
        "Yes/no questions with 'will' invert: Will + subject + base verb?"),
    woq("will-future-7", "พูดว่า: ฉันสัญญาว่าจะทำรายงานให้เสร็จ", ["the report", "I promise I", "will", "finish"],
        ["I promise I", "will", "finish", "the report"], "/aɪ ˈprɒmɪs aɪ wɪl ˈfɪnɪʃ ðə rɪˈpɔːrt/", "ฉันสัญญาว่าจะทำรายงานให้เสร็จ",
        "'Will' is often used for promises about the future."),
    woq("will-future-8", "พูดว่า: เธอน่าจะมาสาย", ["late", "She", "will probably", "be"],
        ["She", "will probably", "be", "late"], "/ʃiː wɪl ˈprɒbəbli biː leɪt/", "เธอน่าจะมาสาย",
        "Adverbs like 'probably' usually go between 'will' and the base verb."),
    woq("will-future-9", "พูดว่า: ฉันจะไม่มีวันลืมวันนี้", ["this day", "I", "will never", "forget"],
        ["I", "will never", "forget", "this day"], "/aɪ wɪl ˈnɛvər fərˈɡɛt ðɪs deɪ/", "ฉันจะไม่มีวันลืมวันนี้",
        "'Will never' is the negative form used for strong future predictions."),
    woq("will-future-10", "พูดว่า: รถไฟจะมาถึงตอนหกโมง", ["at six", "The train", "will", "arrive"],
        ["The train", "will", "arrive", "at six"], "/ðə treɪn wɪl əˈraɪv æt sɪks/", "รถไฟจะมาถึงตอนหกโมง",
        "'Will' is commonly used for scheduled or predicted future events."),
]

# ---------- there-is-are ----------
p = by_id["there-is-are"]
p["examples"] += [
    ex("Is there a bank near here?", "/ɪz ðɛr ə bæŋk nɪr hɪr/", "แถวนี้มีธนาคารไหม"),
    ex("There were many people at the party.", "/ðɛr wɜːr ˈmɛni ˈpiːpəl æt ðə ˈpɑːrti/", "มีคนมากมายในงานปาร์ตี้"),
]
p["wordOrderQuestions"] += [
    woq("there-is-are-6", "พูดว่า: แถวนี้มีโรงพยาบาลไหม", ["nearby", "Is there", "a hospital"],
        ["Is there", "a hospital", "nearby"], "/ɪz ðɛr ə ˈhɒspɪtəl ˈnɪrbaɪ/", "แถวนี้มีโรงพยาบาลไหม",
        "Questions with 'there is/are' invert to 'Is/Are there'."),
    woq("there-is-are-7", "พูดว่า: มีนักเรียนสิบคนอยู่ในห้อง", ["in the room", "There were", "ten students"],
        ["There were", "ten students", "in the room"], "/ðɛr wɜːr tɛn ˈstuːdənts ɪn ðə ruːm/", "มีนักเรียนสิบคนอยู่ในห้อง",
        "'There were' is the past form, used with plural nouns."),
    woq("there-is-are-8", "พูดว่า: ไม่มีอาหารเหลืออยู่เลย", ["left", "There wasn't", "any food"],
        ["There wasn't", "any food", "left"], "/ðɛr ˈwʌzənt ˈɛni fuːd lɛft/", "ไม่มีอาหารเหลืออยู่เลย",
        "'There wasn't' is the past negative, used with singular/uncountable nouns."),
    woq("there-is-are-9", "พูดว่า: มีรถยนต์มากมายอยู่บนถนน", ["on the road", "There are", "a lot of cars"],
        ["There are", "a lot of cars", "on the road"], "/ðɛr ɑːr ə lɒt ʌv kɑːrz ɒn ðə roʊd/", "มีรถยนต์มากมายอยู่บนถนน",
        "'A lot of' works with both countable and uncountable nouns after 'there are'."),
    woq("there-is-are-10", "พูดว่า: ไม่มีอะไรอยู่ในกล่องเลย", ["in the box", "There is", "nothing"],
        ["There is", "nothing", "in the box"], "/ðɛr ɪz ˈnʌθɪŋ ɪn ðə bɒks/", "ไม่มีอะไรอยู่ในกล่องเลย",
        "'Nothing' already has a negative meaning, so 'there is' stays affirmative."),
]

# ---------- can-could-ability ----------
p = by_id["can-could-ability"]
p["examples"] += [
    ex("Could you pass me the salt?", "/kʊd juː pæs miː ðə sɔːlt/", "ช่วยส่งเกลือให้หน่อยได้ไหม"),
    ex("Can I ask you a question?", "/kæn aɪ æsk juː ə ˈkwɛstʃən/", "ฉันขอถามคำถามได้ไหม"),
]
p["wordOrderQuestions"] += [
    woq("can-could-6", "พูดว่า: คุณพูดภาษาอังกฤษได้ไหม", ["English", "Can you", "speak"],
        ["Can you", "speak", "English"], "/kæn juː spiːk ˈɪŋɡlɪʃ/", "คุณพูดภาษาอังกฤษได้ไหม",
        "Yes/no questions with 'can' invert: Can + subject + base verb?"),
    woq("can-could-7", "พูดว่า: ตอนอายุห้าขวบฉันขี่จักรยานได้", ["when I was five", "I", "could", "ride", "a bike"],
        ["I", "could", "ride", "a bike", "when I was five"], "/aɪ kʊd raɪd ə baɪk wɛn aɪ wɒz faɪv/", "ตอนอายุห้าขวบฉันขี่จักรยานได้",
        "'Could' describes an ability someone had in the past."),
    woq("can-could-8", "พูดว่า: เธอร้องเพลงได้ไม่ค่อยดีนัก", ["very well", "She", "can't", "sing"],
        ["She", "can't", "sing", "very well"], "/ʃiː kænt sɪŋ ˈvɛri wɛl/", "เธอร้องเพลงได้ไม่ค่อยดีนัก",
        "'Can't' + base verb makes the ability negative."),
    woq("can-could-9", "พูดว่า: ช่วยฉันสักครู่ได้ไหม", ["for a minute", "Could you", "help", "me"],
        ["Could you", "help", "me", "for a minute"], "/kʊd juː hɛlp miː fɔːr ə ˈmɪnɪt/", "ช่วยฉันสักครู่ได้ไหม",
        "'Could you' is also a polite way to make a request, not just talk about ability."),
    woq("can-could-10", "พูดว่า: เราเจอกันพรุ่งนี้ได้ถ้าคุณต้องการ", ["if you want", "We can", "meet", "tomorrow"],
        ["We can", "meet", "tomorrow", "if you want"], "/wiː kæn miːt təˈmɒroʊ ɪf juː wɒnt/", "เราเจอกันพรุ่งนี้ได้ถ้าคุณต้องการ",
        "'Can' is also used to talk about future possibilities, not just present ability."),
]

# ---------- comparatives ----------
p = by_id["comparatives"]
p["examples"] += [
    ex("The weather today is worse than yesterday.", "/ðə ˈwɛðər təˈdeɪ ɪz wɜːrs ðæn ˈjɛstərdeɪ/", "อากาศวันนี้แย่กว่าเมื่อวาน"),
    ex("This exercise is easier than the last one.", "/ðɪs ˈɛksərsaɪz ɪz ˈiːziər ðæn ðə læst wʌn/", "แบบฝึกหัดนี้ง่ายกว่าอันที่แล้ว"),
]
p["wordOrderQuestions"] += [
    woq("comparatives-6", "พูดว่า: กาแฟนี้เข้มกว่าชานั้น", ["than that tea", "This coffee", "is", "stronger"],
        ["This coffee", "is", "stronger", "than that tea"], "/ðɪs ˈkɒfi ɪz ˈstrɒŋɡər ðæn ðæt tiː/", "กาแฟนี้เข้มกว่าชานั้น",
        "Short adjectives add -er: strong → stronger."),
    woq("comparatives-7", "พูดว่า: น้องชายของฉันอายุน้อยกว่าฉัน", ["than me", "My brother", "is", "younger"],
        ["My brother", "is", "younger", "than me"], "/maɪ ˈbrʌðər ɪz ˈjʌŋɡər ðæn miː/", "น้องชายของฉันอายุน้อยกว่าฉัน",
        "Adjective + -er + than + the person or thing being compared."),
    woq("comparatives-8", "พูดว่า: ข้อสอบนี้ยากกว่าที่ฉันคาดไว้", ["than I expected", "This test", "was", "more difficult"],
        ["This test", "was", "more difficult", "than I expected"], "/ðɪs tɛst wɒz mɔːr ˈdɪfɪkəlt ðæn aɪ ɪkˈspɛktɪd/", "ข้อสอบนี้ยากกว่าที่ฉันคาดไว้",
        "Longer adjectives use 'more' instead of -er: difficult → more difficult."),
    woq("comparatives-9", "พูดว่า: บ้านใหม่ของเธอเล็กกว่าหลังเก่า", ["than the old one", "Her new house", "is", "smaller"],
        ["Her new house", "is", "smaller", "than the old one"], "/hər njuː haʊs ɪz ˈsmɔːlər ðæn ði oʊld wʌn/", "บ้านใหม่ของเธอเล็กกว่าหลังเก่า",
        "Short adjectives ending in a single vowel + consonant sometimes double the consonant before -er, e.g. big → bigger."),
    woq("comparatives-10", "พูดว่า: กระเป๋าใบนี้แย่กว่าใบเก่าของฉัน", ["than my old one", "This bag", "is", "worse"],
        ["This bag", "is", "worse", "than my old one"], "/ðɪs bæɡ ɪz wɜːrs ðæn maɪ oʊld wʌn/", "กระเป๋าใบนี้แย่กว่าใบเก่าของฉัน",
        "'Bad' is irregular: bad → worse, not 'badder'."),
]

# ---------- zero-conditional ----------
p = by_id["zero-conditional"]
p["examples"] += [
    ex("If you don't water plants, they die.", "/ɪf juː doʊnt ˈwɔːtər plænts, ðeɪ daɪ/", "ถ้าคุณไม่รดน้ำต้นไม้ มันจะตาย"),
    ex("Ice melts if the temperature rises.", "/aɪs mɛlts ɪf ðə ˈtɛmprətʃər ˈraɪzɪz/", "น้ำแข็งจะละลายถ้าอุณหภูมิสูงขึ้น"),
]
p["wordOrderQuestions"] += [
    woq("zero-conditional-6", "พูดว่า: ถ้าคุณต้มน้ำ มันจะระเหย", ["it evaporates", "If you boil water,"],
        ["If you boil water,", "it evaporates"], "/ɪf juː bɔɪl ˈwɔːtər, ɪt ɪˈvæpəreɪts/", "ถ้าคุณต้มน้ำ มันจะระเหย",
        "Zero conditional describes scientific facts: If + present simple, + present simple."),
    woq("zero-conditional-7", "พูดว่า: ถ้าดวงอาทิตย์ตก ท้องฟ้าจะมืด", ["it gets dark", "If the sun sets,"],
        ["If the sun sets,", "it gets dark"], "/ɪf ðə sʌn sɛts, ɪt ɡɛts dɑːrk/", "ถ้าดวงอาทิตย์ตก ท้องฟ้าจะมืด",
        "Both clauses use present simple, describing a general truth."),
    woq("zero-conditional-8", "พูดว่า: ถ้าคนนอนไม่พอ พวกเขาจะป่วย", ["they get sick", "If people don't sleep enough,"],
        ["If people don't sleep enough,", "they get sick"], "/ɪf ˈpiːpəl doʊnt sliːp ɪˈnʌf, ðeɪ ɡɛt sɪk/", "ถ้าคนนอนไม่พอ พวกเขาจะป่วย",
        "The if-clause can be negative: If + subject + don't/doesn't + base verb."),
    woq("zero-conditional-9", "พูดว่า: ถ้าคุณแช่แข็งน้ำ มันจะกลายเป็นน้ำแข็ง", ["it turns to ice", "If you freeze water,"],
        ["If you freeze water,", "it turns to ice"], "/ɪf juː friːz ˈwɔːtər, ɪt tɜːrnz tuː aɪs/", "ถ้าคุณแช่แข็งน้ำ มันจะกลายเป็นน้ำแข็ง",
        "Zero conditional sentences are always true under that condition, like scientific facts."),
    woq("zero-conditional-10", "พูดว่า: ถ้าโลหะร้อนขึ้น มันจะขยายตัว", ["it expands", "If metal gets hot,"],
        ["If metal gets hot,", "it expands"], "/ɪf ˈmɛtəl ɡɛts hɒt, ɪt ɪkˈspændz/", "ถ้าโลหะร้อนขึ้น มันจะขยายตัว",
        "The comma separates the if-clause from the result when 'if' begins the sentence."),
]

# ---------- first-conditional ----------
p = by_id["first-conditional"]
p["examples"] += [
    ex("If it's sunny tomorrow, we will go to the beach.", "/ɪf ɪts ˈsʌni təˈmɒroʊ, wiː wɪl ɡoʊ tuː ðə biːtʃ/", "ถ้าพรุ่งนี้อากาศแจ่มใส เราจะไปทะเล"),
    ex("If you don't practice, you won't improve.", "/ɪf juː doʊnt ˈpræktɪs, juː woʊnt ɪmˈpruːv/", "ถ้าคุณไม่ฝึกฝน คุณจะไม่พัฒนาขึ้น"),
]
p["wordOrderQuestions"] += [
    woq("first-conditional-6", "พูดว่า: ถ้าฉันมีเวลา ฉันจะไปเยี่ยมคุณ", ["I will visit you", "If I have time,"],
        ["If I have time,", "I will visit you"], "/ɪf aɪ hæv taɪm, aɪ wɪl ˈvɪzɪt juː/", "ถ้าฉันมีเวลา ฉันจะไปเยี่ยมคุณ",
        "First conditional: If + present simple, + subject + will + base verb."),
    woq("first-conditional-7", "พูดว่า: ถ้าคุณกินมากเกินไป คุณจะรู้สึกไม่สบาย", ["you will feel sick", "If you eat too much,"],
        ["If you eat too much,", "you will feel sick"], "/ɪf juː iːt tuː mʌtʃ, juː wɪl fiːl sɪk/", "ถ้าคุณกินมากเกินไป คุณจะรู้สึกไม่สบาย",
        "The result clause always uses will + base verb for a likely future outcome."),
    woq("first-conditional-8", "พูดว่า: ถ้าเธอไม่รีบ เธอจะพลาดรถบัส", ["she will miss the bus", "If she doesn't hurry,"],
        ["If she doesn't hurry,", "she will miss the bus"], "/ɪf ʃiː ˈdʌzənt ˈhʌri, ʃiː wɪl mɪs ðə bʌs/", "ถ้าเธอไม่รีบ เธอจะพลาดรถบัส",
        "The if-clause can be negative too, using doesn't + base verb."),
    woq("first-conditional-9", "พูดว่า: ถ้าเราเก็บเงิน เราจะซื้อบ้าน", ["we will buy a house", "If we save money,"],
        ["If we save money,", "we will buy a house"], "/ɪf wiː seɪv ˈmʌni, wiː wɪl baɪ ə haʊs/", "ถ้าเราเก็บเงิน เราจะซื้อบ้าน",
        "First conditional talks about real, possible future plans."),
    woq("first-conditional-10", "พูดว่า: ถ้าคุณเลี้ยวซ้าย คุณจะเห็นร้านค้า", ["you will see the store", "If you turn left,"],
        ["If you turn left,", "you will see the store"], "/ɪf juː tɜːrn lɛft, juː wɪl siː ðə stɔːr/", "ถ้าคุณเลี้ยวซ้าย คุณจะเห็นร้านค้า",
        "First conditional is often used to give directions or instructions with a likely result."),
]

# Validate: every correctOrder item must exist among the chunk texts (same
# multiset), for every word-order question across ALL patterns.
for pat in patterns:
    for q in pat["wordOrderQuestions"]:
        chunk_texts = sorted(c["text"] for c in q["chunks"])
        order_texts = sorted(q["correctOrder"])
        assert chunk_texts == order_texts, f"MISMATCH in {q['id']}: {chunk_texts} vs {order_texts}"

with open("src/data/sentencePatterns.json", "w", encoding="utf-8") as f:
    json.dump(patterns, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("OK -", len(patterns), "patterns")
total_ex = 0
total_woq = 0
for pt in patterns:
    print(pt["id"], "examples:", len(pt["examples"]), "woq:", len(pt["wordOrderQuestions"]))
    total_ex += len(pt["examples"])
    total_woq += len(pt["wordOrderQuestions"])
print("TOTAL examples:", total_ex, "TOTAL woq:", total_woq)
