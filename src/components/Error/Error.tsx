import React from "react";
import css from "./Error.module.css";

export interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className={css.container} role="alert" aria-live="polite">
      <div className={css.icon} aria-hidden>
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8 14A2 2 0 004 21h16a2 2 0 001.71-3.14l-8-14a2 2 0 00-3.42 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className={css.content}>
        <strong className={css.title}>Щось пішло не так</strong>
        <p className={css.text}>
          {message || "Не вдалося завантажити дані. Спробуйте ще раз."}
        </p>
      </div>

      {onRetry && (
        <div className={css.actions}>
          <button type="button" className={css.retryButton} onClick={onRetry}>
            Повторити
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
