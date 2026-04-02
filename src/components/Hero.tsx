import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroPlant from "@/assets/hero-plant.jpg";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 flex items-center justify-center">
        <img
          src={heroPlant}
          alt="Premium monstera plant in ceramic pot"
          width={1024}
          height={1280}
          className="h-[70vh] w-auto object-contain opacity-20 lg:opacity-30"
        />
      </motion.div>

      <div className="container relative z-10 mx-auto px-6 py-32 lg:px-12">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent"
          >
            Premium Indoor Plants
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            Bring Nature
            <br />
            <span className="italic text-accent">Into Your Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Hand-selected, sustainably grown plants that transform any space into a living sanctuary. Delivered with care to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#shop"
              className="rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-xl"
            >
              Explore Collection
            </a>
            <a
              href="#story"
              className="rounded-full border border-foreground/20 px-8 py-4 text-sm font-semibold text-foreground transition-all hover:border-foreground/40 hover:scale-105"
            >
              Our Story
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
