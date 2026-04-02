import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", text: "The quality of the plants is incredible. My Monstera arrived in perfect condition and has been thriving ever since. GreenAura is my go-to plant shop.", rating: 5 },
  { name: "James T.", text: "Beautiful packaging, healthy plants, and the care guide was a thoughtful touch. I've ordered three times now and every experience has been outstanding.", rating: 5 },
  { name: "Elena R.", text: "I was nervous about ordering plants online, but GreenAura exceeded every expectation. The Fiddle Leaf Fig is stunning and arrived so well-protected.", rating: 5 },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Testimonials</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">What Our Customers Say</h2>
        </motion.div>

        <div className="relative mx-auto max-w-2xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-8 text-xl leading-relaxed text-foreground italic md:text-2xl">
                "{testimonials[current].text}"
              </p>
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                — {testimonials[current].name}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-foreground" : "w-2 bg-foreground/20"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
