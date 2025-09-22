import React, { useRef, useEffect, useCallback } from 'react';
import { Theme } from '../App';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

interface StarFieldProps {
  theme: Theme;
  starCount?: number;
}

const StarField: React.FC<StarFieldProps> = ({ theme, starCount = 500 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  // FIX: Initialize useRef with null and update type to handle number or null to fix missing argument error.
  const animationFrameIdRef = useRef<number | null>(null);

  const generateStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.5, // stars of different sizes
        speed: Math.random() * 0.5 + 0.1, // stars with different speeds
      });
    }
    starsRef.current = stars;
  }, [starCount]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars(canvas.width, canvas.height);
    }
  }, [generateStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    resizeCanvas(); // Initial setup

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Adjust star visibility based on theme
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.4)';
      
      starsRef.current.forEach(star => {
        // Move star down
        star.y += star.speed;

        // Loop star to the top if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      // FIX: Store ref value in a variable to ensure type-safe access for cancelAnimationFrame.
      const animationFrameId = animationFrameIdRef.current;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [theme, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default StarField;
