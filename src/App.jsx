import { useState } from "react";
import "./App.css";
import AboutUs from "./components/About Page/about";
import AskAI from "./components/Ask Ai/askAnime";
import PageTwo from "./components/Ask Ai/PageTwo";
import ContactPage from "./components/Contact Page/contactPage";
import ContactBtn from "./components/Hero/contactBtn";
import Hero from "./components/Hero/hero";
import MainContent from "./components/Hero/mainContent";
import Hover from "./components/hoverEffect/hover";
import Navbar from "./components/Navbar/Navbar";
import Practice from "./components/PracticePage/Practice";
import { getRemaining } from "./utils/apiLimiter";

function App() {

  const [credits, setCredits] = useState(getRemaining());

  return (
    <>
      {/* 🏠 Home Section */}
      <div className="landingPage" id="home">
        <Navbar credits={credits} />
        <MainContent />
        <ContactBtn />
        <div className="hero">
          <Hero />
        </div>
      </div>

      {/* 🤖 Ask AI Section */}
      <div className="pageTwo" id="askAI">
        <AskAI />
        <PageTwo setCredits={setCredits} />
      </div>

      {/* 📘 Practice Section */}
      <div className="pageThree" id="learn">
        <Practice setCredits={setCredits}/>
      </div>

      <div className="pageAbout" id="about">
        <AboutUs> </AboutUs>
        <Hover></Hover>
        <ContactBtn></ContactBtn>
      </div>

      <div className="pageContactfour" id="contact">
        <ContactPage></ContactPage>
      </div>

    </>
  );
}

export default App;
