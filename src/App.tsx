import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoute />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
