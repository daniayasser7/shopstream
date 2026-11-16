import { apiRequest } from "./client";

export const CARTS_PAGE_SIZE = 10;

export function getCarts({ skip, limit = CARTS_PAGE_SIZE }) {
  return apiRequest(`/carts?limit=${limit}&skip=${skip}`);
}

export function getCart(id) {
  return apiRequest(`/carts/${id}`);
}

export function getUserCarts(userId) {
  return apiRequest(`/carts/user/${userId}`);
}

export function addCart(cart) {
  return apiRequest("/carts/add", { method: "POST", body: cart });
}

export function updateCart(id, changes) {
  return apiRequest(`/carts/${id}`, { method: "PUT", body: changes });
}

export function deleteCart(id) {
  return apiRequest(`/carts/${id}`, { method: "DELETE" });
}