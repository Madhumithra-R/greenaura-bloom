ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS light text NOT NULL DEFAULT 'Bright, indirect light',
  ADD COLUMN IF NOT EXISTS water text NOT NULL DEFAULT 'Water when the top 2 inches of soil are dry',
  ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'Easy',
  ADD COLUMN IF NOT EXISTS mature_size text NOT NULL DEFAULT 'Up to 1.2 m tall',
  ADD COLUMN IF NOT EXISTS care_notes text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.place_order(_shipping_address text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _order_id uuid;
  _total int := 0;
  _row record;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF length(btrim(_shipping_address)) < 10 OR length(btrim(_shipping_address)) > 500 THEN
    RAISE EXCEPTION 'Invalid shipping address';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cart_items WHERE user_id = _uid) THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  INSERT INTO orders (user_id, total_cents, shipping_address, status)
  VALUES (_uid, 0, btrim(_shipping_address), 'pending')
  RETURNING id INTO _order_id;

  FOR _row IN
    SELECT c.quantity, p.id AS product_id, p.name, p.price_cents, p.stock
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = _uid
    ORDER BY p.id
    FOR UPDATE OF p
  LOOP
    IF _row.quantity < 1 OR _row.quantity > _row.stock THEN
      RAISE EXCEPTION 'Not enough stock for %', _row.name;
    END IF;

    INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
    VALUES (_order_id, _row.product_id, _row.name, _row.price_cents, _row.quantity);

    UPDATE products SET stock = stock - _row.quantity WHERE id = _row.product_id;
    _total := _total + _row.price_cents * _row.quantity;
  END LOOP;

  UPDATE orders SET total_cents = _total WHERE id = _order_id;
  DELETE FROM cart_items WHERE user_id = _uid;

  RETURN _order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(text) TO authenticated;