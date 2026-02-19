import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io ("https://kalakshepa-1.onrender.com");

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Join room
  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setCurrentMessage("");
    }
  };

  // Receive message
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      {!joined ? (
        <div style={joinBox}>
          <h2>Join Kalakshepa Chat</h2>

          <input
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => setRoom(e.target.value)}
            style={inputStyle}
          />

          <button onClick={joinRoom} style={buttonStyle}>
            Join Chat
          </button>
        </div>
      ) : (
        <div style={chatContainer}>
          <h2>Kalakshepa Chat</h2>

          <div style={messageContainer}>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.author === username;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: isOwnMessage
                      ? "flex-end"
                      : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      background: isOwnMessage
                        ? "#4CAF50"
                        : "#333",
                      padding: 10,
                      borderRadius: 10,
                      maxWidth: "70%",
                      color: "white",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      {isOwnMessage ? "You" : msg.author}
                    </div>

                    <div>{msg.message}</div>

                    <div
                      style={{
                        fontSize: 10,
                        textAlign: "right",
                        marginTop: 4,
                        opacity: 0.7,
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={currentMessage}
              placeholder="Type message..."
              onChange={(e) =>
                setCurrentMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 5,
                border: "none",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: 5,
                padding: "10px 15px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 5,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const joinBox = {
  background: "#1e1e1e",
  padding: 20,
  borderRadius: 10,
  width: 300,
  color: "white",
};

const chatContainer = {
  width: 400,
  background: "#1e1e1e",
  padding: 20,
  borderRadius: 10,
  color: "white",
};

const messageContainer = {
  height: 300,
  overflowY: "auto",
  border: "1px solid #444",
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
  border: "none",
};

const buttonStyle = {
  width: "100%",
  padding: 10,
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: 5,
};

export default Chat;


