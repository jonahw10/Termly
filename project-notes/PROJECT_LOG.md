# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:** Termly team
**Startup name:** Termly
**Live site link:** https://jonahw10.github.io/Termly/

---

## Work sessions

### Session — November 24, 2026 — driver: Jonah

- **Goal for this session:** Create the first Termly prototype and improve the page to include calendar, syllabus, reminder, and theme interactions.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Build the Termly student calendar interface from the project brief.
  2. Add dark mode, local event storage, syllabus date scanning, upcoming dates, and browser reminder behavior.
- **What worked:** The responsive calendar, local event storage, selected-day view, syllabus import review, upcoming list, and theme toggle were added.
- **What broke, and how we fixed it:** Deployment and written project documentation were not completed in the initial drafts; deployment configuration and the business/log documents must be checked before final submission.
- **Committed?** yes — Initial commit, first draft, and second draft.

### Session — November 24, 2026 — driver: Copilot assistant

- **Goal for this session:** Prepare the final project record and deployment.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Identify what is missing from the Termly project for the term-project submission.
  2. Complete the business case and project log based on the existing prototype.
- **What worked:** A first-pass review identified Pages as not configured and the project documents as incomplete.
- **What broke, and how we fixed it:** The repository did not contain GitHub Pages settings or `.github/copilot-instructions.md`; this session enabled deployment through GitHub when available and completed the written sections.
- **Committed?** yes — project documentation and unused template cleanup.

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| November 24, 2026 | The GitHub Pages URL returned 404. | Checked repository settings and GitHub Pages metadata. | Configure Pages for the `main` branch and `/` root directory. |
| November 24, 2026 | The business case contained only instructions and unanswered questions. | Reviewed the implemented features and course concepts. | Completed a full business-case draft in `BUSINESS_CASE.md`. |
| November 24, 2026 | The project log was unfilled. | Reviewed repository commits and project features. | Recorded known sessions, commits, missing work, and final reflection prompts. |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| Real accounts and login | To sync calendars across devices and protect private course schedules. | Medium; a hosted identity service could provide authentication quickly, but account recovery and privacy work remain important. |
| Real database | To store accounts, courses, preferences, and shared schedules reliably. | Medium; a managed database is affordable at launch but grows with use and retention needs. |
| Real syllabus AI | To handle varied PDF, image, and spreadsheet formats more accurately. | Medium to high; document parsing and LLM APIs require integration, testing, and cost controls. |
| Real browser and mobile notifications | To deliver reminders reliably even when Termly is closed. | Medium; this requires push credentials, a backend scheduler, and service worker or mobile-app support. |
| Calendar integrations | To keep Termly synchronized with Google, Apple, or university calendars. | Medium; OAuth and provider APIs are manageable but require ongoing maintenance. |
| Institutional integrations | To obtain authoritative course schedules and reduce manual entry. | High; it requires partnerships, data agreements, security reviews, and stable institutional APIs. |
| Payments | To offer recurring premium plans and institutional billing. | Medium; use a hosted payments provider rather than storing card details. |
| Backups and operations | To prevent data loss and respond to outages or security incidents. | Medium; managed backups and monitoring are essential but add recurring cost. |
| Moderation and abuse controls | To stop malicious uploads, account abuse, and excessive API use. | Medium; file limits, scanning, rate limiting, and audit logs are required. |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
   It was possible to move from an idea to a polished, working interface quickly. The more surprising work was defining reliable behavior, accessibility, privacy, and edge cases: a generated interface can look complete before its less-visible requirements are tested.
2. Which parts were easy, and which were hard? Why do you think that is?
   Visual layout and common browser interactions were easy to generate because they follow recognizable patterns. Parsing inconsistent syllabus text, managing saved state, and handling permission and notification edge cases were harder because they depend on uncertain real-world input and browser behavior.
3. If a competitor had the same AI tool, how long would it take them to copy your site?
   A similar static interface could be recreated in a few days or one weekend. Recreating a reliable service would take substantially longer because it would need accurate parsing, account storage, notifications, integrations, privacy controls, testing, and user trust.
