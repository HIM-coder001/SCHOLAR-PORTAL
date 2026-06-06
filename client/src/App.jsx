import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import PastPapers from "./pages/PastPapers";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/resources" element={<PastPapers />} />
    </Routes>
  );
};

export default App;