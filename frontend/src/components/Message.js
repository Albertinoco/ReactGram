import "./Message.css";

const Message = ({ msg, type }) => {
  if (!msg) return null;

  const displayMessage =
    typeof msg === "object" ? msg.msg || JSON.stringify(msg) : msg;

  return (
    <div className={`message ${type || ""}`}>
      <p>{displayMessage}</p>
    </div>
  );
};

export default Message;
