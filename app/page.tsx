"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

/* ---------------- DATA ---------------- */
const projects = [
  {
    title: "SOC Augmentation Platform",
    desc: "AI-powered SOC system for threat detection, automation & analysis",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  },
  {
    title: "Accounting CRM",
    desc: "Financial tracking, reports, client workflows",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
  },
];

/* ---------------- HELPERS ---------------- */
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);

    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return reduced;
};

/* ---------------- LAYOUT WRAPPER (FIXES SYMMETRY) ---------------- */
function Section({ id, children, center = false }) {
  return (
    <section
      id={id}
      className={`px-6 md:px-10 py-28 max-w-6xl mx-auto ${center ? "text-center" : ""
        }`}
    >
      {children}
    </section>
  );
}

/* ---------------- PROJECT CARD ---------------- */
function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="h-44 overflow-hidden">
        <motion.img
          src={project.img}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl">{project.title}</h3>
        <p className="text-gray-400 text-sm">{project.desc}</p>
      </div>
    </motion.div>
  );
}

/* ---------------- MAGNETIC BUTTON ---------------- */
function MagneticButton({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 150, damping: 12 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 12 });

  const move = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={move}
      onMouseLeave={reset}
      className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
    >
      {children}
    </motion.button>
  );
}

/* ---------------- MAIN ---------------- */
export default function Portfolio() {
  const [activeProject, setActiveProject] = useState(null);
  const reduced = useReducedMotion();

  const { scrollYProgress, scrollY } = useScroll();

  /* 🌊 Apple-style scroll storytelling */
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.88]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.25]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);

  /* 🌸 CURSOR GLOW (OPTIMIZED) */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (reduced) return;

    let raf;

    const move = (e) => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        raf = null;
      });
    };

    window.addEventListener("mousemove", move, { passive: true });

    return () => window.removeEventListener("mousemove", move);
  }, [reduced]);

  return (
    <div className="bg-black text-white min-h-screen font-[Inter] overflow-x-hidden relative">

      {/* 🌸 CURSOR GLOW */}
      {!reduced && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl z-0 hidden md:block"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      )}

      {/* scroll progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 origin-left z-50"
      />

      {/* background glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20 z-0"
        style={{
          background:
            "radial-gradient(600px at 20% 30%, rgba(236,72,153,0.15), transparent 40%), radial-gradient(600px at 80% 70%, rgba(168,85,247,0.15), transparent 40%)",
        }}
      />

      {/* grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay z-40"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* NAV */}
      <nav className="fixed w-full flex justify-between items-center px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10 z-30">
        <h1 className="text-lg tracking-widest">AYESHA</h1>

        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO (APPLE SCROLL STYLE) */}
      <motion.section
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="h-screen flex flex-col justify-center items-center text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
          Ayesha Irfan
        </h1>

        <p className="mt-4 text-gray-400 max-w-xl">
          Building AI-powered systems & premium web experiences.
        </p>
      </motion.section>

      {/* ABOUT (SYMMETRY FIXED) */}
      <Section id="about">
        <h2 className="text-3xl mb-6">About</h2>

        <p className="text-gray-400 leading-relaxed max-w-2xl">
          I’m a full-stack developer focused on building scalable, intelligent systems.
          My work blends AI automation, clean UI engineering, and performance-first architecture —
          from SOC augmentation platforms to enterprise-grade web tools.
        </p>
      </Section>

      {/* WORK */}
      <Section id="work">
        <h2 className="text-3xl mb-10">Selected Work</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <ProjectCard
              key={i}
              project={p}
              onClick={() => setActiveProject(p)}
            />
          ))}
        </div>
      </Section>

      {/* MODAL (CINEMATIC TRANSITION) */}
      <AnimatePresence mode="wait">
        {activeProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              className="bg-white/10 border border-white/10 p-8 rounded-3xl max-w-md text-center"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            >
              <h3 className="text-2xl mb-3">{activeProject.title}</h3>
              <p className="text-gray-300">{activeProject.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKILLS */}
      <Section id="skills" center>
        <h2 className="text-3xl mb-10">Skills</h2>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
          {["Next.js", "React", "Node.js", "MongoDB", "TypeScript", "Python", "JavaSript"].map(
            (skill) => (
              <motion.div
                key={skill}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full"
              >
                {skill}
              </motion.div>
            )
          )}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" center>
        <h2 className="text-3xl mb-4">Contact</h2>

        <p className="text-gray-400 mb-6">
          Let’s build something iconic.
        </p>

        <MagneticButton>
          Hire Me
        </MagneticButton>
      </Section>
    </div>
  );
}