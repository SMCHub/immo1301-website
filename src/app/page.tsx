"use client";

import { useState, useEffect, useRef, useCallback } from "react";

function SalesBanner({ onClose, onHeightChange }: { onClose: () => void; onHeightChange: (h: number) => void }) {
  const [visible, setVisible] = useState(true);
  const [sent, setSent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const bannerRef = useRef<HTMLDivElement>(null);

  const measureHeight = useCallback(() => {
    if (bannerRef.current && visible) {
      onHeightChange(bannerRef.current.offsetHeight);
    }
  }, [visible, onHeightChange]);

  useEffect(() => {
    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [measureHeight]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSent(true);
        setShowForm(false);
        setShowSuccess(true);
      } else {
        setError("Fehler beim Senden. Bitte versuchen Sie es erneut.");
        setSending(false);
      }
    } catch {
      setError("Fehler beim Senden. Bitte versuchen Sie es erneut.");
      setSending(false);
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        ref={bannerRef}
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center px-4 py-3 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #e8b830, #f5d020, #e8b830)",
          animation: "bannerPulse 3s ease-in-out infinite",
        }}
      >
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="text-[#1a1a1a] font-semibold text-sm md:text-base text-center">
            Gefällt Ihnen diese Webseite? Sie können sie jetzt erwerben!
          </span>
          <button
            onClick={() => setShowForm(true)}
            disabled={sent}
            className="bg-[#1a1a1a] text-[#f5d020] font-bold text-xs md:text-sm uppercase tracking-wider px-4 md:px-6 py-2 rounded-md hover:bg-black hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
          >
            {sent ? "Anfrage gesendet" : "Jetzt Anfrage senden"}
          </button>
        </div>
        <button
          onClick={() => { setVisible(false); onClose(); onHeightChange(0); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] text-xl opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Banner schliessen"
        >
          &times;
        </button>
      </div>

      {/* Contact Form Popup */}
      {showForm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div
            className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-8 md:p-10 max-w-md w-[90%]"
            style={{ animation: "popupIn 0.3s ease" }}
          >
            <h3 className="text-xl font-bold text-white mb-1 text-center">
              Webseite erwerben
            </h3>
            <p className="text-gray-400 text-sm mb-6 text-center">
              Hinterlassen Sie Ihre Kontaktdaten und wir melden uns bei Ihnen.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="Max Muster"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="max@beispiel.ch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="+41 79 123 45 67"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-accent to-accent-light text-[#0a0a0a] font-semibold py-3 rounded-lg text-base hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {sending ? "Wird gesendet..." : "Anfrage senden"}
              </button>
            </form>
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full text-center text-gray-500 text-sm hover:text-gray-300 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuccess(false);
          }}
        >
          <div
            className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-10 max-w-sm w-[90%] text-center"
            style={{ animation: "popupIn 0.3s ease" }}
          >
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              &#10003;
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Anfrage gesendet!
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Vielen Dank für Ihr Interesse. Wir melden uns in Kürze bei Ihnen.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-gradient-to-r from-accent to-accent-light text-[#0a0a0a] font-semibold px-8 py-3 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function NavBar({ bannerHeight }: { bannerHeight: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#ueber-uns", label: "Über uns" },
    { href: "#leistungen", label: "Leistungen" },
    { href: "#standort", label: "Standort" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      style={{ top: `${bannerHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="#"
            className={`text-2xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            IMMO <span className="text-accent">1301</span> AG
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent ${
                  scrolled ? "text-gray-700" : "text-white/90"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="bg-accent hover:bg-accent-light text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg"
            >
              Anfrage senden
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 ${scrolled ? "text-gray-700" : "text-white"}`}
            aria-label="Menü öffnen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 text-sm font-medium uppercase tracking-wide hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setMobileOpen(false)}
              className="bg-accent hover:bg-accent-light text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all text-center"
            >
              Anfrage senden
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f3460] via-[#1a1a2e] to-[#16213e]" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-white/80 text-sm font-medium">
            Freienbach, Schwyz
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Immobilien mit
          <br />
          <span className="text-accent">Weitblick</span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Erwerb, Entwicklung, Vermietung und Verwaltung von erstklassigen
          Liegenschaften &ndash; in der Schweiz und international.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#leistungen"
            className="bg-accent hover:bg-accent-light text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5"
          >
            Unsere Leistungen
          </a>
          <a
            href="#kontakt"
            className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:-translate-y-0.5"
          >
            Kontakt aufnehmen
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function AboutSection() {
  const stats = [
    { value: "CHE-461.372.332", label: "Handelsregister-Nr." },
    { value: "8807", label: "Freienbach, SZ" },
    { value: "AG", label: "Rechtsform" },
  ];

  return (
    <section id="ueber-uns" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Über uns
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
              Ihr Partner für
              <br />
              Immobilien
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Die Immo 1301 AG mit Sitz in Freienbach bezweckt den Erwerb, die
              Veräusserung, die Erstellung, die Entwicklung, die Vermietung, das
              Halten und die Verwaltung von Immobilien.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Wir können Zweigniederlassungen und Tochtergesellschaften im In-
              und Ausland errichten und uns an anderen Unternehmen beteiligen
              sowie alle Geschäfte tätigen, die direkt oder indirekt mit unserem
              Zweck in Zusammenhang stehen.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
            >
              Mehr erfahren
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Right – Stats Card */}
          <div className="bg-gray-50 rounded-2xl p-10 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Unternehmensdaten
            </h3>
            <div className="space-y-6">
              {stats.map((s) => (
                <div key={s.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    Deuberrainweg 5
                  </p>
                  <p className="text-gray-500 text-sm">
                    8807 Freienbach, Schwyz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Erwerb & Veräusserung",
      desc: "Strategischer Kauf und Verkauf von Immobilien im In- und Ausland mit fundierter Marktkenntnis.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Entwicklung",
      desc: "Von der Projektidee bis zur Realisierung – wir entwickeln Immobilienprojekte mit Weitblick.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Vermietung",
      desc: "Professionelle Vermarktung und nachhaltige Vermietung von Wohn- und Gewerbeimmobilien.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Verwaltung",
      desc: "Umfassende Immobilienverwaltung – von der Buchhaltung bis zur technischen Betreuung.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Finanzierung",
      desc: "Finanzierungen für eigene oder fremde Rechnung sowie Garantien und Bürgschaften.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Beteiligungen",
      desc: "Strategische Beteiligungen an Unternehmen im In- und Ausland zur Diversifikation.",
    },
  ];

  return (
    <section id="leistungen" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Leistungen
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            Was wir bieten
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Umfassende Dienstleistungen rund um Immobilien – von der Akquisition
            über die Entwicklung bis zur langfristigen Verwaltung.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-accent/20 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-primary/10 group-hover:bg-accent/10 rounded-2xl flex items-center justify-center mb-6 transition-colors text-primary group-hover:text-accent">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {s.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section id="standort" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Standort
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            Unser Standort
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Zentral gelegen in Freienbach, Kanton Schwyz – im Herzen der
            Schweiz.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[400px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2715.5!2d8.7536!3d47.2022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479aa7e1a1a1a1a1%3A0x1!2sDeuberrainweg%205%2C%208807%20Freienbach!5e0!3m2!1sde!2sch!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Standort Immo 1301 AG"
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Adresse
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Immo 1301 AG
                    </p>
                    <p className="text-gray-600 text-sm">Aktiengesellschaft</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Deuberrainweg 5
                    </p>
                    <p className="text-gray-600 text-sm">
                      8807 Freienbach, SZ
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Schweiz</p>
                    <p className="text-gray-600 text-sm">Kanton Schwyz</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">
                Strategische Lage
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                Freienbach liegt am Zürichsee und bietet optimale
                Verkehrsanbindungen. Die Nähe zu Zürich und zum internationalen
                Flughafen macht unseren Standort ideal für nationale und
                internationale Geschäftstätigkeit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="kontakt" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Kontakt
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            Kontaktieren Sie uns
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Haben Sie Fragen zu unseren Leistungen oder möchten Sie ein Projekt
            besprechen? Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  "Vielen Dank für Ihre Nachricht! Wir melden uns bei Ihnen."
                );
              }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vorname
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nachname
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                    placeholder="Muster"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  placeholder="max.muster@beispiel.ch"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Betreff
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-gray-700"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Bitte wählen
                  </option>
                  <option>Allgemeine Anfrage</option>
                  <option>Immobilienerwerb</option>
                  <option>Vermietung</option>
                  <option>Verwaltung</option>
                  <option>Finanzierung &amp; Beteiligungen</option>
                  <option>Sonstiges</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nachricht
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none resize-none"
                  placeholder="Ihre Nachricht..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-light text-white font-semibold py-4 rounded-lg text-lg transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Nachricht senden
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <p className="text-2xl font-bold mb-4">
              IMMO <span className="text-accent">1301</span> AG
            </p>
            <p className="text-gray-400 leading-relaxed">
              Ihr Partner für Immobilien in der Schweiz und international.
              Erwerb, Entwicklung, Vermietung und Verwaltung.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: "#ueber-uns", label: "Über uns" },
                { href: "#leistungen", label: "Leistungen" },
                { href: "#standort", label: "Standort" },
                { href: "#kontakt", label: "Kontakt" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-gray-400 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Kontakt</h4>
            <div className="space-y-3 text-gray-400">
              <p>Immo 1301 AG</p>
              <p>Deuberrainweg 5</p>
              <p>8807 Freienbach, SZ</p>
              <p className="mt-4">CHE-461.372.332</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Immo 1301 AG. Alle Rechte
            vorbehalten.
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-accent transition-colors">
              Impressum
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [bannerHeight, setBannerHeight] = useState(0);

  return (
    <main>
      <SalesBanner onClose={() => setBannerHeight(0)} onHeightChange={setBannerHeight} />
      <NavBar bannerHeight={bannerHeight} />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
