const CardBox = ({ title, backgroundColor, fontColor, children }) => {
  return (
    <div
      className="rounded-xl py-2 px-2"
      style={{
        backgroundColor: backgroundColor || "transparent", 
        color: fontColor || "black", 
      }}
    >
      <div className="text-start text-xl font-bold">{title}</div>
      {children}
    </div>
  );
};

export default CardBox;
