/* BAJUS — Meeting list page: event-style cards with sidebar actions */

(function () {
  const listEl = document.getElementById('meetings-list');
  const emptyEl = document.getElementById('meetings-empty');
  if (!listEl || typeof BAJUS_MEETINGS === 'undefined') return;

  let activeFilter = 'all';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function sidebarMeta(meeting) {
    if (meeting.status === 'live') {
      return '<p class="text-[10px] text-red-600 leading-snug font-medium">Session in progress</p>';
    }
    if (meeting.status === 'upcoming') {
      return `<p class="text-[10px] text-zinc-500 leading-snug">Starts at ${escapeHtml(meeting.time)}</p>`;
    }
    return '<p class="text-[10px] text-zinc-500 leading-snug">Minutes &amp; records available</p>';
  }

  function actionButton(meeting, href) {
    if (meeting.status === 'live') {
      return `<a href="${href}" class="btn-gold w-full text-xs py-3 text-center">Join Meeting</a>`;
    }
    if (meeting.status === 'upcoming') {
      return `<a href="${href}" class="btn-gold w-full text-xs py-3 text-center">View Details</a>`;
    }
    return `<a href="${href}" class="btn-outline w-full text-xs py-3 text-center border-zinc-300 hover:border-gold">View Archive</a>`;
  }

  function renderCard(meeting) {
    const href = `dashboard-meeting-detail.html?id=${encodeURIComponent(meeting.id)}`;
    const dateMatch = meeting.date.match(/^(\w+)\s+(\d+),\s+(\d+)$/);
    const month = dateMatch ? dateMatch[1].slice(0, 3) : '';
    const day = dateMatch ? dateMatch[2] : '';
    const year = dateMatch ? dateMatch[3] : '';
    const sidebarClass =
      meeting.status === 'live'
        ? 'meeting-card-sidebar--live'
        : meeting.status === 'upcoming'
          ? 'meeting-card-sidebar--upcoming'
          : 'meeting-card-sidebar--concluded';
    const activePollBadge =
      meeting.activePolls > 0
        ? `<span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-full"><i class="ph ph-chart-bar text-[10px]"></i> ${meeting.activePolls} Active Poll${meeting.activePolls !== 1 ? 's' : ''}</span>`
        : '';
    const resolutionLabel = meeting.resolutions !== 1 ? 's' : '';

    return `
      <article class="meeting-card bg-white border border-zinc-200 grid md:grid-cols-12 overflow-hidden card-shadow" data-status="${meeting.status}">
        <div class="md:col-span-10 p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="text-[10px] font-bold text-gold uppercase tracking-widest">${escapeHtml(meeting.type)} · ${escapeHtml(meeting.shortLabel)}</span>
            ${getMeetingStatusBadge(meeting.status)}
            ${activePollBadge}
          </div>
          <h2 class="font-serif text-xl md:text-2xl font-bold text-charcoal mb-2">${escapeHtml(meeting.title)}</h2>
          <p class="text-sm text-zinc-500 leading-relaxed mb-3">${escapeHtml(meeting.description)}</p>
          <ul class="text-xs text-zinc-600 space-y-1">
            <li><span class="text-gold font-semibold">When:</span> ${escapeHtml(meeting.date)} · ${escapeHtml(meeting.time)}</li>
            <li><span class="text-gold font-semibold">Where:</span> ${escapeHtml(meeting.venue)}</li>
            <li><span class="text-gold font-semibold">Delegates:</span> ${meeting.delegates} registered</li>
            <li><span class="text-gold font-semibold">Agenda:</span> ${meeting.agendaItems} items · ${meeting.resolutions} resolution${resolutionLabel}</li>
          </ul>
        </div>
        <div class="md:col-span-2 ${sidebarClass} border-t md:border-t-0 md:border-l p-6 flex flex-col items-center justify-center text-center gap-4">
          <div>
            <div class="text-[11px] uppercase tracking-widest text-gold font-bold">${month}</div>
            <div class="text-5xl font-serif text-charcoal leading-none my-1">${day}</div>
            <div class="text-[11px] uppercase tracking-widest text-zinc-400">${year}</div>
          </div>
          ${actionButton(meeting, href)}
          ${sidebarMeta(meeting)}
        </div>
      </article>`;
  }

  function renderList() {
    const filtered =
      activeFilter === 'all'
        ? BAJUS_MEETINGS
        : BAJUS_MEETINGS.filter((m) => m.status === activeFilter);

    if (filtered.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    listEl.innerHTML = filtered.map(renderCard).join('');
  }

  document.querySelectorAll('.meeting-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.meeting-filter-btn').forEach((b) => {
        const isActive = b === btn;
        b.className = isActive
          ? 'meeting-filter-btn pb-3 text-sm font-semibold border-b-2 border-gold text-gold transition-all'
          : 'meeting-filter-btn pb-3 text-sm font-semibold border-b-2 border-transparent text-zinc-500 hover:text-charcoal transition-all';
      });
      renderList();
    });
  });

  renderList();
})();
