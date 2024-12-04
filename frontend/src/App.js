import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./loginpage";
import WelcomePage from "./welcompage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
    </Routes>
  );
};

export default App;
