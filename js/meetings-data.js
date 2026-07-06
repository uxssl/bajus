/* BAJUS — Meeting catalogue for member portal */

const BAJUS_MEETINGS = [
  {
    id: "mtg-2026-agm",
    title: "52nd Annual General Meeting",
    shortLabel: "52nd AGM",
    type: "AGM",
    date: "June 15, 2026",
    time: "10:00 AM",
    endTime: "11:30 AM",
    duration: "30 min – 1 hr 30 min",
    venue: "BAJUS Bhaban, Baitul Mukarram, Dhaka",
    delegates: 312,
    status: "concluded",
    agendaItems: 8,
    resolutions: 3,
    activePolls: 0,
    description:
      "Annual general assembly — financial approval, resolutions, and executive board election.",
    image: "./assets/news1.jpg",
  },
  {
    id: "mtg-2026-q2-board",
    title: "Q2 Board of Directors Meeting",
    shortLabel: "Q2 Board",
    type: "Board",
    date: "July 28, 2026",
    time: "3:00 PM",
    endTime: "4:30 PM",
    duration: "30 min – 1 hr 30 min",
    venue: "BAJUS Conference Hall, Dhaka",
    delegates: 24,
    status: "upcoming",
    agendaItems: 5,
    resolutions: 0,
    activePolls: 0,
    description:
      "Quarterly board session — policy review, membership applications, and trade liaison updates.",
    image: "./assets/news2.jpg",
  },
  {
    id: "mtg-2026-july-standing",
    title: "Standing Committee on Gold Hallmarking & Assaying",
    shortLabel: "Hallmarking Committee",
    type: "Committee",
    date: "July 2, 2026",
    time: "11:00 AM",
    endTime: "1:00 PM",
    duration: "2 hours",
    venue: "BAJUS Secretariat, Baitul Mukarram, Dhaka",
    delegates: 18,
    status: "concluded",
    agendaItems: 4,
    resolutions: 1,
    activePolls: 0,
    description:
      "Reviewing national hallmarking standard compliance and regional assaying laboratory setups.",
    image: "./assets/craft.jpg",
  },
  {
    id: "mtg-2026-july-exec",
    title: "Executive Committee Monthly Review & Tariff Discussion",
    shortLabel: "Executive Review",
    type: "Executive",
    date: "July 5, 2026",
    time: "3:30 PM",
    endTime: "5:00 PM",
    duration: "1 hr 30 min",
    venue: "BAJUS Conference Hall, Level 4, Dhaka",
    delegates: 35,
    status: "live",
    agendaItems: 6,
    resolutions: 2,
    activePolls: 1,
    description:
      "Live session addressing international bullion price fluctuations, import duties, and trade tariff adjustments.",
    image: "./assets/news3.jpg",
  },
  {
    id: "mtg-2026-july-district",
    title: "District Leaders Coordination & Trade License Seminar",
    shortLabel: "District Leaders Meet",
    type: "Seminar",
    date: "July 18, 2026",
    time: "2:00 PM",
    endTime: "4:00 PM",
    duration: "2 hours",
    venue: "Virtual / BAJUS Auditorium",
    delegates: 142,
    status: "upcoming",
    agendaItems: 5,
    resolutions: 0,
    activePolls: 0,
    description:
      "Nationwide coordination session focusing on municipal trade license renewal protocols and shop registration.",
    image: "./assets/news1.jpg",
  },
  {
    id: "mtg-2026-aug-expo",
    title: "National Jewellery Expo 2026 Planning Committee",
    shortLabel: "Expo Planning Meet",
    type: "Committee",
    date: "August 10, 2026",
    time: "11:30 AM",
    endTime: "1:30 PM",
    duration: "2 hours",
    venue: "ICCB Conference Centre, Dhaka",
    delegates: 48,
    status: "upcoming",
    agendaItems: 7,
    resolutions: 0,
    activePolls: 0,
    description:
      "Initial planning and stall allocation layout review for the upcoming Bangladesh International Jewellery Expo.",
    image: "./assets/news2.jpg",
  },
  {
    id: "mtg-2026-emergency",
    title: "Special Emergency Session — Gold Price Protocol",
    shortLabel: "Emergency Session",
    type: "Special",
    date: "March 3, 2026",
    time: "11:00 AM",
    endTime: "12:30 PM",
    duration: "30 min – 1 hr 30 min",
    venue: "BAJUS Bhaban, Dhaka",
    delegates: 186,
    status: "concluded",
    agendaItems: 4,
    resolutions: 2,
    activePolls: 0,
    description:
      "Extraordinary session convened to align national gold pricing protocol during market volatility.",
    image: "./assets/craft.jpg",
  },
  {
    id: "mtg-2025-agm",
    title: "51st Annual General Meeting",
    shortLabel: "51st AGM",
    type: "AGM",
    date: "June 12, 2025",
    time: "10:00 AM",
    endTime: "11:30 AM",
    duration: "30 min – 1 hr 30 min",
    venue: "BAJUS Bhaban, Baitul Mukarram, Dhaka",
    delegates: 298,
    status: "concluded",
    agendaItems: 8,
    resolutions: 4,
    activePolls: 0,
    description:
      "Previous annual general meeting — minutes, financials, and 2025–2027 board handover.",
    image: "./assets/president.jpg",
  },
];

function getMeetingById(id) {
  return BAJUS_MEETINGS.find((m) => m.id === id) || null;
}

function getMeetingStatusBadge(status) {
  const map = {
    live: '<span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"><span class="size-1.5 rounded-full bg-red-500 animate-pulse"></span> Live</span>',
    upcoming:
      '<span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full"><i class="ph ph-clock text-xs"></i> Upcoming</span>',
    concluded:
      '<span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full"><i class="ph ph-check-circle text-xs"></i> Concluded</span>',
  };
  return map[status] || "";
}

// Attach to window for global access across portal scripts
if (typeof window !== "undefined") {
  window.BAJUS_MEETINGS = BAJUS_MEETINGS;
  window.getMeetingById = getMeetingById;
  window.getMeetingStatusBadge = getMeetingStatusBadge;
}
