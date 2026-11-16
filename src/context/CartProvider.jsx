import { useEffect, useState } from "react";
import { CartContext } from "./cartContext";
import useAuth from "../hooks/useAuth";
import { addCart, deleteCart, getUserCarts, updateCart } from "../api/carts";

function toItems(products) {
  return products.map((product) => ({
    id: product.id,
    quantity: product.quantity,
  }));
}

function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loadedFor, setLoadedFor] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let ignore = false;

    getUserCarts(user.id)
      .then((data) => {
        if (ignore) return;
        setCart(data.carts[0] || null);
        setError("");
        setLoadedFor(user.id);
      })
      .catch((err) => {
        if (ignore) return;
        setCart(null);
        setError(err.message);
        setLoadedFor(user.id);
      });

    return () => {
      ignore = true;
    };
  }, [user]);

  const isReady = Boolean(user) && loadedFor === user.id;
  const currentCart = isReady ? cart : null;
  const products = currentCart?.products || [];

  async function saveProducts(nextProducts) {
    setIsSaving(true);

    try {
      if (nextProducts.length === 0) {
        if (currentCart && !currentCart.isLocal) {
          await deleteCart(currentCart.id);
        }
        setCart(null);
        return;
      }

      const items = toItems(nextProducts);

      if (!currentCart || currentCart.isLocal) {
        const created = await addCart({ userId: user.id, products: items });
        setCart({ ...created, id: currentCart?.id ?? created.id, isLocal: true });
      } else {
        const saved = await updateCart(currentCart.id, {
          merge: false,
          products: items,
        });
        setCart({ ...saved, id: currentCart.id });
      }
    } finally {
      setIsSaving(false);
    }
  }

  function addToCart(productId, quantity = 1) {
    const existing = products.find((item) => item.id === productId);
    const next = existing
      ? products.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...products, { id: productId, quantity }];

    return saveProducts(next);
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return removeFromCart(productId);

    return saveProducts(
      products.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }

  function removeFromCart(productId) {
    return saveProducts(products.filter((item) => item.id !== productId));
  }

  const value = {
    cart: currentCart,
    isLoading: Boolean(user) && !isReady,
    isSaving,
    error,
    itemCount: currentCart?.totalQuantity || 0,
    addToCart,
    updateQuantity,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;