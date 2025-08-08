"use client"

import * as React from "react"
import { useSession } from 'next-auth/react'
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCurrencyDollar,
  IconBriefcase,
  IconUsersGroup,
  IconBrandYandex,
  IconMessage
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const baseNavMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
]

const roleBasedNavItems = {
  HR: {
    title: "HR Management",
    url: "/hr",
    icon: IconUsersGroup,
  },
  Finance: {
    title: "Finance",
    url: "/finance", 
    icon: IconCurrencyDollar,
  },
  Sales: {
    title: "Sales",
    url: "/sales",
    icon: IconBriefcase,
  },
}

const data = {
  navSecondary: [
    {
      title: "Chat",
      url: "/chat",
      icon: IconMessage,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
    {
      title: "RFQ",
      url: "/rfq",
      icon: IconBrandYandex,
    },
    {
      title: "Settings",
      url: "/profile",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { data: session } = useSession()
  const [currentUser, setCurrentUser] = React.useState<any>(null)

  // Fetch current user data to get role information
  React.useEffect(() => {
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

    if (session) {
      fetchCurrentUser()
    }
  }, [session])

  const defaultUser = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar,
  };

  // Build navigation items based on user role
  const navMain = React.useMemo(() => {
    const items = [...baseNavMain]
    
    // Admin should see all pages
    if (currentUser?.type === 'Admin') {
      items.push(
        roleBasedNavItems.HR,
        roleBasedNavItems.Finance,
        roleBasedNavItems.Sales
      )
    } else if (currentUser?.role && roleBasedNavItems[currentUser.role as keyof typeof roleBasedNavItems]) {
      // Regular users see only their role-specific page
      items.push(roleBasedNavItems[currentUser.role as keyof typeof roleBasedNavItems])
    }
    
    return items
  }, [currentUser?.role, currentUser?.type])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img src="https://www.innuxai.com/innuxlogo.svg" alt="Innux AI" className="h-5 w-5" />
                <span className="text-base font-semibold">Innux AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={defaultUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
