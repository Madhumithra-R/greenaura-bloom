import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatPrice, productImage } from "@/lib/catalog";

const Wishlist = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { items, isLoading, remove } = useWishlist();
  const { addItem } = useCart();

  if (!loading && !user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pt-40 text-center lg:px-12">
          <Heart className="mx-auto mb-6 text-accent" size={40} />
          <h1 className="mb-4 text-3xl font-bold text-foreground">Your wishlist awaits</h1>
          <p className="mb-8 text-muted-foreground">Sign in to save the plants you love.</p>
          <button
            onClick={() => navigate("/auth?next=/wishlist")}
            className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Sign in
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32">
        <section className="container mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Saved</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">My Wishlist</h1>
          </div>

          {isLoading ? (
            <p className="py-20 text-center text-muted-foreground">Loading your saved plants…</p>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-6 text-muted-foreground">No saved plants yet — tap the heart on any plant to keep it here.</p>
              <button
                onClick={() => navigate("/shop")}
                className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
              >
                Browse the collection
              </button>
            </div>
          ) : (
            <div className="grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((row, i) => (
                <motion.article
                  key={row.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4) }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden bg-muted">
                    <img
                      src={productImage(row.products?.image_url)}
                      alt={row.products?.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <button
                      onClick={() => remove.mutate(row.id)}
                      aria-label={`Remove ${row.products?.name} from wishlist`}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-transform hover:scale-110 hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {row.products?.category}
                    </span>
                    <h2 className="text-lg font-semibold text-foreground">{row.products?.name}</h2>
                    <p className="mb-4 mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {row.products?.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-foreground">
                        {formatPrice(row.products?.price_cents ?? 0)}
                      </p>
                      <button
                        disabled={(row.products?.stock ?? 0) <= 0}
                        onClick={() => addItem.mutate({ productId: row.product_id })}
                        className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        {(row.products?.stock ?? 0) > 0 ? "Add to cart" : "Sold out"}
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

export default Wishlist;
