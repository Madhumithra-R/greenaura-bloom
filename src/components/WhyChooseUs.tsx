import { motion } from "framer-motion";
import { Leaf, Truck, ShieldCheck, HeartHandshake } from "lucide-react";

const benefits = [
  { icon: Leaf, title: "Sustainably Grown", desc: "Every plant is sourced from eco-conscious, certified nurseries." },
  { icon: Truck, title: "Free Shipping", desc: "Complimentary delivery on all orders over $75, nationwide." },
  { icon: ShieldCheck, title: "30-Day Guarantee", desc: "Not thriving? We'll replace it — no questions asked." },
  { icon: HeartHandshake, title: "Expert Care Guides", desc: "Detailed care instructions included with every plant." },
];

const WhyChooseUs = () => (
  <section className="bg-primary py-24 lg:py-32">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/60">Why GreenAura</p>
        <h2 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">The GreenAura Difference</h2>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <b.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-primary-foreground">{b.title}</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/70">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
