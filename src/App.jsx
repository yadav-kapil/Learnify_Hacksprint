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

function App() {
  return (
    <>
      {/* 🏠 Home Section */}
      <div className="landingPage" id="home">
        <Navbar />
        <MainContent />
        <ContactBtn />
        <div className="hero">
          <Hero />
        </div>
      </div>

      {/* 🤖 Ask AI Section */}
      <div className="pageTwo" id="askAI">
        <AskAI />
        <PageTwo />
      </div>

      {/* 📘 Practice Section */}
      <div className="pageThree" id="learn">
        <Practice />
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
