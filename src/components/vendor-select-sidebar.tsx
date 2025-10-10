"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LordIcon, LORDICON_URLS } from "@/components/ui/lord-icon";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

interface VendorSelectSidebarProps extends React.ComponentProps<typeof Sidebar> {
  rfqGroups: RFQGroup[];
  selectedRFQ: string;
  onRFQSelect: (rfqId: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function VendorSelectSidebar({
  rfqGroups,
  selectedRFQ,
  onRFQSelect,
  user,
  ...props
}: VendorSelectSidebarProps) {
  const defaultUser = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar,
  };

  return (
    <Sidebar collapsible="offcanvas" className="custom-sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/vendor-select">
                <img src="https://www.innuxai.com/innuxlogo.svg" alt="Innux AI" className="h-5 w-5" />
                <span className="text-base font-semibold">Innux AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="p-2 space-y-1">
          <SidebarMenuButton asChild>
            <Link href="/vendor-select" className="flex items-center gap-2">
              <LordIcon
                src={LORDICON_URLS.home}
                size={16}
                trigger="hover"
                colors="primary:#6b7280,secondary:#9ca3af"
              />
              Back to Dashboard
            </Link>
          </SidebarMenuButton>

          <SidebarMenuButton asChild>
            <Link
              href="/vendor-select/vendors"
              className="flex items-center gap-2"
            >
              <LordIcon
                src={LORDICON_URLS.vendor}
                size={16}
                trigger="hover"
                colors="primary:#6b7280,secondary:#9ca3af"
              />
              Vendor Manager
            </Link>
          </SidebarMenuButton>

          <SidebarMenuButton asChild>
            <Link
              href="/vendor-select/documents"
              className="flex items-center gap-2"
            >
              <LordIcon
                src={LORDICON_URLS.documents}
                size={16}
                trigger="hover"
                colors="primary:#6b7280,secondary:#9ca3af"
              />
              Document Manager
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* <div className="p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground">RFQ Documents</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {rfqGroups.length} RFQ group{rfqGroups.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <Accordion type="multiple" defaultValue={[selectedRFQ]} className="space-y-2">
            {rfqGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id} className="border rounded-lg px-3 py-1">
                <AccordionTrigger 
                  className={`text-sm font-medium py-3 hover:no-underline ${
                    selectedRFQ === group.id ? "text-primary" : ""
                  }`}
                  onClick={() => onRFQSelect(group.id)}
                >
                  <div className="flex items-center justify-between w-full mr-2">
                    <span>{group.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {group.documents.length} doc{group.documents.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-2">
                  <div className="space-y-2">
                    {group.documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm font-medium">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          {doc.score && (
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              {doc.score}
                            </span>
                          )}
                          <Badge 
                            variant={doc.status === "Processed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={defaultUser} />
      </SidebarFooter>
    </Sidebar>
  );
}