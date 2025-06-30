"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/atoms/spinner";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 100;
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                right: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, hsl(${
                  Math.random() * 360
                }, 100%, 50%, 0.1), transparent 70%)`,
                animation: `pulse ${2 + Math.random() * 2}s infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          className="relative flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <Spinner size={50} />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <motion.div
              className="h-8 flex items-center"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <motion.span
                className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                SUPER TASKLY
              </motion.span>
            </motion.div>
            <p className="text-sm text-muted-foreground/80">
              {progress < 100 ? "Preparing your experience" : "Almost there..."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
