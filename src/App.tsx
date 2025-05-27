import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { NavigationProvider } from "./utils/navigationUtils";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <NotificationProvider>
            <NavigationProvider>
              <AppRoute />
            </NavigationProvider>
          </NotificationProvider>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
