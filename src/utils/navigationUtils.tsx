/* eslint-disable @typescript-eslint/no-explicit-any */
// navigationUtils.tsx
import { useNavigate } from "react-router-dom";
import { createContext, useContext, ReactNode } from "react";

// Create a context to hold the navigate function
const NavigationContext = createContext<
  ((path: string, options?: any) => void) | null
>(null);

// Provider component to make navigate available throughout the app
export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

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

// Function to set the current navigate function for the service
let currentNavigate: ((path: string, options?: any) => void) | null = null;

export const setNavigateFunction = (
  navigate: (path: string, options?: any) => void
) => {
  currentNavigate = navigate;
};

export const getNavigateFunction = () => {
  return currentNavigate;
};
