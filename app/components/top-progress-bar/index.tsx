import { css } from "@morph-css/kit";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const progressBarStyle = css({
  position: "fixed",
  top: 0,
  left: 0,
  height: "3px",
  backgroundColor: "var(--operon-color-primary, #d33a5c)",
  zIndex: 9999,
  transition: "width 0.3s ease, opacity 0.3s ease",
});

export const TopProgressBar = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isLoading) {
      setVisible(true);
      setProgress(15);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 300);
    } else {
      setProgress(100);

      const hideTimeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);

      return () => clearTimeout(hideTimeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className={progressBarStyle.className}
      style={{
        ...progressBarStyle.style,
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
};
