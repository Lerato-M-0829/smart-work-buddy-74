import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  Clock,
  Mail,
  NotebookPen,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — Your all-in-one AI workplace assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan your day and chat with an AI workplace assistant from one clean dashboard.",
      },
      { property: "og:title", content: "WorkFlow AI — AI workplace assistant" },
      {
        property: "og:description",
        content:
          "Four AI tools in one workspace: email drafting, meeting summaries, task planning and an assistant chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn a rough idea into a polished, ready-to-send draft with the right tone.",
    tag: "Writing",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Paste messy notes and get a summary, decisions and owned action items.",
    tag: "Meetings",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    description: "Turn a task list into a prioritized, time-blocked day plan.",
    tag: "Planning",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Assistant Chat",
    description: "Ask anything about writing, process or problem-solving at work.",
    tag: "Assistant",
  },
] as const;

const stats = [
  { label: "Drafts created", value: "128", icon: Mail, trend: "+18% this week" },
  { label: "Meetings summarized", value: "42", icon: NotebookPen, trend: "+6 since Monday" },
  { label: "Hours saved", value: "31.5", icon: Clock, trend: "≈ 4 working days" },
  { label: "Focus score", value: "87", icon: TrendingUp, trend: "Up from 79" },
];

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          icon={Sparkles}
          title="Good morning, Alex"
          description="Everything you need to move work forward — drafting, summarizing, planning and answers, in one place."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="transition-smooth hover:shadow-[var(--shadow-lift)]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <s.icon className="size-4 text-primary" />
                </div>
                <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">AI tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <Card
                key={tool.to}
                className="group transition-smooth hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <CardHeader className="gap-3">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <tool.icon className="size-5" />
                    </span>
                    <Badge variant="secondary">{tool.tag}</Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                    <CardDescription className="mt-1.5">{tool.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="px-0 text-primary hover:bg-transparent">
                    <Link to={tool.to}>
                      Open tool
                      <ArrowRight className="transition-smooth group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
