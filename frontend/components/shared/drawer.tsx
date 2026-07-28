"use client";

import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { drawerSpring } from "@/lib/animations";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  headerIcon?: ReactNode;
  headerStyle?: string;
  iconStyle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  headerIcon, 
  headerStyle = "bg-[#FAFAFA]", 
  iconStyle = "bg-white border border-[#E5E7EB] text-[#111827]",
  children, 
  footer,
  maxWidth = "max-w-md"
}: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#111827]/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={drawerSpring}
            className={`fixed inset-y-0 right-0 w-full ${maxWidth} bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]`}
          >
            {/* Header */}
            <div className={`p-6 border-b border-[#E5E7EB] flex items-start justify-between ${headerStyle}`}>
              <div className="flex gap-4 items-center">
                {headerIcon && (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconStyle}`}>
                    {headerIcon}
                  </div>
                )}
                {title && (
                  <h2 className="text-lg font-bold text-[#111827] leading-tight">{title}</h2>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFAFA] flex gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
