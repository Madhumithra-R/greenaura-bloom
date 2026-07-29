import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Droplets, Ruler, Sprout, Sun } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveButton from "@/components/SaveButton";
import PlantAssistant from "@/components/PlantAssistant";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, productImage, type Product } from "@/lib/catalog";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const ProductDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", product?.category, id],
    enabled: !!product,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product!.category)
        .neq("id", id)
        .limit(3);
      if (error) throw error;
      return data as Product[];
    },
  });

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} — GreenAura`;
    const desc = document.querySelector('meta[name="description"]');
    desc?.setAttribute("content", product.description.slice(0, 155));
  }, [product]);

  const care = product
    ? [
        { Icon: Sun, label: "Light", value: product.light },
        { Icon: Droplets, label: "Water", value: product.water },
        { Icon: Sprout, label: "Care level", value: product.difficulty },
        { Icon: Ruler, label: "Mature size", value: product.mature_size },
      ]
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 pb-24 pt-32 lg:px-12">
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Back to shop
        </Link>

        {isLoading ? (
          <p className="py-20 text-center text-muted-foreground">Loading…</p>
        ) : !product ? (
          <p className="py-20 text-center text-muted-foreground">That plant is no longer available.</p>
        ) : (
          <>
            {/* eslint-disable-next-line react/no-danger */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: product.name,
                  description: product.description,
                  category: product.category,
                  offers: {
                    "@type": "Offer",
                    price: (product.price_cents / 100).toFixed(2),
                    priceCurrency: "USD",
                    availability:
                      product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                  },
                }),
              }}
            />

            <div className="grid gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-muted"
              >
                <img
                  src={productImage(product.image_url)}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />
                <SaveButton productId={product.id} className="absolute right-5 top-5" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col justify-center"
              >
                <span className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{product.name}</h1>
                <p className="mt-4 text-2xl font-semibold text-foreground">{formatPrice(product.price_cents)}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {care.map(({ Icon, label, value }) => (
                    <div key={label} className="rounded-2xl bg-card p-4 shadow-sm">
                      <div className="mb-1 flex items-center gap-2 text-accent">
                        <Icon size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>

                {product.care_notes && (
                  <p className="mt-6 rounded-2xl bg-muted p-5 text-sm leading-relaxed text-muted-foreground">
                    {product.care_notes}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    disabled={product.stock <= 0}
                    onClick={() =>
                      user
                        ? addItem.mutate({ productId: product.id })
                        : navigate(`/auth?next=/product/${product.id}`)
                    }
                    className="rounded-full bg-primary px-10 py-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    {product.stock > 0 ? "Add to cart" : "Sold out"}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} in stock` : "Back soon"}
                  </span>
                </div>
              </motion.div>
            </div>

            {related.length > 0 && (
              <section className="mt-24">
                <h2 className="mb-8 text-2xl font-bold text-foreground">You may also like</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/product/${r.id}`}
                      className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-2xl"
                    >
                      <img
                        src={productImage(r.image_url)}
                        alt={r.name}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="flex items-center justify-between p-5">
                        <h3 className="font-semibold text-foreground">{r.name}</h3>
                        <p className="font-semibold text-foreground">{formatPrice(r.price_cents)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <PlantAssistant />
      <Footer />
    </div>
  );
};

export default ProductDetail;
