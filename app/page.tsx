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
        className="h-screen flex flex-col justify-center items-center text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
          Ayesha Irfan
        </h1>

        <p className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl">
          Full Stack Web Developer crafting modern, animated and scalable web
          experiences with React, Next.js and Node.js.
        </p>
      </motion.section>

      {/* ABOUT */}
      <Section id="about">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* LEFT */}
          <div>
            <p className="text-pink-400 uppercase tracking-[0.3em] text-sm mb-4">
              About Me
            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Full Stack <br />
              Web Developer
            </h2>

            <p className="text-gray-400 leading-relaxed mb-6">
              I'm Ayesha Irfan, a passionate full stack web developer focused on
              building modern, responsive and high-performance web applications.
              I enjoy creating smooth user experiences, scalable backend systems,
              and visually engaging interfaces using modern technologies.
            </p>

            <p className="text-gray-500 leading-relaxed">
              My expertise includes React, Next.js, Node.js, Express.js,
              MongoDB, Tailwind CSS, TypeScript and Framer Motion.
            </p>
          </div>

          {/* RIGHT */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl rounded-full" />

            <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Frontend</h3>

                  <p className="text-gray-400">
                    React, Next.js, Tailwind CSS, Framer Motion
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Backend</h3>

                  <p className="text-gray-400">
                    Node.js, Express.js, REST APIs
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Database</h3>

                  <p className="text-gray-400">
                    MongoDB, PostgreSQL, Firebase
                  </p>
                </div>
              </div>
            </div>
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

        <MagneticButton>
          Hire Me
        </MagneticButton>
      </Section>
    </div>
  );
}