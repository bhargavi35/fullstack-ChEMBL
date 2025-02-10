import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompoundSearch from "./components/CompoundSearch";
import CompoundChart from "./components/CompoundChart";
import CompoundDetail from "./components/CompoundDetail";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CompoundSearch />} />
          <Route path="/charts" element={<CompoundChart />} />
          <Route path="/compound/:chemblId" element={<CompoundDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
