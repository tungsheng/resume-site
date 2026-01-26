// Toast styles

import type React from "react";

export const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 3000,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  toast: {
    padding: "12px 20px",
    borderRadius: 6,
    color: "#fff",
    fontSize: 14,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    animation: "slideIn 0.2s ease-out",
  },
  error: {
    background: "#e94560",
  },
  success: {
    background: "#27ae60",
  },
};

export const keyframes = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;
