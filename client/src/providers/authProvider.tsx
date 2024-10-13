import { createContext, useEffect, useState } from "react";

interface UserData {
  name: string;
  email: string;
}
interface AuthContextType {
  user: UserData | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  const backend_url = "http://localhost:8080";

  const login = async (email: string, password: string) => {
    const response = await fetch(`${backend_url}/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      console.log(await response.json());
      throw new Error("Invalid credentials");
    }
    const token = await response.json();
    localStorage.setItem("token", token.token);
    getUser();
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // no-cors
    const response = await fetch(`${backend_url}/user/jwt`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      //   mode: "no-cors",
    });
    if (!response.ok) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    const user = await response.json();
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${backend_url}/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const token = await response.json();
    localStorage.setItem("token", token.token);
    getUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
