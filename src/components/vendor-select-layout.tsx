'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { VendorSelectSidebar } from "@/components/vendor-select-sidebar"
import { SiteHeader } from "@/components/vendor-select-site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface RFQDocument {
  id: string;
  name: string;
  status: "Waiting" | "Processed";
  score?: string;
}

interface RFQGroup {
  id: string;
  documents: RFQDocument[];
}

interface VendorSelectLayoutProps {
  children: React.ReactNode;
  rfqGroups: RFQGroup[];
  selectedRFQ: string;
  onRFQSelect: (rfqId: string) => void;
}

export function VendorSelectLayout({ 
  children, 
  rfqGroups, 
  selectedRFQ, 
  onRFQSelect 
}: VendorSelectLayoutProps) {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/users/me")
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  useEffect(() => {
    if (session) {
      fetchCurrentUser()
    }
  }, [session])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  const userData = {
    name: currentUser?.name || session.user?.name || "User",
    email: currentUser?.email || session.user?.email || "",
    avatar: currentUser?.avatar || session.user?.image || "",
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)", // Slightly wider for vendor select
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <VendorSelectSidebar 
        variant="inset" 
        user={userData}
        rfqGroups={rfqGroups}
        selectedRFQ={selectedRFQ}
        onRFQSelect={onRFQSelect}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}