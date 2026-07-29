"use client";

import React, { useEffect } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      spring.set(value);
    } else {
      spring.set(value);
    }
  }, [value, spring, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <span className={className}>
        {prefix}
        {value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </span>
    );
  }

  return <motion.span className={className}>{display}</motion.span>;
}
