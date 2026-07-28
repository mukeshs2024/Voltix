"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={cn("space-y-8 max-w-7xl mx-auto w-full", className)}
    >
      {children}
    </motion.div>
  );
}

export const SectionContainer = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  function SectionContainer({ children, className, ...props }, ref) {
    return (
      <motion.section
        ref={ref}
        {...props}
        variants={fadeIn}
        className={cn("space-y-4", className)}
      >
        {children}
      </motion.section>
    );
  }
);

SectionContainer.displayName = "SectionContainer";
