import "./App.css";
import { PostureProcessing } from "./components/PostureProcessing";
import { Register } from "./components/login/Register";
import { Login } from "./components/login/Login";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { NoMatch } from "./components/NoMatch";
import { AuthProvider, useAuth } from "./context/authContext";
import Calendar from "./components/calendar/Calendar";
import { LandingPage } from "./components/landing-page/LandingPange";
import { ToastContainer } from "react-toastify";
import { ErgonomicsPage } from "./components/ergonomics-page/ErgonomicsPage";

const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    // Replace isAuthenticated with your own authentication logic
    navigate("/login", { state: { from: location } });
    return null;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <ToastContainer></ToastContainer>
      <AuthProvider>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="ergonomics" element={<ErgonomicsPage />} />
          <Route path="posture-processing" element={<PostureProcessing />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
