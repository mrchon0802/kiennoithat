import type { SelectingOrder } from "@/type/SelectingOrder";
import type { CartItemPayload } from "@/type/Cart.payload";

export const mapSelectingOrderToCartItem = (
  order: SelectingOrder,
): CartItemPayload => ({
  productId: order.productId,
  name: order.name,
  image: order.image,
  price: order.price,
  weight: order.weight,
  length: order.length,
  width: order.width,
  height: order.height,
  size: order.size,
  color: order.color,
  quantity: order.quantity,
});
