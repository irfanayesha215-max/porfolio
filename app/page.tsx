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

/* ---------------- TYPES ---------------- */
type SectionProps = {
  id: string;
  children: React.ReactNode;
  center?: boolean;
};

type Project = {
  title: string;
  desc: string;
  img: string;
};

type ProjectCardProps = {
  project: Project;
  onClick: () => void;
};

type MagneticButtonProps = {
  children: React.ReactNode;
};

/* ---------------- REDUCED MOTION ---------------- */
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (e: MediaQueryListEvent) => {
      setReduced(e.matches);
    };

    setReduced(mq.matches);

    mq.addEventListener?.("change", handler);

    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return reduced;
};

/* ---------------- SECTION ---------------- */
function Section({
  id,
  children,
  center = false,
}: SectionProps) {
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
function ProjectCard({ project, onClick }: ProjectCardProps) {
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
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-gray-400 text-sm mt-2">{project.desc}</p>
      </div>
    </motion.div>
  );
}

/* ---------------- MAGNETIC BUTTON ---------------- */
function MagneticButton({ children }: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 150, damping: 12 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 12 });

  const move = (e: React.MouseEvent<HTMLButtonElement>) => {
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
      className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-medium"
    >
      {children}
    </motion.button>
  );
}

/* ---------------- MAIN ---------------- */
export default function Portfolio() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const reduced = useReducedMotion();

  const { scrollYProgress, scrollY } = useScroll();

  const heroScale = useTransform(scrollY, [0, 400], [1, 0.88]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.25]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, {
    stiffness: 80,
    damping: 25,
  });

  const smoothY = useSpring(y, {
    stiffness: 80,
    damping: 25,
  });

  useEffect(() => {
    if (reduced) return;

    let raf: number | null = null;

    const move = (e: MouseEvent) => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        raf = null;
      });
    };

    window.addEventListener("mousemove", move, {
      passive: true,
    });

    return () => window.removeEventListener("mousemove", move);
  }, [reduced, x, y]);

  return (
    <div className="bg-black text-white min-h-screen font-[Inter] overflow-x-hidden relative">

      {/* CURSOR GLOW */}
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

      {/* SCROLL PROGRESS */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 origin-left z-50"
      />

      {/* HERO */}
      <motion.section
        style={{
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY,
        }}
        className="h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden"
      >
        {/* background glow */}
        <div className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-pink-500/10 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-sm text-gray-300 z-10"
        >
          ✦ Full Stack Web Developer
        </motion.div>

        {/* name */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight z-10"
        >
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
            Ayesha Irfan
          </span>
        </motion.h1>

        {/* animated line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{
            delay: 0.5,
            duration: 0.8,
          }}
          className="h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 mt-6 rounded-full z-10"
        />

        {/* animated description */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 1,
          }}
          className="text-gray-400 mt-8 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed z-10"
        >
          Crafting modern, animated and scalable web experiences with
          React, Next.js, TypeScript and Node.js.
        </motion.p>

        {/* animated buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.8,
          }}
          className="flex flex-col sm:flex-row gap-4 mt-10 z-10"
        >
          <motion.a
            href="#work"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 font-medium"
          >
            View Work
          </motion.a>

          <motion.a
            href="mailto:irfanayesha215@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl font-medium"
          >
            Contact Me
          </motion.a>
        </motion.div>

        {/* floating shapes */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="absolute top-24 left-10 hidden md:block w-20 h-20 rounded-full border border-pink-500/20"
        />

        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="absolute bottom-32 right-10 hidden md:block w-32 h-32 rounded-full border border-purple-500/20"
        />
      </motion.section>
      {/* ABOUT */}
      {/* ABOUT */}
      <Section id="about">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-pink-400 uppercase tracking-[0.3em] text-sm mb-4"
            >
              About Me
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
            >
              Building Modern <br />
              Digital Experiences
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-gray-400 leading-relaxed mb-6 text-lg"
            >
              I'm Ayesha Irfan, a passionate full stack web developer focused on
              building modern, responsive and high-performance web applications.
              I enjoy crafting smooth user experiences and scalable backend systems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-gray-500 leading-relaxed"
            >
              My expertise includes React, Next.js, Node.js, MongoDB,
              TypeScript, Tailwind CSS and Framer Motion.
            </motion.p>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* glow */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl rounded-full"
            />

            {/* card */}
            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 overflow-hidden"
            >
              {/* floating light */}
              <motion.div
                animate={{
                  x: [-20, 20, -20],
                  y: [-10, 10, -10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-2xl rounded-full"
              />

              <div className="space-y-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Frontend
                  </h3>

                  <p className="text-gray-400">
                    React, Next.js, Tailwind CSS, Framer Motion
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Backend
                  </h3>

                  <p className="text-gray-400">
                    Node.js, Express.js, REST APIs
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Database
                  </h3>

                  <p className="text-gray-400">
                    MongoDB, PostgreSQL, Firebase
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Section>
      {/* WORK */}
      <Section id="work">
        <h2 className="text-3xl mb-10 font-bold">Selected Work</h2>

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

      {/* MODAL */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 px-4"
            onClick={() => setActiveProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 border border-white/10 p-8 rounded-3xl max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl mb-3 font-bold">
                {activeProject.title}
              </h3>

              <p className="text-gray-300">
                {activeProject.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT */}
      <Section id="contact" center>
        <h2 className="text-3xl mb-4 font-bold">
          Contact
        </h2>

        <p className="text-gray-400 mb-8">
          Let’s build something amazing together.
        </p>

        <MagneticButton
        >
          Hire Me
        </MagneticButton>
      </Section>
    </div>
  );
}