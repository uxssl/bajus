/* BAJUS — Meeting detail page: load meeting metadata from URL */

(function () {
  function initMeetingDetail() {
    const root = document.getElementById('meeting-detail-root');
    if (!root || typeof getMeetingById !== 'function') return;

    const meetingId = new URLSearchParams(window.location.search).get('id');
    const meeting = meetingId ? getMeetingById(meetingId) : null;

    if (!meeting) {
      window.location.href = 'dashboard-meeting.html';
      return;
    }

    root.dataset.meetingId = meeting.id;
    document.title = `${meeting.title} — BAJUS Portal`;

    const breadcrumb = document.getElementById('meeting-breadcrumb');
    const badges = document.getElementById('meeting-badges');
    const titleEl = document.getElementById('meeting-title');
    const metaEl = document.getElementById('meeting-meta');

    if (breadcrumb) breadcrumb.textContent = meeting.shortLabel;

    if (badges) {
      badges.innerHTML =
        getMeetingStatusBadge(meeting.status) +
        `<span class="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold-soft border border-gold/30 px-2.5 py-1 rounded-full">${meeting.type}</span>`;
    }

    if (titleEl) {
      const words = meeting.title.split(' ');
      const last = words.pop();
      titleEl.innerHTML = `${words.join(' ')} <span class="text-gold italic font-medium">${last}</span>`;
    }

    if (metaEl) {
      metaEl.innerHTML = `
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-calendar text-gold"></i> ${meeting.date} · ${meeting.time}${meeting.endTime ? ` – ${meeting.endTime}` : ''}</span>
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-hourglass text-gold"></i> ${meeting.duration || '30 min – 1 hr 30 min'}</span>
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-map-pin text-gold"></i> ${meeting.venue}</span>
        <span class="inline-flex items-center gap-1.5"><i class="ph ph-users text-gold"></i> ${meeting.delegates} delegates registered</span>`;
    }

    const agendaMeta = document.getElementById('meeting-agenda-meta');
    if (agendaMeta) {
      agendaMeta.textContent = `${meeting.agendaItems} items · ${meeting.duration || '30 min – 1 hr 30 min'}`;
    }

    const hasRichContent = meeting.id === 'mtg-2026-agm';

    const richAgenda = document.getElementById('meeting-rich-content');
    const simpleAgenda = document.getElementById('meeting-simple-agenda');
    const richResolutions = document.getElementById('meeting-rich-resolutions');
    const simpleResolutions = document.getElementById('meeting-simple-resolutions');

    if (richAgenda) richAgenda.classList.toggle('hidden', !hasRichContent);
    if (simpleAgenda) simpleAgenda.classList.toggle('hidden', hasRichContent);
    if (richResolutions) richResolutions.classList.toggle('hidden', !hasRichContent);
    if (simpleResolutions) simpleResolutions.classList.toggle('hidden', hasRichContent);

    if (!hasRichContent) {
      const agendaText = document.getElementById('meeting-simple-agenda-text');
      const resText = document.getElementById('meeting-simple-resolutions-text');

      if (meeting.status === 'upcoming') {
        if (agendaText) agendaText.textContent = 'The agenda for this meeting will be published by the administrator before the session begins.';
        if (resText) resText.textContent = 'Resolutions will be tabled and published ahead of this meeting.';
      } else if (meeting.status === 'concluded') {
        if (agendaText) agendaText.textContent = `This meeting concluded on ${meeting.date}. Full agenda and minutes are available in My Documents.`;
        if (resText) resText.textContent = meeting.resolutions > 0
          ? `${meeting.resolutions} resolution${meeting.resolutions !== 1 ? 's were' : ' was'} adopted during this session.`
          : 'No formal resolutions were recorded for this meeting.';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeetingDetail);
  } else {
    initMeetingDetail();
  }
})();
