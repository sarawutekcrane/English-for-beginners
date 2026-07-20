import TopicForm from "./TopicForm";

export default function TopicPresent() {
  return (
    <TopicForm
      field="present"
      heading={
        <>
          <h3 className="lesson-heading">✅ ผันกริยา Present Simple (he/she/it)</h3>
          <div className="time-note th-text">
            <span>⏰</span> เติม -s ท้ายกริยาเมื่อประธานเป็น he/she/it เท่านั้น ประธานอื่นๆ ใช้กริยารูปพื้นฐานตามปกติ
          </div>
        </>
      }
    />
  );
}
