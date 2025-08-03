import { useState, useEffect, useCallback } from "react";
import { API_CONFIG } from "../config/constants";

export const useCartTimer = (cartId: string, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number>(API_CONFIG.CART_EXPIRY_MINUTES * 60); // en segundos
  const [isActive, setIsActive] = useState<boolean>(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(API_CONFIG.CART_EXPIRY_MINUTES * 60);
    setIsActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            onTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeout]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isActive,
    resetTimer,
    stopTimer,
    formatTime: formatTime(timeLeft),
    isExpired: timeLeft === 0,
  };
};
