"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Animation variants for each grid item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

interface BentoProductGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Animated container for bento grid items with stagger animation
 */
export const BentoProductGrid = ({
  children,
  className,
}: BentoProductGridProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "grid w-full gap-4",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface BentoProductItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Individual animated bento grid item
 */
export const BentoProductItem = ({
  children,
  className,
  onClick,
}: BentoProductItemProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "group relative overflow-hidden border-2 border-neutral-800 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:bg-[#1a1a1a]",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
