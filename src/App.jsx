import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./Layout";
import Home from "./pages/home";
import About from "./pages/about";
import Visualiser from './pages/Visualiser'

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
