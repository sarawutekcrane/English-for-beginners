import { useEffect, useState } from "react";
import AnnotatedText from "../components/AnnotatedText";
import Toggle from "../components/Toggle";
import { useSpeak } from "../hooks/useSpeech";
import { useSwipeBack } from "../hooks/useSwipeBack";
import { shuffle } from "../utils/content";
import { playCorrect, playIncorrect } from "../utils/sound";
import conversations from "../data/conversations.json";

// Shared canned retry line, hard-coded app-wide (not per-topic data), shown
// whenever the learner picks an incorrect reply option.
const MISUNDERSTANDING = {
  text: "Sorry, could you say that again?",
  phonetic: "/ˈsɒri, kʊd juː seɪ ðæt əˈɡɛn/",
  thai: "ขอโทษค่ะ ช่วยพูดอีกครั้งได้ไหมคะ",
};

// Local registry mirroring SectionPicker.jsx's pattern (a single consumer,
// so this lives beside Conversation.jsx rather than in the shared
// content.js VOCAB_CATEGORIES registry, which is read by four modules).
const CONVERSATION_GROUPS = [
  { id: "travel", emoji: "🧳", title: "การเดินทางและท่องเที่ยว", subtitle: "ถนน โรงแรม สนามบิน แท็กซี่" },
  { id: "shopping_services", emoji: "🛍️", title: "ช้อปปิ้งและบริการต่างๆ", subtitle: "ร้านอาหาร เสื้อผ้า ธนาคาร คลินิก" },
  { id: "social", emoji: "🗣️", title: "การเข้าสังคมและพูดคุยทั่วไป", subtitle: "ทำความรู้จัก นัดหมาย พูดคุยเล่น" },
  { id: "safety_officer", emoji: "🦺", title: "งานเซฟตี้", subtitle: "Safety Officer" },
  { id: "office_communication", emoji: "💼", title: "งานสื่อสารในออฟฟิศ", subtitle: "Office Communication" },
];

function GroupPicker({ onPick }) {
  return (
    <div className="picker">
      <section className="picker-section">
        <h3 className="picker-heading">💬 เลือกหมวดสถานการณ์</h3>
        <div className="module-grid">
          {CONVERSATION_GROUPS.map((g) => (
            <button key={g.id} className="module-card" onClick={() => onPick(g)}>
              <span className="module-emoji">{g.emoji}</span>
              <span className="module-title th-text">{g.title}</span>
              <span className="module-subtitle th-text">{g.subtitle}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function TopicPicker({ group, onPick, onBack }) {
  useSwipeBack(onBack);
  const topics = conversations.filter((t) => t.group === group.id);
  return (
    <div className="picker">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดสถานการณ์
      </button>
      <section className="picker-section">
        <h3 className="picker-heading">
          {group.emoji} {group.title} · เลือกสถานการณ์ที่อยากฝึก
        </h3>
        <div className="topic-grid">
          {topics.map((topic) => (
            <button key={topic.id} className="topic-card" onClick={() => onPick(topic)}>
              <span className="module-emoji">{topic.emoji}</span>
              <span className="module-title th-text">{topic.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Single chokepoint for rendering a conversation line -- history entries,
 * the current-turn system bubble, the pending-reply bubble, every reply
 * option, and the misunderstanding line -- all route through here. Toggle
 * state is read once and applied uniformly; no bubble type gets its own
 * copy of this rendering logic.
 */
function ConversationLine({ line, showTranslation, showPhonetic }) {
  return (
    <>
      <AnnotatedText as="span" className="en-text" plain={line.text} segments={line.altScript} />
      {showPhonetic && <span className="bubble-romaji">{line.phonetic}</span>}
      {showTranslation && <span className="th-text bubble-thai">{line.thai}</span>}
    </>
  );
}

function DialogueView({ topic, onBack }) {
  const { speak, supported } = useSpeak();
  useSwipeBack(onBack);
  const [nodeId, setNodeId] = useState(topic.start);
  const [options, setOptions] = useState(() => shuffle(topic.nodes[topic.start].options));
  const [showTranslation, setShowTranslation] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);
  const [pendingReply, setPendingReply] = useState(null);
  const [misunderstanding, setMisunderstanding] = useState(false);

  const node = topic.nodes[nodeId];
  const currentSystem = misunderstanding ? MISUNDERSTANDING : node.system;

  useEffect(() => {
    speak(topic.nodes[topic.start].system.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replay = () => speak(currentSystem.text);
  const replayReply = () => pendingReply && speak(pendingReply.text);

  const choose = (opt) => {
    setPendingReply(opt);
    if (supported) speak(opt.text);
  };

  const confirmAttempt = () => {
    const opt = pendingReply;
    setPendingReply(null);
    if (opt.correct) {
      playCorrect();
      setHistory((h) => [...h, { system: node.system, reply: opt }]);
      if (opt.next) {
        const nextNode = topic.nodes[opt.next];
        setNodeId(opt.next);
        setOptions(shuffle(nextNode.options));
        speak(nextNode.system.text);
      } else {
        setFinished(true);
      }
    } else {
      playIncorrect();
      setMisunderstanding(true);
      speak(MISUNDERSTANDING.text);
    }
  };

  const continueMisunderstanding = () => {
    setMisunderstanding(false);
    setOptions(shuffle(node.options));
    speak(node.system.text);
  };

  const restart = () => {
    setNodeId(topic.start);
    setOptions(shuffle(topic.nodes[topic.start].options));
    setHistory([]);
    setFinished(false);
    setPendingReply(null);
    setMisunderstanding(false);
  };

  return (
    <div className="conversation-view">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนสถานการณ์
      </button>

      <p className="progress-label th-text">
        {topic.emoji} {topic.title} · รอบที่ {history.length + 1}
      </p>

      <div className="toggle-group blue">
        <Toggle label="แปล" checked={showTranslation} onChange={setShowTranslation} />
        <Toggle label="คำอ่าน" checked={showPhonetic} onChange={setShowPhonetic} />
      </div>

      <div className="conversation-history scroll-x-safe">
        {history.map((h, i) => (
          <div key={i} className="history-turn">
            <div className="bubble bubble-system">
              <ConversationLine line={h.system} showTranslation={showTranslation} showPhonetic={showPhonetic} />
            </div>
            <div className="bubble bubble-user">
              <ConversationLine line={h.reply} showTranslation={showTranslation} showPhonetic={showPhonetic} />
            </div>
          </div>
        ))}
      </div>

      {!finished ? (
        <div className="conversation-card">
          {misunderstanding ? (
            <>
              <div className="bubble bubble-system bubble-current">
                <ConversationLine line={MISUNDERSTANDING} showTranslation={showTranslation} showPhonetic={showPhonetic} />
              </div>
              <button className="btn btn-outline blue btn-sm" onClick={replay}>
                🔊 ฟังอีกครั้ง
              </button>
              <button className="btn btn-success btn-sm" onClick={continueMisunderstanding}>
                ลองตอบอีกครั้ง →
              </button>
            </>
          ) : !pendingReply ? (
            <>
              <div className="bubble bubble-system bubble-current">
                <ConversationLine line={node.system} showTranslation={showTranslation} showPhonetic={showPhonetic} />
              </div>
              <button className="btn btn-outline blue btn-sm" onClick={replay}>
                🔊 ฟังอีกครั้ง
              </button>

              <p className="th-text conversation-prompt">เลือกคำตอบของคุณ:</p>
              <div className="reply-options">
                {options.map((opt, i) => (
                  <button key={i} className="reply-option" onClick={() => choose(opt)}>
                    <ConversationLine line={opt} showTranslation={showTranslation} showPhonetic={showPhonetic} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="bubble bubble-system">
                <ConversationLine line={node.system} showTranslation={showTranslation} showPhonetic={showPhonetic} />
              </div>
              <div className="bubble bubble-user bubble-current">
                <ConversationLine line={pendingReply} showTranslation={showTranslation} showPhonetic={showPhonetic} />
              </div>
              <button className="btn btn-outline blue btn-sm" onClick={replayReply}>
                🔊 ฟังอีกครั้ง
              </button>
              <button className="btn btn-success btn-sm" onClick={confirmAttempt}>
                ดำเนินการต่อ →
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="conversation-card">
          <p className="th-text session-complete-text">จบบทสนทนาแล้ว! เก่งมากๆ เลย 🎉📘</p>
          <div className="quiz-actions">
            <button className="btn btn-outline btn-sm" onClick={restart}>
              🔁 ฝึกอีกครั้ง
            </button>
            <button className="btn btn-success btn-sm" onClick={onBack}>
              เลือกสถานการณ์อื่น →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Conversation() {
  const [group, setGroup] = useState(null);
  const [topic, setTopic] = useState(null);

  if (!group) return <GroupPicker onPick={setGroup} />;
  if (!topic) return <TopicPicker group={group} onPick={setTopic} onBack={() => setGroup(null)} />;
  return <DialogueView topic={topic} onBack={() => setTopic(null)} />;
}
