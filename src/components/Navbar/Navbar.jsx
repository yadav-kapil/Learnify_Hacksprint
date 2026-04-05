import "./Navbar.css";
import myImage from "./logo.png";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={myImage} alt="logo" />
      </div>

      <div className="glass">
        <ul>
          <li onClick={() => scrollToSection("home")}>Home</li>
          <li onClick={() => scrollToSection("askAI")}>Ask AI</li>
          <li onClick={() => scrollToSection("learn")}>Practice</li>
          <li onClick={() => scrollToSection("about")}>About Us</li>
        </ul>
      </div>

      <div className="btn">
        <button onClick={() => scrollToSection("askAI")}>Try Now</button>
      </div>

      {/* ☰ Menu Icon */}
      <div className="menuIcon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* 📱 Mobile Menu */}
      <div className={`mobileMenu ${menuOpen ? "active" : ""}`}>
        <li onClick={() => scrollToSection("home")}>Home</li>
        <li onClick={() => scrollToSection("askAI")}>Ask AI</li>
        <li onClick={() => scrollToSection("learn")}>Practice</li>
        <li onClick={() => scrollToSection("about")}>About Us</li>
      </div>
    </div>
  );
};

export default Navbar;