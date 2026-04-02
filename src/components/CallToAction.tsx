import { motion } from "framer-motion";

const CallToAction = () => (
  <section className="py-24 lg:py-32">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl bg-primary px-8 py-20 text-center lg:px-20"
      >
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Ready to Transform
          <br />
          <span className="italic">Your Space?</span>
        </h2>
        <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-primary-foreground/70">
          Join thousands of plant lovers who trust GreenAura for premium, sustainably grown indoor plants.
        </p>
        <a
          href="#shop"
          className="inline-block rounded-full bg-primary-foreground px-10 py-4 text-sm font-semibold text-primary transition-all hover:scale-105 hover:shadow-xl"
        >
          Shop the Collection
        </a>
      </motion.div>
    </div>
  </section>
);

export default CallToAction;
