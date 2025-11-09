import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  IconCategory,
  IconPackage,
  IconShoppingCart,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
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
import { useAuth } from "@/contexts/AuthContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const location = useLocation()

  const data = {
    user: {
      name: user?.email?.split("@")[0] || "User",
      email: user?.email || "",
      avatar: "/avatars/user.jpg",
    },
    navMain: [
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: IconCategory,
        isActive: location.pathname === "/dashboard/categories" || location.pathname === "/dashboard",
      },
      {
        title: "Products",
        url: "/dashboard/products",
        icon: IconPackage,
        isActive: location.pathname === "/dashboard/products",
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: IconShoppingCart,
        isActive: location.pathname === "/dashboard/orders",
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Supabase Demo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
