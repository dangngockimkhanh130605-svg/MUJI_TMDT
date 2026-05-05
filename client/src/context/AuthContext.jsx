import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      // Decode token để lấy user info (hoặc call API /me)
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, [token]);

  const login = (tokenData) => {
    localStorage.setItem("token", tokenData);
    setToken(tokenData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);