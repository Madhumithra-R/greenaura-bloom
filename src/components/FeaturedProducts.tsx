import { motion } from "framer-motion";
import productBird from "@/assets/product-bird-of-paradise.jpg";
import productFicus from "@/assets/product-ficus.jpg";
import productOlive from "@/assets/product-olive.jpg";

const products = [
  { name: "Bird of Paradise", category: "Tropical", price: "$210", image: productBird },
  { name: "Ficus Elastica", category: "Tree", price: "$160", image: productFicus },
  { name: "Olea Europaea", category: "Mediterranean", price: "$285", image: productOlive },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Curated Selection
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Featured Plants
        </h2>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <motion.div
            key={product.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow duration-500 hover:shadow-2xl"
          >
            <div className="overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                width={800}
                height={1024}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {product.category}
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="text-lg font-semibold text-foreground">{product.price}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
