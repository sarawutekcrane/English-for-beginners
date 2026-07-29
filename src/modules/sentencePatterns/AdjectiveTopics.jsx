import { useState } from "react";
import { useSwipeBack } from "../../hooks/useSwipeBack";
import AdjectiveIntro from "./adjectives/AdjectiveIntro";
import AdjectiveErEst from "./adjectives/AdjectiveErEst";
import AdjectiveMoreMost from "./adjectives/AdjectiveMoreMost";
import AdjectiveException from "./adjectives/AdjectiveException";
import AdjectiveComparisonTable from "./adjectives/AdjectiveComparisonTable";

const TOPICS = [
  { id: "intro", emoji: "💡", title: "3 กลุ่มการผันคำคุณศัพท์เปรียบเทียบ", Component: AdjectiveIntro },
  { id: "erest", emoji: "📘", title: "คำคุณศัพท์สั้น (-er / -est)", Component: AdjectiveErEst },
  { id: "moremost", emoji: "📗", title: "คำคุณศัพท์ยาว (more / most)", Component: AdjectiveMoreMost },
  { id: "exception", emoji: "⚠️", title: "ข้อยกเว้นพิเศษ (Irregular)", Component: AdjectiveException },
  { id: "comparison", emoji: "📊", title: "ตารางเปรียบเทียบทุกรูป", Component: AdjectiveComparisonTable },
];

function TopicList({ onPick, onBack }) {
  useSwipeBack(onBack);
  return (
    <div className="picker">
      <button className="btn btn-outline btn-sm" onClick={onBack}>
        ← เปลี่ยนหมวดหมู่
      </button>

      <section className="picker-section">
        <h3 className="picker-heading">🎨 สอนและอธิบายคำคุณศัพท์</h3>
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
  useSwipeBack(onBackToList);
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

export default function AdjectiveTopics({ onBack }) {
  const [index, setIndex] = useState(null);

  if (index === null) return <TopicList onPick={setIndex} onBack={onBack} />;
  return <TopicDetail index={index} onBackToList={() => setIndex(null)} onNext={() => setIndex((i) => i + 1)} />;
}
