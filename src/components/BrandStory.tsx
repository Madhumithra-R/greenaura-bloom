import { motion } from "framer-motion";
import storyImg from "@/assets/story-plants.jpg";

const BrandStory = () => (
  <section id="story" className="py-24 lg:py-32">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl"
        >
          <img
            src={storyImg}
            alt="Curated plant collection on wooden shelf"
            loading="lazy"
            width={1200}
            height={800}
            className="w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Our Story</p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Rooted in
            <br />
            <span className="italic">Passion</span>
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
            GreenAura began with a simple belief — that every space deserves the vitality of living greenery. Founded in 2020, we've grown from a small urban nursery into a curated destination for plant enthusiasts.
          </p>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Each plant in our collection is hand-selected from sustainable growers, nurtured with care, and delivered in eco-friendly packaging. We're not just selling plants — we're cultivating a greener way of living.
          </p>
          <a
            href="#contact"
            className="inline-block rounded-full border border-foreground/20 px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-foreground/40 hover:scale-105"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default BrandStory;
