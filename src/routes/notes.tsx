import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ListChecks, Loader2, NotebookPen, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer, AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { delay, summarizeNotes, type MeetingSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get an executive summary, key decisions and action items with owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a clear summary, decisions and owned next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingSummary | null>(null);

  async function handleSummarize() {
    if (notes.trim().length < 20) {
      toast.error("Paste a bit more of your notes to summarize.");
      return;
    }
    setLoading(true);
    setResult(null);
    await delay(1300);
    setResult(summarizeNotes(notes));
    setLoading(false);
    toast.success("Summary ready");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={NotebookPen}
          title="Meeting Notes Summarizer"
          description="Drop in rough notes or a full transcript and get a structured recap your team can act on."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input</CardTitle>
              <CardDescription>Raw notes, transcript or bullet points.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Meeting notes</Label>
                <Textarea
                  id="notes"
                  rows={14}
                  placeholder="Paste anything — half sentences, names, timestamps, side comments…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button onClick={handleSummarize} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {loading ? "Summarizing…" : "Summarize notes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Output</CardTitle>
              <CardDescription>Summary, decisions and action items.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {loading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              )}
              {!loading && !result && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Your structured recap will appear here.
                </p>
              )}
              {!loading && result && (
                <>
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Executive Summary</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {result.summary}
                    </p>
                  </section>
                  <Separator />
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Key Decisions</h3>
                    <ul className="space-y-2">
                      {result.decisions.map((d) => (
                        <li key={d} className="flex gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <Separator />
                  <section className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <ListChecks className="size-4 text-primary" /> Action Items
                    </h3>
                    <ul className="space-y-2">
                      {result.actions.map((a) => (
                        <li
                          key={a.task}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
                        >
                          <span>{a.task}</span>
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary">{a.owner}</Badge>
                            <span className="text-xs text-muted-foreground">{a.due}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
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
