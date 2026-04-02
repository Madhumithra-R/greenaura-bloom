import { motion } from "framer-motion";
import { Sprout, HeartHandshake, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  { icon: Sprout, title: "Master Cultivated", desc: "Every plant raised by expert horticulturists with decades of experience." },
  { icon: HeartHandshake, title: "Lifetime Support", desc: "Free ongoing care advice from our plant specialists, forever." },
  { icon: ShieldCheck, title: "Pristine Health Guarantee", desc: "If it doesn't thrive, we replace it — no questions asked." },
  { icon: Truck, title: "White Glove Delivery", desc: "Carefully packaged and hand-delivered to your doorstep." },
];

const WhyChooseUs = () => (
  <section className="bg-primary py-24 lg:py-32">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/60">
          The GreenAura Standard
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
          Uncompromising Quality
        </h2>
      </motion.div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="group text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 transition-colors group-hover:bg-primary-foreground/20"
            >
              <b.icon className="h-8 w-8 text-primary-foreground" strokeWidth={1.5} />
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold text-primary-foreground">{b.title}</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/60">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
