import { apiRequest } from "./client";

export const USERS_PAGE_SIZE = 10;

const LIST_FIELDS = "firstName,lastName,username,email,phone,image,role";

export function getUserOptions() {
  return apiRequest("/users?limit=0&select=firstName,lastName,email,image");
}

export function getUsers({ q, filterKey, filterValue, skip, limit = USERS_PAGE_SIZE }) {
  const params = new URLSearchParams({ limit, skip, select: LIST_FIELDS });
  let path = "/users";

  if (q) {
    path = "/users/search";
    params.set("q", q);
  } else if (filterKey) {
    path = "/users/filter";
    params.set("key", filterKey);
    params.set("value", filterValue);
  }

  return apiRequest(`${path}?${params}`);
}

export function getUser(id) {
  return apiRequest(`/users/${id}`);
}

export function addUser(user) {
  return apiRequest("/users/add", { method: "POST", body: user });
}

export function updateUser(id, changes) {
  return apiRequest(`/users/${id}`, { method: "PUT", body: changes });
}

export function deleteUser(id) {
  return apiRequest(`/users/${id}`, { method: "DELETE" });
}