import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Loader2, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer, AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { delay, generateEmail, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkFlow AI" },
      {
        name: "description",
        content:
          "Describe the context, pick a tone, and get a polished email draft with subject line and body.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkFlow AI" },
      {
        property: "og:description",
        content: "Draft professional emails in seconds with formal, friendly or persuasive tone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error("Add some context so the draft has something to work with.");
      return;
    }
    setLoading(true);
    setResult(null);
    await delay(1100);
    setResult(generateEmail({ topic, recipient, tone }));
    setLoading(false);
    toast.success("Email draft ready");
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          icon={Mail}
          title="Smart Email Generator"
          description="Give the context and audience, choose a tone, and get a clean draft you can send."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input</CardTitle>
              <CardDescription>What should this email accomplish?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic / context</Label>
                <Textarea
                  id="topic"
                  rows={5}
                  placeholder="e.g. Asking the design team to review the new onboarding flow before Friday"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient role</Label>
                  <Input
                    id="recipient"
                    placeholder="e.g. Head of Design"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {loading ? "Drafting…" : "Generate email"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Output</CardTitle>
                <CardDescription>Your draft appears here.</CardDescription>
              </div>
              {result && (
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              )}
              {!loading && !result && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Fill in the context on the left to generate a draft.
                </p>
              )}
              {!loading && result && (
                <>
                  <div className="rounded-lg border border-border bg-muted/50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Subject</p>
                    <p className="mt-0.5 font-medium">{result.subject}</p>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {result.body}
                  </pre>
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
