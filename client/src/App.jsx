import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Chat from "./Chat";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>Kalakshepa</h1>

        <Link to="/chat">Go to Chat</Link>

        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;




