import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;
