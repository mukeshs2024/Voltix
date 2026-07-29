"use client";

import React from "react";
import { Search, Bell, Sparkles, Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebar-store";

export function TopNavigation() {
  const { toggleMobile } = useSidebarStore();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 -ml-2 text-[#6B7280] hover:text-[#111827] rounded-[12px] hover:bg-[#FAFAFA]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search & Global Context Placeholder */}
        <div className="hidden sm:flex relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search buildings, devices, scenarios..."
            className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-[12px] pl-9 pr-4 py-2 text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>AI Assistant</span>
        </Button>

        {/* Notifications Dropdown (UI Only) */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="View notifications"
            className="p-2 rounded-[12px] border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA] relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#EF4444] absolute top-2 right-2 border-2 border-white" />
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-[16px] shadow-apple-hover overflow-hidden z-50">
              <div className="p-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAFAFA]">
                <span className="text-sm font-semibold text-[#111827]">Notifications</span>
                <span className="text-xs text-[#2563EB] font-medium cursor-pointer">Mark all read</span>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-[#FAFAFA] rounded-[12px] cursor-pointer flex gap-3 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-[#EF4444]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111827]">HVAC Anomaly Detected</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">East Coast Plaza • 2m ago</p>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#FAFAFA] rounded-[12px] cursor-pointer flex gap-3 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Optimization Successful</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Saved 45kW in HQ Tower • 1h ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

        {/* Profile Avatar & Dropdown (UI Only) */}
        <div className="relative">
          <div 
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-semibold">
              NK
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] hidden sm:block" />
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-[16px] shadow-apple-hover overflow-hidden z-50 p-1">
              <div className="px-3 py-2.5 border-b border-[#E5E7EB] mb-1">
                <p className="text-sm font-semibold text-[#111827]">Naveen Kumar</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Senior Facilities Engineer</p>
              </div>
              <div className="p-1 space-y-0.5">
                <button className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#FAFAFA] rounded-[10px] transition-colors text-left">
                  <User className="w-4 h-4" />
                  <span>Your Profile</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#FAFAFA] rounded-[10px] transition-colors text-left">
                  <Settings className="w-4 h-4" />
                  <span>Preferences</span>
                </button>
              </div>
              <div className="p-1 border-t border-[#E5E7EB] mt-1">
                <button className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-[10px] transition-colors text-left">
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
