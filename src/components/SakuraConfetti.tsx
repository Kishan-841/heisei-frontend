"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";

// Colors matching the HEISEI palette — warm, earthy, accent red
const colors = [
  "#C23B22", // accent red
  "#A8A29E", // muted stone
  "#8B7355", // warm bronze
  "#C9A96E", // gold
  "#0F0F0F", // ink black
  "#D4C5A9", // warm sand
];

export function useConfetti() {
  const fire = useCallback(() => {
    const defaults = {
      colors,
      ticks: 350,
      gravity: 0.85,
      decay: 0.92,
      startVelocity: 40,
      shapes: ["square" as const, "circle" as const],
      scalar: 1.1,
    };

    // Left burst
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 120,
      angle: 60,
      origin: { x: 0, y: 0.6 },
    });

    // Right burst
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 120,
      angle: 120,
      origin: { x: 1, y: 0.6 },
    });

    // Center burst
    confetti({
      ...defaults,
      particleCount: 100,
      spread: 140,
      angle: 90,
      origin: { x: 0.5, y: 0.7 },
      startVelocity: 50,
    });

    // Delayed second wave for richness
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 60,
        spread: 100,
        angle: 75,
        origin: { x: 0.3, y: 0.5 },
      });
      confetti({
        ...defaults,
        particleCount: 60,
        spread: 100,
        angle: 105,
        origin: { x: 0.7, y: 0.5 },
      });
    }, 200);
  }, []);

  return fire;
}
