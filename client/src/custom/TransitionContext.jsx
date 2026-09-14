import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (to) => {
      if (transitioning) return;

      // Start transition
      setTransitioning(true);

      // Navigate immediately — NO WAIT
      navigate(to);

      // Immediately reset
      setTransitioning(false);
    },
    [navigate, transitioning]
  );

  return (
    <TransitionContext.Provider
      value={{
        transitioning,
        navigateTo,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}