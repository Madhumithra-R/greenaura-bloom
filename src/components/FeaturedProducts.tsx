import { motion } from "framer-motion";
import plant1 from "@/assets/plant-1.jpg";
import plant2 from "@/assets/plant-2.jpg";
import plant3 from "@/assets/plant-3.jpg";
import plant4 from "@/assets/plant-4.jpg";
import plant5 from "@/assets/plant-5.jpg";
import plant6 from "@/assets/plant-6.jpg";

const products = [
  { name: "Desert Rose Succulent", price: "$24", image: plant1 },
  { name: "Fiddle Leaf Fig", price: "$68", image: plant2 },
  { name: "Snake Plant", price: "$42", image: plant3 },
  { name: "Golden Pothos", price: "$32", image: plant4 },
  { name: "Peace Lily", price: "$38", image: plant5 },
  { name: "Rubber Plant", price: "$56", image: plant6 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const FeaturedProducts = () => (
  <section id="shop" className="py-24 lg:py-32">
    <div className="container mx-auto px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Curated Selection</p>
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Featured Plants</h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <motion.div
            key={product.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-card transition-shadow hover:shadow-2xl"
          >
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                width={800}
                height={800}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
              <p className="mt-1 text-sm font-medium text-accent">{product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
