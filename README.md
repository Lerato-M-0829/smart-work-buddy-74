# WorkFlow AI Hub

Create a fully responsive, modern web application called "WorkFlow AI" that serves as an all-in-one AI workplace assistant. The application must feature a professional Dashboard Layout with a collapsible Sidebar Navigation (fully responsive for mobile and desktop) and integrate 4 core AI features with distinct Input & Output sections.

### Global UI/UX & Design Requirements

- **Design System:** Use a clean, modern SaaS aesthetic (inspired by Tailwind UI / Shadcn UI) with a professional color palette (slate/indigo accents), subtle shadows, smooth transitions, and clear typography.

- **Responsible AI:** Include a persistent, subtle footer or disclaimer on all AI-generated output views stating: "AI-generated content may require review. Verify accuracy before use."

- **State Management:** Simulate realistic AI generation states (loading spinners, typing effects, success toasts) for all interactions.

### Core Feature Requirements (Include all 4)

1. Smart Email Generator

   - **Inputs:** Topic/Context field, Recipient role, and a Tone Selector dropdown (Formal, Friendly, Persuasive).

   - **Output:** A cleanly formatted, ready-to-copy email draft with a subject line and body.

2. Meeting Notes Summarizer

   - **Inputs:** A large text area for pasting raw, unstructured meeting transcripts or rough notes.

   - **Outputs:** An organized summary card divided into three distinct sections: Executive Summary, Key Decisions, and Action Items with owners/deadlines.

3. AI Task Planner / Scheduler

   - **Inputs:** A comma-separated list of raw daily tasks or a project goal, plus a priority weighting preference.

   - **Outputs:** A structured, time-blocked daily schedule with prioritized tasks and estimated time allocations.

4. AI Chatbot Interface

   - **Inputs:** An interactive chat interface with a message history window and a bottom text input bar.

   - **Outputs:** Real-time conversational AI workplace assistance handling general queries, formatting help, and problem-solving prompts.

### Technical & Presentation Quality

- Use clean component-based architecture with placeholder mock-AI logic that yields realistic, high-quality sample outputs instantly.

- Ensure seamless navigation between the Dashboard home view and the 4 individual tool views.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smart-work-buddy-74.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/166202e9-3bd0-4b46-a540-09a7dc5b2408).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
