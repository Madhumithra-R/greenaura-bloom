import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/lib/catalog";

export type CartRow = {
  id: string;
  quantity: number;
  product_id: string;
  products: Product;
};

export const useCart = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const cart = useQuery({
    queryKey: ["cart", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, quantity, product_id, products(*)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CartRow[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cart", user?.id] });

  const addItem = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) throw new Error("Please sign in to add items to your cart.");
      const existing = cart.data?.find((r) => r.product_id === productId);
      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, product_id: productId, quantity });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Added to cart" });
    },
    onError: (e: Error) => toast({ title: "Could not add item", description: e.message, variant: "destructive" }),
  });

  const setQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast({ title: "Could not update cart", description: e.message, variant: "destructive" }),
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const items = cart.data ?? [];
  const count = items.reduce((sum, r) => sum + r.quantity, 0);
  const totalCents = items.reduce((sum, r) => sum + r.quantity * (r.products?.price_cents ?? 0), 0);

  return { items, count, totalCents, isLoading: cart.isLoading, addItem, setQuantity, removeItem, invalidate };
};
