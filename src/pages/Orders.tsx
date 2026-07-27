import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/catalog";

type OrderRow = {
  id: string;
  created_at: string;
  total_cents: number;
  status: string;
  shipping_address: string;
  order_items: { id: string; product_name: string; quantity: number; unit_price_cents: number }[];
};

const Orders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth?next=/orders", { replace: true });
  }, [loading, user, navigate]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, total_cents, status, shipping_address, order_items(id, product_name, quantity, unit_price_cents)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OrderRow[];
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 pb-24 pt-32 lg:px-12">
        <h1 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Your Orders</h1>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="mb-6 text-muted-foreground">No orders yet.</p>
            <button
              onClick={() => navigate("/shop")}
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl bg-card p-6 shadow-sm">
                <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                    {order.status}
                  </span>
                </header>
                <ul className="mb-4 space-y-2">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="text-foreground">{formatPrice(item.unit_price_cents * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">Shipping to {order.shipping_address}</span>
                  <span className="font-semibold text-foreground">{formatPrice(order.total_cents)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
