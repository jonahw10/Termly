window.TERMLY_DEMO_EVENTS = (function () {
  "use strict";

  function dateInDays(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");
  }

  return [
    { id: "demo-finance-assignment", title: "Intro to Finance — Assignment 2", date: dateInDays(1), category: "due" },
    { id: "demo-systems-quiz", title: "Data Systems — Weekly quiz", date: dateInDays(3), category: "due" },
    { id: "demo-marketing-midterm", title: "Marketing 101 — Midterm exam", date: dateInDays(7), category: "exam" },
    { id: "demo-computer-science-lab", title: "Computer Science — Lab 4", date: dateInDays(10), category: "class" },
    { id: "demo-project-paper", title: "Research Methods — Project paper", date: dateInDays(14), category: "due" }
  ];
})();
