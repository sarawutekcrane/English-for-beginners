import TopicForm from "./TopicForm";

export default function TopicPast() {
  return (
    <TopicForm
      field="past"
      heading={
        <>
          <h3 className="lesson-heading">⏪ ผันกริยา Past Simple (อดีต)</h3>
          <div className="time-note th-text">
            <span>⏰</span> ใช้พูดถึงเหตุการณ์ที่จบไปแล้วในอดีต กริยา regular เติม -ed แต่กริยา irregular ต้องจำรูปแยกต่างหาก
          </div>
        </>
      }
    />
  );
}
