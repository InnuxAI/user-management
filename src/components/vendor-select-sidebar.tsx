"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home, Settings } from "lucide-react";
import Link from "next/link";

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

interface VendorSelectSidebarProps {
  rfqGroups: RFQGroup[];
  selectedRFQ: string;
  onRFQSelect: (rfqId: string) => void;
}

export function VendorSelectSidebar({
  rfqGroups,
  selectedRFQ,
  onRFQSelect
}: VendorSelectSidebarProps) {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-80 transition-all duration-300 ease-in-out bg-card border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <img src="https://www.innuxai.com/innuxlogo.svg" alt="Innux AI" className="h-6 w-6" />
          <span className="font-semibold text-lg">Innux AI</span>
        </div>

        <div className="mb-4 space-y-2">
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/vendor-select" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/vendor-select/vendors" className="flex items-center gap-2">
              <span>🏢</span>
              Vendor Manager
            </Link>
          </Button>
          
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/vendor-select/documents" className="flex items-center gap-2">
              <span>📄</span>
              Document Manager
            </Link>
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Vendor Selector</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span>Lists All documents</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📁</span>
              <span>Grouped by RFQ ID</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>State: (Waiting/Processed)</span>
            </div>
          </div>
        </div>
      </div>

      {/* RFQ Groups */}
      <ScrollArea className="flex-1 p-4">
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
      </ScrollArea>

      {/* Footer Navigation */}
      <div className="border-t p-4 space-y-3">
        {/* Settings */}
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>

        <Separator />

        {/* User Info */}
        {isClient && session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={session.user?.avatar && session.user.avatar !== '/avatars/default.jpg' ? session.user.avatar : undefined} 
                      alt={session.user?.name || ""} 
                    />
                    <AvatarFallback className="text-xs">
                      {session.user?.name?.charAt(0)?.toUpperCase() || session.user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left min-w-0 flex-1">
                    <span className="text-sm font-medium truncate w-full">User</span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {session.user?.email || 'abc@eg.com'}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{session.user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {(session.user as any)?.type} {(session.user as any)?.role && `- ${(session.user as any)?.role}`}
                </p>
              </div>
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {isClient && !session && status !== 'loading' && (
          <div className="text-center text-sm text-muted-foreground">
            Not signed in
          </div>
        )}
        
        {!isClient && (
          <div className="text-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}