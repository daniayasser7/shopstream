import { apiRequest } from "./client";

export const PAGE_SIZE = 12;

const LIST_FIELDS =
  "title,description,price,discountPercentage,rating,thumbnail,category,brand";

export function getProducts({
  q,
  category,
  sortBy,
  order,
  skip,
  limit = PAGE_SIZE,
  select = LIST_FIELDS,
}) {
  const params = new URLSearchParams({ limit, skip, select });

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  let path = "/products";

  if (q) {
    path = "/products/search";
    params.set("q", q);
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`;
  }

  return apiRequest(`${path}?${params}`);
}

export function getProduct(id) {
  return apiRequest(`/products/${id}`);
}

export function getCategories() {
  return apiRequest("/products/categories");
}

export function addProduct(product) {
  return apiRequest("/products/add", { method: "POST", body: product });
}

export function updateProduct(id, changes) {
  return apiRequest(`/products/${id}`, { method: "PUT", body: changes });
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, { method: "DELETE" });
}

export function getProductOptions() {
  return apiRequest("/products?limit=0&select=title,price,thumbnail");
}