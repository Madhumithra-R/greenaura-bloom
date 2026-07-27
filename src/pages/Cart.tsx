import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, productImage } from "@/lib/catalog";
import { toast } from "@/hooks/use-toast";

const addressSchema = z.string().trim().min(10, "Please enter a full shipping address").max(500);

const Cart = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { items, totalCents, isLoading, setQuantity, removeItem, invalidate } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?next=/cart", { replace: true });
  }, [loading, user, navigate]);

  const checkout = async () => {
    const parsed = addressSchema.safeParse(address);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError("");
    if (!user || items.length === 0) return;
    setPlacing(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total_cents: totalCents, shipping_address: parsed.data, status: "pending" })
        .select("id")
        .single();
      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((row) => ({
          order_id: order.id,
          product_id: row.product_id,
          product_name: row.products.name,
          unit_price_cents: row.products.price_cents,
          quantity: row.quantity,
        })),
      );
      if (itemsError) throw itemsError;

      await supabase.from("cart_items").delete().eq("user_id", user.id);
      invalidate();
      toast({ title: "Order placed!", description: "We'll start potting it up right away." });
      navigate("/orders");
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 pb-24 pt-32 lg:px-12">
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Your Cart</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="mb-6 text-muted-foreground">Your cart is empty.</p>
            <button
              onClick={() => navigate("/shop")}
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
            >
              Browse plants
            </button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {items.map((row) => (
                <div key={row.id} className="flex gap-5 rounded-2xl bg-card p-4 shadow-sm">
                  <img
                    src={productImage(row.products.image_url)}
                    alt={row.products.name}
                    className="h-28 w-24 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-foreground">{row.products.name}</h2>
                      <p className="text-sm text-muted-foreground">{formatPrice(row.products.price_cents)} each</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity.mutate({ id: row.id, quantity: row.quantity - 1 })}
                          className="rounded-full border border-border p-1.5 text-foreground hover:bg-muted"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-foreground">{row.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQuantity.mutate({ id: row.id, quantity: row.quantity + 1 })}
                          className="rounded-full border border-border p-1.5 text-foreground hover:bg-muted"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-foreground">
                          {formatPrice(row.products.price_cents * row.quantity)}
                        </p>
                        <button
                          aria-label={`Remove ${row.products.name}`}
                          onClick={() => removeItem.mutate(row.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl bg-muted p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Order Summary</h2>
              <div className="mb-6 flex justify-between border-b border-border pb-4 text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(totalCents)}</span>
              </div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-foreground">
                Shipping address
              </label>
              <textarea
                id="address"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, postcode, country"
                className="mb-1 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
              <button
                onClick={checkout}
                disabled={placing}
                className="mt-4 w-full rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
              >
                {placing ? "Placing order…" : "Place order"}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Payments are not enabled yet — orders are recorded for fulfilment.
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
