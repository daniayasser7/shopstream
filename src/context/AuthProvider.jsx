import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { getToken, saveToken, removeToken } from "../api/client";
import { loginRequest, getCurrentUser } from "../api/auth";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => removeToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(identifier, password) {
    const data = await loginRequest(identifier, password);
    saveToken(data.accessToken);
    const profile = await getCurrentUser();
    setUser(profile);
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;