import { useState, useEffect, useRef } from "react";
import {
  Menu, X, Heart, Users, GraduationCap, BookOpen, Wrench, MapPin,
  Phone, Mail, Facebook, Twitter, Instagram, Youtube, ArrowRight,
  ChevronLeft, ChevronRight, Globe, Moon, Sun, Calendar, Award,
  Snowflake, Leaf, Shield, Star, CheckCircle, HandHelping, Sparkles,
  Building2, Send, DollarSign, TrendingUp, Quote as QuoteIcon
} from "lucide-react";
import logo from "@/imports/logo.png";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    nav: { about: "About", programs: "Programs", impact: "Impact", gallery: "Gallery", volunteer: "Volunteer", donate: "Donate", contact: "Contact" },
    hero: { headline: "Creating Opportunities,\nTransforming Lives", sub: "Empowering underprivileged children and families through education, skills, and hope across Bangladesh.", cta1: "Donate Now", cta2: "Become a Volunteer" },
    about: { label: "Our Story", title: "12+ Years of Hope & Empowerment", body: "Sombhabona was born from a simple belief: every child, regardless of circumstance, deserves a future filled with opportunity. Founded in the heart of Bangladesh, we have spent over twelve years building bridges between potential and possibility — one child, one family, one community at a time.", mission: "Mission", missionText: "To empower underprivileged children and families through free education, skill development, and community welfare programs that create lasting social change.", vision: "Vision", visionText: "A Bangladesh where every child has equal access to quality education and every family has the tools to build a dignified life.", values: "Core Values", founder: "Founder's Message", founderText: "\"When I started Sombhabona, I had one vision: that no child in Bangladesh should be denied a future simply because of where they were born. Today, seeing thousands of children reading, learning, and growing fills my heart with boundless gratitude. This is your victory as much as ours.\"", founderName: "Md. Rafiqul Islam", founderTitle: "Founder & Executive Director" },
    stats: { label: "Our Impact in Numbers", title: "Transforming Lives Every Day", children: "Children Educated", families: "Families Supported", graduates: "Skill Training Graduates", volunteers: "Active Volunteers", clothes: "Winter Clothes Distributed", years: "Years of Service" },
    programs: { label: "What We Do", title: "Our Programs", sub: "Six pillars of sustainable change — each program designed to address a critical need in our communities." },
    winter: { label: "Annual Campaign", title: "Winter Festival", sub: "Each winter, we reach thousands of vulnerable families across Bangladesh with warm clothing and essential supplies, because no child should shiver in the cold.", stat1: "5,000+", stat1Label: "Warm Clothes Distributed", stat2: "12", stat2Label: "Districts Covered", stat3: "2,800+", stat3Label: "Children Helped" },
    stories: { label: "Real Impact", title: "Stories of Change" },
    gallery: { label: "Our Work in Pictures", title: "Photo Gallery", cats: ["All", "Education", "Training", "Community", "Winter Festival"] },
    volunteer: { label: "Join Our Family", title: "Become a Volunteer", sub: "Your time and skills can change a child's life. Join our growing community of 450+ dedicated volunteers across Bangladesh.", name: "Full Name", email: "Email Address", phone: "Phone Number", skill: "Your Skills / Expertise", msg: "Why do you want to volunteer?", submit: "Apply to Volunteer" },
    donation: { label: "Make a Difference", title: "Support Our Mission", once: "One-Time", monthly: "Monthly", sponsor: "Sponsor a Child", custom: "Custom Amount", campaigns: "Active Campaigns", donate: "Donate Now", currency: "BDT" },
    partners: { label: "Working Together", title: "Our Partners & Sponsors" },
    news: { label: "Stay Updated", title: "News & Events", readMore: "Read More" },
    testimonials: { label: "What They Say", title: "Voices of Impact" },
    contact: { label: "Get in Touch", title: "Contact Us", name: "Your Name", email: "Email Address", subject: "Subject", msg: "Your Message", send: "Send Message", address: "House 47, Road 12, Mirpur-2, Dhaka-1216, Bangladesh", phone: "+880 1711-000000", email2: "info@sombhabona.org", hours: "Sun–Thu: 9am–5pm" },
    footer: { tagline: "Deprived Children Are Future Leaders Too.", newsletter: "Subscribe to Newsletter", subscribe: "Subscribe", rights: "All rights reserved.", quickLinks: "Quick Links", programs: "Programs", contact: "Contact" }
  },
  bn: {
    nav: { about: "আমাদের সম্পর্কে", programs: "কার্যক্রম", impact: "প্রভাব", gallery: "গ্যালারি", volunteer: "স্বেচ্ছাসেবক", donate: "দান করুন", contact: "যোগাযোগ" },
    hero: { headline: "সুযোগ সৃষ্টি করছি,\nজীবন পরিবর্তন করছি", sub: "শিক্ষা, দক্ষতা ও আশার মাধ্যমে সুবিধাবঞ্চিত শিশু ও পরিবারের ক্ষমতায়ন।", cta1: "এখনই দান করুন", cta2: "স্বেচ্ছাসেবক হন" },
    about: { label: "আমাদের গল্প", title: "আশা ও ক্ষমতায়নের ১২+ বছর", body: "সম্ভাবনা একটি সহজ বিশ্বাস থেকে জন্ম নিয়েছে: প্রতিটি শিশু, পরিস্থিতি নির্বিশেষে, সুযোগে পরিপূর্ণ একটি ভবিষ্যত পাওয়ার যোগ্য।", mission: "লক্ষ্য", missionText: "বিনামূল্যে শিক্ষা, দক্ষতা উন্নয়ন এবং সামাজিক কল্যাণ কার্যক্রমের মাধ্যমে সুবিধাবঞ্চিত শিশু ও পরিবারের ক্ষমতায়ন।", vision: "দৃষ্টিভঙ্গি", visionText: "এমন একটি বাংলাদেশ যেখানে প্রতিটি শিশুর মানসম্মত শিক্ষার সমান সুযোগ রয়েছে।", values: "মূল মূল্যবোধ", founder: "প্রতিষ্ঠাতার বার্তা", founderText: "\"যখন আমি সম্ভাবনা শুরু করেছিলাম, আমার একটাই স্বপ্ন ছিল: বাংলাদেশের কোনো শিশু যেন শুধুমাত্র জন্মস্থানের কারণে ভবিষ্যৎ থেকে বঞ্চিত না হয়।\"", founderName: "মোঃ রফিকুল ইসলাম", founderTitle: "প্রতিষ্ঠাতা ও নির্বাহী পরিচালক" },
    stats: { label: "আমাদের প্রভাব সংখ্যায়", title: "প্রতিদিন জীবন পরিবর্তন করছি", children: "শিশু শিক্ষিত", families: "পরিবার সহায়তাপ্রাপ্ত", graduates: "দক্ষতা প্রশিক্ষণ স্নাতক", volunteers: "সক্রিয় স্বেচ্ছাসেবক", clothes: "শীতবস্ত্র বিতরণ", years: "সেবার বছর" },
    programs: { label: "আমরা কী করি", title: "আমাদের কার্যক্রম", sub: "টেকসই পরিবর্তনের ছয়টি স্তম্ভ।" },
    winter: { label: "বার্ষিক প্রচারণা", title: "শীত উৎসব", sub: "প্রতি শীতে আমরা হাজার হাজার ঝুঁকিপূর্ণ পরিবারে উষ্ণ পোশাক ও প্রয়োজনীয় সামগ্রী পৌঁছে দিই।", stat1: "৫,০০০+", stat1Label: "শীতবস্ত্র বিতরণ", stat2: "১২", stat2Label: "জেলা কভার", stat3: "২,৮০০+", stat3Label: "শিশু সহায়তা" },
    stories: { label: "বাস্তব প্রভাব", title: "পরিবর্তনের গল্প" },
    gallery: { label: "আমাদের কাজের ছবিতে", title: "ফটো গ্যালারি", cats: ["সব", "শিক্ষা", "প্রশিক্ষণ", "সম্প্রদায়", "শীত উৎসব"] },
    volunteer: { label: "আমাদের পরিবারে যোগ দিন", title: "স্বেচ্ছাসেবক হন", sub: "আপনার সময় ও দক্ষতা একটি শিশুর জীবন বদলে দিতে পারে।", name: "পূর্ণ নাম", email: "ইমেইল ঠিকানা", phone: "ফোন নম্বর", skill: "আপনার দক্ষতা", msg: "আপনি কেন স্বেচ্ছাসেবক হতে চান?", submit: "আবেদন করুন" },
    donation: { label: "পার্থক্য তৈরি করুন", title: "আমাদের মিশন সমর্থন করুন", once: "এককালীন", monthly: "মাসিক", sponsor: "একটি শিশুকে স্পনসর করুন", custom: "কাস্টম পরিমাণ", campaigns: "সক্রিয় প্রচারণা", donate: "এখনই দান করুন", currency: "টাকা" },
    partners: { label: "একসাথে কাজ করছি", title: "আমাদের অংশীদার ও স্পনসর" },
    news: { label: "আপডেট থাকুন", title: "সংবাদ ও ঘটনা", readMore: "আরও পড়ুন" },
    testimonials: { label: "তারা কী বলেন", title: "প্রভাবের কণ্ঠস্বর" },
    contact: { label: "যোগাযোগ করুন", title: "আমাদের সাথে যোগাযোগ করুন", name: "আপনার নাম", email: "ইমেইল ঠিকানা", subject: "বিষয়", msg: "আপনার বার্তা", send: "বার্তা পাঠান", address: "বাড়ি ৪৭, রোড ১২, মিরপুর-২, ঢাকা-১২১৬, বাংলাদেশ", phone: "+880 1711-000000", email2: "info@sombhabona.org", hours: "রবি–বৃহস্পতি: সকাল ৯টা–বিকাল ৫টা" },
    footer: { tagline: "সুবিধাবঞ্চিত শিশুরাও ভবিষ্যতের নেতা।", newsletter: "নিউজলেটারে সাবস্ক্রাইব করুন", subscribe: "সাবস্ক্রাইব", rights: "সর্বস্বত্ব সংরক্ষিত।", quickLinks: "দ্রুত লিঙ্ক", programs: "কার্যক্রম", contact: "যোগাযোগ" }
  }
} as const;

type Lang = "en" | "bn";

// ─── Image URLs ───────────────────────────────────────────────────────────────
const IMGS = {
  hero: "https://images.unsplash.com/photo-1773243906471-909ac5d3496e?w=1920&h=1080&fit=crop&auto=format",
  volunteer1: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=800&h=600&fit=crop&auto=format",
  volunteer2: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop&auto=format",
  volunteer3: "https://images.unsplash.com/photo-1628717341663-0007b0ee2597?w=800&h=600&fit=crop&auto=format",
  clothes1: "https://images.unsplash.com/photo-1567347397177-7f0083398378?w=800&h=600&fit=crop&auto=format",
  clothes2: "https://images.unsplash.com/photo-1706280614737-fcc70630f933?w=800&h=600&fit=crop&auto=format",
  community1: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&h=600&fit=crop&auto=format",
  community2: "https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=800&h=600&fit=crop&auto=format",
};

// ─── Counter Hook ─────────────────────────────────────────────────────────────
function useCounter(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.round(target * Math.min(step / steps, 1)));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Navbar({ lang, setLang, dark, setDark, t }: { lang: Lang; setLang: (l: Lang) => void; dark: boolean; setDark: (d: boolean) => void; t: typeof T.en }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    ["about", t.nav.about], ["impact", t.nav.impact], ["programs", t.nav.programs],
    ["gallery", t.nav.gallery], ["volunteer", t.nav.volunteer], ["contact", t.nav.contact]
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white dark:bg-gray-900 shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <img src={logo} alt="Sombhabona" className="h-10 lg:h-12 object-contain" />

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`text-sm font-medium transition-colors hover:text-accent ${scrolled ? "text-foreground" : "text-white"}`}>
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border transition-colors ${scrolled ? "border-border text-foreground" : "border-white/40 text-white"}`}>
              <Globe size={12} /> {lang === "en" ? "বাং" : "EN"}
            </button>
            <button onClick={() => setDark(!dark)}
              className={`p-1.5 rounded-full transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/20"}`}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => scrollTo("donation")}
              className="hidden lg:flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
              <Heart size={14} /> {t.nav.donate}
            </button>
            <button onClick={() => setOpen(!open)} className={`lg:hidden p-1.5 ${scrolled ? "text-foreground" : "text-white"}`}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-border shadow-lg">
          {links.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-b border-border last:border-0">
              {label}
            </button>
          ))}
          <div className="px-6 py-4">
            <button onClick={() => scrollTo("donation")}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-full text-sm font-semibold">
              <Heart size={14} /> {t.nav.donate}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ t }: { t: typeof T.en }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={IMGS.hero} alt="Children learning" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E3A8A]/70 to-[#16A34A]/40" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-20">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Sparkles size={14} className="text-yellow-300" />
          <span>12+ Years of Transforming Lives in Bangladesh</span>
        </div>
        <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 whitespace-pre-line">
          {t.hero.headline}
        </h1>
        <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.hero.sub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => scrollTo("donation")}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
            <Heart size={20} /> {t.hero.cta1}
          </button>
          <button onClick={() => scrollTo("volunteer")}
            className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
            <Users size={20} /> {t.hero.cta2}
          </button>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
          {[["8,500+", "Children Educated"], ["5,000+", "Winter Clothes"], ["12+", "Years of Service"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold font-['Playfair_Display']">{n}</div>
              <div className="text-xs sm:text-sm text-white/70 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About({ t }: { t: typeof T.en }) {
  const coreValues = ["Compassion", "Integrity", "Sustainability", "Inclusivity", "Empowerment", "Community"];
  const timeline = [
    { year: "2012", event: "Sombhabona founded with 12 students in a single room" },
    { year: "2014", event: "First vocational training center opened" },
    { year: "2016", event: "Launched Women's Empowerment Program" },
    { year: "2018", event: "Reached 1,000 children in education program" },
    { year: "2020", event: "COVID-19 Emergency Relief — 800+ families supported" },
    { year: "2022", event: "5,000th Winter Clothing distribution milestone" },
    { year: "2024", event: "8,500+ children educated across 12 districts" },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.about.label}</span>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">{t.about.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{t.about.body}</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { icon: Shield, title: t.about.mission, text: t.about.missionText, color: "text-primary" },
                { icon: Star, title: t.about.vision, text: t.about.visionText, color: "text-secondary" },
              ].map(({ icon: Icon, title, text, color }) => (
                <div key={title} className="p-5 rounded-2xl bg-muted/50 dark:bg-muted/20 border border-border">
                  <Icon size={22} className={`${color} mb-3`} />
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3">{t.about.values}</h3>
              <div className="flex flex-wrap gap-2">
                {coreValues.map(v => (
                  <span key={v} className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    <CheckCircle size={12} /> {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Timeline */}
            <div className="mb-10">
              <div className="relative pl-6 border-l-2 border-primary/20 dark:border-primary/30 space-y-6">
                {timeline.map(({ year, event }) => (
                  <div key={year} className="relative">
                    <div className="absolute -left-[1.65rem] top-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="flex gap-4 items-start">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">{year}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Message */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-3xl p-6 border border-primary/10">
              <QuoteIcon size={28} className="text-accent mb-4" />
              <p className="text-foreground font-['Playfair_Display'] text-lg italic leading-relaxed mb-4">{t.about.founderText}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  RI
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.about.founderName}</div>
                  <div className="text-xs text-muted-foreground">{t.about.founderTitle}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Impact Stats ─────────────────────────────────────────────────────────────
function ImpactStats({ t }: { t: typeof T.en }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const children = useCounter(8500, active);
  const families = useCounter(3200, active);
  const graduates = useCounter(2100, active);
  const volunteers = useCounter(450, active);
  const clothes = useCounter(5000, active);

  const stats = [
    { value: children, suffix: "+", label: t.stats.children, icon: GraduationCap, color: "text-primary", bg: "bg-primary/10" },
    { value: families, suffix: "+", label: t.stats.families, icon: Heart, color: "text-accent", bg: "bg-accent/10" },
    { value: graduates, suffix: "+", label: t.stats.graduates, icon: Award, color: "text-secondary", bg: "bg-secondary/10" },
    { value: volunteers, suffix: "+", label: t.stats.volunteers, icon: Users, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/10" },
    { value: clothes, suffix: "+", label: t.stats.clothes, icon: Snowflake, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-500/10" },
    { value: 12, suffix: "+", label: t.stats.years, icon: Calendar, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-500/10" },
  ];

  return (
    <section id="impact" ref={ref} className="py-20 lg:py-28 bg-gradient-to-br from-primary to-[#1a327a] dark:from-gray-900 dark:to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-orange-300 font-semibold text-sm uppercase tracking-widest mb-3">{t.stats.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold">{t.stats.title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map(({ value, suffix, label, icon: Icon, color, bg }) => (
            <div key={label} className="text-center group">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={26} className={color} />
              </div>
              <div className="font-['Playfair_Display'] text-3xl font-bold mb-1">
                {value.toLocaleString()}{suffix}
              </div>
              <div className="text-white/70 text-xs leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Programs ─────────────────────────────────────────────────────────────────
function Programs({ t }: { t: typeof T.en }) {
  const programs = [
    { icon: BookOpen, title: "Free Education Program", desc: "Quality schooling for 8,500+ underprivileged children — textbooks, uniforms, meals, and dedicated teachers.", color: "text-primary", bg: "bg-primary/10", img: IMGS.volunteer1 },
    { icon: Wrench, title: "Skill Development Training", desc: "Vocational courses in tailoring, electronics, mobile repair, and IT equipping youth for employment.", color: "text-accent", bg: "bg-accent/10", img: IMGS.volunteer2 },
    { icon: HandHelping, title: "Women's Empowerment", desc: "Micro-finance, health education, and income-generation programs uplifting 1,200+ women.", color: "text-secondary", bg: "bg-secondary/10", img: IMGS.clothes1 },
    { icon: Heart, title: "Community Welfare", desc: "Emergency relief, healthcare camps, and social safety nets for the most vulnerable families.", color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-500/10", img: IMGS.community1 },
    { icon: Snowflake, title: "Winter Festival", desc: "Annual distribution of 5,000+ warm clothes and essential supplies before the harsh winter season.", color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-500/10", img: IMGS.clothes2 },
    { icon: Leaf, title: "Youth Leadership", desc: "Camps, workshops, and mentorship programs building the next generation of community leaders.", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10", img: IMGS.community2 },
  ];

  return (
    <section id="programs" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.programs.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">{t.programs.title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t.programs.sub}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map(({ icon: Icon, title, desc, color, bg, img }) => (
            <div key={title} className="bg-card dark:bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border hover:-translate-y-1">
              <div className="h-44 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Winter Festival ──────────────────────────────────────────────────────────
function WinterFestival({ t }: { t: typeof T.en }) {
  const galleryImgs = [IMGS.clothes1, IMGS.clothes2, IMGS.community1, IMGS.community2, IMGS.volunteer1, IMGS.volunteer2];
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0c2461] to-[#1E3A8A] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Snowflake size={14} className="text-cyan-300" /> {t.winter.label}
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-6 leading-tight">{t.winter.title}</h2>
            <p className="text-white/80 leading-relaxed mb-10 text-lg">{t.winter.sub}</p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { n: t.winter.stat1, l: t.winter.stat1Label },
                { n: t.winter.stat2, l: t.winter.stat2Label },
                { n: t.winter.stat3, l: t.winter.stat3Label },
              ].map(({ n, l }) => (
                <div key={l} className="text-center bg-white/10 rounded-2xl py-5 px-3 border border-white/10">
                  <div className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-yellow-300">{n}</div>
                  <div className="text-white/70 text-xs mt-1 leading-snug">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {galleryImgs.map((src, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 || i === 5 ? "col-span-2 row-span-1" : ""}`} style={{ aspectRatio: i === 0 || i === 5 ? "2/1.3" : "1/1.2" }}>
                <img src={src} alt="Winter festival" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Success Stories ──────────────────────────────────────────────────────────
function Stories({ t }: { t: typeof T.en }) {
  const [idx, setIdx] = useState(0);
  const stories = [
    { name: "Rina Begum", age: 16, loc: "Dhaka", quote: "Before Sombhabona, I had never held a book in my hands. Now I dream of becoming a doctor. They didn't just teach me letters — they taught me to believe in myself.", tag: "Student", color: "bg-primary/10 text-primary", img: IMGS.volunteer2 },
    { name: "Karim Mia", age: 42, loc: "Rajshahi", quote: "After the vocational training, I repaired my first mobile phone and earned my first salary. Now I support my family of five. Sombhabona gave me dignity.", tag: "Training Graduate", color: "bg-secondary/10 text-secondary", img: IMGS.volunteer1 },
    { name: "Fatema Khatun", age: 35, loc: "Chittagong", quote: "During the winter, my children shivered every night. Sombhabona arrived with warm jackets and blankets. I cried — not from cold, but from gratitude.", tag: "Mother, Winter Program", color: "bg-accent/10 text-accent", img: IMGS.clothes1 },
    { name: "Arif Hossain", age: 22, loc: "Sylhet", quote: "I joined as a volunteer at 19. Today I run one of Sombhabona's community centers. The organization shaped who I am — a leader who gives back.", tag: "Youth Leader & Volunteer", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-600", img: IMGS.community1 },
  ];

  const story = stories[idx];
  return (
    <section id="stories" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.stories.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{t.stories.title}</h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="relative h-72 md:h-auto overflow-hidden">
              <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${story.color} bg-white/90`}>{story.tag}</span>
              </div>
            </div>
            <div className="bg-card dark:bg-card p-8 lg:p-10 flex flex-col justify-center">
              <QuoteIcon size={32} className="text-accent mb-4" />
              <p className="font-['Playfair_Display'] text-lg italic text-foreground leading-relaxed mb-6">"{story.quote}"</p>
              <div>
                <div className="font-bold text-foreground">{story.name}, {story.age}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={12} /> {story.loc}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={() => setIdx((idx - 1 + stories.length) % stories.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-foreground">
              <ChevronLeft size={18} />
            </button>
            {stories.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? "bg-primary w-6" : "bg-border"}`} />
            ))}
            <button onClick={() => setIdx((idx + 1) % stories.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-foreground">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery({ t }: { t: typeof T.en }) {
  const [cat, setCat] = useState(0);
  const allImgs = [
    { src: IMGS.volunteer1, cat: 1, span: "row-span-2" },
    { src: IMGS.volunteer2, cat: 2, span: "" },
    { src: IMGS.clothes1, cat: 3, span: "" },
    { src: IMGS.community1, cat: 4, span: "row-span-2" },
    { src: IMGS.clothes2, cat: 4, span: "" },
    { src: IMGS.community2, cat: 3, span: "" },
    { src: IMGS.volunteer3, cat: 1, span: "" },
    { src: IMGS.hero, cat: 2, span: "col-span-2" },
  ];
  const cats = t.gallery.cats;
  const filtered = cat === 0 ? allImgs : allImgs.filter(i => i.cat === cat);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.gallery.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-foreground mb-6">{t.gallery.title}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cats.map((c, i) => (
              <button key={c} onClick={() => setCat(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === i ? "bg-primary text-white" : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {filtered.map(({ src, span }, i) => (
            <div key={i} className={`${span} overflow-hidden rounded-2xl bg-muted group`}>
              <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Volunteer ────────────────────────────────────────────────────────────────
function Volunteer({ t }: { t: typeof T.en }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", skill: "", msg: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", skill: "", msg: "" });
  };

  return (
    <section id="volunteer" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.volunteer.label}</span>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">{t.volunteer.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{t.volunteer.sub}</p>

            <div className="space-y-4">
              {[
                { icon: BookOpen, title: "Teaching & Tutoring", desc: "Support children's learning in core subjects" },
                { icon: Wrench, title: "Skills Training Support", desc: "Share your professional expertise with youth" },
                { icon: Heart, title: "Community Outreach", desc: "Help organize events and welfare programs" },
                { icon: TrendingUp, title: "Fundraising & Advocacy", desc: "Expand our reach and amplify our impact" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="text-secondary mx-auto mb-4" />
                <h3 className="font-bold text-foreground text-xl mb-2">Application Submitted!</h3>
                <p className="text-muted-foreground">Thank you for your willingness to serve. We will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: "name", label: t.volunteer.name, type: "text" },
                  { key: "email", label: t.volunteer.email, type: "email" },
                  { key: "phone", label: t.volunteer.phone, type: "tel" },
                  { key: "skill", label: t.volunteer.skill, type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input type={type} value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      required className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.volunteer.msg}</label>
                  <textarea rows={3} value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-colors">
                  <Users size={16} /> {t.volunteer.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Donation ─────────────────────────────────────────────────────────────────
function Donation({ t }: { t: typeof T.en }) {
  const [type, setType] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const amounts = [100, 250, 500, 1000, 2500, 5000];

  const campaigns = [
    { title: "Education Fund 2025", raised: 182000, goal: 300000, color: "bg-primary" },
    { title: "Winter Festival 2025", raised: 95000, goal: 150000, color: "bg-accent" },
    { title: "Women Empowerment", raised: 67000, goal: 120000, color: "bg-secondary" },
  ];

  return (
    <section id="donation" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.donation.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{t.donation.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div className="bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            <div className="flex rounded-xl overflow-hidden border border-border mb-6">
              {([["once", t.donation.once], ["monthly", t.donation.monthly]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setType(v)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${type === v ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                  {l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {amounts.map(a => (
                <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${amount === a && !custom ? "border-primary bg-primary text-white" : "border-border text-foreground hover:border-primary hover:text-primary"}`}>
                  ৳{a.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.donation.custom} (BDT)</label>
              <input type="number" value={custom} placeholder="Enter amount"
                onChange={e => { setCustom(e.target.value); setAmount(0); }}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              {[
                { title: t.donation.sponsor, icon: GraduationCap },
                { title: "Sponsor Training", icon: Wrench },
              ].map(({ title, icon: Icon }) => (
                <div key={title} className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
                  <Icon size={14} className="text-primary group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-medium text-foreground">{title}</span>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-base transition-colors shadow-lg shadow-orange-500/20">
              <Heart size={18} /> {t.donation.donate} — ৳{(custom ? Number(custom) : amount).toLocaleString()}
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Shield size={12} /> Secure payment · Tax-deductible donation
            </p>
          </div>

          {/* Campaigns */}
          <div>
            <h3 className="font-bold text-foreground text-xl mb-6">{t.donation.campaigns}</h3>
            <div className="space-y-6">
              {campaigns.map(({ title, raised, goal, color }) => {
                const pct = Math.round((raised / goal) * 100);
                return (
                  <div key={title} className="bg-card dark:bg-card rounded-2xl p-6 border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-foreground">{title}</h4>
                      <span className="text-xs font-bold text-accent">{pct}%</span>
                    </div>
                    <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-2.5 mb-3 overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>৳{raised.toLocaleString()} raised</span>
                      <span>Goal: ৳{goal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
              <div className="flex items-start gap-3">
                <DollarSign size={22} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Your Impact</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>৳100 → School supplies for one child (1 month)</li>
                    <li>৳500 → One warm jacket for a winter beneficiary</li>
                    <li>৳2,500 → Full month education for 5 children</li>
                    <li>৳10,000 → Vocational training for one youth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Partners ─────────────────────────────────────────────────────────────────
function Partners({ t }: { t: typeof T.en }) {
  const partners = ["BRAC Foundation", "UNICEF Bangladesh", "Grameen Bank", "Dhaka City Corp.", "Save the Children", "ActionAid BD", "World Food Programme", "Dutch-Bangla Bank"];
  return (
    <section className="py-16 bg-white dark:bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-2">{t.partners.label}</span>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-foreground">{t.partners.title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {partners.map(p => (
            <div key={p} className="flex items-center justify-center h-14 px-3 rounded-xl bg-muted/50 dark:bg-muted/20 border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors">
              <div className="text-[10px] font-bold text-muted-foreground text-center leading-tight">{p}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── News & Events ────────────────────────────────────────────────────────────
function News({ t }: { t: typeof T.en }) {
  const posts = [
    { date: "Jun 15, 2025", cat: "Upcoming", title: "Winter Festival 2025 Registration Open", desc: "We are preparing our largest Winter Festival yet. Register your community or volunteer your time to help us distribute 5,000+ warm items.", img: IMGS.clothes2 },
    { date: "May 28, 2025", cat: "News", title: "500 Children Graduate from Free Education Program", desc: "In a joyous ceremony, 500 children received completion certificates — many going on to mainstream government schools.", img: IMGS.volunteer1 },
    { date: "Apr 10, 2025", cat: "Event", title: "Youth Leadership Camp — Dhaka & Chittagong", desc: "80 young leaders participated in our 3-day leadership camp, gaining skills in public speaking, community organizing, and social entrepreneurship.", img: IMGS.community1 },
  ];

  const catColors: Record<string, string> = {
    Upcoming: "bg-accent/10 text-accent",
    News: "bg-primary/10 text-primary",
    Event: "bg-secondary/10 text-secondary",
  };

  return (
    <section id="news" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.news.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-foreground">{t.news.title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(({ date, cat, title, desc, img }) => (
            <article key={title} className="bg-card dark:bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColors[cat]}`}>{cat}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={11} /> {date}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group-hover:gap-3">
                  {t.news.readMore} <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials({ t }: { t: typeof T.en }) {
  const items = [
    { name: "Dr. Shahin Akter", role: "Community Doctor, Dhaka", text: "Sombhabona brings genuine health education to communities that have never had access. Their volunteers are devoted and disciplined.", stars: 5 },
    { name: "Nazmul Haque", role: "Parent, Rajshahi", text: "My son failed twice. After joining Sombhabona's tutoring program, he passed with distinction. I cannot put my gratitude into words.", stars: 5 },
    { name: "Sarah Rahman", role: "International Volunteer, UK", text: "I spent three months here. The commitment of local staff and the resilience of the children changed my perspective on life forever.", stars: 5 },
    { name: "Md. Billal Hossain", role: "Local Government Official, Mymensingh", text: "Sombhabona fills the gap where government services cannot reach. They are a true partner in grassroots development.", stars: 5 },
    { name: "Kulsum Begum", role: "Training Graduate, Sylhet", text: "I learned tailoring through their program. Now I run a small workshop with four employees. My daughters are in school.", stars: 5 },
    { name: "Tanvir Ahmed", role: "Corporate Partner, bKash Ltd.", text: "We have co-funded three batches of the skill development program. The outcomes are measurable, the transparency is exemplary.", stars: 5 },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#f0f7ff] to-[#f0fdf4] dark:from-muted/5 dark:to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.testimonials.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-foreground">{t.testimonials.title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ name, role, text, stars }) => (
            <div key={name} className="bg-card dark:bg-card rounded-3xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-5 italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{name}</div>
                  <div className="text-xs text-muted-foreground">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact({ t }: { t: typeof T.en }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", msg: "" });
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">{t.contact.label}</span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-foreground">{t.contact.title}</h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, label: "Office Address", value: t.contact.address, color: "text-primary" },
              { icon: Phone, label: "Phone", value: t.contact.phone, color: "text-secondary" },
              { icon: Mail, label: "Email", value: t.contact.email2, color: "text-accent" },
              { icon: Calendar, label: "Office Hours", value: t.contact.hours, color: "text-purple-500" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex gap-4 p-4 rounded-2xl border border-border hover:bg-muted/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-0.5">{label}</div>
                  <div className="text-sm text-foreground">{value}</div>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, color: "hover:bg-blue-600", href: "#" },
                { icon: Twitter, color: "hover:bg-sky-500", href: "#" },
                { icon: Instagram, color: "hover:bg-pink-500", href: "#" },
                { icon: Youtube, color: "hover:bg-red-500", href: "#" },
              ].map(({ icon: Icon, color, href }) => (
                <a key={href + color} href={href}
                  className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground ${color} hover:text-white transition-colors border border-border`}>
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Embedded map */}
            <div className="rounded-2xl overflow-hidden border border-border h-44">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.254219099804!2d90.34915789999999!3d23.806823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c14c8baaaaa1%3A0x3f1f9b5e8d2c9b0c!2sMirpur%2C%20Dhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Sombhabona Office Location"
              />
            </div>
          </div>

          <div className="lg:col-span-3 bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            {sent ? (
              <div className="text-center py-16">
                <CheckCircle size={48} className="text-secondary mx-auto mb-4" />
                <h3 className="font-bold text-foreground text-xl mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for reaching out. We will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ key: "name", label: t.contact.name, type: "text" }, { key: "email", label: t.contact.email, type: "email" }].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                      <input type={type} value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.contact.subject}</label>
                  <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.contact.msg}</label>
                  <textarea rows={6} value={form.msg} onChange={e => setForm(f => ({ ...f, msg: e.target.value }))} required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" />
                </div>
                <button type="submit"
                  className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                  <Send size={16} /> {t.contact.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ t }: { t: typeof T.en }) {
  const [email, setEmail] = useState("");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-[#0c1f4a] dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <img src={logo} alt="Sombhabona" className="h-12 object-contain mb-4 brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">{t.footer.tagline}</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">{t.footer.quickLinks}</div>
            <ul className="space-y-2.5">
              {[["about", t.nav.about], ["programs", t.nav.programs], ["gallery", t.nav.gallery], ["volunteer", t.nav.volunteer], ["contact", t.nav.contact]].map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="text-white/60 hover:text-accent text-sm transition-colors flex items-center gap-1.5">
                    <ArrowRight size={11} /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">{t.footer.newsletter}</div>
            <div className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              <button onClick={() => setEmail("")}
                className="bg-accent hover:bg-orange-600 text-white px-3 py-2.5 rounded-xl transition-colors text-sm font-medium">
                <Send size={14} />
              </button>
            </div>
            <div className="mt-6">
              <button onClick={() => scrollTo("donation")}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                <Heart size={14} /> {t.nav.donate}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Sombhabona NGO. {t.footer.rights}</p>
          <div className="flex gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white/70 transition-colors">Annual Report</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.fontFamily = lang === "bn"
      ? "'Noto Sans Bengali', 'Inter', sans-serif"
      : "'Inter', sans-serif";
  }, [dark, lang]);

  return (
    <div className="bg-background text-foreground">
      <Navbar lang={lang} setLang={setLang} dark={dark} setDark={setDark} t={t} />
      <Hero t={t} />
      <About t={t} />
      <ImpactStats t={t} />
      <Programs t={t} />
      <WinterFestival t={t} />
      <Stories t={t} />
      <Gallery t={t} />
      <Volunteer t={t} />
      <Donation t={t} />
      <Partners t={t} />
      <News t={t} />
      <Testimonials t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </div>
  );
}
