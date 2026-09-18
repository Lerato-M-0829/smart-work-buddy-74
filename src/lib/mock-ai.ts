export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Tone = "formal" | "friendly" | "persuasive";

const openers: Record<Tone, string> = {
  formal: "I hope this message finds you well.",
  friendly: "Hope your week is going well!",
  persuasive: "I'll keep this brief, because I think it's worth your time.",
};

const closers: Record<Tone, string> = {
  formal: "Thank you for your time and consideration.",
  friendly: "Thanks so much — let me know what you think!",
  persuasive: "Happy to move quickly if this looks right to you.",
};

export function generateEmail(input: { topic: string; recipient: string; tone: Tone }) {
  const topic = input.topic.trim() || "a short update";
  const recipient = input.recipient.trim() || "Team";
  const subject =
    input.tone === "persuasive"
      ? `A quick proposal: ${capitalize(topic)}`
      : `${capitalize(topic)} — next steps`;

  const body = [
    `Hi ${recipient},`,
    "",
    openers[input.tone],
    "",
    `I'm reaching out regarding ${topic}. Here is a short summary of where things stand and what I'd suggest as the next step.`,
    "",
    "• Context: the work is in progress and on track against the current plan.",
    "• Ask: a quick review and your confirmation on the proposed direction.",
    "• Timeline: ideally confirmed within the next two business days.",
    "",
    "If it's easier to talk it through, I'm glad to set up 15 minutes at a time that suits you.",
    "",
    closers[input.tone],
    "",
    "Best regards,",
    "Alex Rivera",
  ].join("\n");

  return { subject, body };
}

export type MeetingSummary = {
  summary: string;
  decisions: string[];
  actions: { task: string; owner: string; due: string }[];
};

export function summarizeNotes(raw: string): MeetingSummary {
  const words = raw.trim().split(/\s+/).filter(Boolean).length;
  return {
    summary: `The team reviewed current progress and aligned on priorities for the coming sprint. Discussion focused on scope, delivery risk, and customer-facing impact. Overall sentiment was positive, with two open risks flagged for follow-up. (Source notes: ~${words} words.)`,
    decisions: [
      "Ship the current scope on the agreed date; defer non-critical polish to the next cycle.",
      "Consolidate reporting into a single weekly update instead of two separate threads.",
      "Approve additional design support for the onboarding flow.",
    ],
    actions: [
      { task: "Circulate the revised delivery plan", owner: "Priya", due: "Tomorrow, 5:00 PM" },
      { task: "Draft the customer communication", owner: "Marcus", due: "Wed, Sep 23" },
      { task: "Resolve the two flagged blockers", owner: "Engineering", due: "Fri, Sep 25" },
      { task: "Book the follow-up review", owner: "Alex", due: "End of week" },
    ],
  };
}

export type ScheduleBlock = {
  time: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  minutes: number;
  note: string;
};

export function planDay(tasksRaw: string, weighting: string): ScheduleBlock[] {
  const tasks = tasksRaw
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const list = tasks.length ? tasks : ["Plan the day", "Deep work", "Email and admin"];

  const starts = [
    "08:30",
    "09:15",
    "10:15",
    "11:15",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "16:45",
  ];
  const deepFirst = weighting !== "quick-wins";
  const ordered = deepFirst ? list : [...list].reverse();

  const blocks: ScheduleBlock[] = ordered.slice(0, 8).map((task, i) => {
    const priority: ScheduleBlock["priority"] = i < 2 ? "High" : i < 5 ? "Medium" : "Low";
    const minutes = priority === "High" ? 60 : priority === "Medium" ? 45 : 30;
    return {
      time: starts[i] ?? "17:00",
      title: capitalize(task),
      priority,
      minutes,
      note:
        priority === "High"
          ? "Protected focus block — no meetings, notifications off."
          : priority === "Medium"
            ? "Good slot for collaborative or review work."
            : "Batch with other light admin tasks.",
    };
  });

  blocks.splice(Math.min(4, blocks.length), 0, {
    time: "12:15",
    title: "Lunch & reset",
    priority: "Low",
    minutes: 45,
    note: "Step away from the screen to protect afternoon focus.",
  });

  return blocks;
}

const chatReplies = [
  "Here's how I'd approach that: break it into the smallest useful step, decide who owns it, and set a date. Want me to draft that as a short plan?",
  "Good question. A clear structure works well here — lead with the outcome, then the reasoning, then the ask. I can rewrite anything you paste in that shape.",
  "I'd frame it in three parts: what happened, what it means, and what you need next. That keeps it easy for a busy reader to act on.",
  "You can tighten that by cutting hedging words and moving the request into the first two lines. Paste the text and I'll show you a tighter version.",
];

export function chatReply(message: string, turn: number) {
  const m = message.toLowerCase();
  if (m.includes("email"))
    return "For emails, keep it to one ask per message: a specific subject line, two or three short lines of context, and a clear next step with a date. The Email Generator can draft it for you.";
  if (m.includes("meeting") || m.includes("notes"))
    return "Paste your raw notes into the Notes Summarizer and you'll get an executive summary, decisions, and action items with owners. Want tips on capturing notes live?";
  if (m.includes("plan") || m.includes("schedule") || m.includes("time"))
    return "Time-block your two hardest tasks in the morning, keep the afternoon for collaboration, and leave a 30-minute buffer for overflow. The Task Planner builds this automatically.";
  return chatReplies[turn % chatReplies.length];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
