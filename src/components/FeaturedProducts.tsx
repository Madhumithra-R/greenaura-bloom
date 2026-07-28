import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, productImage, type Product } from "@/lib/catalog";
import SaveButton from "@/components/SaveButton";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
  }),
};

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at")
        .limit(6);
      if (error) throw error;
      return data as Product[];
    },
  });

  return (
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

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading the greenhouse…</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => navigate("/shop")}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow duration-500 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden bg-muted">
                  <img
                    src={productImage(product.image_url)}
                    alt={product.name}
                    loading="lazy"
                    width={800}
                    height={1024}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <SaveButton productId={product.id} className="absolute right-4 top-4" />
                </div>
                <div className="p-6">
                  <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {product.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="text-lg font-semibold text-foreground">{formatPrice(product.price_cents)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/shop")}
            className="rounded-full border border-primary px-10 py-4 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View all plants
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
