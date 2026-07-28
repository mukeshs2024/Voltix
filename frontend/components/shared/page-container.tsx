"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

export function SectionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section 
      variants={fadeIn}
      className={cn("space-y-4", className)}
    >
      {children}
    </motion.section>
  );
}
