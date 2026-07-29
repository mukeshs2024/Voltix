"use client";

import React, { useState } from "react";
import { PageContainer, SectionContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  Bell, 
  Palette, 
  Link as LinkIcon, 
  Shield, 
  Key, 
  Save,
  CheckCircle2
} from "lucide-react";

type SettingsTab = "profile" | "organization" | "notifications" | "appearance" | "integrations" | "security" | "api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "organization", label: "Organization", icon: <Building className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "integrations", label: "Integrations", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "api", label: "API Configuration", icon: <Key className="w-4 h-4" /> }
  ];

  return (
    <PageContainer>
      <SectionContainer>
        <PageHeader 
          title="System Settings"
          description="Manage global preferences, notifications, and external Voltix integrations."
          actions={
            <Button 
              variant="primary" 
              onClick={handleSave}
              className="bg-[#111827] hover:bg-[#374151] text-white border-none gap-2"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? "Saved Successfully" : "Save Changes"}</span>
            </Button>
          }
        />
      </SectionContainer>

      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Navigation Sidebar */}
          <div className="md:col-span-1 flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  activeTab === tab.id 
                    ? "bg-[#111827] text-white" 
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Tab Content */}
          <div className="md:col-span-3">
            <Card className="bg-white border border-[#E5E7EB] rounded-[24px] shadow-xs">
              <CardContent className="p-6">
                
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">Profile Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6B7280]">Full Name</label>
                        <input type="text" defaultValue="Naveen Kumar" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#111827]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6B7280]">Email Address</label>
                        <input type="email" defaultValue="naveen@voltix.io" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#111827]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "organization" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">Organization Profiles</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6B7280]">Company Name</label>
                        <input type="text" defaultValue="Voltix Enterprises Ltd" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6B7280]">Domain Name</label>
                        <input type="text" defaultValue="voltix.io" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                        <div>
                          <div className="text-sm font-semibold text-[#111827]">Critical Anomalies</div>
                          <div className="text-xs text-[#6B7280]">Email and Push notifications on critical incidents.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#111827]" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                        <div>
                          <div className="text-sm font-semibold text-[#111827]">Weekly Optimization Summaries</div>
                          <div className="text-xs text-[#6B7280]">Receive weekly summaries of carbon abatement savings.</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#111827]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">Appearance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border-2 border-[#111827] rounded-xl cursor-pointer">
                        <div className="text-sm font-bold text-[#111827]">Voltix Light</div>
                        <div className="text-xs text-[#6B7280] mt-1">Default light minimal theme.</div>
                      </div>
                      <div className="p-4 bg-[#111827] text-white border border-[#E5E7EB] rounded-xl cursor-pointer">
                        <div className="text-sm font-bold">Voltix Obsidian</div>
                        <div className="text-xs text-gray-400 mt-1">Sleek, dark contrast theme. (Coming Soon)</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "integrations" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">Integrations</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                        <div className="text-sm font-semibold text-[#111827]">Slack Alerts</div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                        <div className="text-sm font-semibold text-[#111827]">Supabase Auth</div>
                        <Button variant="outline" size="sm">Connected</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">Security & Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6B7280]">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#6B7280]">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "api" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#111827]">API Keys</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                        <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Publishable API Token</div>
                        <div className="text-xs font-mono text-[#111827] mt-1 break-all select-all">pk_live_voltix_5594b2a3cd84e59000a</div>
                      </div>
                      <div className="p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
                        <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Secret Endpoint Key</div>
                        <div className="text-xs font-mono text-[#111827] mt-1 break-all select-all">sk_live_••••••••••••••••••••••••</div>
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      </SectionContainer>
    </PageContainer>
  );
}
