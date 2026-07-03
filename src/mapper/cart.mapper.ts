import type { SelectingOrder } from "@/type/SelectingOrder";
import type { UpdateCartItemPayload } from "@/type/Cart.payload";

export const mapSelectingOrderToCartItem = (
  order: SelectingOrder,
): UpdateCartItemPayload => ({
  productId: order.productId,
  size: order.size,
  color: order.color,
  quantity: order.quantity,
});
