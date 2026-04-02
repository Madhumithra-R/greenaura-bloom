import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroBg from "@/assets/hero-greenhouse.jpg";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative flex min-h-screen items-center overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroBg}
          alt="Lush greenhouse conservatory with tropical plants"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </motion.div>

      <motion.div style={{ opacity }} className="container relative z-10 mx-auto px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-sm font-semibold uppercase tracking-[0.4em] text-primary-foreground/70"
          >
            Premium Indoor Plants
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-primary-foreground md:text-7xl lg:text-8xl"
          >
            Breathe Life
            <br />
            <span className="italic">Into Your Space</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mb-12 max-w-lg text-lg leading-relaxed text-primary-foreground/80"
          >
            Hand-selected, sustainably grown plants that transform any space into a living sanctuary. Delivered with care to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#shop"
              className="rounded-full bg-primary-foreground px-10 py-4 text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:scale-105 hover:shadow-xl"
            >
              Explore Collection
            </a>
            <a
              href="#story"
              className="rounded-full border border-primary-foreground/40 px-10 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:border-primary-foreground hover:scale-105"
            >
              Our Story
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
