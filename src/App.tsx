// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import ScrollToTop from "./components/ScrollToTop";

import HomePage from "./pages/index";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import GalleryPage from "./pages/gallery";
import ServicesPage from "./pages/services";
import BookingPage from "./pages/booking";

import "./index.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <SiteHeader />

      <main>
        <AnimatedRoutes />
      </main>

      <SiteFooter />
    </BrowserRouter>
  );
}

export default App;