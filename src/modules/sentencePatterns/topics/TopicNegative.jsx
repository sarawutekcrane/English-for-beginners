import TopicForm from "./TopicForm";

export default function TopicNegative() {
  return (
    <TopicForm
      field="negative"
      heading={
        <>
          <h3 className="lesson-heading">🚫 Negative (don't / doesn't)</h3>
          <div className="time-note th-text">
            <span>⏰</span> ใช้ don't/doesn't + กริยารูปพื้นฐาน ไม่ว่ากริยาจะเป็น regular หรือ irregular ก็ใช้กฎเดียวกัน
          </div>
        </>
      }
    />
  );
}
