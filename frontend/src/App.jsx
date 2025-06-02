import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Regsiter from "./pages/Regsiter";
import Home from "./pages/Home";
import Start from "./components/Start";

import io from "socket.io-client";
export const Socket = io(process.env.REACT_APP_SERVER_URL);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Regsiter />} />
        <Route path="/chats" element={<Home />} />
        <Route path="/" element={<Start />} />
      </Routes>
    </Router>
  );
}

export default App;
