import { apiRequest } from "./client";

export async function getStoreStats() {
  const [products, users, carts] = await Promise.all([
    apiRequest("/products?limit=1&select=id"),
    apiRequest("/users?limit=1&select=id"),
    apiRequest("/carts?limit=1"),
  ]);

  return {
    products: products.total,
    users: users.total,
    carts: carts.total,
  };
}