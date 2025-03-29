import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./layout.jsx";
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Visualiser from './pages/visualiser.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="/about" element={<About />} />
          <Route path="/visualiser" element={<Visualiser />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
