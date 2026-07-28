import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/lib/catalog";

export type WishlistRow = {
  id: string;
  product_id: string;
  products: Product;
};

export const useWishlist = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const wishlist = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("id, product_id, products(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as WishlistRow[];
    },
  });

  const items = wishlist.data ?? [];
  const invalidate = () => qc.invalidateQueries({ queryKey: ["wishlist", user?.id] });

  const isSaved = (productId: string) => items.some((r) => r.product_id === productId);

  const toggle = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Please sign in to save plants.");
      const existing = items.find((r) => r.product_id === productId);
      if (existing) {
        const { error } = await supabase.from("wishlist_items").delete().eq("id", existing.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("wishlist_items")
        .insert({ user_id: user.id, product_id: productId });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: (result) => {
      invalidate();
      toast({ title: result === "added" ? "Saved to wishlist" : "Removed from wishlist" });
    },
    onError: (e: Error) =>
      toast({ title: "Could not update wishlist", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Removed from wishlist" });
    },
  });

  return { items, count: items.length, isLoading: wishlist.isLoading, isSaved, toggle, remove };
};
