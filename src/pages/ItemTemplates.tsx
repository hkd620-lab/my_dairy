export default function ItemTemplates() {
  const handleAdd = () => {
    console.log("항목 추가 버튼 클릭");
  };

  return (
    <div>
      <h1>항목 관리</h1>
      <button onClick={handleAdd}>+ 항목 추가</button>
    </div>
  );
}
