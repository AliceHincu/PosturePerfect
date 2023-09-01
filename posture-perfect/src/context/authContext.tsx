import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, validateSessionToken } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastType, generateToast } from "../components/ui/Toast";

type AuthContextType = {
  token: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // This effect runs when the component mounts
  useEffect(() => {
    const validateUser = async () => {
      const data = await validateSessionToken(); // replace with your API endpoint
      if (data.isAuthenticated) {
        setToken(data.token);
      }
    };

    validateUser();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const handleLogin = async (email: string, password: string) => {
    const response = await loginUser({
      email: email,
      password: password,
    });
    setToken(response.sessionToken);

    const origin = location.state?.from?.pathname || "/home";
    navigate(origin);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
