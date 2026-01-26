// Spinner component

import React from "react";
import { colors } from "../../styles";

interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 16, color = colors.primary }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${Math.max(2, size / 8)}px solid #f0f0f0`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        display: "inline-block",
      }}
    />
  );
}
