import React from "react";
import css from "./Loader.module.css";

export const Loader: React.FC<{ size?: number; color?: string }> = ({
  size = 48,
  color = "#3b82f6",
}) => {
  return (
    <div className={css.wrapper}>
      <div
        className={css.ring}
        style={
          {
             
            "--size": `${size}px`,
            "--color": color,
          } as React.CSSProperties
        }
      />
    </div>
  );
};
