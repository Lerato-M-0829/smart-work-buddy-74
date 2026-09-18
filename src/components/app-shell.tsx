import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/chat", label: "AI Assistant", icon: Bot },
] as const;

function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-1 py-1.5">
          <span className="brand-gradient flex size-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold leading-tight">WorkFlow AI</span>
            <span className="text-xs text-muted-foreground">Workplace assistant</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.label}>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg p-1">
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent text-xs text-accent-foreground">AR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium leading-tight">Alex Rivera</span>
            <span className="text-xs text-muted-foreground">Product Operations</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p className={`text-xs text-muted-foreground ${className ?? ""}`}>
      AI-generated content may require review. Verify accuracy before use.
    </p>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="brand-gradient hidden size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground sm:flex">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = navItems.find((i) => i.to === pathname)?.label ?? "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <span className="truncate text-sm font-medium">{current}</span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground sm:flex">
            <Sparkles className="size-3.5" /> Demo mode
          </span>
        </header>
        <main className="flex-1 px-3 py-5 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
        <footer className="border-t border-border px-3 py-4 sm:px-6">
          <AiDisclaimer />
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
