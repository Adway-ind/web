import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (to) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        navigate(to);
        setTimeout(() => setTransitioning(false), 300);
      }, 400);
    },
    [navigate, transitioning]
  );

  return (
    <TransitionContext.Provider value={{ transitioning, navigateTo }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}