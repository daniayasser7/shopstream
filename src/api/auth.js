import { apiRequest } from "./client";

const SESSION_MINUTES = 60 * 24 * 7;

async function findUsernameByEmail(email) {
  const data = await apiRequest(
    `/users/filter?key=email&value=${encodeURIComponent(email)}&select=username`
  );

  if (data.users.length === 0) {
    throw new Error("No account found with this email.");
  }

  return data.users[0].username;
}

export async function loginRequest(identifier, password) {
  const username = identifier.includes("@")
    ? await findUsernameByEmail(identifier)
    : identifier;

  return apiRequest("/auth/login", {
    method: "POST",
    body: { username, password, expiresInMins: SESSION_MINUTES },
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me", { auth: true });
}

export function registerUser(newUser) {
  return apiRequest("/users/add", {
    method: "POST",
    body: newUser,
  });
}