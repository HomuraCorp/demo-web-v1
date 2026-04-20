import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// --- Reusable Fade-In Component ---
const FadeInSection = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(currentRef);
    return () => observer.unobserve(currentRef);
  }, []);

  return (
    <div
      ref={domRef}
      className={`fade-in-section ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- SVG Mini Component for Avatars ---
const AvatarSVG = ({ emotion = 'smile', color = '#86efac' }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill={color} />
    <circle cx="50" cy="45" r="35" fill="#fcd34d" />
    <path d="M50 15 C30 15 25 35 25 35 C35 25 65 25 75 35 C75 35 70 15 50 15 Z" fill="#064e3b" />
    <circle cx="35" cy="45" r="5" fill="#1e293b" />
    <circle cx="65" cy="45" r="5" fill="#1e293b" />
    {emotion === 'smile' && <path d="M40 60 Q50 70 60 60" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />}
    {emotion === 'cool' && <path d="M30 40 H70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />}
  </svg>
);

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Demo Section State (Section 6) ---
  const [prayers, setPrayers] = useState({ subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false });
  const [helpParents, setHelpParents] = useState(false);
  const [exp, setExp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState(null);

  const maxExp = 120;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addFloatingText = (amount, e) => {
    const newId = Date.now();
    setFloatingTexts(prev => [...prev, { id: newId, amount, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newId));
    }, 1000);
  };

  const handlePrayerCheck = (prayer, e) => {
    if (prayers[prayer]) return;
    const newPrayers = { ...prayers, [prayer]: true };
    setPrayers(newPrayers);
    
    const newExp = exp + 10;
    setExp(newExp);
    addFloatingText(10, e);

    const allPrayersDone = Object.values(newPrayers).every(v => v === true);
    if (allPrayersDone && streak === 0) {
      setStreak(1);
      setActiveStep(3);
      showToast("Sholat wajibmu hari ini lengkap! 🎉");
    }

    if (allPrayersDone && helpParents) triggerAllDone();
    else if (!allPrayersDone && activeStep === 1) setActiveStep(2);
  };

  const handleHelpCheck = (e) => {
    if (helpParents) return;
    setHelpParents(true);
    setExp(prev => prev + 50);
    addFloatingText(50, e);

    const allPrayersDone = Object.values(prayers).every(v => v === true);
    if (allPrayersDone) triggerAllDone();
  };

  const triggerAllDone = () => {
    setAllDone(true);
    setActiveStep(4);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#188200', '#F08C00', '#ffffff', '#86efac']
    });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-xl w-11/12 max-w-sm px-4 py-3 flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-white shadow-md">✓</div>
          <p className="text-content font-medium text-sm flex-1">{toastMessage}</p>
        </div>
      )}

      {/* Floating Texts */}
      {floatingTexts.map(text => (
        <div key={text.id} 
          className="fixed z-50 text-secondary font-extrabold text-xl animate-float pointer-events-none drop-shadow-md"
          style={{ left: text.x - 20, top: text.y - 20 }}
        >
          +{text.amount} EXP
        </div>
      ))}

      {/* SECTION 1 — Sticky Navbar */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="#" className="font-jakarta font-extrabold text-2xl text-primary flex items-center gap-2">
            <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg">M</span>
            MuslimKid
          </a>
          
          <div className="hidden md:flex gap-8 items-center font-medium">
            <a href="#fitur" className="text-content/80 hover:text-primary transition-colors">Fitur</a>
            <a href="#demo" className="text-content/80 hover:text-primary transition-colors">Cara Kerja</a>
            <a href="#showcase" className="text-content/80 hover:text-primary transition-colors">Galeri UI</a>
            <a href="#testimoni" className="text-content/80 hover:text-primary transition-colors">Testimoni</a>
          </div>

          <div className="hidden md:block">
            <a href="#download" className="bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-full font-bold transition-all shadow-[0_4px_14px_0_rgba(24,130,0,0.39)] hover:shadow-[0_6px_20px_rgba(24,130,0,0.23)] hover:-translate-y-0.5 inline-block">
              Download Gratis
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-content text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden glass-panel absolute top-full left-0 w-full flex flex-col py-4 px-6 border-t border-white/20 shadow-xl">
            <a href="#fitur" className="py-3 font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>Fitur</a>
            <a href="#demo" className="py-3 font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>Demo & Cara Kerja</a>
            <a href="#testimoni" className="py-3 font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>Testimoni</a>
            <a href="#download" className="mt-6 bg-primary text-white font-bold text-center py-4 rounded-full shadow-lg" onClick={() => setMenuOpen(false)}>Download Gratis</a>
          </div>
        )}
      </nav>

      {/* SECTION 2 — Hero */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-mesh-pattern overflow-hidden flex items-center min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Keiri Text */}
            <FadeInSection>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                <span className="text-base">🌙</span> App Ibadah Anak #1 di Indonesia
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-jakarta font-extrabold text-[#004B23] leading-[1.1] mb-6">
                Bantu si kecil sholat <br /> tepat waktu — <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">tanpa drama.</span>
              </h1>
              <p className="text-lg md:text-xl text-content/70 mb-10 max-w-lg leading-relaxed font-medium">
                Muslim Kid mengubah ibadah harian jadi petualangan seru. Quest terpandu, EXP level, dan achievement interaktif yang dirancang khusus untuk rutinitas keluarga Muslim.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#download" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(24,130,0,0.3)] hover:-translate-y-1 text-center flex items-center justify-center gap-2">
                  <span>Mulai Petualangan</span>
                  <span>🚀</span>
                </a>
                <a href="#demo" className="glass-panel text-primary hover:bg-white/90 px-8 py-4 rounded-full font-bold transition-all text-center">
                  Coba Interactive Demo
                </a>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-content/60 font-medium">
                <div className="flex -space-x-3">
                  <img className="w-8 h-8 rounded-full border-2 border-white bg-green-200" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23bbf7d0'/%3E%3C/svg%3E" alt="avatar"/>
                  <img className="w-8 h-8 rounded-full border-2 border-white bg-orange-200" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23fed7aa'/%3E%3C/svg%3E" alt="avatar"/>
                  <img className="w-8 h-8 rounded-full border-2 border-white bg-blue-200" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23bfdbfe'/%3E%3C/svg%3E" alt="avatar"/>
                </div>
                <span>Dipercaya oleh <strong>10.000+</strong> Keluarga Muslim</span>
              </div>
            </FadeInSection>

            {/* Kanan 3D/Hover Mockup Detail */}
            <FadeInSection className="relative flex justify-center lg:justify-end perspective-1000">
              {/* Floating decor */}
              <div className="absolute top-10 -left-12 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-float-icon z-20 flex gap-4 items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl drop-shadow-sm">🏆</div>
                <div>
                  <div className="font-bold text-sm text-content">New Achievement!</div>
                  <div className="text-secondary text-xs font-bold">Quest Master Unlocked</div>
                </div>
              </div>

              <div className="relative w-[320px] h-[650px] bg-gradient-to-b from-primary to-primary-dark rounded-[44px] border-[8px] border-gray-900 shadow-2xl overflow-hidden animate-subtle-float">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-30"></div>
                
                {/* Mock UI Dalam Frame */}
                <div className="pt-12 px-6 pb-6 flex flex-col h-full text-white bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'rgba(255,255,255,0.05)\'/%3E%3C/svg%3E')]">
                  
                  {/* Tab Bar Header */}
                  <div className="flex justify-between items-center mb-8 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white p-0.5 overflow-hidden">
                        <AvatarSVG />
                      </div>
                      <div>
                        <div className="text-xs text-secondary font-bold">Level 5</div>
                        <div className="text-sm font-bold">Hasan 👦</div>
                      </div>
                    </div>
                    <div className="bg-secondary/20 text-secondary px-3 py-1.5 rounded-full text-xs font-bold border border-secondary/50 flex items-center gap-1">
                      <span>🔥</span> 3 Streak
                    </div>
                  </div>
                  
                  <div className="mb-4 flex justify-between items-end">
                    <h3 className="font-jakarta font-extrabold text-2xl tracking-tight">Ceklis Ibadah<br/>Hari Ini</h3>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="glass-panel text-content rounded-2xl p-4 flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-sm font-extrabold text-content">Sholat Subuh</div>
                        <div className="text-xs text-muted font-medium mt-0.5">Waktunya tersenyum di pagi hari</div>
                      </div>
                      <span className="text-secondary font-bold text-sm bg-orange-50 px-2 py-1 rounded">+10</span>
                    </div>
                    
                    <div className="bg-primary border border-white/20 rounded-2xl p-4 flex gap-4 items-center shadow-lg transform scale-[1.02] transition-transform">
                      <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold shadow-inner">✓</div>
                      <div className="flex-1">
                        <div className="text-sm font-extrabold text-white">Sholat Dzuhur</div>
                        <div className="text-xs text-white/70 font-medium mt-0.5">Selesai tepat waktu!</div>
                      </div>
                      <span className="text-white/60 line-through text-sm font-bold">+10</span>
                    </div>

                    <div className="glass-panel text-content rounded-2xl p-4 flex gap-4 items-center opacity-80 scale-95 origin-top">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-sm font-extrabold text-content">Bantu Orang Tua</div>
                      </div>
                      <span className="text-secondary font-bold text-sm bg-orange-50 px-2 py-1 rounded">+50</span>
                    </div>
                  </div>

                  {/* Mock EXP Bar Bottom */}
                  <div className="bg-white/10 rounded-2xl p-5 mt-auto border border-white/20 relative overflow-hidden backdrop-blur-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between text-xs mb-3 font-bold relative z-10">
                      <span>Progres Level 5</span>
                      <span className="text-secondary">180 / 200 XP</span>
                    </div>
                    <div className="h-3 bg-black/30 rounded-full overflow-hidden relative z-10 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-secondary to-yellow-400 w-[90%] rounded-full relative">
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Features (Z-Pattern Refactor) */}
      <section id="fitur" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-20">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Fitur Eksklusif</div>
            <h2 className="text-3xl md:text-5xl font-jakarta font-extrabold max-w-2xl mx-auto leading-tight text-content">Bangun kebiasaan baik dengan cara yang asyik</h2>
          </FadeInSection>

          {/* Row 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24">
            <FadeInSection className="lg:w-1/2">
              <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-green-50 to-primary/10 rounded-3xl overflow-hidden feature-image-shadow p-8 flex items-center justify-center border border-green-100">
                <div className="bg-white rounded-2xl p-6 custom-shadow border border-gray-100 w-full max-w-sm hover:scale-105 transition-transform duration-300">
                  <h4 className="font-bold mb-4 flex justify-between items-center text-sm border-b pb-3">Quest Terkini <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Target 5/5</span></h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"><div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">✓</div> <span className="text-sm font-semibold">Subuh berjamaah</span></li>
                    <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"><div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">✓</div> <span className="text-sm font-semibold">Baca 2 lembar Al-Qur'an</span></li>
                    <li className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 shadow-sm"><div className="w-5 h-5 border-2 border-primary rounded-full"></div> <span className="text-sm font-bold text-primary">Bantu ibu cuci piring (In progress)</span></li>
                  </ul>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="lg:w-1/2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🕌</div>
              <h3 className="font-jakarta font-extrabold text-3xl mb-4">Quest Harian yang Terpandu</h3>
              <p className="text-lg text-content/70 leading-relaxed font-medium">Bukan sekadar buku catatan amal. Tugas seperti Sholat 5 waktu, membaca Qur'an, hingga sedekah disajikan sebagai Misi Utama harian. Anak mencentang quest, dan hadiah EXP menanti mereka secara instan.</p>
            </FadeInSection>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24 mb-24">
            <FadeInSection className="lg:w-1/2">
              <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-orange-50 to-secondary/10 rounded-3xl overflow-hidden feature-image-shadow flex items-center justify-center border border-orange-100">
                <div className="absolute w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative z-10 text-center">
                  <div className="text-7xl font-extrabold text-secondary drop-shadow-md mb-2">LVL 12</div>
                  <div className="bg-white px-6 py-3 rounded-full text-sm font-bold shadow-xl border border-orange-100 inline-flex items-center gap-2">
                    <span className="text-xl">⚡</span> XP Bertambah +150
                  </div>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection className="lg:w-1/2">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">⚡</div>
              <h3 className="font-jakarta font-extrabold text-3xl mb-4">Sistem EXP & Petualangan Level Up</h3>
              <p className="text-lg text-content/70 leading-relaxed font-medium">Tinggalkan metode peringatan yang membosankan. Tiap ibadah ditransformasi menjadi poin pengalaman (EXP). Lihat binar di mata mereka saat karakternya "Naik Level" karena konsistensi ibadahnya sendiri.</p>
            </FadeInSection>
          </div>

        </div>
      </section>

      {/* SECTION 6 — Interactive Demo (Expanded Modal & UI) */}
      <section id="demo" className="py-24 bg-primary-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection className="text-center mb-16">
            <div className="inline-block bg-secondary/20 text-secondary border border-secondary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Demonstrasi Langsung</div>
            <h2 className="text-4xl md:text-5xl font-jakarta font-extrabold mb-4">Rasakan hari bersama Muslim Kid</h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto">Klik kotak centang di bawah ini dan perhatikan bagaimana UI bereaksi untuk memberikan *instant gratification* yang positif.</p>
          </FadeInSection>

          <div className="flex flex-col lg:flex-row gap-12 items-center justify-center max-w-6xl mx-auto">
            
            {/* LEFT — Step Guide Panel - Glassmorphism */}
            <FadeInSection className="w-full lg:w-1/3 glass-dark rounded-3xl p-6">
              <div className="flex flex-col gap-4 relative">
                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-white/10 z-0"></div>
                {[
                  { step: 1, text: "Mulai hari dengan Sholat Subuh", icon: "🌅" },
                  { step: 2, text: "Lengkapi ibadah pokok harian", icon: "🕌" },
                  { step: 3, text: "Kerjakan Quest Ekstra", icon: "⭐" },
                  { step: 4, text: "Rayakan Achievement Anda!", icon: "🎉" }
                ].map(item => (
                  <div 
                    key={item.step} 
                    className={`relative z-10 p-5 rounded-2xl transition-all duration-500 font-medium flex items-center gap-4 ${
                      activeStep === item.step 
                        ? 'bg-white text-content shadow-2xl scale-105 border-transparent' 
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activeStep === item.step ? 'bg-primary/10 text-xl' : 'bg-white/10 grayscale opacity-50'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${activeStep === item.step ? 'text-primary' : ''}`}>Langkah {item.step}</div>
                      <div className={activeStep === item.step ? 'font-bold' : ''}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>

            {/* RIGHT — Phone UI Interactive */}
            <FadeInSection className="w-full lg:w-auto relative flex justify-center perspective-1000">
              <div className="w-[340px] h-[700px] bg-bg rounded-[44px] border-[10px] border-gray-900 shadow-2xl overflow-hidden relative flex flex-col transform transition-transform hover:rotate-1">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-2xl z-30"></div>
                
                {/* App Dashboard UI */}
                <div className="bg-primary px-6 pb-8 pt-14 text-white relative shadow-md">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
                  <h3 className="font-jakarta font-bold text-2xl mb-4 leading-tight">Assalamu'alaikum, <br/> Hasan 👋</h3>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-secondary text-sm font-extrabold mb-1">Level 5</div>
                      <div className="w-32 h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/20">
                        <div className="h-full bg-secondary transition-all duration-[800ms] ease-out rounded-full relative" style={{ width: `${Math.min((exp / maxExp) * 100, 100)}%` }}>
                          <div className="absolute inset-0 bg-white/30 truncate"></div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold mt-1 text-white/80">{exp} / 120 EXP</div>
                    </div>
                    <div className={`flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-xl border border-white/20 ${streak > 0 ? 'animate-[bounce_0.5s_ease-out]' : ''}`}>
                      <span className="text-lg drop-shadow-md">🔥</span>
                      <span className="text-sm font-extrabold">{streak} hari</span>
                    </div>
                  </div>
                </div>

                {/* Quest List */}
                <div className="flex-1 p-6 overflow-y-auto bg-mesh-pattern relative">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="text-content font-jakarta font-extrabold text-lg">Quest Hari Ini</h4>
                    <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-1 rounded">Sisa {6 - (Object.values(prayers).filter(Boolean).length + (helpParents ? 1 : 0))}</span>
                  </div>
                  
                  <div className="flex flex-col gap-3 pb-20">
                    {[
                      { id: 'subuh', label: 'Subuh 🌅', xp: 10, time: "04:30 AM" },
                      { id: 'dzuhur', label: 'Dzuhur ☀️', xp: 10, time: "12:00 PM" },
                      { id: 'ashar', label: 'Ashar 🌤️', xp: 10, time: "15:20 PM" },
                      { id: 'maghrib', label: 'Maghrib 🌆', xp: 10, time: "18:10 PM" },
                      { id: 'isya', label: 'Isya 🌙', xp: 10, time: "19:20 PM" }
                    ].map(q => (
                      <button 
                        key={q.id}
                        onClick={(e) => handlePrayerCheck(q.id, e)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden group ${
                          prayers[q.id] 
                            ? 'bg-primary text-white shadow-lg border-transparent translate-x-1' 
                            : 'bg-white text-content border border-gray-100 hover:border-primary/40 hover:shadow-md custom-shadow'
                        }`}
                      >
                        {prayers[q.id] && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1s_forwards]"></div>}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                          prayers[q.id] ? 'bg-white border-white text-primary scale-110' : 'border-gray-300 bg-gray-50'
                        }`}>{prayers[q.id] ? '✓' : ''}</div>
                        <div className="flex-1">
                          <span className="font-extrabold block text-[15px]">{q.label}</span>
                          <span className={`text-[10px] font-semibold tracking-wide ${prayers[q.id] ? 'text-white/70' : 'text-muted'}`}>{q.time}</span>
                        </div>
                        <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${prayers[q.id] ? 'bg-white/20 text-white' : 'bg-orange-50 text-secondary'}`}>+{q.xp} XP</span>
                      </button>
                    ))}
                    
                    <div className="h-px bg-gray-200 my-2"></div>

                    <button 
                      onClick={(e) => handleHelpCheck(e)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left border ${
                        helpParents 
                          ? 'bg-secondary text-white shadow-lg border-transparent translate-x-1' 
                          : 'bg-gradient-to-r from-orange-50 to-white text-content border-orange-200 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                        helpParents ? 'bg-white border-white text-secondary scale-110' : 'border-secondary bg-white text-transparent'
                      }`}>{helpParents ? '✓' : ''}</div>
                      <div className="flex-1">
                        <span className="font-extrabold block text-[15px]">Bantu Orang Tua 🤝</span>
                        <span className={`text-[10px] font-semibold tracking-wide ${helpParents ? 'text-white/70' : 'text-muted'}`}>Bebas Misi</span>
                      </div>
                      <span className={`text-xs font-extrabold px-2 py-1 rounded-lg ${helpParents ? 'bg-white/20 text-white border border-white/20' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>+{50} XP</span>
                    </button>
                  </div>

                  {/* Level Up Modal Component (Simulated) */}
                  {allDone && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 animate-[scaleIn_0.4s_ease-out]">
                      <div className="bg-white p-8 rounded-3xl text-center shadow-[0_20px_50px_rgba(240,140,0,0.2)] border border-orange-100 max-w-sm w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-yellow-400"></div>
                        <div className="text-6xl mb-4 animate-[bounce_1s_ease-out]">🌟</div>
                        <h5 className="text-secondary font-jakarta font-extrabold text-2xl mb-2">Quest Master</h5>
                        <p className="text-content/80 text-sm font-medium mb-6">Hebat! Kamu telah menyapu bersih semua misi ibadah hari ini. Kamu luar biasa!</p>
                        <button className="w-full bg-primary text-white py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-green-500 shadow-md">Klaim Reward</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 7 & 9 — UI Showcase & Achievement Bento Grid */}
      <section id="showcase" className="py-24 bg-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-jakarta font-extrabold mb-6">Sistem Avatar yang Dinamis</h2>
            <p className="text-content/70 max-w-2xl mx-auto text-lg font-medium">Melalui prototipe "Pilih Karaktermu", Muslim Kid memberikan ruang personalisasi. Achievement membuka tipe karakter baru, memperkuat putaran *habit loop* secara visual.</p>
          </FadeInSection>

          {/* Bento Grid layout directly representing Figma design context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Main Featured Avatar */}
            <FadeInSection className="md:col-span-2 md:row-span-2" delay={0}>
              <div className="bg-[#e4f9e0] rounded-[2rem] p-8 h-full min-h-[300px] relative overflow-hidden flex flex-col group border border-green-200 feature-image-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-auto">
                     <span className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">Karakter Utama Terbuka ✅</span>
                  </div>
                  <div className="absolute right-0 bottom-[-20px] w-64 h-64 md:w-80 md:h-80 opacity-90 group-hover:scale-105 transition-transform duration-500">
                    <AvatarSVG emotion="smile" color="#86efac" />
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* Locked Avatar 1 */}
            <FadeInSection delay={100}>
              <div className="bg-white rounded-3xl p-6 h-full min-h-[220px] border border-gray-200 relative overflow-hidden locked-filter flex flex-col items-center justify-center custom-shadow">
                <span className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-sm">🔒 Locked</span>
                <div className="w-32 h-32 opacity-70">
                   <AvatarSVG emotion="cool" color="#cbd5e1" />
                </div>
                <div className="mt-4 text-center">
                  <div className="font-extrabold text-sm text-gray-800 tracking-tight">"Nah, I'd Streak"</div>
                </div>
              </div>
            </FadeInSection>

             {/* Locked Avatar 2 */}
            <FadeInSection delay={200}>
              <div className="bg-white rounded-3xl p-6 h-full min-h-[220px] border border-gray-200 relative overflow-hidden locked-filter flex flex-col items-center justify-center custom-shadow">
                <span className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-sm">🔒 Locked</span>
                <div className="w-32 h-32 opacity-70">
                   <AvatarSVG emotion="smile" color="#94a3b8" />
                </div>
                <div className="mt-4 text-center">
                  <div className="font-extrabold text-sm text-gray-800 tracking-tight">"Rajin Mengaji"</div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 10 — Testimonial (Slider/Masonry Upgraded) */}
      <section id="testimoni" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-jakarta font-extrabold text-center mb-6">Cerita dari Mereka</h2>
            <p className="text-content/70 max-w-2xl mx-auto text-lg font-medium">Lebih dari 10.000 orang tua telah menyadari perubahan rutinitas ibadah anak-anak mereka di rumah.</p>
          </FadeInSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { letter: "F", name: "Ibu Fatimah", role: "Ibu dari Rizky, 7 th", color: "bg-green-500", quote: "Subhanallah, sekarang Rizky yang ngingetin Mama sholat. Dia takut putus streak-nya!" },
              { letter: "A", name: "Bapak Arief", role: "Ayah dari Dafa, 9 th", color: "bg-secondary", quote: "Lebih efektif dari semua cara yang pernah kami coba. Skema gamifikasinya genius." },
              { letter: "S", name: "Ibu Sari", role: "Ibu dari Nadia, 6 th", color: "bg-teal-500", quote: "Positif banget pendekatannya. Tidak ada rasa takut, semua motivasi dari dalam diri anak." }
            ].map((t, i) => (
               <FadeInSection key={i} delay={i * 100}>
                <div className="bg-bg p-8 rounded-[2rem] border border-gray-100 h-full flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-xl duration-300">
                  <div className="text-6xl text-gray-200 absolute top-4 right-6 font-serif opacity-50">"</div>
                  <div className="text-secondary text-base mb-6 tracking-widest relative z-10">★★★★★</div>
                  <p className="text-contentfont-medium italic leading-relaxed text-lg mb-8 relative z-10">"{t.quote}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto relative z-10">
                    <div className={`w-12 h-12 rounded-xl ${t.color} flex items-center justify-center text-white font-extrabold text-xl shadow-inner`}>{t.letter}</div>
                    <div>
                      <h4 className="font-jakarta font-extrabold text-content">{t.name}</h4>
                      <p className="text-xs font-semibold text-content/50 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — FAQ (NEW SECTION) */}
      <section className="py-24 bg-mesh-pattern border-t border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-jakarta font-extrabold mb-4">Pertanyaan Seputar Muslim Kid</h2>
          </FadeInSection>

          <div className="bg-white rounded-3xl px-6 py-2 custom-shadow border border-gray-50 flex flex-col gap-2">
            {[
              { id: 1, q: "Apakah aplikasi ini gratis digunakan?", a: "Ya, Muslim Kid dapat diunduh dan digunakan untuk fitur inti seperti Quest Harian dan Sistem EXP secara gratis tanpa iklan yang mengganggu." },
              { id: 2, q: "Bagaimana cara memastikan laporan sholat jujur?", a: "Muslim Kid dirancang sebagai alat bantu pembiasaan, bukan alat pemantau restriktif. Kami mendorong orang tua untuk tetap melakukan check-in santai untuk memvalidasi kejujuran dan usaha anak." },
              { id: 3, q: "Apakah butuh koneksi internet setiap saat?", a: "Untuk fitur utama seperti Checklist harian, aplikasi dapat bekerja offline dan akan disinkronisasi ketika terkoneksi dengan internet." }
            ].map(faq => (
              <FadeInSection key={faq.id}>
                <div className="border-b last:border-0 border-gray-100">
                  <button 
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full text-left py-6 flex justify-between items-center transition-colors hover:text-primary focus:outline-none"
                  >
                    <span className="font-extrabold font-jakarta text-lg pr-8">{faq.q}</span>
                    <span className={`text-2xl transition-transform duration-300 font-light text-muted ${openFaq === faq.id ? 'rotate-45 text-primary' : ''}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === faq.id ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="text-content/70 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 — Final CTA */}
      <section id="download" className="py-32 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-20 bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\'%3E%3Cpath d=\\'M20 0l20 20-20 20L0 20z\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.1\\'/%3E%3C/svg%3E')]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-jakarta font-extrabold mb-8 text-white leading-tight">Mulai perjalanan habit <br /> si kecil hari ini</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button className="bg-white text-content group hover:bg-bg px-8 py-4 rounded-full font-extrabold text-lg flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] w-full sm:w-auto justify-center">
                <span className="text-2xl group-hover:scale-110 transition-transform">🍎</span> Unduh via App Store
              </button>
              <button className="bg-white text-content group hover:bg-bg px-8 py-4 rounded-full font-extrabold text-lg flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] w-full sm:w-auto justify-center">
                <span className="text-2xl group-hover:scale-110 transition-transform text-green-500">▶</span> Unduh via Google Play
              </button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1016] text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12 text-center md:text-left">
            <div>
              <div className="font-jakarta font-extrabold text-3xl mb-3 flex items-center justify-center md:justify-start gap-2">
                <span className="w-8 h-8 bg-white text-primary rounded-lg flex items-center justify-center text-lg">M</span>
                MuslimKid
              </div>
              <p className="text-white/40 text-sm font-medium">Tumbuh bersama ibadah, satu quest setiap hari.</p>
            </div>

            <div className="flex justify-center md:justify-end gap-3">
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-105">IN</button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-105">TT</button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-105">YT</button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/30 gap-4 mt-8 pt-8 border-t border-white/10 font-medium">
            <p>© 2025 Muslim Kid Studio. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Dynamic Keyframes added inline strictly for those missed in TS config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
