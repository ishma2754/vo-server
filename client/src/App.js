import { Routes, Route } from "react-router-dom";
import "./App.css";
import Auth from "./components/Authorisation/Auth";
import { Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ChartPage from "./pages/chart";
import Input from "./pages/input-field";
import Home from "./pages/home";
import ReportsPage from "./pages/ReportsPage";
import AdminFetchUser from "./pages/AdminPage";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userRole = cookies.Role;

  return (
    <div>
      <div className="App">
        {!authToken && <Auth />}

        {authToken && (
          <>
            <Navbar />
            <div className="flex-1">
              <Routes>
                {userRole === "admin" ? (
                  <>
                    <Route path="*" element={<Navigate to="/AdminPage" />} />
                    <Route path="/AdminPage" element={<AdminFetchUser />} />
                  </>
                ) : (
                  <>
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/Input" element={<Input />} />
                    <Route path="/ChartPage" element={<ChartPage />} />
                    <Route path="/ReportsPage" element={<ReportsPage />} />
                  </>
                )}
              </Routes>
            </div>
            {userRole !== "admin" && <Footer />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
