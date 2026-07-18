import AdjectiveTopicForm from "./AdjectiveTopicForm";

export default function AdjectiveMoreMost() {
  return (
    <AdjectiveTopicForm
      ruleGroup="more-most"
      heading={
        <>
          <h3 className="lesson-heading">📗 คำคุณศัพท์ยาว (more / most)</h3>
          <div className="time-note th-text">
            <span>⏰</span> คำยาว (มักมี 2 พยางค์ขึ้นไป) ไม่เติมท้ายคำ แต่ใช้ more นำหน้าสำหรับขั้นกว่า และ most นำหน้าสำหรับขั้นสุด
          </div>
        </>
      }
    />
  );
}
