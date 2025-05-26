/* eslint-disable @typescript-eslint/no-explicit-any */
// navigationUtils.tsx
import { useNavigate } from "react-router-dom";
import { createContext, useContext, ReactNode, useEffect } from "react";

// Create a context to hold the navigate function
const NavigationContext = createContext<
  ((path: string, options?: any) => void) | null
>(null);

// Provider component to make navigate available throughout the app
export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  // Set the navigate function when the component mounts
  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigate function
export const useAppNavigate = () => {
  const navigate = useContext(NavigationContext);
  if (!navigate) {
    throw new Error("useAppNavigate must be used within a NavigationProvider");
  }
  return navigate;
};

// Keep these for backward compatibility
let currentNavigate: ((path: string, options?: any) => void) | null = null;
export const setNavigateFunction = (
  navigate: (path: string, options?: any) => void
) => {
  currentNavigate = navigate;
};
export const getNavigateFunction = () => {
  return currentNavigate;
};
