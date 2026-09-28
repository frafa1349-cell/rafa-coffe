import { useEffect, useState } from "react";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import BestSeller from "./components/BestSeller";
import MenuSection from "./components/MenuSection";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Promo from "./components/Promo";
import Location from "./components/Location";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import AdminPage from "./pages/AdminPage";
import { fetchMedia, fileUrl } from "./lib/api";

function Landing() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    fetchMedia()
      .then(setMedia)
      .catch(() => {});
  }, []);

  const overrides = {};
  const extraGallery = [];
  let heroImg = null;
  media.forEach((m) => {
    const url = fileUrl(m.storage_path);
    if (m.slot === "hero") {
      if (!heroImg) heroImg = url;
    } else if (m.slot === "gallery") {
      extraGallery.push({ img: url, title: "Foto ALEXX COFFEE" });
    } else if (!overrides[m.slot]) {
      overrides[m.slot] = url;
    }
  });

  return (
    <div className="min-h-screen bg-parchment font-sans text-coffee-900 antialiased">
      <Navbar />
      <main>
        <Hero image={heroImg} />
        <Marquee />
        <BestSeller overrides={overrides} />
        <MenuSection overrides={overrides} />
        <About />
        <Gallery extra={extraGallery} />
        <Reviews />
        <Promo />
        <Location />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
