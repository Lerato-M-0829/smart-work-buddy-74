import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Clock, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer, AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { delay, planDay, type ScheduleBlock } from "@/lib/mock-ai";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkFlow AI" },
      {
        name: "description",
        content:
          "Turn a list of tasks or a project goal into a prioritized, time-blocked daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner — WorkFlow AI" },
      {
        property: "og:description",
        content: "Get a time-blocked day plan with priorities and estimated time per task.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const priorityStyles: Record<ScheduleBlock["priority"], string> = {
  High: "bg-primary text-primary-foreground",
  Medium: "bg-accent text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [weighting, setWeighting] = useState("deep-work");
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<ScheduleBlock[] | null>(null);

  async function handlePlan() {
    if (!tasks.trim()) {
      toast.error("Add a few tasks or a goal to plan around.");
      return;
    }
    setLoading(true);
    setBlocks(null);
    await delay(1200);
    setBlocks(planDay(tasks, weighting));
    setLoading(false);
    toast.success("Daily schedule ready");
  }

  const totalMinutes = blocks?.reduce((sum, b) => sum + b.minutes, 0) ?? 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={CalendarClock}
          title="AI Task Planner"
          description="List what needs doing, choose how to weight your day, and get a realistic time-blocked plan."
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input</CardTitle>
              <CardDescription>Comma-separated tasks or a project goal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="tasks">Tasks</Label>
                <Textarea
                  id="tasks"
                  rows={7}
                  placeholder="Finish Q3 report, review design specs, reply to client emails, prep standup"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label>Priority weighting</Label>
                <RadioGroup value={weighting} onValueChange={setWeighting} className="gap-2">
                  {[
                    {
                      value: "deep-work",
                      label: "Deep work first",
                      hint: "Hardest tasks in the morning",
                    },
                    {
                      value: "quick-wins",
                      label: "Quick wins first",
                      hint: "Clear small tasks to build momentum",
                    },
                    {
                      value: "balanced",
                      label: "Balanced",
                      hint: "Mix focus and collaboration evenly",
                    },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={opt.value}
                      className="transition-smooth flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/60 has-[:checked]:border-primary has-[:checked]:bg-accent/60"
                    >
                      <RadioGroupItem id={opt.value} value={opt.value} className="mt-0.5" />
                      <span>
                        <span className="block text-sm font-medium">{opt.label}</span>
                        <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <Button onClick={handlePlan} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {loading ? "Building schedule…" : "Build my schedule"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Output</CardTitle>
                <CardDescription>Time-blocked plan for today.</CardDescription>
              </div>
              {blocks && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="size-3.5" />
                  {Math.round((totalMinutes / 60) * 10) / 10}h planned
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )}
              {!loading && !blocks && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Your schedule will appear here as time blocks.
                </p>
              )}
              {!loading && blocks && (
                <>
                  <ol className="space-y-3">
                    {blocks.map((b, i) => (
                      <li
                        key={`${b.time}-${i}`}
                        className="transition-smooth flex gap-3 rounded-lg border border-border bg-card p-3 hover:shadow-[var(--shadow-soft)]"
                      >
                        <span className="w-14 shrink-0 pt-0.5 font-mono text-sm text-muted-foreground">
                          {b.time}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium">{b.title}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[b.priority]}`}
                            >
                              {b.priority}
                            </span>
                            <span className="text-xs text-muted-foreground">{b.minutes} min</span>
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">{b.note}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <AiDisclaimer className="border-t border-border pt-3" />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
