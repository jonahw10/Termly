# Business case

Your prototype shows *what* the product looks like. This document explains *why* it could become a business. Answer in your own words and refer to course concepts by name. See the term project brief on Moodle for length and grading.

## 1. The idea

- **Customer:** Termly is for undergraduate students who manage several courses and need to keep track of assignments, exams, classes, and other deadlines. It is especially useful for students who currently use disconnected tools such as learning platforms, paper syllabi, calendars, reminder apps, and spreadsheets.
- **Problem:** Course information is fragmented across syllabi and multiple university systems. Students can miss deadlines or spend time manually copying dates into a calendar. Their current workaround is a mix of LMS pages, screenshots, sticky notes, and personal calendar applications, none of which automatically organize the information for them.
- **Solution:** Termly lets a student paste or upload a syllabus and review the dates it identifies before adding selected items to one calendar. The prototype also groups deadlines by day and month, shows upcoming work, supports browser reminders, saves information locally, and offers light and dark modes. It differs from a general calendar because its workflow starts from the course syllabus rather than from an empty schedule.
- **Revenue:** A real version could offer a free basic plan and sell a premium subscription with features such as account syncing across devices, unlimited syllabus imports, export to Google or Apple Calendar, recurring reminders, and course recommendations. The company could also offer a low-cost institutional plan to student services or departments. It would avoid selling individual student data and should make the premium benefits and privacy terms clear.

## 2. Where IT creates value

Termly creates value in the information-management and service stages of the value chain. It reduces the time students spend searching, reading, and copying course dates, lowering a repetitive coordination cost. As more syllabi and course schedules are processed, a real system could develop stronger structured data, improve date extraction, and build a more useful course calendar.

The product could use **differentiation** by focusing on syllabus-first planning for students instead of competing directly as another general-purpose calendar. It could scale with cloud-based document processing, a database, and a notification service because each additional user could use the same systems and shared course templates without a comparable increase in manual service. GitHub Pages and browser storage make the prototype inexpensive, while a real account-based service would provide an accessible direct **distribution channel** through a public website.

Data and personalization could increase **switching costs** over time: uploaded syllabi, course schedules, preferred reminder times, and a student's completed events may become inconvenient to recreate elsewhere. However, Termly should support calendar export and data deletion so that lock-in does not come from denying customers control of their information.

## 3. Network effects

Termly is initially more of a one-sided productivity tool than a strong network platform: each student receives value alone. It may develop **indirect network effects** if it can verify and share syllabus data across students, instructors, and institutions.

- The one-sided version has students on one side and improves through better data and recommendations rather than direct interaction.
- A future two-sided version would connect students and institutions: students contribute or verify courses and receive accurate shared schedules, while institutions and instructors provide the authoritative syllabus source.
- Shared course templates become more valuable as more users contribute and confirm dates. The system could compare a large number of syllabi by course, section, term, and professor to identify common patterns and flag missing or conflicting information.
- The prototype solves the empty-network problem by being useful immediately: it parses an individual's own syllabus without requiring any other users. At launch, Termly should focus on this standalone workflow, seed a small set of popular course schedules, and add verification features only after enough users exist.
- The syllabus-import and saved-calendar areas in the prototype demonstrate the initial standalone experience, while future shared-course features would extend this workflow.

## 4. Can it be copied? (the moat question)

The HTML, CSS, JavaScript, and calendar interface are not a durable advantage because anyone in this course could reconstruct a similar prototype with AI quickly. The moat would need to come from capabilities around the interface.

The most valuable advantage would be a large, accurate, consent-based archive of normalized course dates and syllabus information (**data**). The code alone would not be rare or hard to imitate, but reliable course data plus integrations, a strong brand, verified instructor submissions, and high trust could meet VRIN-like criteria. Students would also find it difficult to leave if they accumulated many courses and reminder preferences, creating **switching costs**, although export options remain important.

A competitor with a larger budget could copy the basic interface in a few weeks and might integrate a general AI service more quickly. It would take much longer to earn institutional relationships, build a broad corpus of verified schedules, establish student trust, and improve extraction across different syllabus formats. Network effects, data quality, brand, integrations, and accumulated customer preferences could strengthen over time, but the first-mover advantage should not be assumed.

## 5. Cloud and operations

A real Termly service would need authentication, a database, file processing, hosted parsing, notification delivery, monitoring, backup, and calendar integrations.

- **SaaS:** Use a hosted identity provider for sign-in, an email provider for account and notification messages, and a calendar integration provider or APIs for Google and Apple calendars.
- **PaaS:** Host the API and scheduled reminder workers on a managed application platform, with object storage for optionally uploaded syllabi and a managed database for accounts and course records.
- **IaaS:** Dedicated compute would likely be unnecessary at launch. If needed for secure document processing or high-volume parsing, the company could use virtual machines or containers with autoscaling.

Managed services reduce operational work and can scale as demand grows, but create vendor lock-in, recurring cost, API limits, and availability or security risks. The company could reduce these risks with standard formats, regular backups, infrastructure-as-code, service-level monitoring, and provider exit plans. Sensitive document processing should occur only with user consent and appropriate retention limits.

## 6. Risks and ethics

The main risks are incorrect date extraction, privacy loss, notification fatigue, and unequal or misleading advice. A parser could place an assignment on the wrong date or misread a phrase such as “tentative.” To reduce this, Termly should show the source text, require users to review detected dates, and label uncertain imports as needing confirmation.

A real system would process course and possibly institution information. It should use encryption, least-privilege access, short data retention, clear consent, account controls, audit logs, and secure deletion. It should not sell student data or use it for advertising without explicit permission. Abuse risks include malicious uploads, account scraping, and denial-of-service attempts. These could be addressed with file limits, malware scanning, rate limiting, authentication, and moderation.

Societal risks include students becoming overly dependent on a service or institutions expecting students to use a third-party tool. Termly can use accessible interface patterns, make calendar export available, provide a free core feature, and communicate that the service is a scheduling aid rather than an authoritative academic system.
