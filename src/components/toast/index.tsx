// Toast notification component

import React, { useEffect } from "react";
import { styles, keyframes } from "./style";

export interface Toast {
  id: number;
  message: string;
  type: "error" | "success";
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container} role="alert" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div style={{ ...styles.toast, ...styles[toast.type] }}>
      {toast.message}
    </div>
  );
}
