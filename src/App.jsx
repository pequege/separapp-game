import "./App.css";
import Game from "./pages/Game";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminQuestions from "./pages/AdminQuestions";

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/separapp-game" element={<Game />} />
          <Route path="/admin" element={<AdminQuestions />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
