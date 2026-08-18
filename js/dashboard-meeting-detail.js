/* BAJUS — Meeting detail page: load meeting metadata from URL */

(function () {
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function agendaStatusBadge(status) {
    const styles = {
      completed: "text-emerald-700 bg-emerald-50",
      "in-progress": "text-gold bg-gold-soft",
      upcoming: "text-zinc-500 bg-zinc-100",
    };
    const labels = {
      completed: "Completed",
      "in-progress": "In Progress",
      upcoming: "Upcoming",
    };
    const style = styles[status] || styles.upcoming;
    const label = labels[status] || labels.upcoming;
    return `<span class="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider ${style} px-2 py-0.5 rounded-full">${label}</span>`;
  }

  function resolutionStatusBadge(status) {
    const map = {
      passed:
        '<span class="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"><i class="ph ph-check-circle"></i> Passed</span>',
      "under-vote":
        '<span class="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><i class="ph ph-hourglass"></i> Under Vote</span>',
      pending:
        '<span class="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full"><i class="ph ph-clock"></i> Pending</span>',
    };
    return map[status] || map.pending;
  }

  function renderAgendaItem(item) {
    return (
      '<div class="p-5 md:p-6 flex flex-col sm:flex-row sm:items-start gap-4">' +
      '<div class="agenda-item text-[11px] font-bold text-gold uppercase tracking-wider sm:w-24 shrink-0 whitespace-nowrap">' +
      escapeHtml(item.time) +
      "</div>" +
      '<div class="flex-1">' +
      '<h3 class="font-semibold text-charcoal text-sm">' +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="text-xs text-zinc-500 mt-1 leading-relaxed">' +
      escapeHtml(item.description) +
      "</p>" +
      agendaStatusBadge(item.status) +
      "</div>" +
      "</div>"
    );
  }

  function renderResolutionItem(resolution) {
    let footer = "";

    if (resolution.status === "passed") {
      footer =
        '<div class="flex flex-wrap gap-4 text-xs text-zinc-500 border-t border-zinc-100 pt-4">' +
        `<span><strong class="text-charcoal">Votes For:</strong> ${resolution.votesFor}</span>` +
        `<span><strong class="text-charcoal">Votes Against:</strong> ${resolution.votesAgainst}</span>` +
        `<span><strong class="text-charcoal">Abstentions:</strong> ${resolution.abstentions}</span>` +
        `<span><strong class="text-charcoal">Adopted:</strong> ${escapeHtml(resolution.adoptedAt || "")}</span>` +
        "</div>";
    } else if (resolution.status === "under-vote") {
      footer =
        '<div class="bg-gold-soft/50 border border-gold/20 px-4 py-3 text-xs text-charcoal leading-relaxed">' +
        '<i class="ph ph-chart-bar text-gold mr-1"></i> Linked to ' +
        `<strong>${escapeHtml(resolution.pollRef || "active poll")}</strong> — voting is currently open. Results will be recorded upon poll closure.` +
        "</div>";
    } else {
      footer =
        '<p class="text-xs text-zinc-400 italic">Scheduled for discussion. A poll will be created by the administrator before the vote.</p>';
    }

    return (
      '<article class="bg-white border border-zinc-200 rounded-sm p-5 md:p-6 card-shadow">' +
      '<div class="flex flex-wrap items-start justify-between gap-3 mb-3">' +
      `<span class="text-[10px] font-bold text-gold uppercase tracking-widest">${escapeHtml(resolution.code)}</span>` +
      resolutionStatusBadge(resolution.status) +
      "</div>" +
      `<h3 class="font-serif text-lg text-charcoal mb-2">${escapeHtml(resolution.title)}</h3>` +
      `<p class="text-sm text-zinc-600 leading-relaxed mb-4">${escapeHtml(resolution.body)}</p>` +
      footer +
      "</article>"
    );
  }

  function renderDynamicContent(meeting, content) {
    const richAgenda = document.getElementById("meeting-rich-content");
    const richResolutions = document.getElementById("meeting-rich-resolutions");

    if (richAgenda && Array.isArray(content.agenda)) {
      richAgenda.innerHTML =
        '<div class="flex items-center justify-between gap-4">' +
        '<h2 class="font-serif text-xl text-charcoal">Meeting Agenda</h2>' +
        `<span id="meeting-agenda-meta" class="text-[10px] text-zinc-400 uppercase tracking-wider">${meeting.agendaItems} items · ${escapeHtml(meeting.duration || "30 min – 1 hr 30 min")}</span>` +
        "</div>" +
        '<div class="bg-white border border-zinc-200 rounded-sm divide-y divide-zinc-100">' +
        content.agenda.map(renderAgendaItem).join("") +
        "</div>";
    }

    if (richResolutions && Array.isArray(content.resolutions)) {
      const resolutionLabel =
        content.resolutions.length === 1 ? "resolution" : "resolutions";
      richResolutions.innerHTML =
        '<div class="flex items-center justify-between gap-4">' +
        '<h2 class="font-serif text-xl text-charcoal">Resolutions</h2>' +
        `<span id="meeting-resolutions-meta" class="text-[10px] text-zinc-400 uppercase tracking-wider">${content.resolutions.length} ${resolutionLabel} on the floor</span>` +
        "</div>" +
        `<div class="space-y-4">${content.resolutions.map(renderResolutionItem).join("")}</div>`;
    }
  }

  function initMeetingDetail() {
    const root = document.getElementById("meeting-detail-root");
    if (!root || typeof getMeetingById !== "function") return;

    const meetingId = new URLSearchParams(window.location.search).get("id");
    const meeting = meetingId ? getMeetingById(meetingId) : null;

    if (!meeting) {
      window.location.href = "dashboard-meeting.html";
      return;
    }

    root.dataset.meetingId = meeting.id;
    document.title = `${meeting.title} — BAJUS Portal`;

    const breadcrumb = document.getElementById("meeting-breadcrumb");
    const badges = document.getElementById("meeting-badges");
    const titleEl = document.getElementById("meeting-title");
    const metaEl = document.getElementById("meeting-meta");

    if (breadcrumb) breadcrumb.textContent = meeting.shortLabel;

    if (badges) {
      badges.innerHTML =
        getMeetingStatusBadge(meeting.status) +
        `<span class="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold-soft border border-gold/30 px-2.5 py-1 rounded-full">${meeting.type}</span>`;
    }

    if (titleEl) {
      const words = meeting.title.split(" ");
      const last = words.pop();
      titleEl.innerHTML = `${words.join(" ")} <span class="text-gold italic font-medium">${last}</span>`;
    }

    if (metaEl) {
      metaEl.innerHTML = `
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-calendar text-gold"></i> ${meeting.date} · ${meeting.time}${meeting.endTime ? ` – ${meeting.endTime}` : ""}</span>
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-hourglass text-gold"></i> ${meeting.duration || "30 min – 1 hr 30 min"}</span>
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-map-pin text-gold"></i> ${meeting.venue}</span>
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-users text-gold"></i> ${meeting.delegates} delegates registered</span>`;
    }

    const detailContent =
      typeof getMeetingDetailContent === "function"
        ? getMeetingDetailContent(meeting.id)
        : null;

    if (detailContent) {
      renderDynamicContent(meeting, detailContent);
    } else {
      const agendaMeta = document.getElementById("meeting-agenda-meta");
      if (agendaMeta) {
        agendaMeta.textContent = `${meeting.agendaItems} items · ${meeting.duration || "30 min – 1 hr 30 min"}`;
      }
    }

    const hasRichContent =
      typeof meetingHasRichContent === "function"
        ? meetingHasRichContent(meeting)
        : meeting.id === "mtg-2026-agm";

    const richAgenda = document.getElementById("meeting-rich-content");
    const simpleAgenda = document.getElementById("meeting-simple-agenda");
    const richResolutions = document.getElementById("meeting-rich-resolutions");
    const simpleResolutions = document.getElementById("meeting-simple-resolutions");

    if (richAgenda) richAgenda.classList.toggle("hidden", !hasRichContent);
    if (simpleAgenda) simpleAgenda.classList.toggle("hidden", hasRichContent);
    if (richResolutions) richResolutions.classList.toggle("hidden", !hasRichContent);
    if (simpleResolutions) simpleResolutions.classList.toggle("hidden", hasRichContent);

    if (!hasRichContent) {
      const agendaText = document.getElementById("meeting-simple-agenda-text");
      const resText = document.getElementById("meeting-simple-resolutions-text");

      if (meeting.status === "upcoming") {
        if (agendaText) {
          agendaText.textContent =
            "The agenda for this meeting will be published by the administrator before the session begins.";
        }
        if (resText) {
          resText.textContent =
            "Resolutions will be tabled and published ahead of this meeting.";
        }
      } else if (meeting.status === "live") {
        if (agendaText) {
          agendaText.textContent =
            "The live agenda is being prepared. Please refresh shortly or contact the secretariat.";
        }
        if (resText) {
          resText.textContent =
            "Resolutions for this live session will appear here once published by the chair.";
        }
      } else if (meeting.status === "concluded") {
        if (agendaText) {
          agendaText.textContent = `This meeting concluded on ${meeting.date}. Full agenda and minutes are available in My Documents.`;
        }
        if (resText) {
          resText.textContent =
            meeting.resolutions > 0
              ? `${meeting.resolutions} resolution${meeting.resolutions !== 1 ? "s were" : " was"} adopted during this session.`
              : "No formal resolutions were recorded for this meeting.";
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMeetingDetail);
  } else {
    initMeetingDetail();
  }
})();
