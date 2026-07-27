import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, productImage, type Product } from "@/lib/catalog";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const Shop = () => {
  const [category, setCategory] = useState<string>("All");
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Product[];
    },
  });

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const visible = category === "All" ? products : products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32">
        <section className="container mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">The Collection</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Shop All Plants</h1>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="py-20 text-center text-muted-foreground">Loading the greenhouse…</p>
          ) : (
            <div className="grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product, i) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4) }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-2xl"
                >
                  <div className="overflow-hidden bg-muted">
                    <img
                      src={productImage(product.image_url)}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {product.category}
                    </span>
                    <h2 className="text-lg font-semibold text-foreground">{product.name}</h2>
                    <p className="mb-4 mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-foreground">{formatPrice(product.price_cents)}</p>
                      <button
                        disabled={product.stock <= 0}
                        onClick={() =>
                          user
                            ? addItem.mutate({ productId: product.id })
                            : navigate("/auth?next=/shop")
                        }
                        className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        {product.stock > 0 ? "Add to cart" : "Sold out"}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
