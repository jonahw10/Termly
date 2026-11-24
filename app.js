(function () {
  "use strict";

  const EVENTS_KEY = "termly.events";
  const REMINDERS_KEY = "termly.reminders-enabled";
  const SENT_REMINDERS_KEY = "termly.sent-reminders";
  const THEME_KEY = "termly.theme";
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNumbers = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9,
    october: 9, nov: 10, november: 10, dec: 11, december: 11
  };
  const importantWords = /\b(due|deadline|assignment|quiz|exam|test|midterm|final|paper|project|presentation|lab|reading|class|lecture|break|holiday|registration|withdrawal)\b/i;
  const eventWords = {
    exam: /\b(exam|test|midterm|final)\b/i,
    class: /\b(class|lecture|lab|break|holiday|registration|withdrawal)\b/i
  };

  const notice = document.getElementById("app-notice");
  const calendarGrid = document.getElementById("calendar-grid");
  const monthTitle = document.getElementById("month-title");
  const selectedDateTitle = document.getElementById("selected-date-title");
  const selectedDayEvents = document.getElementById("selected-day-events");
  const upcomingList = document.getElementById("upcoming-list");
  const upcomingCount = document.getElementById("upcoming-count");
  const fileInput = document.getElementById("syllabus-file");
  const fileDrop = document.getElementById("file-drop");
  const syllabusText = document.getElementById("syllabus-text");
  const importResults = document.getElementById("import-results");
  const resultsList = document.getElementById("results-list");
  const resultsCount = document.getElementById("results-count");
  const enableRemindersButton = document.getElementById("enable-reminders");
  const themeToggleButton = document.getElementById("theme-toggle");
  const themeToggleLabel = document.getElementById("theme-toggle-label");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  let events = loadEvents();
  let stagedEvents = [];
  let visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let selectedDate = dateKey(new Date());
  let remindersEnabled = readBoolean(REMINDERS_KEY);

  function showNotice(message, isError) {
    notice.textContent = message;
    notice.classList.toggle("error", Boolean(isError));
    notice.hidden = false;
  }

  function clearNotice() {
    notice.hidden = true;
    notice.textContent = "";
    notice.classList.remove("error");
  }

  function loadEvents() {
    try {
      const saved = localStorage.getItem(EVENTS_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error("Saved calendar data is not a list.");
      return parsed.filter(function (event) {
        return event && typeof event.id === "string" &&
          typeof event.title === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.date);
      });
    } catch (error) {
      showNotice("We couldn't read your saved dates. Your calendar will start fresh on this device.", true);
      return [];
    }
  }

  function readBoolean(key) {
    try {
      return localStorage.getItem(key) === "true";
    } catch (error) {
      showNotice("Browser storage is unavailable. Dates and reminder settings may not be saved.", true);
      return false;
    }
  }

  function loadTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch (error) {
      showNotice("Your appearance preference couldn't be read. Using light mode for this visit.", true);
      return "light";
    }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    document.body.dataset.theme = theme;
    themeToggleButton.setAttribute("aria-pressed", String(isDark));
    themeToggleButton.setAttribute("aria-label", "Switch to " + nextTheme + " mode");
    themeToggleLabel.textContent = nextTheme === "dark" ? "Dark mode" : "Light mode";
    themeToggleIcon.textContent = nextTheme === "dark" ? "☾" : "☀";
    themeColorMeta.setAttribute("content", isDark ? "#0e1117" : "#f6f7f3");
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showNotice("Your browser couldn't save this change. Check that site storage is enabled.", true);
      return false;
    }
  }

  function dateKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  }

  function parseDateKey(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatLongDate(value) {
    return parseDateKey(value).toLocaleDateString(undefined, {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    });
  }

  function formatShortDate(value) {
    return parseDateKey(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function daysBetween(from, to) {
    const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((end - start) / 86400000);
  }

  function classifyEvent(title) {
    if (eventWords.exam.test(title)) return "exam";
    if (eventWords.class.test(title)) return "class";
    return "due";
  }

  function createId() {
    return window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
  }

  function saveEvents() {
    if (save(EVENTS_KEY, events)) {
      render();
      return true;
    }
    return false;
  }

  function getDateMatches(line, year) {
    const matches = [];
    const isoPattern = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
    const monthPattern = /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\b/gi;
    const numericPattern = /\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/g;
    let match;

    while ((match = isoPattern.exec(line)) !== null) {
      const eventYear = Number(match[1]);
      const month = Number(match[2]) - 1;
      const day = Number(match[3]);
      const date = new Date(eventYear, month, day);
      if (date.getFullYear() === eventYear && date.getMonth() === month && date.getDate() === day) {
        matches.push({ date: dateKey(date), start: match.index, end: isoPattern.lastIndex });
      }
    }

    while ((match = monthPattern.exec(line)) !== null) {
      const month = monthNumbers[match[1].toLowerCase().replace(".", "")];
      const day = Number(match[2]);
      const eventYear = match[3] ? Number(match[3]) : year;
      const date = new Date(eventYear, month, day);
      const overlapsExisting = matches.some(function (existing) {
        return match.index < existing.end && monthPattern.lastIndex > existing.start;
      });
      if (!overlapsExisting && date.getFullYear() === eventYear &&
        date.getMonth() === month && date.getDate() === day) {
        matches.push({ date: dateKey(date), start: match.index, end: monthPattern.lastIndex });
      }
    }

    while ((match = numericPattern.exec(line)) !== null) {
      const month = Number(match[1]) - 1;
      const day = Number(match[2]);
      let eventYear = match[3] ? Number(match[3]) : year;
      if (eventYear < 100) eventYear += eventYear < 50 ? 2000 : 1900;
      const date = new Date(eventYear, month, day);
      const overlapsExisting = matches.some(function (existing) {
        return match.index < existing.end && numericPattern.lastIndex > existing.start;
      });
      if (!overlapsExisting && month >= 0 && month < 12 && date.getFullYear() === eventYear &&
        date.getMonth() === month && date.getDate() === day) {
        matches.push({ date: dateKey(date), start: match.index, end: numericPattern.lastIndex });
      }
    }

    return matches.sort(function (a, b) { return a.start - b.start; });
  }

  function cleanEventTitle(line, match) {
    const title = (line.slice(0, match.start) + " " + line.slice(match.end))
      .replace(/^\s*[-–—•|:,;]+|[-–—•|:,;]+\s*$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return title.length > 100 ? title.slice(0, 97).trim() + "…" : title || "Course date";
  }

  function parseSyllabus(text) {
    const found = [];
    const lines = text.split(/\r?\n/);
    const year = new Date().getFullYear();

    lines.forEach(function (line) {
      if (!importantWords.test(line)) return;
      getDateMatches(line, year).forEach(function (match) {
        const title = cleanEventTitle(line, match);
        const duplicate = found.some(function (event) {
          return event.date === match.date && event.title.toLowerCase() === title.toLowerCase();
        });
        if (!duplicate) {
          found.push({ id: createId(), title: title, date: match.date, category: classifyEvent(title) });
        }
      });
    });

    return found.sort(function (a, b) { return a.date.localeCompare(b.date); });
  }

  function renderCalendar() {
    calendarGrid.replaceChildren();
    monthTitle.textContent = months[visibleMonth.getMonth()] + " " + visibleMonth.getFullYear();

    weekdays.forEach(function (day) {
      const label = document.createElement("div");
      label.className = "weekday";
      label.setAttribute("role", "columnheader");
      label.textContent = day;
      calendarGrid.appendChild(label);
    });

    const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const firstVisible = new Date(firstOfMonth);
    firstVisible.setDate(firstVisible.getDate() - firstOfMonth.getDay());
    const todayKey = dateKey(new Date());

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(firstVisible);
      date.setDate(firstVisible.getDate() + index);
      const key = dateKey(date);
      const dayEvents = events.filter(function (event) { return event.date === key; });
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-cell";
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", formatLongDate(key) +
        (dayEvents.length ? ", " + dayEvents.length + " event" + (dayEvents.length === 1 ? "" : "s") : ""));
      button.setAttribute("aria-pressed", key === selectedDate ? "true" : "false");
      if (date.getMonth() !== visibleMonth.getMonth()) button.classList.add("outside-month");
      if (key === todayKey) button.classList.add("is-today");
      if (key === selectedDate) button.classList.add("is-selected");

      const number = document.createElement("span");
      number.className = "day-number";
      number.textContent = String(date.getDate());
      button.appendChild(number);

      const dots = document.createElement("span");
      dots.className = "event-dots";
      dots.setAttribute("aria-hidden", "true");
      dayEvents.slice(0, 3).forEach(function (event) {
        const dot = document.createElement("i");
        dot.className = "legend-dot " + event.category + "-dot";
        dots.appendChild(dot);
      });
      button.appendChild(dots);
      button.addEventListener("click", function () {
        selectedDate = key;
        if (date.getMonth() !== visibleMonth.getMonth()) {
          visibleMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        render();
      });
      calendarGrid.appendChild(button);
    }
  }

  function makeEventRow(event, removable) {
    const row = document.createElement("div");
    row.className = "day-event";

    const bar = document.createElement("span");
    bar.className = "event-type-bar " + event.category;
    bar.setAttribute("aria-hidden", "true");

    const title = document.createElement("span");
    title.className = "event-title";
    title.textContent = event.title;

    const category = document.createElement("span");
    category.className = "event-category";
    category.textContent = event.category === "due" ? "Deadline" :
      event.category.charAt(0).toUpperCase() + event.category.slice(1);

    row.append(bar, title, category);
    if (removable) {
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-event";
      removeButton.setAttribute("aria-label", "Remove " + event.title);
      removeButton.textContent = "×";
      removeButton.addEventListener("click", function () {
        events = events.filter(function (savedEvent) { return savedEvent.id !== event.id; });
        saveEvents();
      });
      row.appendChild(removeButton);
    }
    return row;
  }

  function renderSelectedDay() {
    selectedDateTitle.textContent = formatLongDate(selectedDate);
    const dayEvents = events.filter(function (event) { return event.date === selectedDate; });
    selectedDayEvents.replaceChildren();
    if (!dayEvents.length) {
      const empty = document.createElement("p");
      empty.className = "empty-day";
      empty.textContent = "Nothing planned yet. Add a syllabus to see your course dates here.";
      selectedDayEvents.appendChild(empty);
      return;
    }
    dayEvents.forEach(function (event) {
      selectedDayEvents.appendChild(makeEventRow(event, true));
    });
  }

  function reminderText(days) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day reminder";
    if (days === 7) return "1 week reminder";
    return "In " + days + " days";
  }

  function renderUpcoming() {
    const today = new Date();
    const upcoming = events.filter(function (event) {
      return daysBetween(today, parseDateKey(event.date)) >= 0;
    }).sort(function (a, b) {
      return a.date.localeCompare(b.date);
    }).slice(0, 5);

    upcomingCount.textContent = String(upcoming.length);
    upcomingList.replaceChildren();
    if (!upcoming.length) {
      const empty = document.createElement("p");
      empty.className = "empty-upcoming";
      empty.textContent = "Your next deadlines and exams will show up here.";
      upcomingList.appendChild(empty);
      return;
    }

    upcoming.forEach(function (event) {
      const date = parseDateKey(event.date);
      const item = document.createElement("div");
      item.className = "upcoming-item";
      const dateBlock = document.createElement("div");
      dateBlock.className = "date-block";
      const day = document.createElement("strong");
      day.textContent = String(date.getDate());
      const month = document.createElement("span");
      month.textContent = months[date.getMonth()].slice(0, 3);
      dateBlock.append(day, month);

      const details = document.createElement("div");
      details.className = "upcoming-details";
      const title = document.createElement("strong");
      title.textContent = event.title;
      const dateLabel = document.createElement("span");
      dateLabel.textContent = event.category === "due" ? "Deadline" :
        event.category.charAt(0).toUpperCase() + event.category.slice(1);
      details.append(title, dateLabel);

      const tag = document.createElement("span");
      tag.className = "reminder-tag";
      tag.textContent = reminderText(daysBetween(today, date));
      item.append(dateBlock, details, tag);
      upcomingList.appendChild(item);
    });
  }

  function render() {
    renderCalendar();
    renderSelectedDay();
    renderUpcoming();
    enableRemindersButton.textContent = remindersEnabled ? "Reminders are on ✓" : "♧ Turn on reminders";
    enableRemindersButton.setAttribute("aria-pressed", String(remindersEnabled));
  }

  function renderStagedEvents() {
    importResults.hidden = false;
    resultsList.replaceChildren();
    resultsCount.textContent = stagedEvents.length + (stagedEvents.length === 1 ? " date" : " dates");

    if (!stagedEvents.length) {
      const empty = document.createElement("p");
      empty.className = "result-empty";
      empty.textContent = "No dates found. Try a text syllabus with dates like “Oct 12 — Midterm exam”.";
      resultsList.appendChild(empty);
      document.getElementById("add-selected-dates").hidden = true;
      return;
    }

    document.getElementById("add-selected-dates").hidden = false;
    stagedEvents.forEach(function (event, index) {
      const label = document.createElement("label");
      label.className = "result-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.index = String(index);
      const text = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = event.title;
      const date = document.createElement("small");
      date.textContent = formatLongDate(event.date);
      text.append(title, date);
      label.append(checkbox, text);
      resultsList.appendChild(label);
    });
  }

  async function readSyllabusFile(file) {
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["txt", "md", "csv"].includes(extension)) {
      showNotice("This prototype reads .txt, .md, and .csv syllabus files. You can paste text copied from a PDF instead.", true);
      fileInput.value = "";
      return;
    }
    try {
      syllabusText.value = await file.text();
      clearNotice();
      showNotice("Loaded " + file.name + ". Select “Find important dates” to review the dates before adding them.");
    } catch (error) {
      showNotice("We couldn't read that file. Try another text syllabus or paste its text instead.", true);
    }
  }

  fileInput.addEventListener("change", function () {
    readSyllabusFile(fileInput.files[0]);
  });

  fileDrop.addEventListener("dragover", function (event) {
    event.preventDefault();
    fileDrop.classList.add("dragging");
  });
  fileDrop.addEventListener("dragleave", function () {
    fileDrop.classList.remove("dragging");
  });
  fileDrop.addEventListener("drop", function (event) {
    event.preventDefault();
    fileDrop.classList.remove("dragging");
    readSyllabusFile(event.dataTransfer.files[0]);
  });

  document.getElementById("scan-syllabus").addEventListener("click", function () {
    const text = syllabusText.value.trim();
    if (!text) {
      showNotice("Choose a syllabus file or paste its text first.", true);
      return;
    }
    stagedEvents = parseSyllabus(text);
    renderStagedEvents();
    if (stagedEvents.length) {
      clearNotice();
    } else {
      showNotice("No dates matched the supported formats. Include a date and a course keyword such as exam, assignment, or due.", true);
    }
  });

  document.getElementById("add-selected-dates").addEventListener("click", function () {
    const selected = Array.from(resultsList.querySelectorAll("input:checked")).map(function (checkbox) {
      return stagedEvents[Number(checkbox.dataset.index)];
    }).filter(Boolean);
    const additions = selected.filter(function (event) {
      return !events.some(function (savedEvent) {
        return savedEvent.date === event.date && savedEvent.title.toLowerCase() === event.title.toLowerCase();
      });
    });
    if (!additions.length) {
      showNotice(selected.length ? "Those dates are already in your calendar." : "Select at least one date to add.", true);
      return;
    }
    events = events.concat(additions).sort(function (a, b) { return a.date.localeCompare(b.date); });
    if (saveEvents()) {
      selectedDate = additions[0].date;
      visibleMonth = new Date(parseDateKey(selectedDate).getFullYear(), parseDateKey(selectedDate).getMonth(), 1);
      render();
      showNotice("Added " + additions.length + (additions.length === 1 ? " course date" : " course dates") + " to your calendar.");
      importResults.hidden = true;
    }
  });

  document.getElementById("previous-month").addEventListener("click", function () {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    render();
  });
  document.getElementById("next-month").addEventListener("click", function () {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    render();
  });
  document.getElementById("today-button").addEventListener("click", function () {
    const today = new Date();
    visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedDate = dateKey(today);
    render();
  });

  enableRemindersButton.addEventListener("click", async function () {
    if (!("Notification" in window)) {
      showNotice("Browser notifications aren't supported here. Your in-app reminder list will still show dates.", true);
      return;
    }
    if (Notification.permission === "denied") {
      showNotice("Notifications are blocked for this site. Allow them in your browser's site settings to turn on reminders.", true);
      return;
    }
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showNotice("Notifications weren't enabled. You can still see upcoming reminders in Termly.", true);
        return;
      }
    }
    remindersEnabled = true;
    if (save(REMINDERS_KEY, true)) {
      clearNotice();
      render();
      checkReminders();
      showNotice("Reminders are on. Keep Termly open to receive browser notifications.");
    }
  });

  let currentTheme = loadTheme();
  applyTheme(currentTheme);
  themeToggleButton.addEventListener("click", function () {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    try {
      localStorage.setItem(THEME_KEY, currentTheme);
    } catch (error) {
      showNotice("Theme changed, but your preference couldn't be saved for next time.", true);
    }
  });

  function checkReminders() {
    if (!remindersEnabled || !("Notification" in window) || Notification.permission !== "granted") return;
    const today = dateKey(new Date());
    let sent = [];
    try {
      sent = JSON.parse(localStorage.getItem(SENT_REMINDERS_KEY) || "[]");
      if (!Array.isArray(sent)) sent = [];
    } catch (error) {
      showNotice("Reminder history couldn't be read, so notifications are paused until the page is refreshed.", true);
      return;
    }

    events.forEach(function (event) {
      const daysUntil = daysBetween(new Date(), parseDateKey(event.date));
      if (daysUntil !== 7 && daysUntil !== 1) return;
      const key = event.id + ":" + daysUntil + ":" + today;
      if (sent.includes(key)) return;
      new Notification(daysUntil === 7 ? "One week until " + event.title : "Tomorrow: " + event.title, {
        body: formatLongDate(event.date) + " · Termly",
        tag: key
      });
      sent.push(key);
    });

    save(SENT_REMINDERS_KEY, sent.slice(-100));
  }

  render();
  checkReminders();
  window.setInterval(checkReminders, 60 * 60 * 1000);
})();
