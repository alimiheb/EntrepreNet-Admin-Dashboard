import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Login from "./Login/Login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Report from "./scenes/report/Report";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from local storage
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isLoggedIn && <Sidebar isSidebar={isSidebar} />}
          {isLoggedIn && <Topbar setIsSidebar={setIsSidebar} />}
          <main className="content">
            <Routes>
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Team />
                  ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} />
                  )
                }
              />
              <Route
                path="/"
                element={isLoggedIn ? <Team /> : <Navigate to="/login" />}
              />
              <Route
                path="/team"
                element={isLoggedIn ? <Team /> : <Navigate to="/login" />}
              />
              <Route
                path="/invoices"
                element={isLoggedIn ? <Invoices /> : <Navigate to="/login" />}
              />
              <Route
                path="/reports"
                element={isLoggedIn ? <Report /> : <Navigate to="/login" />}
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
