import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListingApp from "./ListingApp";
import PhotoApp from "./PhotoApp";
import UrlUpload from "./UrlUpload";
import ComputerUpload from "./ComputerUpload";
import Home from "./Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Listing" element={<ListingApp />} />
        <Route path="/Photo" element={<PhotoApp />} />
        <Route path="/UrlUpload" element={<UrlUpload />} />
        <Route path="/ComputerUpload" element={<ComputerUpload />} />
      </Routes>
    </Router>
  );
};

export default App;
