"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const WHEEL_COLORS = [
  "#ff6b35", "#3b82f6", "#22c55e", "#f59e0b",
  "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899",
  "#10b981", "#f97316", "#6366f1", "#14b8a6",
  "#e11d48", "#84cc16", "#a855f7", "#0ea5e9",
  "#f43f5e", "#eab308", "#7c3aed", "#2dd4bf",
];

interface SpinningWheelProps {
  segments: string[];
  onResult: (result: string) => void;
  spinning: boolean;
  onSpinEnd: () => void;
}

export default function SpinningWheel({
  segments,
  onResult,
  spinning,
  onSpinEnd,
}: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [size, setSize] = useState(0);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const maxSize = Math.min(window.innerWidth - 32, 500);
      setSize(maxSize);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas || segments.length === 0 || size === 0) return;

      const ctx = canvas.getContext("2d")!;
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 8;
      const sliceAngle = (2 * Math.PI) / segments.length;

      ctx.clearRect(0, 0, size, size);

      // Draw segments
      segments.forEach((segment, i) => {
        const startAngle = angle + i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);

        const textRadius = radius * 0.65;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(10, Math.min(14, 200 / segments.length))}px system-ui`;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 3;

        // Truncate long names
        const maxChars = segments.length > 12 ? 8 : 12;
        const displayText =
          segment.length > maxChars
            ? segment.slice(0, maxChars) + "…"
            : segment;
        ctx.fillText(displayText, textRadius, 0);
        ctx.shadowBlur = 0;
        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.12, 0, 2 * Math.PI);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    },
    [segments, size]
  );

  // Spin animation
  useEffect(() => {
    if (!spinning) return;

    // Random initial velocity
    velocityRef.current = 15 + Math.random() * 15;

    const animate = () => {
      angleRef.current += velocityRef.current * 0.016; // ~60fps timestep
      velocityRef.current *= 0.985; // Friction

      drawWheel(angleRef.current);

      if (velocityRef.current < 0.05) {
        // Determine winner
        const sliceAngle = (2 * Math.PI) / segments.length;
        // Pointer is at top (3π/2 or -π/2)
        const normalizedAngle =
          (((-angleRef.current % (2 * Math.PI)) + 2 * Math.PI) %
            (2 * Math.PI));
        // The pointer is at the top (12 o'clock), which in canvas is -π/2
        const pointerAngle = (normalizedAngle + Math.PI / 2) % (2 * Math.PI);
        const winnerIndex =
          Math.floor(
            ((2 * Math.PI - pointerAngle) % (2 * Math.PI)) / sliceAngle
          ) % segments.length;

        onResult(segments[winnerIndex]);
        onSpinEnd();
        return;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [spinning, segments, drawWheel, onResult, onSpinEnd]);

  // Initial draw
  useEffect(() => {
    if (!spinning) {
      drawWheel(angleRef.current);
    }
  }, [segments, size, drawWheel, spinning]);

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Pointer (top center) */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "24px solid #ff6b35",
            filter: "drop-shadow(0 2px 8px rgba(255,107,53,0.5))",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full"
        style={{ width: size, height: size }}
      />

      {/* Glow ring when spinning */}
      {spinning && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: "0 0 40px rgba(255,107,53,0.3), 0 0 80px rgba(255,107,53,0.1)",
          }}
        />
      )}
    </div>
  );
}
