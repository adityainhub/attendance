import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Home from "./Admin/AdminLogin"
import AdminDash from "./Admin/AdminDash";
import Contracter from "./Admin/Contractor";
import AddMember from "./Admin/AddMember";
import About from "./Admin/About";
import Footer from "./Admin/Footer";

function App() {
 // const isBackgroundRed=false;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admindash" element={<AdminDash />} />
          <Route path='/contracter/:id' element={<Contracter />} />
          <Route path='addmember' element={<AddMember />} />
          <Route path='/about' element={<About />} />
          <Route path='/roles/:id/:projectName' element={<Roles />} />
        </Routes>
        
      
      </BrowserRouter>
    </>
  );
}

export default App;
