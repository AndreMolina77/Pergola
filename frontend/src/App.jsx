import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import CustomDesigns from "./pages/CustomDesigns"; // <-- IMPORTA EL NUEVO COMPONENTE

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/customdesigns" element={<CustomDesigns />} /> {/* NUEVA RUTA */}
      </Routes>
    </Router>
  );
}

export default App;
