import AdjectiveTopicForm from "./AdjectiveTopicForm";

export default function AdjectiveException() {
  return (
    <AdjectiveTopicForm
      ruleGroup="irregular"
      heading={
        <>
          <h3 className="lesson-heading">⚠️ ข้อยกเว้นพิเศษ (Irregular)</h3>
          <div className="time-note th-text">
            <span>⏰</span> คำเหล่านี้ไม่เติม -er/-est และไม่ใช้ more/most แต่เปลี่ยนรูปคำไปเลย เช่น good → better → best
            ต้องท่องจำแยกไว้เป็นพิเศษ
          </div>
        </>
      }
    />
  );
}
