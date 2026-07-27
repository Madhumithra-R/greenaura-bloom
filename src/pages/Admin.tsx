import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, productImage, type Product } from "@/lib/catalog";
import { toast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  category: z.string().trim().min(1, "Category is required").max(60),
  description: z.string().trim().max(1000),
  price: z.coerce.number().min(0, "Price must be positive").max(100000),
  stock: z.coerce.number().int().min(0).max(100000),
  image_url: z.string().trim().max(300),
});

const emptyForm = { name: "", category: "", description: "", price: "", stock: "", image_url: "" };

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?next=/admin", { replace: true });
  }, [loading, user, navigate]);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at");
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, total_cents, status, shipping_address")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = productSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name: parsed.data.name,
      category: parsed.data.category,
      description: parsed.data.description,
      price_cents: Math.round(parsed.data.price * 100),
      stock: parsed.data.stock,
      image_url: parsed.data.image_url || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Could not add product", description: error.message, variant: "destructive" });
      return;
    }
    setForm(emptyForm);
    qc.invalidateQueries({ queryKey: ["products"] });
    toast({ title: "Product added" });
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  if (loading) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-6 pb-24 pt-40 lg:px-12">
          <div className="mx-auto max-w-lg rounded-2xl bg-muted p-12 text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">Admin access required</h1>
            <p className="text-sm text-muted-foreground">
              Your account doesn't have the admin role yet. Ask an existing admin to grant it, or set it from the
              backend users area.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto space-y-16 px-6 pb-24 pt-32 lg:px-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Store Admin</h1>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-foreground">Add a product</h2>
          <form onSubmit={addProduct} className="grid gap-4 rounded-2xl bg-card p-6 shadow-sm sm:grid-cols-2">
            {[
              { key: "name", label: "Name", placeholder: "Monstera Deliciosa" },
              { key: "category", label: "Category", placeholder: "Tropical" },
              { key: "price", label: "Price (USD)", placeholder: "145.00" },
              { key: "stock", label: "Stock", placeholder: "10" },
              { key: "image_url", label: "Image URL or key", placeholder: "plant-4" },
            ].map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="mb-2 block text-sm font-medium text-foreground">
                  {field.label}
                </label>
                <input
                  id={field.key}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                {errors[field.key] && <p className="mt-1 text-xs text-destructive">{errors[field.key]}</p>}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">Description</label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
            >
              {saving ? "Saving…" : "Add product"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-foreground">Catalog ({products.length})</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm">
                <img src={productImage(p.image_url)} alt={p.name} className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {formatPrice(p.price_cents)} · {p.stock} in stock
                  </p>
                </div>
                <button
                  aria-label={`Delete ${p.name}`}
                  onClick={() => deleteProduct(p.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-foreground">Orders ({orders.length})</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card p-4 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-foreground">#{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{o.shipping_address}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatPrice(o.total_cents)}</p>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-foreground">Contact messages ({messages.length})</h2>
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="rounded-xl bg-card p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground">
                  {m.name} <span className="font-normal text-muted-foreground">· {m.email}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
