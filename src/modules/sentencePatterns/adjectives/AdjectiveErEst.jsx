import AdjectiveTopicForm from "./AdjectiveTopicForm";

export default function AdjectiveErEst() {
  return (
    <AdjectiveTopicForm
      ruleGroup="er-est"
      heading={
        <>
          <h3 className="lesson-heading">📘 คำคุณศัพท์สั้น (-er / -est)</h3>
          <div className="time-note th-text">
            <span>⏰</span> คำสั้นๆ เติม -er สำหรับขั้นกว่า และ -est สำหรับขั้นสุด บางคำเบิ้ลพยัญชนะท้าย (big → bigger) หรือ
            เปลี่ยน y เป็น i ก่อนเติม (happy → happier)
          </div>
        </>
      }
    />
  );
}
