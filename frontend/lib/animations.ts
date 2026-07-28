import { Variants, Transition } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] } 
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.015, 
    y: -4, 
    transition: { type: "spring", stiffness: 400, damping: 25 } 
  },
  tap: { scale: 0.985, y: 0 }
};

export const drawerSpring: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 0.8
};
