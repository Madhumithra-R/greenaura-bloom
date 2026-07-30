-- Server-side checkout routine, callable only by the service role (edge function)
CREATE OR REPLACE FUNCTION public.place_order_for_user(_user_id uuid, _shipping_address text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _order_id uuid;
  _total int := 0;
  _row record;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF length(btrim(_shipping_address)) < 10 OR length(btrim(_shipping_address)) > 500 THEN
    RAISE EXCEPTION 'Invalid shipping address';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cart_items WHERE user_id = _user_id) THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  INSERT INTO orders (user_id, total_cents, shipping_address, status)
  VALUES (_user_id, 0, btrim(_shipping_address), 'pending')
  RETURNING id INTO _order_id;

  FOR _row IN
    SELECT c.quantity, p.id AS product_id, p.name, p.price_cents, p.stock
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = _user_id
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
  DELETE FROM cart_items WHERE user_id = _user_id;

  RETURN _order_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.place_order_for_user(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_order_for_user(uuid, text) TO service_role;

-- Remove the client-callable SECURITY DEFINER checkout routine
DROP FUNCTION IF EXISTS public.place_order(text);