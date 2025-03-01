import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NewPage from "./new-pages/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-pages" element={<NewPage />} />
      </Routes>
    </Router>
  );
}

export default App;