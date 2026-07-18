import TopicForm from "./TopicForm";

export default function TopicPresentParticiple() {
  return (
    <TopicForm
      field="presentParticiple"
      heading={
        <>
          <h3 className="lesson-heading">🔗 Present Continuous (-ing)</h3>
          <div className="time-note th-text">
            <span>⏰</span> เติม -ing ท้ายกริยา ใช้กฎเดียวกันทั้ง regular และ irregular verb
          </div>
        </>
      }
    />
  );
}
