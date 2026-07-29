import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveButton from "@/components/SaveButton";
import PlantAssistant from "@/components/PlantAssistant";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, productImage, type Product } from "@/lib/catalog";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const PAGE_SIZE = 9;

const sortOptions: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

const Shop = () => {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(1);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price_cents - b.price_cents);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price_cents - a.price_cents);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [products, category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32">
        <section className="container mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent">The Collection</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Shop All Plants</h1>
          </div>

          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => reset(() => setQuery(e.target.value))}
                placeholder="Search plants…"
                aria-label="Search plants"
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => reset(() => setSort(e.target.value as Sort))}
              aria-label="Sort plants"
              className="rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => reset(() => setCategory(c))}
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

          <p className="mb-8 text-center text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "plant" : "plants"} found
          </p>

          {isLoading ? (
            <p className="py-20 text-center text-muted-foreground">Loading the greenhouse…</p>
          ) : visible.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No plants match that search. Try another term or category.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product, i) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4) }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden bg-muted">
                    <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                      <img
                        src={productImage(product.image_url)}
                        alt={product.name}
                        loading="lazy"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    <SaveButton productId={product.id} className="absolute right-4 top-4" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {product.category}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h2 className="text-lg font-semibold text-foreground hover:text-accent">{product.name}</h2>
                    </Link>
                    <p className="mb-4 mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-foreground">{formatPrice(product.price_cents)}</p>
                      <button
                        disabled={product.stock <= 0}
                        onClick={() =>
                          user ? addItem.mutate({ productId: product.id }) : navigate("/auth?next=/shop")
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

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex justify-center gap-2">
              <button
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold uppercase tracking-wider text-foreground disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={`h-9 w-9 rounded-full text-xs font-semibold ${
                    n === current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(current + 1)}
                disabled={current === pageCount}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold uppercase tracking-wider text-foreground disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}

          <div className="pb-24" />
        </section>
      </main>
      <PlantAssistant />
      <Footer />
    </div>
  );
};

export default Shop;
