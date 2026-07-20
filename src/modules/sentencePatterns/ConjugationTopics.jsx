import { useState } from "react";
import TopicIntro from "./topics/TopicIntro";
import TopicPresent from "./topics/TopicPresent";
import TopicPast from "./topics/TopicPast";
import TopicPresentParticiple from "./topics/TopicPresentParticiple";
import TopicNegative from "./topics/TopicNegative";
import TopicComparisonVerbs from "./topics/TopicComparisonVerbs";

const TOPICS = [
  { id: "intro", emoji: "🔤", title: "กริยาปกติและกริยาไม่ปกติ (Regular vs Irregular)", Component: TopicIntro },
  { id: "present", emoji: "✅", title: "ผันกริยา Present Simple (he/she/it)", Component: TopicPresent },
  { id: "past", emoji: "⏪", title: "ผันกริยา Past Simple (อดีต)", Component: TopicPast },
  { id: "presentParticiple", emoji: "🔗", title: "ผันกริยา Present Continuous (-ing)", Component: TopicPresentParticiple },
  { id: "negative", emoji: "🚫", title: "รูปปฏิเสธของกริยา (don't / doesn't)", Component: TopicNegative },
  { id: "comparison", emoji: "📊", title: "ตารางเปรียบเทียบทุกรูป", Component: TopicComparisonVerbs },
];

function TopicList({ onPick, onBack }) {
  return (
    <div className="picker">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <section className="picker-section">
        <h3 className="picker-heading">🔤 สอนและอธิบายวิธีการผันกริยา</h3>
        <div className="pattern-list">
          {TOPICS.map((t, i) => (
            <button key={t.id} className="pattern-list-btn" onClick={() => onPick(i)}>
              <span className="pattern-list-order">{t.emoji}</span>
              <span className="pattern-list-title">{t.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function TopicDetail({ index, onBackToList, onNext }) {
  const topic = TOPICS[index];
  const isLast = index === TOPICS.length - 1;
  const { Component } = topic;

  return (
    <div className="lesson-view">
      <button className="btn btn-outline btn-sm" onClick={onBackToList}>
        ← หัวข้อทั้งหมด
      </button>
      <Component />
      <button className="btn btn-success" onClick={isLast ? onBackToList : onNext}>
        {isLast ? "กลับไปหัวข้อทั้งหมด" : `หัวข้อถัดไป: ${TOPICS[index + 1].title} →`}
      </button>
    </div>
  );
}

export default function ConjugationTopics({ onBack }) {
  const [index, setIndex] = useState(null);

  if (index === null) return <TopicList onPick={setIndex} onBack={onBack} />;
  return <TopicDetail index={index} onBackToList={() => setIndex(null)} onNext={() => setIndex((i) => i + 1)} />;
}
