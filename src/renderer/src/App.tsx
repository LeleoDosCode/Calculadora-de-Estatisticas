import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DNA from "./pages/DNA";
import DASIC from "./pages/DASIC";
import DACIC from "./pages/DACIC";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/DNA" element={<DNA />} />
        <Route path="/DASIC" element={<DASIC />} />
        <Route path="/DACIC" element={<DACIC />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;